import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  ArrowLeft, 
  Globe, 
  MapPin, 
  History, 
  Zap, 
  ShieldCheck, 
  ExternalLink,
  Mic,
  Square,
  Cpu
} from 'lucide-react';
import { auth, db, doc, collection, addDoc, query, orderBy, onSnapshot } from '../lib/firebase';

interface CareerCoachChatProps {
  onBack: () => void;
  currentUser?: any;
}

interface ChatMessageItem {
  id: string;
  role: 'user' | 'model';
  content: string;
  modelUsed?: string;
  sources?: Array<{ title: string; uri: string }>;
  timestamp?: string;
}

export const CareerCoachChat: React.FC<CareerCoachChatProps> = ({ onBack, currentUser }) => {
  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: 'welcome',
      role: 'model',
      content: `Hello! 👋 I am your multi-model AI Career Co-pilot at JobReady AI. 

I can assist you with:
• **Complex Strategy & Leadership** using **gemini-4-argon**
• **General Career Coaching & Resume Optimization** using **gemini-3.8-flash**
• **Instant High-Speed Answers** using **gemini-3.1-flash-lite**
• **Live Google Search Grounding** (real-time salary spikes, top recruiters, hiring surges)
• **Google Maps Grounding** (commute times, HQ tech clusters in Bengaluru, Gurugram, Hyderabad, and Pune)
• **Voice-to-Text Audio Transcription** using **gemini-3.5-transcribe**

How can I help accelerate your career today?`,
      modelUsed: 'gemini-3.8-flash',
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [modelTier, setModelTier] = useState<'gemini-4-argon' | 'gemini-3.8-flash' | 'gemini-3.1-flash-lite'>('gemini-3.8-flash');
  const [enableSearch, setEnableSearch] = useState(false);
  const [enableMaps, setEnableMaps] = useState(false);

  // Audio Recording & Transcription (gemini-3.5-transcribe)
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Sync with Firestore chat history if user is signed in
  useEffect(() => {
    if (!currentUser?.uid) return;
    try {
      const chatRef = collection(db, 'users', currentUser.uid, 'chatHistory');
      const q = query(chatRef, orderBy('timestamp', 'asc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const loaded: ChatMessageItem[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            loaded.push({
              id: doc.id,
              role: data.role,
              content: data.content,
              modelUsed: data.modelUsed,
              sources: data.sources || [],
            });
          });
          if (loaded.length > 0) {
            setMessages(loaded);
          }
        }
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Firestore chat listener notice:', e);
    }
  }, [currentUser?.uid]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach((track) => track.stop());
        await transcribeAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access denied:', err);
      alert('Microphone access is required for audio transcription.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const res = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBase64: base64Data,
            mimeType: 'audio/webm',
          }),
        });
        const data = await res.json();
        if (data.transcript) {
          setInputVal((prev) => (prev ? `${prev} ${data.transcript}` : data.transcript));
        }
        setIsTranscribing(false);
      };
    } catch (error) {
      console.error('Transcription error:', error);
      setIsTranscribing(false);
    }
  };

  const handleSend = async (customPrompt?: string) => {
    const q = (customPrompt || inputVal).trim();
    if (!q || isTyping) return;

    const userMsg: ChatMessageItem = {
      id: Date.now().toString(),
      role: 'user',
      content: q,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Save to Firestore if authenticated
    if (currentUser?.uid) {
      try {
        await addDoc(collection(db, 'users', currentUser.uid, 'chatHistory'), {
          ...userMsg,
          userId: currentUser.uid,
        });
      } catch (err) {
        console.error('Failed to save user chat to Firestore:', err);
      }
    }

    try {
      let resData: any = null;

      if (enableSearch) {
        const res = await fetch('/api/search-grounding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: q }),
        });
        resData = await res.json();
      } else if (enableMaps) {
        const res = await fetch('/api/maps-grounding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: q }),
        });
        resData = await res.json();
      } else {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: q,
            history: messages.slice(-8),
            modelChoice: modelTier,
            roleInstruction: "You are an elite Executive HR Career Coach and ATS Specialist at JobReady AI. Provide sharp, actionable, high-impact career advice, salary negotiation tactics, and bullet improvements.",
          }),
        });
        resData = await res.json();
      }

      const botReply: ChatMessageItem = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: resData?.reply || resData?.text || "I'm analyzing your request. Let's optimize this further.",
        modelUsed: enableSearch ? 'gemini-3.8-flash (Search Grounded)' : enableMaps ? 'gemini-3.8-flash (Maps Grounded)' : (resData?.modelUsed || modelTier),
        sources: resData?.sources || [],
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botReply]);

      // Save bot reply to Firestore if authenticated
      if (currentUser?.uid) {
        try {
          await addDoc(collection(db, 'users', currentUser.uid, 'chatHistory'), {
            ...botReply,
            userId: currentUser.uid,
          });
        } catch (err) {
          console.error('Failed to save bot reply to Firestore:', err);
        }
      }
    } catch (err) {
      console.error('Chat API Error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: "I've encountered a temporary connection glitch. Please try asking again.",
          modelUsed: modelTier,
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[82vh] rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80 gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Dashboard</span>
          </button>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>JobReady Gemini AI Career Co-pilot</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Multi-turn career coaching with Search & Maps Grounding
            </p>
          </div>
        </div>

        {/* Controls: Model & Grounding Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 rounded-xl bg-slate-900 border border-slate-800 p-1 text-xs">
            <button
              type="button"
              onClick={() => { setModelTier('gemini-4-argon'); setEnableSearch(false); setEnableMaps(false); }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                modelTier === 'gemini-4-argon' && !enableSearch && !enableMaps
                  ? 'bg-amber-400 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="h-3 w-3" />
              <span>Complex (4-Argon)</span>
            </button>
            <button
              type="button"
              onClick={() => { setModelTier('gemini-3.8-flash'); setEnableSearch(false); setEnableMaps(false); }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                modelTier === 'gemini-3.8-flash' && !enableSearch && !enableMaps
                  ? 'bg-amber-400 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              General (3.8)
            </button>
            <button
              type="button"
              onClick={() => { setModelTier('gemini-3.1-flash-lite'); setEnableSearch(false); setEnableMaps(false); }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                modelTier === 'gemini-3.1-flash-lite' && !enableSearch && !enableMaps
                  ? 'bg-amber-400 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="h-3 w-3 inline mr-0.5" />
              Fast (Lite)
            </button>
          </div>

          <button
            type="button"
            onClick={() => { setEnableSearch(!enableSearch); setEnableMaps(false); }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition ${
              enableSearch
                ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="h-3.5 w-3.5 text-blue-400" />
            <span>Search</span>
          </button>

          <button
            type="button"
            onClick={() => { setEnableMaps(!enableMaps); setEnableSearch(false); }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition ${
              enableMaps
                ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="h-3.5 w-3.5 text-emerald-400" />
            <span>Maps</span>
          </button>
        </div>
      </div>

      {/* Message Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 max-w-3xl ${m.role === 'user' ? 'ml-auto justify-end' : ''}`}
          >
            {m.role === 'model' && (
              <div className="h-8 w-8 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-amber-400" />
              </div>
            )}
            <div
              className={`rounded-2xl p-4 text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-amber-400 text-slate-950 font-medium'
                  : 'bg-slate-950/80 border border-slate-800 text-slate-200'
              }`}
            >
              {m.modelUsed && (
                <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold text-amber-400/80 uppercase tracking-wider">
                  <Sparkles className="h-3 w-3" />
                  <span>{m.modelUsed}</span>
                </div>
              )}
              <div className="whitespace-pre-line">{m.content}</div>

              {/* Citations & Web Sources */}
              {m.sources && m.sources.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                  <span className="text-[10px] font-bold text-blue-400 block mb-1">
                    Google Search Sources:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {m.sources.map((s, idx) => (
                      <a
                        key={idx}
                        href={s.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-950/60 border border-blue-800/50 text-[10px] text-blue-300 hover:text-white"
                      >
                        <ExternalLink className="h-2.5 w-2.5" />
                        <span>{s.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {m.role === 'user' && (
              <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                <User className="h-4 w-4 text-slate-300" />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3 max-w-md">
            <div className="h-8 w-8 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4 text-amber-400" />
            </div>
            <div className="rounded-2xl p-4 bg-[#0C1017]/90 border border-[#2B3340] text-[#949EB0] text-xs flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#FFB319] animate-pulse" />
              <span>Thinking ({enableSearch ? 'Google Search' : enableMaps ? 'Google Maps' : modelTier})...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 border-t border-slate-800/60 bg-slate-950/40 flex items-center gap-2 overflow-x-auto text-xs">
        <button
          type="button"
          onClick={() => { setEnableSearch(true); handleSend("What are the highest-paying HR and tech recruiter skills in India for 2026?"); }}
          className="shrink-0 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
        >
          🔍 2026 Recruiter Skills (Search)
        </button>
        <button
          type="button"
          onClick={() => { setEnableMaps(true); handleSend("Where are the major Google and Microsoft campus offices located in Hyderabad and Bengaluru?"); }}
          className="shrink-0 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
        >
          📍 Tech HQs in Bengaluru (Maps)
        </button>
        <button
          type="button"
          onClick={() => handleSend("Rewrite my recruitment experience bullet to include quantifiable metrics like time-to-fill and offer acceptance rate.")}
          className="shrink-0 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
        >
          ✨ Upgrade Resume Bullet Point
        </button>
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          {/* Audio Microphone Transcription Button (gemini-3.5-transcribe) */}
          <button
            type="button"
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            className={`flex items-center justify-center h-10 w-10 rounded-xl transition ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse'
                : isTranscribing
                ? 'bg-amber-500 text-slate-950 animate-spin'
                : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white'
            }`}
            title={isRecording ? 'Click to stop recording' : 'Click to speak (gemini-3.5-transcribe)'}
          >
            {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>

          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={
              isRecording
                ? "Listening... Speak your prompt clearly"
                : isTranscribing
                ? "Transcribing audio via gemini-3.5-transcribe..."
                : enableSearch
                ? "Ask real-time hiring trends via Google Search..."
                : enableMaps
                ? "Ask office locations, commute times, or tech clusters..."
                : "Ask anything about career strategy, salary, or resume bullets..."
            }
            className="flex-1 rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isTyping}
            className="flex items-center justify-center h-10 w-10 rounded-xl bg-amber-400 text-slate-950 hover:bg-amber-300 disabled:opacity-40 transition"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
