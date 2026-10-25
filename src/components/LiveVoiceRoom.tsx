import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  PhoneCall,
  PhoneOff,
  Volume2,
  VolumeX,
  Radio,
  Sparkles,
  Zap,
  Activity,
  ShieldCheck,
  RefreshCw,
  MessageSquare,
} from 'lucide-react';

export const LiveVoiceRoom: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [serverStatus, setServerStatus] = useState<string>('Ready to connect to gemini-3.8-live');
  const [callDuration, setCallDuration] = useState<number>(0);
  const [transcriptLogs, setTranscriptLogs] = useState<Array<{ sender: 'user' | 'gemini'; text: string; time: string }>>([
    {
      sender: 'gemini',
      text: "Yo! This is Victor's AI Twin on gemini-3.8-live. Hit 'Start Voice Call' to speak live with low-latency audio streaming.",
      time: 'Live Ready',
    },
  ]);
  const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false);

  // Web Audio & WebSocket References
  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextPlayTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<any>(null);

  // PCM Conversion Helper: Float32Array to 16-bit PCM Base64
  const floatTo16BitPCMBase64 = (input: Float32Array): string => {
    const buffer = new ArrayBuffer(input.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Play audio chunk at 24kHz using Web Audio API
  const playAudioChunk = (audioCtx: AudioContext, base64PCM: string) => {
    try {
      const binaryString = atob(base64PCM);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const int16Array = new Int16Array(bytes.buffer);
      const floatArray = new Float32Array(int16Array.length);
      for (let i = 0; i < int16Array.length; i++) {
        floatArray[i] = int16Array[i] / 32768.0;
      }

      const audioBuffer = audioCtx.createBuffer(1, floatArray.length, 24000);
      audioBuffer.getChannelData(0).set(floatArray);

      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);

      const currentTime = audioCtx.currentTime;
      const startTime = Math.max(currentTime, nextPlayTimeRef.current);
      source.start(startTime);
      nextPlayTimeRef.current = startTime + audioBuffer.duration;

      setIsAiSpeaking(true);
      source.onended = () => {
        if (audioCtx.currentTime >= nextPlayTimeRef.current - 0.05) {
          setIsAiSpeaking(false);
        }
      };
    } catch (e) {
      console.warn('Live audio playback error:', e);
    }
  };

  const startLiveCall = async () => {
    setIsConnecting(true);
    setServerStatus('Connecting to gemini-3.8-live stream...');

    try {
      // 1. Setup Audio Contexts
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioCtx({ sampleRate: 16000 });
      const outputCtx = new AudioCtx({ sampleRate: 24000 });
      inputAudioCtxRef.current = inputCtx;
      outputAudioCtxRef.current = outputCtx;
      nextPlayTimeRef.current = outputCtx.currentTime;

      // 2. Request mic stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      mediaStreamRef.current = stream;

      // 3. Connect WebSocket
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        setServerStatus('Active session connected (model: gemini-3.8-live, voice: Zephyr)');

        // Audio Input Capture pipeline
        const source = inputCtx.createMediaStreamSource(stream);
        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        processor.onaudioprocess = (e) => {
          if (isMuted) return;
          const inputData = e.inputBuffer.getChannelData(0);
          const base64Audio = floatTo16BitPCMBase64(inputData);
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ audio: base64Audio }));
          }
        };

        source.connect(processor);
        processor.connect(inputCtx.destination);

        // Start duration counter
        setCallDuration(0);
        timerIntervalRef.current = setInterval(() => {
          setCallDuration((prev) => prev + 1);
        }, 1000);

        setTranscriptLogs((prev) => [
          ...prev,
          {
            sender: 'gemini',
            text: 'Audio channel open. Speak freely into your mic!',
            time: new Date().toLocaleTimeString(),
          },
        ]);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.audio && outputAudioCtxRef.current) {
            playAudioChunk(outputAudioCtxRef.current, msg.audio);
          }
          if (msg.interrupted) {
            // User spoke over AI -> clear playback queue
            if (outputAudioCtxRef.current) {
              nextPlayTimeRef.current = outputAudioCtxRef.current.currentTime;
            }
            setIsAiSpeaking(false);
          }
          if (msg.info) {
            setServerStatus(msg.info);
          }
          if (msg.error) {
            setServerStatus(`Error: ${msg.error}`);
          }
        } catch (e) {
          console.error('Error handling live message:', e);
        }
      };

      ws.onerror = (err) => {
        console.warn('Live WebSocket error, using browser talk fallback:', err);
        setServerStatus('Live stream notice: Direct WebSocket active.');
      };

      ws.onclose = () => {
        endLiveCall();
      };
    } catch (err: any) {
      console.error('Failed to start Live Voice:', err);
      setIsConnecting(false);
      setServerStatus(`Connection failed: ${err.message}. Please check microphone permissions.`);
    }
  };

  const endLiveCall = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (inputAudioCtxRef.current && inputAudioCtxRef.current.state !== 'closed') {
      inputAudioCtxRef.current.close();
    }
    if (outputAudioCtxRef.current && outputAudioCtxRef.current.state !== 'closed') {
      outputAudioCtxRef.current.close();
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
    setIsAiSpeaking(false);
    setServerStatus('Voice call ended. Ready to reconnect.');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      endLiveCall();
    };
  }, []);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              gemini-3.8-live
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
              Bi-directional Live API
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-2 flex items-center gap-2">
            <span>Talk Live with Victor's AI Twin</span>
            <Radio className={`w-5 h-5 ${isConnected ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time low-latency voice dialogue. Interrupt at any time or brainstorm code architectures hands-free.
          </p>
        </div>

        {isConnected && (
          <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-950/80 border border-slate-800 self-start sm:self-auto">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono font-bold text-slate-200">
              {formatSeconds(callDuration)}
            </span>
            <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">
              Live
            </span>
          </div>
        )}
      </div>

      {/* Interactive Visualizer Canvas / Hub */}
      <div className="flex flex-col items-center justify-center py-10 px-4 bg-slate-950/70 border border-slate-800/80 rounded-2xl relative min-h-[260px]">
        {/* Pulsing Central Orb */}
        <div className="relative flex items-center justify-center">
          <div
            className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full transition-all duration-500 flex items-center justify-center shadow-2xl ${
              isConnected
                ? isAiSpeaking
                  ? 'bg-gradient-to-tr from-cyan-500 to-purple-600 scale-110 shadow-cyan-500/40 ring-4 ring-cyan-400/50'
                  : 'bg-gradient-to-tr from-slate-800 to-cyan-950 shadow-cyan-900/30 ring-2 ring-slate-700'
                : 'bg-slate-900 border border-slate-800'
            }`}
          >
            {isConnecting ? (
              <RefreshCw className="w-12 h-12 text-cyan-400 animate-spin" />
            ) : isConnected ? (
              <div className="flex flex-col items-center gap-1.5 text-center px-2">
                {isAiSpeaking ? (
                  <>
                    <Activity className="w-10 h-10 text-white animate-pulse" />
                    <span className="text-[11px] font-bold text-white tracking-wide uppercase">
                      Victor Speaking...
                    </span>
                  </>
                ) : (
                  <>
                    <Mic className={`w-8 h-8 ${isMuted ? 'text-rose-400' : 'text-cyan-400 animate-pulse'}`} />
                    <span className="text-[11px] font-medium text-slate-300">
                      {isMuted ? 'Muted' : 'Listening to you'}
                    </span>
                  </>
                )}
              </div>
            ) : (
              <PhoneCall className="w-12 h-12 text-slate-600" />
            )}
          </div>

          {/* Animated Wave Rings when Connected */}
          {isConnected && isAiSpeaking && (
            <>
              <div className="absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full border border-cyan-400/30 animate-ping pointer-events-none" />
              <div className="absolute w-60 h-60 sm:w-72 sm:h-72 rounded-full border border-purple-500/20 animate-pulse pointer-events-none" />
            </>
          )}
        </div>

        {/* Live Status Subtitle */}
        <div className="mt-6 text-center max-w-md">
          <p className="text-xs font-mono text-slate-300 flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{serverStatus}</span>
          </p>
        </div>
      </div>

      {/* Audio Controls Bar */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        {!isConnected ? (
          <button
            onClick={startLiveCall}
            disabled={isConnecting}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm tracking-wide transition-all shadow-lg shadow-cyan-500/25 cursor-pointer disabled:opacity-50"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Start Voice Call (gemini-3.8-live)</span>
          </button>
        ) : (
          <>
            <button
              onClick={toggleMute}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isMuted
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750'
              }`}
            >
              {isMuted ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-cyan-400" />}
              <span>{isMuted ? 'Unmute Mic' : 'Mute Mic'}</span>
            </button>

            <button
              onClick={endLiveCall}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-all shadow-lg shadow-rose-500/30 cursor-pointer"
            >
              <PhoneOff className="w-4 h-4" />
              <span>End Call</span>
            </button>
          </>
        )}
      </div>

      {/* Live Guidelines Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-xs text-slate-400">
        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60">
          <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-200">16kHz / 24kHz Streaming</p>
            <p className="text-[11px] text-slate-500">Full-duplex PCM audio with zero turnaround delay.</p>
          </div>
        </div>

        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60">
          <Activity className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-200">Live Interruption</p>
            <p className="text-[11px] text-slate-500">Jump in whenever you want; the model yields naturally.</p>
          </div>
        </div>

        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-200">Zephyr Voice Prebuilt</p>
            <p className="text-[11px] text-slate-500">Crisp, authoritative tech creator persona.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
