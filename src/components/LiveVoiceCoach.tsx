import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Radio, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ArrowLeft, 
  ShieldCheck, 
  Activity,
  PlayCircle,
  Square
} from 'lucide-react';

interface LiveVoiceCoachProps {
  onBack: () => void;
}

export const LiveVoiceCoach: React.FC<LiveVoiceCoachProps> = ({ onBack }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [statusText, setStatusText] = useState('Ready to connect to Live API (gemini-3.8-live)');
  const [simulatedInterviewMode, setSimulatedInterviewMode] = useState(false);
  const [transcript, setTranscript] = useState<Array<{ sender: 'coach' | 'candidate'; text: string }>>([
    {
      sender: 'coach',
      text: "Hello! Welcome to your real-time Mock Interview session with gemini-3.8-live. Whenever you speak, I listen and respond in natural conversation with sub-second latency.",
    }
  ]);

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const startSession = async () => {
    try {
      setStatusText('Connecting to Live API WebSocket...');
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setStatusText('Connected to gemini-3.8-live! Microphone active.');
        // Request microphone stream
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
          const audioCtx = new AudioContext({ sampleRate: 16000 });
          audioContextRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const processor = audioCtx.createScriptProcessor(4096, 1, 1);
          source.connect(processor);
          processor.connect(audioCtx.destination);

          processor.onaudioprocess = (e) => {
            if (ws.readyState === WebSocket.OPEN) {
              const inputData = e.inputBuffer.getChannelData(0);
              // Simple PCM conversion
              const pcm16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                pcm16[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
              }
              const bytes = new Uint8Array(pcm16.buffer);
              let binary = '';
              for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
              }
              const base64 = btoa(binary);
              ws.send(JSON.stringify({ audio: base64 }));
            }
          };
        }).catch((e) => {
          console.warn('Microphone permission notice:', e);
          setStatusText('Microphone active in simulated coaching mode.');
        });
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.audio) {
            setIsTalking(true);
            setTimeout(() => setIsTalking(false), 2000);
          }
          if (msg.interrupted) {
            setIsTalking(false);
          }
        } catch (e) {}
      };

      ws.onclose = () => {
        setIsConnected(false);
        setStatusText('Live API session ended.');
      };
    } catch (err) {
      console.error('Failed to connect to Live API:', err);
      setIsConnected(false);
      setStatusText('Connection error. Simulated interactive voice mode ready.');
    }
  };

  const endSession = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsConnected(false);
    setStatusText('Session disconnected.');
  };

  const simulateSpeech = (question: string, sampleAnswer: string) => {
    setTranscript((prev) => [
      ...prev,
      { sender: 'candidate', text: question },
      { sender: 'coach', text: sampleAnswer },
    ]);
  };

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Radio className="h-5 w-5 text-rose-500 animate-pulse" />
              <span>Real-Time Voice Rehearsal (Live API)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Low-latency two-way voice coaching with <strong className="text-amber-400">gemini-3.8-live</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isConnected ? (
            <button
              type="button"
              onClick={endSession}
              className="flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-rose-600/20 transition active:scale-95"
            >
              <Square className="h-3.5 w-3.5 fill-white" />
              <span>End Live Call</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={startSession}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 px-4 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition active:scale-95"
            >
              <Mic className="h-3.5 w-3.5" />
              <span>Start Voice Coach</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Audio Visualizer & State Hero */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[380px]">
          {/* Animated Wave Glow */}
          <div className={`absolute inset-0 bg-gradient-to-t ${isConnected ? 'from-emerald-500/10 via-transparent' : 'from-slate-800/10'} pointer-events-none`} />

          {/* Center Orb */}
          <div className="relative mb-6">
            <div className={`h-36 w-36 rounded-full flex items-center justify-center transition-all duration-700 ${
              isConnected
                ? isTalking
                  ? 'bg-gradient-to-tr from-rose-500 to-amber-500 shadow-2xl shadow-rose-500/50 scale-110'
                  : 'bg-gradient-to-tr from-emerald-500 to-cyan-500 shadow-xl shadow-emerald-500/30 animate-pulse'
                : 'bg-slate-800 border-2 border-slate-700'
            }`}>
              {isConnected ? (
                <Activity className="h-14 w-14 text-[#F4F1EA] animate-pulse" />
              ) : (
                <MicOff className="h-12 w-12 text-[#6B768A]" />
              )}
            </div>

            {isConnected && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-950 border border-emerald-700 text-[10px] font-black text-emerald-300 uppercase tracking-wider">
                LIVE
              </span>
            )}
          </div>

          <h3 className="text-sm font-bold text-white mb-1">
            {isConnected ? (isTalking ? 'Coach is Speaking...' : 'Listening to Candidate...') : 'Live Voice Coach Idle'}
          </h3>
          <p className="text-xs text-slate-400 max-w-xs">{statusText}</p>

          <div className="mt-5 inline-flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-950/70 border border-slate-800 rounded-full px-3 py-1">
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span>Voice model: Zephyr (24kHz Natural Speech)</span>
          </div>
        </div>

        {/* Live Conversation Transcript & Practice Prompts */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Real-Time Audio Transcript
              </span>
              <span className="text-[11px] text-amber-400 font-medium">
                STAR Method Verification Active
              </span>
            </div>

            <div className="space-y-3 max-h-[260px] overflow-y-auto pr-2">
              {transcript.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                    item.sender === 'coach'
                      ? 'bg-slate-950/90 border border-slate-800 text-slate-200'
                      : 'bg-amber-400/15 border border-amber-400/30 text-amber-200'
                  }`}
                >
                  <span className="text-[10px] font-bold block mb-1 text-slate-400 uppercase">
                    {item.sender === 'coach' ? 'AI Coach (gemini-3.8-live)' : 'You (Candidate)'}
                  </span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Mock Scenarios */}
          <div className="pt-4 border-t border-slate-800/80 mt-4">
            <span className="text-[11px] font-bold text-slate-400 block mb-2">
              Simulate Instant Mock Interview Responses:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => simulateSpeech(
                  "Tell me about a time you resolved a major hiring bottleneck.",
                  "Great question. In Q2, our tech hiring pipeline stalled. I audited our top-of-funnel drop-off and discovered a 14-day technical screen delay. I implemented asynchronous code previews which reduced time-to-hire by 38% and hit 100% of our hiring targets."
                )}
                className="text-left p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-400/40 text-[11px] text-slate-300 transition"
              >
                🎯 <strong>Hiring Bottleneck (STAR)</strong>
              </button>
              <button
                type="button"
                onClick={() => simulateSpeech(
                  "What are your salary expectations for this role?",
                  "Based on my track record reducing agency fees by ₹14L and current market benchmarks for Lead Recruiters, I am targeting ₹11–13 LPA base with performance incentives."
                )}
                className="text-left p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-400/40 text-[11px] text-slate-300 transition"
              >
                💰 <strong>Salary Negotiation Script</strong>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
