import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Video, 
  Image as ImageIcon, 
  Music, 
  ArrowLeft, 
  Download, 
  Play, 
  Pause,
  Upload, 
  RefreshCw,
  Film,
  Camera,
  CheckCircle2,
  Sliders,
  Clock,
  Radio,
  Layers,
  ExternalLink
} from 'lucide-react';
import { db, collection, addDoc, query, orderBy, onSnapshot } from '../lib/firebase';

interface MultimediaStudioProps {
  onBack: () => void;
  currentUser?: any;
}

interface SavedAsset {
  id: string;
  type: 'video' | 'image' | 'music';
  prompt: string;
  mediaUrl: string;
  model: string;
  createdAt: string;
  aspectRatio?: string;
  duration?: number;
}

export const MultimediaStudio: React.FC<MultimediaStudioProps> = ({ onBack, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'video' | 'image' | 'music'>('video');
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  
  // Video options (Veo 3.1)
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Music options (Lyria 3)
  const [musicModel, setMusicModel] = useState<'lyria-3-clip-preview' | 'lyria-3-pro-preview'>('lyria-3-clip-preview');
  const [musicDuration, setMusicDuration] = useState<number>(30); // 15s or 30s for clip, 60s or 120s for pro

  // Generated Result
  const [generatedResult, setGeneratedResult] = useState<{
    type: 'video' | 'image' | 'music';
    url: string;
    prompt: string;
    model: string;
    aspectRatio?: string;
    duration?: number;
  } | null>(null);

  // Recent History from Firestore
  const [recentAssets, setRecentAssets] = useState<SavedAsset[]>([]);

  useEffect(() => {
    if (!currentUser?.uid) return;
    try {
      const assetsRef = collection(db, 'users', currentUser.uid, 'studioAssets');
      const q = query(assetsRef, orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const loaded: SavedAsset[] = [];
        snapshot.forEach((doc) => {
          const d = doc.data();
          loaded.push({
            id: doc.id,
            type: d.type,
            prompt: d.prompt,
            mediaUrl: d.mediaUrl,
            model: d.model || '',
            createdAt: d.createdAt,
            aspectRatio: d.aspectRatio,
            duration: d.duration,
          });
        });
        setRecentAssets(loaded);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Could not load assets from Firestore:', e);
    }
  }, [currentUser?.uid]);

  const handleGenerate = async () => {
    if (!prompt.trim() && !selectedPhoto) return;
    setIsGenerating(true);

    const modelName = activeTab === 'video' 
      ? 'veo-3.1-fast-generate-preview' 
      : activeTab === 'music' 
      ? musicModel 
      : 'gemini-nano-banana-2.1';

    try {
      const res = await fetch('/api/generate-asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activeTab,
          prompt: prompt || (activeTab === 'video' ? 'Animated executive elevator pitch video' : 'Professional resume asset'),
          aspectRatio,
          musicModel,
          duration: musicDuration,
          hasPhoto: !!selectedPhoto,
        }),
      });
      const data = await res.json();

      const result = {
        type: activeTab,
        url: data.url,
        prompt: prompt || `${activeTab.toUpperCase()} generation`,
        model: modelName,
        aspectRatio: activeTab === 'video' ? aspectRatio : undefined,
        duration: activeTab === 'music' ? musicDuration : undefined,
      };
      setGeneratedResult(result);

      // Save asset record to Firestore
      if (currentUser?.uid) {
        try {
          await addDoc(collection(db, 'users', currentUser.uid, 'studioAssets'), {
            userId: currentUser.uid,
            type: activeTab,
            prompt: result.prompt,
            mediaUrl: data.url,
            model: modelName,
            aspectRatio: activeTab === 'video' ? aspectRatio : null,
            duration: activeTab === 'music' ? musicDuration : null,
            createdAt: new Date().toISOString(),
          });
        } catch (e) {
          console.warn('Could not save studio asset to Firestore:', e);
        }
      }
    } catch (err) {
      console.error('Asset creation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setSelectedPhoto(evt.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
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
              <Sparkles className="h-5 w-5 text-amber-400" />
              <span>JobReady Multimodal AI Creative Studio</span>
            </h2>
            <p className="text-xs text-slate-400">
              Veo 3.1 video pitches, Imagen headshots & Lyria 3 walk-up audio tracks
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-900 border border-slate-800 p-1 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => { setActiveTab('video'); setGeneratedResult(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'video' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="h-3.5 w-3.5" />
            <span>Veo Video (3.1)</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('music'); setGeneratedResult(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'music' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Music className="h-3.5 w-3.5" />
            <span>Lyria Music (3)</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('image'); setGeneratedResult(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'image' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>AI Headshots</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="h-4 w-4 text-amber-400" />
              <span>
                {activeTab === 'video' && 'Veo 3.1 Video Pitch Config'}
                {activeTab === 'music' && 'Lyria 3 Music Generator'}
                {activeTab === 'image' && 'AI Executive Headshot Studio'}
              </span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
              {activeTab === 'video' && 'veo-3.1-fast-generate-preview'}
              {activeTab === 'music' && musicModel}
              {activeTab === 'image' && 'gemini-nano-banana-2.1'}
            </span>
          </div>

          {/* Video Controls */}
          {activeTab === 'video' && (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1.5">
                  Aspect Ratio (Veo Specification):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAspectRatio('16:9')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                      aspectRatio === '16:9'
                        ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Film className="h-3.5 w-3.5" />
                    <span>16:9 Landscape</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAspectRatio('9:16')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                      aspectRatio === '9:16'
                        ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Camera className="h-3.5 w-3.5" />
                    <span>9:16 Portrait</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1.5">
                  Photo-to-Video Animation (Optional):
                </label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-amber-400/50 rounded-xl p-3 cursor-pointer bg-slate-950/60 transition text-center">
                  <Upload className="h-5 w-5 text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-slate-300">
                    {selectedPhoto ? 'Photo Uploaded (Click to change)' : 'Upload portrait photo'}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Veo animates this face into a speaking pitch</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
                {selectedPhoto && (
                  <div className="mt-2 flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <img src={selectedPhoto} alt="Upload Preview" className="h-9 w-9 object-cover rounded-md border border-slate-700" />
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Attached for Veo generation
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Music Controls */}
          {activeTab === 'music' && (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1.5">
                  Lyria Generation Model:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMusicModel('lyria-3-clip-preview');
                      setMusicDuration(30);
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center gap-1 text-center ${
                      musicModel === 'lyria-3-clip-preview'
                        ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-extrabold">lyria-3-clip-preview</span>
                    <span className="text-[10px] opacity-80">Short Clips (up to 30s)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMusicModel('lyria-3-pro-preview');
                      setMusicDuration(60);
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center gap-1 text-center ${
                      musicModel === 'lyria-3-pro-preview'
                        ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-extrabold">lyria-3-pro-preview</span>
                    <span className="text-[10px] opacity-80">Full-Length Tracks</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1.5">
                  Track Duration:
                </label>
                <div className="flex items-center gap-2">
                  {musicModel === 'lyria-3-clip-preview' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setMusicDuration(15)}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition ${
                          musicDuration === 15 ? 'border-amber-400 bg-amber-400/10 text-amber-300' : 'border-slate-800 bg-slate-950 text-slate-400'
                        }`}
                      >
                        15 seconds
                      </button>
                      <button
                        type="button"
                        onClick={() => setMusicDuration(30)}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition ${
                          musicDuration === 30 ? 'border-amber-400 bg-amber-400/10 text-amber-300' : 'border-slate-800 bg-slate-950 text-slate-400'
                        }`}
                      >
                        30 seconds (Max)
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setMusicDuration(60)}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition ${
                          musicDuration === 60 ? 'border-amber-400 bg-amber-400/10 text-amber-300' : 'border-slate-800 bg-slate-950 text-slate-400'
                        }`}
                      >
                        60 seconds
                      </button>
                      <button
                        type="button"
                        onClick={() => setMusicDuration(120)}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition ${
                          musicDuration === 120 ? 'border-amber-400 bg-amber-400/10 text-amber-300' : 'border-slate-800 bg-slate-950 text-slate-400'
                        }`}
                      >
                        120 seconds
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Prompt Box */}
          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1.5">
              Generation Prompt:
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                activeTab === 'video'
                  ? "A sharp, charismatic talent acquisition leader in modern corporate attire delivering a 30s executive elevator pitch..."
                  : activeTab === 'music'
                  ? "Energetic, cinematic electronic track with driving beats for interview confidence and focus..."
                  : "Executive LinkedIn profile photo, navy tailored blazer, soft rim studio lighting, 4K crisp clarity..."
              }
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          {/* Quick Preset Prompts */}
          <div>
            <span className="text-[10px] text-slate-400 block mb-1 font-semibold uppercase tracking-wider">
              Quick Suggestions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activeTab === 'video' && (
                <>
                  <button
                    type="button"
                    onClick={() => setPrompt("Executive 30s elevator pitch for Fortune 500 HR director")}
                    className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  >
                    Executive Pitch
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrompt("Tech recruiter presenting candidate sourcing metrics on stage")}
                    className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  >
                    Tech Recruiter Showcase
                  </button>
                </>
              )}
              {activeTab === 'music' && (
                <>
                  <button
                    type="button"
                    onClick={() => setPrompt("Calm, steady ambient beats with subtle synth for pre-interview anxiety reduction")}
                    className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  >
                    Calm Focus Track
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrompt("Uplifting sports-walkup motivational track with crisp brass and drums")}
                    className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  >
                    Interview Hype Walk-Up
                  </button>
                </>
              )}
              {activeTab === 'image' && (
                <>
                  <button
                    type="button"
                    onClick={() => setPrompt("Corporate executive headshot, confident smile, clean bokeh office background")}
                    className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  >
                    LinkedIn Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrompt("Modern creative startup lead portrait, natural daylight, high resolution")}
                    className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  >
                    Startup Lead
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 px-5 py-3 text-xs font-black text-slate-950 shadow-lg shadow-amber-500/20 active:scale-95 transition disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Generating {activeTab}...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>
                  {activeTab === 'video' && 'Synthesize Video Pitch (veo-3.1)'}
                  {activeTab === 'music' && `Synthesize Music Track (${musicModel})`}
                  {activeTab === 'image' && 'Generate Headshot (gemini-nano-banana)'}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Output & Playback Canvas */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 flex flex-col items-center justify-center min-h-[380px] text-center relative overflow-hidden">
            {generatedResult ? (
              <div className="w-full space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Generated Asset Preview
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {generatedResult.model}
                    </span>
                  </div>
                  <a
                    href={generatedResult.url}
                    download="jobready-creative-asset"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-xs font-bold text-slate-950 transition"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download</span>
                  </a>
                </div>

                {generatedResult.type === 'video' && (
                  <div className={`mx-auto rounded-xl overflow-hidden border border-slate-800 bg-black shadow-2xl ${
                    generatedResult.aspectRatio === '9:16' ? 'max-w-[220px]' : 'w-full max-w-[480px]'
                  }`}>
                    <video
                      src={generatedResult.url}
                      controls
                      autoPlay
                      loop
                      className="w-full h-auto"
                    />
                  </div>
                )}

                {generatedResult.type === 'image' && (
                  <div className="mx-auto rounded-xl overflow-hidden border border-slate-800 max-w-[340px] shadow-2xl">
                    <img
                      src={generatedResult.url}
                      alt="Generated Resume Asset"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}

                {generatedResult.type === 'music' && (
                  <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4">
                    <div className="h-16 w-16 mx-auto rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center animate-pulse">
                      <Music className="h-8 w-8 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Lyria 3 Generated Track</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {generatedResult.duration || 30}s • {generatedResult.model}
                      </p>
                    </div>
                    <audio src={generatedResult.url} controls className="w-full mt-2" />
                  </div>
                )}

                <p className="text-xs text-slate-400 italic">"{generatedResult.prompt}"</p>
              </div>
            ) : (
              <div className="max-w-sm space-y-3">
                <div className="h-16 w-16 mx-auto rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                  <Film className="h-8 w-8 text-slate-500" />
                </div>
                <h4 className="text-sm font-bold text-white">Generative Creative Canvas</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Transform plain text resume bullets and candidate headshots into broadcast-quality video pitches (Veo 3.1), crisp portraits, or interview walk-up music tracks (Lyria 3).
                </p>
              </div>
            )}
          </div>

          {/* Saved History from Firestore */}
          {recentAssets.length > 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Layers className="h-3.5 w-3.5 text-amber-400" />
                <span>Your Stored Cloud Assets ({recentAssets.length})</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[180px] overflow-y-auto">
                {recentAssets.map((asset) => (
                  <div
                    key={asset.id}
                    onClick={() => {
                      setGeneratedResult({
                        type: asset.type,
                        url: asset.mediaUrl,
                        prompt: asset.prompt,
                        model: asset.model,
                        aspectRatio: asset.aspectRatio,
                        duration: asset.duration,
                      });
                    }}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-400/50 cursor-pointer transition text-left"
                  >
                    <div className="flex items-center justify-between text-[10px] text-amber-400 font-bold mb-1">
                      <span className="capitalize">{asset.type}</span>
                      <span className="text-slate-500">{new Date(asset.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 truncate">{asset.prompt}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
