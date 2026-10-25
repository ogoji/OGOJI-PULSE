import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  MessageSquare,
  Image as ImageIcon,
  Video,
  Music,
  Mic,
  MicOff,
  Search,
  MapPin,
  Send,
  Loader2,
  Download,
  Copy,
  Check,
  RefreshCw,
  Upload,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Layers,
  Wand2,
  Radio,
  Sliders,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';
import { usePulseStore } from '../store/usePulseStore';
import { LiveVoiceRoom } from './LiveVoiceRoom';

type LabSubTab = 'chat' | 'images' | 'video' | 'music' | 'voice' | 'grounding';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  model?: string;
  timestamp: string;
}

export const AIStudioLab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<LabSubTab>('chat');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ==========================================
  // 1. CHATBOT STATE (gemini-3.5-flash, gemini-3.1-pro-preview, gemini-3.1-flash-lite)
  // ==========================================
  const [chatModel, setChatModel] = useState<'gemini-3.5-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite'>('gemini-3.5-flash');
  const [chatRole, setChatRole] = useState<'sqa' | 'prompt' | 'creator' | 'architect'>('sqa');
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-msg',
      role: 'assistant',
      content:
        "Hello! I am Victor's AI Engineering Twin and SQA Command Assistant. I can generate production testing matrices, design type-safe system prompts, and architect high-velocity web apps. Which challenge are we tackling today?",
      model: 'gemini-3.5-flash',
      timestamp: 'Just now',
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const ROLE_INSTRUCTIONS: Record<string, string> = {
    sqa: 'You are Victor Oladapo Olufemi (@ogojithecreator._) acting as an elite Staff SQA Engineer. Provide exhaustive regression testing matrices, boundary value analysis, race condition simulations, and actionable TypeScript assertions. Always be structured, disciplined, and rigorous.',
    prompt:
      'You are Victor Oladapo Olufemi (@ogojithecreator._) acting as a Senior AI Prompt Architect. You engineer role-based, modular system prompts with strict schemas, zero token waste, and precise output formatting for production LLM pipelines.',
    creator:
      'You are Victor Oladapo Olufemi (@ogojithecreator._) acting as a high-retention Tech Creator & Personal Branding Strategist. Generate punchy YouTube titles, 3-hook video scripts, LinkedIn carousels, and client inbound conversion frameworks.',
    architect:
      'You are Victor Oladapo Olufemi (@ogojithecreator._) acting as a Full-Stack Cloud Architect. Scaffold type-safe TypeScript architectures, Express/Vite server structures, normalized schemas, and zero-downtime deployment pipelines.',
  };

  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          systemInstruction: ROLE_INSTRUCTIONS[chatRole],
          model: chatModel,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages((prev) => [
        ...prev,
        {
          id: 'res-' + Date.now(),
          role: 'assistant',
          content: data.text,
          model: data.model || chatModel,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          role: 'assistant',
          content: `Notice: ${err.message || 'Unable to complete response. Please check your connection or secrets.'}`,
          model: chatModel,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // ==========================================
  // 2. IMAGE CREATION & EDITING (gemini-3.1-flash-image-preview)
  // ==========================================
  const [imageModel, setImageModel] = useState<'gemini-3.1-flash-image-preview' | 'gemini-3.1-flash-lite-image'>('gemini-3.1-flash-image-preview');
  const [imagePrompt, setImagePrompt] = useState('A sleek cyberpunk software engineering battle station with multi-monitor SQA telemetry dashboards, neon cyan and emerald glowing cables, cinematic depth of field');
  const [imageAspectRatio, setImageAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3' | '3:4'>('16:9');
  const [imageRefBase64, setImageRefBase64] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageDescription, setImageDescription] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageRefBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim() || imageLoading) return;
    setImageLoading(true);
    setImageDescription(null);

    try {
      const res = await fetch('/api/images/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: imageModel,
          prompt: imagePrompt,
          aspectRatio: imageAspectRatio,
          referenceImageBase64: imageRefBase64,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
      }
      if (data.text) {
        setImageDescription(data.text);
      }
    } catch (err: any) {
      alert(`Image generation error: ${err.message}`);
    } finally {
      setImageLoading(false);
    }
  };

  // ==========================================
  // 3. VEO 3 VIDEO STUDIO (veo-3.1-fast-generate-preview)
  // ==========================================
  const [videoPrompt, setVideoPrompt] = useState('Futuristic holographic code flowing around a creator desk with smooth 60fps camera pan and neon ambient lighting');
  const [videoMode, setVideoMode] = useState<'text' | 'image'>('text');
  const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [videoImageBase64, setVideoImageBase64] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoProgressMsg, setVideoProgressMsg] = useState('');
  const [videoResultUrl, setVideoResultUrl] = useState<string | null>(null);
  const videoImageInputRef = useRef<HTMLInputElement>(null);

  const handleVideoImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setVideoImageBase64(reader.result as string);
      setVideoMode('image');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateVideo = async () => {
    if (videoLoading) return;
    setVideoLoading(true);
    setVideoProgressMsg('Initiating Veo 3 Video Engine (veo-3.1-fast-generate-preview)...');
    setVideoResultUrl(null);

    try {
      const res = await fetch('/api/video/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: videoPrompt,
          aspectRatio: videoAspectRatio,
          imageBase64: videoMode === 'image' ? videoImageBase64 : undefined,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const opName = data.operationName;
      setVideoProgressMsg('Synthesizing temporal latent frames & camera motion...');

      // Poll status
      let attempts = 0;
      const pollInterval = setInterval(async () => {
        attempts++;
        if (attempts > 30) {
          clearInterval(pollInterval);
          setVideoLoading(false);
          setVideoProgressMsg('Generation is taking longer than expected. Please check back shortly.');
          return;
        }

        const statusRes = await fetch('/api/video/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName: opName }),
        });
        const statusData = await statusRes.json();

        if (statusData.done) {
          clearInterval(pollInterval);
          setVideoLoading(false);
          if (statusData.simulated && statusData.videoUrl) {
            setVideoResultUrl(statusData.videoUrl);
          } else {
            setVideoResultUrl(`/api/video/download?op=${encodeURIComponent(opName)}`);
          }
          setVideoProgressMsg('Video generation complete!');
        } else {
          const msgs = [
            'Simulating physical light bounces & chromatic coherence...',
            'Interpolating 60fps motion vectors...',
            'Encoding high-fidelity output stream...',
          ];
          setVideoProgressMsg(msgs[attempts % msgs.length]);
        }
      }, 3000);
    } catch (err: any) {
      setVideoLoading(false);
      setVideoProgressMsg(`Error: ${err.message}`);
    }
  };

  // ==========================================
  // 4. LYRIA MUSIC GENERATION (lyria-3-clip-preview / lyria-3-pro-preview)
  // ==========================================
  const [musicPrompt, setMusicPrompt] = useState('Energetic high-velocity tech podcast intro beat with futuristic synthwave arpeggios, tight 808 sub, and motivational momentum');
  const [musicClipType, setMusicClipType] = useState<'clip' | 'pro'>('clip');
  const [musicLoading, setMusicLoading] = useState(false);
  const [musicAudioUrl, setMusicAudioUrl] = useState<string | null>(null);
  const [musicLyrics, setMusicLyrics] = useState<string | null>(null);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement>(null);

  const handleGenerateMusic = async () => {
    if (!musicPrompt.trim() || musicLoading) return;
    setMusicLoading(true);
    setIsPlayingMusic(false);

    try {
      const res = await fetch('/api/music/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: musicPrompt,
          clipType: musicClipType,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      if (data.audioUrl) {
        setMusicAudioUrl(data.audioUrl);
      }
      if (data.lyrics) {
        setMusicLyrics(data.lyrics);
      }
    } catch (err: any) {
      alert(`Music generation failed: ${err.message}`);
    } finally {
      setMusicLoading(false);
    }
  };

  // ==========================================
  // 5. LIVE VOICE & AUDIO TRANSCRIPTION (gemini-3.8-live & gemini-3.5-transcribe)
  // ==========================================
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptionLoading, setTranscriptionLoading] = useState(false);
  const [transcriptResult, setTranscriptResult] = useState<string | null>(
    'Press "Start Microphone" to speak directly to Victor\'s Audio Transcriber. Gemini will convert speech to text with sub-second accuracy.'
  );
  const [voiceDialoguePrompt, setVoiceDialoguePrompt] = useState('Explain why role-based prompts combined with automated regression testing protect client deliverables.');
  const [voiceDialogueLoading, setVoiceDialogueLoading] = useState(false);
  const [voiceDialogueResponse, setVoiceDialogueResponse] = useState<string | null>(null);
  const [voiceDialogueAudio, setVoiceDialogueAudio] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onload = async () => {
          const base64Audio = reader.result as string;
          sendAudioForTranscription(base64Audio);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setTranscriptResult('Listening to your audio via microphone...');
    } catch (err: any) {
      alert(`Microphone access error: ${err.message}`);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setTranscriptionLoading(true);
    }
  };

  const sendAudioForTranscription = async (base64Audio: string) => {
    setTranscriptionLoading(true);
    try {
      const res = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64: base64Audio,
          mimeType: 'audio/webm',
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setTranscriptResult(data.transcript || 'Transcription yielded no text.');
    } catch (err: any) {
      setTranscriptResult(`Transcription error: ${err.message}`);
    } finally {
      setTranscriptionLoading(false);
    }
  };

  const handleVoiceDialogueTalk = async () => {
    if (!voiceDialoguePrompt.trim() || voiceDialogueLoading) return;
    setVoiceDialogueLoading(true);
    setVoiceDialogueResponse(null);
    setVoiceDialogueAudio(null);

    try {
      const res = await fetch('/api/voice/talk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: voiceDialoguePrompt,
          voice: 'Zephyr',
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setVoiceDialogueResponse(data.text);
      if (data.audioBase64) {
        setVoiceDialogueAudio(`data:audio/mp3;base64,${data.audioBase64}`);
      } else if (data.audioUrl) {
        setVoiceDialogueAudio(data.audioUrl);
      }
    } catch (err: any) {
      alert(`Voice dialogue error: ${err.message}`);
    } finally {
      setVoiceDialogueLoading(false);
    }
  };

  // ==========================================
  // 6. SEARCH & MAPS GROUNDING (gemini-3.5-flash with googleSearch & googleMaps)
  // ==========================================
  const [groundingPrompt, setGroundingPrompt] = useState('What are the latest best practices for AI code generation quality assurance in 2026?');
  const [groundingMode, setGroundingMode] = useState<'search' | 'maps'>('search');
  const [groundingLoading, setGroundingLoading] = useState(false);
  const [groundingResult, setGroundingResult] = useState<{
    text: string;
    sources: { title: string; url: string }[];
  } | null>({
    text: 'Combining AI prompt architecture with continuous automated SQA suites delivers verified velocity. Engineering teams in 2026 utilize boundary-value checking, schema-locked system prompts, and automated regression replay buffers prior to client deployments.',
    sources: [
      { title: 'Google DeepMind AI Engineering Standards', url: 'https://deepmind.google' },
      { title: 'Modern Software Quality Assurance in AI Era', url: 'https://google.com' },
    ],
  });

  const handleRunGrounding = async () => {
    if (!groundingPrompt.trim() || groundingLoading) return;
    setGroundingLoading(true);

    try {
      const res = await fetch('/api/grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: groundingPrompt,
          mode: groundingMode,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setGroundingResult({
        text: data.text,
        sources: data.sources || [],
      });
    } catch (err: any) {
      alert(`Grounding error: ${err.message}`);
    } finally {
      setGroundingLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Studio Banner Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800/80 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OGOJIPULSE MULTI-MODAL AI SUITE</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              AI Studio & Generation Lab
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Explore the official multi-modal engineering tools built for Victor Oladapo Olufemi (<span className="text-cyan-400 font-medium">@ogojithecreator._</span>). Generate Veo videos, Lyria music, Nano Banana visuals, Live voice conversations, and grounded SQA intelligence.
            </p>
          </div>

          {/* Quick Engine Telemetry Badges */}
          <div className="flex flex-wrap lg:flex-col gap-2 shrink-0 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Gemini 3.5 & 3.1 Pro Preview</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>Veo 3 & Lyria 3 Streaming</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Live Search & Maps Grounding</span>
            </span>
          </div>
        </div>

        {/* Feature Sub-Navigation Tabs */}
        <div className="relative z-10 mt-8 pt-6 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'chat', label: 'Gemini Chatbot', icon: MessageSquare, badge: 'Multi-Role' },
            { id: 'images', label: 'Image Creator & Editor', icon: ImageIcon, badge: 'Nano Banana' },
            { id: 'video', label: 'Veo 3 Video Studio', icon: Video, badge: 'Veo 3.1' },
            { id: 'music', label: 'Lyria Music Studio', icon: Music, badge: 'Lyria 3' },
            { id: 'voice', label: 'Voice & Transcription', icon: Mic, badge: 'Live API' },
            { id: 'grounding', label: 'Search & Maps Grounding', icon: Search, badge: 'Live Intel' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as LabSubTab)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-bold'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
                <span>{tab.label}</span>
                <span
                  className={`hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono uppercase ${
                    isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 1. GEMINI CHATBOT TAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls & Role Selector */}
          <div className="lg:col-span-4 space-y-5">
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Model & Architecture</span>
              </h3>

              {/* Model Picker */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium">Active Gemini Model</label>
                <div className="space-y-1.5">
                  {[
                    { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash', desc: 'Balanced speed, general tasks, agile QA' },
                    { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro Preview', desc: 'Complex reasoning, deep STEM, architecture' },
                    { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite', desc: 'Sub-second latency, quick snippets' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setChatModel(m.id as any)}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        chatModel === m.id
                          ? 'bg-cyan-500/10 border-cyan-500/50 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-white flex items-center justify-between">
                        <span>{m.name}</span>
                        {chatModel === m.id && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{m.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Role Presets */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <label className="text-xs text-slate-400 font-medium">System Role Instruction</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'sqa', label: 'Staff SQA Lead' },
                    { id: 'prompt', label: 'Prompt Architect' },
                    { id: 'creator', label: 'Viral Creator' },
                    { id: 'architect', label: 'Cloud Architect' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setChatRole(r.id as any)}
                      className={`p-2.5 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                        chatRole === r.id
                          ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Prompt Ideas */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-xs text-slate-400 font-medium">Tactical Starters</label>
                <div className="space-y-1.5">
                  {[
                    'Generate an SQA Boundary Testing Matrix for a payment webhook',
                    'Draft a production TypeScript system prompt for client code gen',
                    'Review my client onboarding flow for race condition edge cases',
                  ].map((starter, i) => (
                    <button
                      key={i}
                      onClick={() => setChatInput(starter)}
                      className="w-full text-left p-2 rounded-lg bg-slate-950/40 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-cyan-300 text-xs transition-colors line-clamp-1 cursor-pointer"
                    >
                      "{starter}"
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Conversation Thread & Input */}
          <div className="lg:col-span-8 flex flex-col rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden min-h-[560px]">
            {/* Thread Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Active Thread • {chatModel}
                </span>
              </div>
              <button
                onClick={() =>
                  setMessages([
                    {
                      id: 'reset-' + Date.now(),
                      role: 'assistant',
                      content: 'Thread cleared. What shall we architect or verify next?',
                      model: chatModel,
                      timestamp: 'Just now',
                    },
                  ])
                }
                className="text-xs text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            </div>

            {/* Scrollable Messages Thread */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[460px]">
              {messages.map((m) => {
                const isUser = m.role === 'user';
                return (
                  <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 space-y-2 text-sm leading-relaxed ${
                        isUser
                          ? 'bg-cyan-600 text-white rounded-br-none shadow-md shadow-cyan-950/30'
                          : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 text-[11px] opacity-75 font-mono">
                        <span>{isUser ? 'You (Builder)' : `Victor AI [${m.model || chatModel}]`}</span>
                        <span>{m.timestamp}</span>
                      </div>
                      <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm">{m.content}</div>
                      {!isUser && (
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end">
                          <button
                            onClick={() => copyToClipboard(m.content, m.id)}
                            className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            {copiedId === m.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl p-4 bg-slate-950 border border-slate-800 text-slate-400 text-xs flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                    <span>Victor AI is reasoning & formulating code...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendChat} className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask Victor's AI Twin anything about SQA, prompt pipelines, or code architectures..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <button
                type="submit"
                disabled={chatLoading || !chatInput.trim()}
                className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                {chatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. IMAGE CREATOR & EDITOR TAB (gemini-3.1-flash-image) */}
      {/* ========================================================================= */}
      {activeSubTab === 'images' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-cyan-400" />
                  <span>Image Generation & Editing Engine</span>
                </h3>
                <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono">
                  <button
                    type="button"
                    onClick={() => setImageModel('gemini-3.1-flash-image-preview')}
                    className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                      imageModel === 'gemini-3.1-flash-image-preview'
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    gemini-3.1-flash-image-preview
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageModel('gemini-3.1-flash-lite-image')}
                    className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                      imageModel === 'gemini-3.1-flash-lite-image'
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    lite
                  </button>
                </div>
              </div>

              {/* Prompt Input */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Visual Generation / Edit Prompt</label>
                <textarea
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Describe the image to create or specify modifications to make to your uploaded reference..."
                />
              </div>

              {/* Aspect Ratio Selector */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Aspect Ratio</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(['1:1', '16:9', '9:16', '4:3', '3:4'] as const).map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setImageAspectRatio(ratio)}
                      className={`py-2 rounded-lg text-xs font-mono font-semibold border transition-all cursor-pointer ${
                        imageAspectRatio === ratio
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Reference Image for Editing */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-slate-300 font-medium">
                    Upload Reference Image (Optional for Editing)
                  </label>
                  {imageRefBase64 && (
                    <button
                      onClick={() => setImageRefBase64(null)}
                      className="text-[11px] text-rose-400 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input
                  type="file"
                  ref={imageInputRef}
                  onChange={handleImageFileChange}
                  accept="image/*"
                  className="hidden"
                />
                {imageRefBase64 ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-cyan-500/40">
                    <img src={imageRefBase64} alt="Reference" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono bg-black/80 text-cyan-300">
                      Edit Target Loaded
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="w-full py-4 rounded-xl border border-dashed border-slate-700 hover:border-cyan-500/50 bg-slate-950/60 flex flex-col items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-slate-400" />
                    <span>Upload photo to edit with text</span>
                  </button>
                )}
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleGenerateImage}
                disabled={imageLoading || !imagePrompt.trim()}
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                {imageLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Image with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{imageRefBase64 ? 'Edit Image with Prompt' : 'Generate Image'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Image Showcase */}
          <div className="lg:col-span-7 rounded-2xl bg-slate-900/80 border border-slate-800 p-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Visual Canvas Output
                </span>
                {generatedImage && (
                  <a
                    href={generatedImage}
                    download="ogoji_generated_image.png"
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Asset</span>
                  </a>
                )}
              </div>

              <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center min-h-[360px]">
                {generatedImage ? (
                  <img
                    src={generatedImage}
                    alt="Generated Asset"
                    className="w-full h-auto max-h-[480px] object-contain rounded-xl"
                  />
                ) : (
                  <div className="text-center p-8 text-slate-500 text-xs space-y-2">
                    <ImageIcon className="w-10 h-10 mx-auto text-slate-600" />
                    <p>Enter a prompt and click "Generate Image" to render visual assets.</p>
                  </div>
                )}
              </div>

              {imageDescription && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                  <span className="font-semibold text-cyan-400">Analysis: </span>
                  {imageDescription}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Model: gemini-3.1-flash-image</span>
              <span>Resolution: Configured for High-Fidelity</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. VEO 3 VIDEO STUDIO TAB (veo-3.1-fast-generate-preview) */}
      {/* ========================================================================= */}
      {activeSubTab === 'video' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Video className="w-4 h-4 text-purple-400" />
                  <span>Veo 3 Video Studio</span>
                </h3>
                <span className="text-[11px] font-mono text-purple-400 bg-purple-950/60 border border-purple-800 px-2 py-0.5 rounded">
                  veo-3.1-fast-generate-preview
                </span>
              </div>

              {/* Mode Toggle: Text-to-Video vs Image-to-Video */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setVideoMode('text')}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    videoMode === 'text'
                      ? 'bg-purple-600 text-white font-bold border-purple-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Text to Video
                </button>
                <button
                  onClick={() => setVideoMode('image')}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    videoMode === 'image'
                      ? 'bg-purple-600 text-white font-bold border-purple-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Animate Image to Video
                </button>
              </div>

              {/* Video Prompt */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Video Direction Prompt</label>
                <textarea
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Describe the cinematic action, camera motion, and lighting..."
                />
              </div>

              {/* Aspect Ratio (16:9 Landscape vs 9:16 Portrait) */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">
                  Aspect Ratio (Veo Format Mandate)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setVideoAspectRatio('16:9')}
                    className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                      videoAspectRatio === '16:9'
                        ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    16:9 (Landscape / YouTube)
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoAspectRatio('9:16')}
                    className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                      videoAspectRatio === '9:16'
                        ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    9:16 (Portrait / Shorts / Reels)
                  </button>
                </div>
              </div>

              {/* Photo Upload if Mode === 'image' */}
              {videoMode === 'image' && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-slate-300 font-medium">Starting Frame Photo</label>
                    {videoImageBase64 && (
                      <button
                        onClick={() => setVideoImageBase64(null)}
                        className="text-[11px] text-rose-400 hover:underline cursor-pointer"
                      >
                        Change
                      </button>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={videoImageInputRef}
                    onChange={handleVideoImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  {videoImageBase64 ? (
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-purple-500/40">
                      <img src={videoImageBase64} alt="Frame" className="w-full h-full object-cover" />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono bg-black/80 text-purple-300">
                        Initial Keyframe Ready
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => videoImageInputRef.current?.click()}
                      className="w-full py-4 rounded-xl border border-dashed border-purple-800 hover:border-purple-500 bg-slate-950/60 flex flex-col items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-purple-300 transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-purple-400" />
                      <span>Upload photo to bring to life with Veo</span>
                    </button>
                  )}
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                onClick={handleGenerateVideo}
                disabled={videoLoading || (!videoPrompt.trim() && !videoImageBase64)}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
              >
                {videoLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Rendering Veo Video...</span>
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4" />
                    <span>{videoMode === 'image' ? 'Animate Photo into Video' : 'Generate Veo 3 Video'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Video Render Output */}
          <div className="lg:col-span-7 rounded-2xl bg-slate-900/80 border border-slate-800 p-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Veo 3 Render Monitor
                </span>
                <span className="text-xs text-purple-400 font-mono">
                  Aspect: {videoAspectRatio}
                </span>
              </div>

              {videoLoading ? (
                <div className="rounded-xl aspect-video bg-slate-950 border border-purple-900/60 p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
                    <Sparkles className="w-6 h-6 text-purple-400 absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">Veo 3 Generative Synthesis in Progress</h4>
                    <p className="text-xs text-purple-300 font-mono">{videoProgressMsg}</p>
                  </div>
                </div>
              ) : videoResultUrl ? (
                <div className="rounded-xl overflow-hidden bg-black border border-purple-500/40">
                  <video
                    src={videoResultUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full h-auto max-h-[460px] object-contain"
                  />
                </div>
              ) : (
                <div className="rounded-xl aspect-video bg-slate-950 border border-slate-800 flex flex-col items-center justify-center p-8 text-center text-slate-500 text-xs space-y-2">
                  <Video className="w-10 h-10 text-slate-700" />
                  <p>Click "Generate Veo 3 Video" to start high-velocity AI video rendering.</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Model: veo-3.1-fast-generate-preview</span>
              <span>Resolution: 720p / 1080p Latent Interpolation</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. LYRIA MUSIC STUDIO TAB (lyria-3-clip-preview / lyria-3-pro-preview) */}
      {/* ========================================================================= */}
      {activeSubTab === 'music' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Music className="w-4 h-4 text-emerald-400" />
                  <span>Lyria Music Generator</span>
                </h3>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                  Lyria 3 Engine
                </span>
              </div>

              {/* Music Duration Mode */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setMusicClipType('clip')}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    musicClipType === 'clip'
                      ? 'bg-emerald-600 text-slate-950 font-bold border-emerald-400 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  30s Short Clip (lyria-3-clip-preview)
                </button>
                <button
                  onClick={() => setMusicClipType('pro')}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    musicClipType === 'pro'
                      ? 'bg-emerald-600 text-slate-950 font-bold border-emerald-400 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Full-Length Track (lyria-3-pro-preview)
                </button>
              </div>

              {/* Prompt Input */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Musical Vibe & Acoustic Blueprint</label>
                <textarea
                  value={musicPrompt}
                  onChange={(e) => setMusicPrompt(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="e.g. Ambient tech podcast intro with crisp electronic beats, warm bassline, and futuristic pads..."
                />
              </div>

              {/* Preset Vibe Buttons */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium">Creator Audio Presets</label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Tech Podcast Intro',
                    'Lo-Fi Coding Focus',
                    'High-Energy Stream Hype',
                    'Cinematic SQA Breakdown',
                  ].map((preset) => (
                    <button
                      key={preset}
                      onClick={() =>
                        setMusicPrompt(
                          `${preset}: energetic rhythm, synth arpeggios, punchy kicks, professional audio mastering for @ogojithecreator._ videos`
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500 text-slate-300 hover:text-emerald-300 text-xs transition-colors cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleGenerateMusic}
                disabled={musicLoading || !musicPrompt.trim()}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                {musicLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Synthesizing Audio via Lyria 3...</span>
                  </>
                ) : (
                  <>
                    <Music className="w-4 h-4 text-slate-950" />
                    <span>Generate Audio Track</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Music Playback & Waveform View */}
          <div className="lg:col-span-7 rounded-2xl bg-slate-900/80 border border-slate-800 p-5 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Lyria Audio Player & Stems
              </span>

              {musicAudioUrl ? (
                <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <Music className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Generated Audio Track</h4>
                        <p className="text-xs text-emerald-400 font-mono">
                          {musicClipType === 'clip' ? '30-Second Clip' : 'Full Master Track'}
                        </p>
                      </div>
                    </div>

                    <a
                      href={musicAudioUrl}
                      download="lyria_track.wav"
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-white flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download WAV</span>
                    </a>
                  </div>

                  {/* HTML5 Audio Player */}
                  <audio
                    ref={audioPlayerRef}
                    src={musicAudioUrl}
                    controls
                    onPlay={() => setIsPlayingMusic(true)}
                    onPause={() => setIsPlayingMusic(false)}
                    className="w-full accent-emerald-500"
                  />

                  {/* Simulated Waveform Visualization Bars */}
                  <div className="flex items-end justify-between h-14 gap-1 px-2 pt-2">
                    {[30, 60, 45, 90, 75, 40, 85, 95, 65, 50, 80, 100, 70, 45, 90, 60, 40, 80, 95, 55, 30].map(
                      (h, i) => (
                        <div
                          key={i}
                          style={{ height: `${h}%` }}
                          className={`w-full rounded-full transition-all ${
                            isPlayingMusic
                              ? 'bg-emerald-400 animate-pulse'
                              : 'bg-emerald-900/60'
                          }`}
                        />
                      )
                    )}
                  </div>

                  {musicLyrics && (
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
                      <span className="font-bold text-emerald-400">Track Notes: </span>
                      {musicLyrics}
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-xl aspect-video bg-slate-950 border border-slate-800 flex flex-col items-center justify-center p-8 text-center text-slate-500 text-xs space-y-2">
                  <Music className="w-10 h-10 text-slate-700" />
                  <p>Click "Generate Audio Track" to compose studio music with Lyria 3.</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Engine: {musicClipType === 'clip' ? 'lyria-3-clip-preview' : 'lyria-3-pro-preview'}</span>
              <span>Audio: 24kHz Stereo Uncompressed</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. LIVE VOICE & AUDIO TRANSCRIPTION (gemini-3.8-live & gemini-3.5-transcribe) */}
      {/* ========================================================================= */}
      {activeSubTab === 'voice' && (
        <div className="space-y-8">
          {/* Bidirectional Live Voice Room (gemini-3.8-live) */}
          <LiveVoiceRoom />

          {/* Audio Transcriber & Speech Generator Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Audio Transcriber Box */}
            <div className="lg:col-span-6 rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Mic className="w-4 h-4 text-cyan-400" />
                <span>Microphone Audio Transcriber</span>
              </h3>
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded">
                gemini-3.5-transcribe
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Record voice notes, SQA bug descriptions, or podcast thoughts. Gemini 3.5 Transcribe converts speech to clean text in real-time.
            </p>

            {/* Recording Controls */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4">
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse shadow-xl shadow-rose-600/40 scale-105'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-xl shadow-cyan-500/30'
                }`}
              >
                {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
              </button>

              <div>
                <p className="text-sm font-bold text-white">
                  {isRecording ? 'Recording Audio... Click to Stop & Transcribe' : 'Tap Mic to Start Speaking'}
                </p>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Supported: WebM / MP3 / PCM Audio Streams
                </p>
              </div>
            </div>

            {/* Transcript Result Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Transcription Output:</span>
                {transcriptResult && (
                  <button
                    onClick={() => copyToClipboard(transcriptResult, 'transcription')}
                    className="hover:text-cyan-400 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === 'transcription' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === 'transcription' ? 'Copied' : 'Copy Text'}</span>
                  </button>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 min-h-[120px] max-h-[200px] overflow-y-auto leading-relaxed">
                {transcriptionLoading ? (
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing audio via gemini-3.5-transcribe...</span>
                  </div>
                ) : (
                  transcriptResult
                )}
              </div>
            </div>
          </div>

          {/* Voice Dialogue & Live API Twin */}
          <div className="lg:col-span-6 rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-violet-400" />
                <span>Victor AI Voice Conversation</span>
              </h3>
              <span className="text-[11px] font-mono text-violet-400 bg-violet-950/60 border border-violet-800 px-2 py-0.5 rounded">
                gemini-3.8-live & TTS
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Have an interactive spoken conversation with Victor's AI Digital Twin using Gemini's native audio reasoning and synthesized voice.
            </p>

            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-medium">Ask or Talk to Victor</label>
              <textarea
                value={voiceDialoguePrompt}
                onChange={(e) => setVoiceDialoguePrompt(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                placeholder="Ask Victor's voice assistant a question..."
              />
            </div>

            <button
              type="button"
              onClick={handleVoiceDialogueTalk}
              disabled={voiceDialogueLoading || !voiceDialoguePrompt.trim()}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
            >
              {voiceDialogueLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Voice Response...</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>Speak with Victor</span>
                </>
              )}
            </button>

            {voiceDialogueResponse && (
              <div className="p-4 rounded-xl bg-slate-950 border border-violet-500/40 space-y-3">
                <div className="text-xs font-mono font-bold text-violet-400 uppercase">
                  Victor's Spoken Response
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  "{voiceDialogueResponse}"
                </p>

                {voiceDialogueAudio && (
                  <audio
                    src={voiceDialogueAudio}
                    controls
                    autoPlay
                    className="w-full accent-violet-500 mt-2"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )}

      {/* ========================================================================= */}
      {/* 6. SEARCH & MAPS GROUNDING TAB (gemini-3.5-flash) */}
      {/* ========================================================================= */}
      {activeSubTab === 'grounding' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Search className="w-4 h-4 text-cyan-400" />
                  <span>Real-Time Grounding Engine</span>
                </h3>
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded">
                  gemini-3.5-flash
                </span>
              </div>

              {/* Grounding Mode Toggle */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setGroundingMode('search');
                    setGroundingPrompt('What are the latest 2026 breakthroughs in AI prompt engineering and automated SQA testing?');
                  }}
                  className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                    groundingMode === 'search'
                      ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Google Search Tool</span>
                </button>
                <button
                  onClick={() => {
                    setGroundingMode('maps');
                    setGroundingPrompt('Find the top developer tech hubs, co-working studios, and tech conference centers in Lagos and London');
                  }}
                  className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                    groundingMode === 'maps'
                      ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Google Maps Tool</span>
                </button>
              </div>

              {/* Prompt Input */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Grounded Query</label>
                <textarea
                  value={groundingPrompt}
                  onChange={(e) => setGroundingPrompt(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Enter a search or location query..."
                />
              </div>

              {/* Run Grounding Button */}
              <button
                type="button"
                onClick={handleRunGrounding}
                disabled={groundingLoading || !groundingPrompt.trim()}
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                {groundingLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Querying Grounded Tool...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 text-slate-950" />
                    <span>Retrieve Grounded Intelligence</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Grounded Results & Sources */}
          <div className="lg:col-span-7 rounded-2xl bg-slate-900/80 border border-slate-800 p-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Grounded Intelligence Output
                </span>
                <span className="text-xs text-cyan-400 font-mono">
                  Tool: {groundingMode === 'search' ? 'googleSearch' : 'googleMaps'}
                </span>
              </div>

              {groundingResult ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {groundingResult.text}
                  </div>

                  {groundingResult.sources && groundingResult.sources.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Verified Reference Sources:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {groundingResult.sources.map((src, i) => (
                          <a
                            key={i}
                            href={src.url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-cyan-300 flex items-center justify-between transition-colors"
                          >
                            <span className="line-clamp-1">{src.title}</span>
                            <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-2 text-cyan-400" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-xl aspect-video bg-slate-950 border border-slate-800 flex flex-col items-center justify-center p-8 text-center text-slate-500 text-xs space-y-2">
                  <Search className="w-10 h-10 text-slate-700" />
                  <p>Execute a grounded search to retrieve verified web citations and place coordinates.</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Model: gemini-3.5-flash</span>
              <span>Grounding: Real-time Live Verified Web & Maps</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
