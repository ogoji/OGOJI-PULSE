import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, Cpu, ShieldCheck, Video, Briefcase, Zap } from 'lucide-react';
import { usePulseStore } from '../store/usePulseStore';
import { BrandLogo } from './BrandLogo';

const AVAILABLE_INTERESTS = [
  {
    id: 'AI & Prompts',
    label: 'AI & Prompt Engineering',
    desc: 'Production system prompts, LLM frameworks, and Cursor AI workflows',
    icon: Cpu,
    color: 'from-cyan-500/20 to-blue-600/20 border-cyan-500/30 text-cyan-400',
  },
  {
    id: 'SQA Engineering',
    label: 'SQA & Software Testing',
    desc: 'Bug tracking, pre-flight release checklists, and QA career insights',
    icon: ShieldCheck,
    color: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/30 text-emerald-400',
  },
  {
    id: 'Tech Workflows',
    label: 'Tech Workflows & Vlogs',
    desc: 'Talking-head video breakdowns, desk setup, and creator pipelines',
    icon: Video,
    color: 'from-purple-500/20 to-indigo-600/20 border-purple-500/30 text-purple-400',
  },
  {
    id: 'Professional Services',
    label: 'Profile & Social Optimization',
    desc: 'LinkedIn overhaul, multi-platform branding, and VIP growth packages',
    icon: Briefcase,
    color: 'from-amber-500/20 to-orange-600/20 border-amber-500/30 text-amber-400',
  },
];

export const OnboardingModal: React.FC = () => {
  const { hasCompletedOnboarding, completeOnboarding } = usePulseStore();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'AI & Prompts',
    'SQA Engineering',
  ]);
  const [userName, setUserName] = useState('');

  if (hasCompletedOnboarding) return null;

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((i) => i !== id));
      }
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleFinish = () => {
    completeOnboarding(selectedInterests, userName.trim() || 'Tech Explorer');
  };

  return (
    <div
      id="onboarding-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div
        id="onboarding-card"
        className="relative w-full max-w-xl rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-2xl shadow-cyan-950/40 text-slate-100 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Glow accent */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-24 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {step === 1 ? (
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="my-2">
              <BrandLogo size="hero" showSubtitle={true} />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Command Center for @ogojithecreator._</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-['Outfit']">
                Welcome to OgojiPulse
              </h2>
              <p className="text-sm sm:text-base text-slate-400 max-w-md mx-auto leading-relaxed">
                Your unified hub for talking-head media streams, production AI prompts, SQA engineering checklists, and high-tier profile optimization services.
              </p>
            </div>

            <div className="w-full grid grid-cols-2 gap-3 pt-2 text-left">
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <Zap className="w-4 h-4" /> Live Video Stream
                </div>
                <p className="text-xs text-slate-400">Direct-to-camera breakdowns with transcripts & chapter markers.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-4 h-4" /> SQA & AI Hub
                </div>
                <p className="text-xs text-slate-400">Interactive release test matrices & system prompt templates.</p>
              </div>
            </div>

            <button
              id="onboarding-step1-continue"
              onClick={() => setStep(2)}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold tracking-wide transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 cursor-pointer text-sm sm:text-base"
            >
              <span>Personalize My Feed</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white font-['Outfit']">Select Your Focus Areas</h3>
                <p className="text-xs sm:text-sm text-slate-400">Choose what you want prioritized in your pulse stream</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                Step 2 of 2
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Your Name or Handle (Optional)</label>
              <input
                id="onboarding-name-input"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Alex Chen or @alexdev"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-slate-300">Target Interests (select at least one)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {AVAILABLE_INTERESTS.map((interest) => {
                  const isSelected = selectedInterests.includes(interest.id);
                  const Icon = interest.icon;
                  return (
                    <div
                      key={interest.id}
                      onClick={() => toggleInterest(interest.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? `bg-gradient-to-br ${interest.color} ring-1 ring-cyan-400/40`
                          : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <Icon className="w-5 h-5 mb-2" />
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                              : 'border-slate-600'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                      <div className="font-semibold text-xs sm:text-sm text-white">{interest.label}</div>
                      <div className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {interest.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                id="onboarding-back-btn"
                onClick={() => setStep(1)}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
              >
                Back
              </button>
              <button
                id="onboarding-complete-btn"
                onClick={handleFinish}
                className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold tracking-wide transition-all shadow-lg shadow-cyan-500/25 cursor-pointer text-sm text-center"
              >
                Launch OgojiPulse Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
