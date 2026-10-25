import React, { useState } from 'react';
import {
  Search,
  Copy,
  Check,
  Cpu,
  ShieldCheck,
  Wrench,
  Sliders,
  Bookmark,
  Share2,
  ExternalLink,
  Download,
  RotateCcw,
  Sparkles,
  Terminal,
  AlertCircle,
  FileCode,
} from 'lucide-react';
import { usePulseStore } from '../store/usePulseStore';
import { ResourceItem } from '../types';

export const HubView: React.FC = () => {
  const {
    resources,
    bookmarkedResourceIds,
    toggleBookmarkResource,
    completedTasks,
    toggleTaskCompleted,
    resetChecklist,
    recordResourceCopy,
  } = usePulseStore();

  const [hubTab, setHubTab] = useState<'prompts' | 'sqa' | 'tools'>('prompts');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<ResourceItem | null>(
    resources.find((r) => r.type === 'prompt') || null
  );
  const [promptVariableValues, setPromptVariableValues] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [exportCopied, setExportCopied] = useState<boolean>(false);

  // Initialize variables when a prompt is selected
  const handleSelectPrompt = (prompt: ResourceItem) => {
    setSelectedPrompt(prompt);
    const initialVars: Record<string, string> = {};
    if (prompt.promptVariables) {
      prompt.promptVariables.forEach((v) => {
        initialVars[v.name] = v.defaultValue;
      });
    }
    setPromptVariableValues(initialVars);
  };

  // Compute live customized prompt string
  const getCompiledPrompt = (template?: string) => {
    if (!template) return '';
    let compiled = template;
    Object.entries(promptVariableValues).forEach(([key, val]) => {
      const regex = new RegExp(`\\[${key}\\]`, 'g');
      const replacement = String(val || `[${key}]`);
      compiled = compiled.replace(regex, () => replacement);
    });
    return compiled;
  };

  const handleCopyPromptText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    recordResourceCopy(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const activeSQAResource = resources.find((r) => r.type === 'sqa_log');

  // Compute checklist stats
  const totalTasks = activeSQAResource?.sqaTasks?.length || 0;
  const completedCount =
    activeSQAResource?.sqaTasks?.filter((t) => completedTasks[t.id]).length || 0;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const handleExportChecklist = () => {
    if (!activeSQAResource?.sqaTasks) return;
    const lines = [
      `# ${activeSQAResource.title}`,
      `Generated from OgojiPulse SQA Log by Victor Olufemi (@ogojithecreator._)`,
      `Status: ${completedCount}/${totalTasks} Tasks Verified (${progressPercent}%)\n`,
      `## Test Cases & Verification Matrix:`,
      ...activeSQAResource.sqaTasks.map(
        (t) =>
          `- [${completedTasks[t.id] ? 'x' : ' '}] **[${t.priority}]** ${t.task} (${t.category})\n  *Notes: ${t.notes}*`
      ),
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setExportCopied(true);
    setTimeout(() => setExportCopied(false), 2500);
  };

  // Filter items
  const filteredPrompts = resources
    .filter((r) => r.type === 'prompt')
    .filter(
      (r) =>
        r.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        r.tags.some((t) => t.toLowerCase().includes(searchFilter.toLowerCase()))
    );

  const filteredTools = resources.filter((r) => r.type === 'tool');

  return (
    <div id="hub-view" className="space-y-8 pb-12">
      {/* Sub-navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Outfit']">
            Tech & AI Resource Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Searchable prompt blueprints, automated frameworks, and repeatable SQA testing matrices.
          </p>
        </div>

        {/* Hub Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            id="hub-tab-prompts"
            onClick={() => setHubTab('prompts')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              hubTab === 'prompts'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>AI Prompts & Stacks</span>
          </button>

          <button
            id="hub-tab-sqa"
            onClick={() => setHubTab('sqa')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              hubTab === 'sqa'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>SQA Testing Logs</span>
          </button>

          <button
            id="hub-tab-tools"
            onClick={() => setHubTab('tools')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              hubTab === 'tools'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Tool Recommendations</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: AI PROMPTS & INTERACTIVE PLAYGROUND */}
      {hubTab === 'prompts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Prompt Selection List */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter prompts by keyword or tech..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-3">
              {filteredPrompts.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <Cpu className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">No prompts found matching "{searchFilter}"</p>
                </div>
              ) : (
                filteredPrompts.map((prompt) => {
                  const isSelected = selectedPrompt?.id === prompt.id;
                  const isBookmarked = bookmarkedResourceIds.includes(prompt.id);

                  return (
                    <div
                      key={prompt.id}
                      id={`prompt-item-${prompt.id}`}
                      onClick={() => handleSelectPrompt(prompt)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'bg-slate-900 border-cyan-500/60 ring-1 ring-cyan-500/30 shadow-lg shadow-cyan-950/40'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          {prompt.promptTargetModel || 'Universal Prompt'}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmarkResource(prompt.id);
                          }}
                          className="text-slate-400 hover:text-cyan-400 transition-colors"
                        >
                          <Bookmark
                            className={`w-4 h-4 ${isBookmarked ? 'fill-cyan-400 text-cyan-400' : ''}`}
                          />
                        </button>
                      </div>

                      <h3 className="font-bold text-white text-sm mt-2.5 line-clamp-1">
                        {prompt.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {prompt.description}
                      </p>

                      <div className="flex items-center justify-between mt-3.5 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
                        <span>{prompt.author}</span>
                        <span>{prompt.updatedAt}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Interactive Prompt Customizer & Sandbox */}
          {selectedPrompt && (
            <div className="lg:col-span-7 rounded-2xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      Interactive Prompt Sandbox
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                      {selectedPrompt.promptTargetModel}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mt-1 font-['Outfit']">
                    {selectedPrompt.title}
                  </h3>
                </div>

                <button
                  id="copy-compiled-prompt-btn"
                  onClick={() =>
                    handleCopyPromptText(
                      getCompiledPrompt(selectedPrompt.promptTemplate),
                      selectedPrompt.id
                    )
                  }
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all cursor-pointer whitespace-nowrap"
                >
                  {copiedId === selectedPrompt.id ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Customized Prompt</span>
                    </>
                  )}
                </button>
              </div>

              {/* Dynamic Variable Inputs */}
              {selectedPrompt.promptVariables && selectedPrompt.promptVariables.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Customize Prompt Variables (Updates text below in real-time)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {selectedPrompt.promptVariables.map((v) => (
                      <div key={v.name} className="space-y-1">
                        <label className="text-[11px] font-medium text-slate-400">
                          {v.label} <code className="text-cyan-400">[{v.name}]</code>
                        </label>
                        <input
                          type="text"
                          value={promptVariableValues[v.name] ?? v.defaultValue}
                          onChange={(e) =>
                            setPromptVariableValues({
                              ...promptVariableValues,
                              [v.name]: e.target.value,
                            })
                          }
                          placeholder={v.placeholder}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Real-time Code / Prompt Output Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 font-mono text-cyan-400">
                    <Terminal className="w-3.5 h-3.5" /> Compiled Blueprint
                  </span>
                  <span>Ready for ChatGPT, Claude, Gemini, or Cursor</span>
                </div>

                <div className="relative rounded-xl bg-slate-950 border border-slate-800/80 p-4 font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto max-h-96">
                  <pre className="whitespace-pre-wrap font-mono">
                    {getCompiledPrompt(selectedPrompt.promptTemplate)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: SQA ENGINEERING CHECKLISTS & LOGS */}
      {hubTab === 'sqa' && activeSQAResource && (
        <div className="space-y-6">
          {/* Header Card with Progress Gauge */}
          <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>SQA Production Gatekeeper</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
                  {activeSQAResource.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                  {activeSQAResource.description}
                </p>
              </div>

              {/* Progress Metric Block */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center min-w-[200px] space-y-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-cyan-400 font-mono">
                    {progressPercent}%
                  </span>
                  <span className="text-xs text-slate-400">verified</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-400">
                  {completedCount} of {totalTasks} tests passing
                </span>
              </div>
            </div>

            {/* Quick Actions toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-5 mt-5 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <button
                  id="export-sqa-checklist-btn"
                  onClick={handleExportChecklist}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer border border-slate-700"
                >
                  {exportCopied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">Copied as Markdown!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-cyan-400" />
                      <span>Export QA Log (Markdown)</span>
                    </>
                  )}
                </button>

                <button
                  id="reset-sqa-checklist-btn"
                  onClick={() => resetChecklist(activeSQAResource.id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All</span>
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> Critical Gate
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> High
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" /> Medium
                </span>
              </div>
            </div>
          </div>

          {/* SQA Test Cases List */}
          <div className="space-y-3">
            {activeSQAResource.sqaTasks?.map((task) => {
              const isChecked = !!completedTasks[task.id];

              const priorityColors = {
                Critical: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
                High: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                Medium: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
              };

              return (
                <div
                  key={task.id}
                  id={`sqa-task-${task.id}`}
                  onClick={() => toggleTaskCompleted(task.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isChecked
                      ? 'bg-slate-900/40 border-emerald-500/30'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Custom Checkbox */}
                  <div
                    className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                      isChecked
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : 'border-slate-700 bg-slate-950'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  {/* Task details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-sm font-semibold transition-all ${
                          isChecked ? 'line-through text-slate-400' : 'text-slate-100'
                        }`}
                      >
                        {task.task}
                      </span>
                      <span
                        className={`px-2 py-0.2 rounded-md text-[10px] font-bold border ${
                          priorityColors[task.priority]
                        }`}
                      >
                        {task.priority}
                      </span>
                      <span className="text-[10px] text-slate-400 px-2 py-0.2 rounded bg-slate-800/80">
                        {task.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{task.notes}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Victor's SQA Principles */}
          {activeSQAResource.sqaBestPractices && (
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                Victor’s Non-Negotiable SQA Principles
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                {activeSQAResource.sqaBestPractices.map((bp, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                    <span className="text-cyan-400 font-bold block mb-1">0{idx + 1}.</span>
                    {bp}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: CURATED DEVELOPER TOOL STACK */}
      {hubTab === 'tools' && (
        filteredTools.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <Wrench className="w-8 h-8 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">No developer tools listed</h4>
            <p className="text-xs text-slate-400">Curated tools recommended by Victor will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTools.map((tool) => (
              <div
                key={tool.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-cyan-500/50 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {tool.category}
                    </span>
                    <span className="text-xs font-semibold text-amber-400">
                      ★ {tool.toolRating}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mt-3">{tool.title}</h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">{tool.toolPricing}</span>
                  {tool.toolUrl && (
                    <a
                      href={tool.toolUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                    >
                      <span>Visit Tool</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};
