import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Download, 
  Check, 
  Copy, 
  Share2, 
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Terminal,
  FileCode2,
  ArrowRight,
  Facebook,
  Building2,
  User
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { MARKETING_AD_HOOKS, WHATSAPP_VIRAL_TEMPLATE } from '../data/sampleData';

interface AndroidLaunchCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidLaunchCenterModal: React.FC<AndroidLaunchCenterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, install, isAndroid, isIOS } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'install' | 'twa-playstore' | 'marketing'>('install');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl border border-amber-500/40 bg-slate-950 p-5 sm:p-8 shadow-2xl my-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl bg-slate-800 p-2 text-slate-400 hover:text-white transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20">
            <Smartphone className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Android Launch Center
              </h2>
              <span className="rounded-full bg-emerald-950 border border-emerald-800/60 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                100% Android Ready
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Zero-cost PWA deployment, Play Store TWA packaging, and instant install
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-5 flex items-center gap-2 border-b border-slate-800 pb-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('install')}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              activeTab === 'install'
                ? 'bg-amber-400 text-slate-950 font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📱 Direct Android Install (PWA)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('twa-playstore')}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              activeTab === 'twa-playstore'
                ? 'bg-amber-400 text-slate-950 font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Google Play Store / TWA APK
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('marketing')}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              activeTab === 'marketing'
                ? 'bg-amber-400 text-slate-950 font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🚀 Day-1 Launch Kit
          </button>
        </div>

        {/* TAB 1: Direct Android Install */}
        {activeTab === 'install' && (
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/30 to-slate-900 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
                  Instant Android App Installation
                </span>
                <h3 className="text-lg font-bold text-white">
                  Add JobReady AI to Your Phone's Home Screen
                </h3>
                <p className="text-xs text-slate-300 max-w-md">
                  Runs natively in fullscreen standalone mode without browser URL bars, with instant loading and offline caching.
                </p>
              </div>

              {isInstalled ? (
                <div className="rounded-xl bg-emerald-950/80 border border-emerald-700/60 px-4 py-2.5 text-xs font-bold text-emerald-300 flex items-center gap-2 shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Already Installed!</span>
                </div>
              ) : isInstallable ? (
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black px-5 py-3 text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition active:scale-95 shrink-0 flex items-center gap-2"
                >
                  <Download className="h-4 w-4 stroke-[3]" />
                  <span>Install on Android Now</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    alert('To install on Android: Open in Google Chrome, tap the 3 dots (⋮) in the top right, and choose "Add to Home screen" or "Install App".');
                  }}
                  className="rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2.5 text-xs shadow-md shadow-amber-500/20 transition active:scale-95 shrink-0 flex items-center gap-1.5"
                >
                  <span>Install Instructions</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-950" />
                </button>
              )}
            </div>

            {/* Android Manifest Compliance Checklist */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Verified Android PWA Standards Checklist:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Web App Manifest configured (`name: JobReady AI`)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Android Standalone Display Mode (`display: standalone`)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>192x192 & 512x512 High-Res PNG Icons</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Android Maskable Icon with 15% Safe-Zone Margin</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Android Status Bar Theme Color (`#0C1017`)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Service Worker Pre-caching with Workbox</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Microphone Permission for Voice Interview Practice</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Mobile Tap Targets &gt;= 48px with Safe Area Insets</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TWA & Google Play Store Packaging */}
        {activeTab === 'twa-playstore' && (
          <div className="mt-5 space-y-4 text-xs">
            <div className="rounded-xl bg-amber-950/20 border border-amber-500/30 p-4">
              <h4 className="font-bold text-white text-sm mb-1">
                Turn This PWA into a Google Play Store App (.aab / .apk)
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Google provides <strong>Trusted Web Activities (TWA)</strong> and the official <strong>Bubblewrap CLI</strong> to package your PWA into an Android App Bundle (.aab) with zero native Java/Kotlin code required.
              </p>
            </div>

            {/* Official Publisher & Developer Registration Card */}
            <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-950 p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <Building2 className="h-4 w-4" />
                  <span className="text-sm text-white">Google Play Console Publishing Metadata</span>
                </div>
                <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                  Ready to Publish
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-2.5">
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">Publishing Organization</span>
                  <span className="text-xs font-extrabold text-white">696969 Marketing</span>
                </div>
                <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-2.5">
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">Lead Developer / Author</span>
                  <span className="text-xs font-extrabold text-amber-300">Abhinandan Pandey</span>
                </div>
                <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-2.5">
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">Android Application ID</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">com.marketing696969.jobready</span>
                </div>
                <div className="rounded-xl bg-[#0C1017]/80 border border-[#2B3340] p-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-[#949EB0] block uppercase tracking-wider">Official Facebook Page</span>
                    <span className="text-xs font-semibold text-[#F7D07A]">696969 Marketing</span>
                  </div>
                  <a
                    href="https://www.facebook.com/share/1CE62Y7JGU/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-lg bg-[#131924] hover:bg-[#1D2533] border border-[#2B3340] hover:border-[#FFB319]/40 px-2.5 py-1 text-[11px] font-semibold text-[#F7D07A] transition"
                  >
                    <Facebook className="h-3 w-3 text-[#FFB319]" />
                    <span>View Page</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400">Step 1: Digital Asset Links (Installed & Ready)</span>
                  <button
                    type="button"
                    onClick={() => copyText(JSON.stringify([{
                      relation: ["delegate_permission/common.handle_all_urls"],
                      target: {
                        namespace: "android_app",
                        package_name: "com.marketing696969.jobready",
                        sha256_cert_fingerprints: ["14:6D:E9:7D:0F:52:AB:FC:A0:E6:9E:C1:2F:A2:3E:9F:8B:1A:4C:5D:6E:7F:8A:9B:0C:1D:2E:3F:4A:5B:6C:7D"]
                      }
                    }], null, 2), 'assetlinks')}
                    className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300"
                  >
                    {copiedKey === 'assetlinks' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>Copy assetlinks.json</span>
                  </button>
                </div>
                <p className="text-slate-400">
                  Pre-configured at <code>/.well-known/assetlinks.json</code> with package <code>com.marketing696969.jobready</code> to prove app ownership to Android OS.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400">Step 2: Generate APK via Bubblewrap / PWA2APK</span>
                  <button
                    type="button"
                    onClick={() => copyText('npx @bubblewrap/cli init --manifest=https://jobready.ai/manifest.webmanifest --packageId=com.marketing696969.jobready\nnpx @bubblewrap/cli build', 'bubblewrap')}
                    className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300"
                  >
                    {copiedKey === 'bubblewrap' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>Copy Command</span>
                  </button>
                </div>
                <pre className="rounded-lg bg-slate-950 p-2 text-[11px] text-emerald-400 font-mono overflow-x-auto">
npx @bubblewrap/cli init --manifest=https://jobready.ai/manifest.webmanifest --packageId=com.marketing696969.jobready
npx @bubblewrap/cli build
                </pre>
                <p className="text-slate-400">
                  Generates a signed release Android App Bundle (<code>app-release-bundle.aab</code>) for <strong>696969 Marketing</strong> ready for upload to Google Play Console.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
                <span className="font-bold text-amber-400">Step 3: ₹0 Validation Advice (From Blueprint PDF)</span>
                <p className="text-slate-300 leading-relaxed">
                  As recommended on page 3 of the blueprint: Google Play requires a $25 developer registration fee. Launch on WhatsApp and Instagram as an installable Android web app first to validate paying customers, then upload to Google Play Store once cashflow is established!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Growth & Viral Launch Kit */}
        {activeTab === 'marketing' && (
          <div className="mt-5 space-y-4 text-xs">
            {/* WhatsApp Viral Template */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Share2 className="h-4 w-4" /> Ready WhatsApp Message (PDF Page 11 & 19)
                </span>
                <button
                  type="button"
                  onClick={() => copyText(WHATSAPP_VIRAL_TEMPLATE, 'whatsapp')}
                  className="flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1 text-white font-bold transition"
                >
                  {copiedKey === 'whatsapp' ? (
                    <>
                      <Check className="h-3 w-3" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy WhatsApp Text</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-xl bg-slate-950 p-3 font-mono text-[11px] text-slate-300 whitespace-pre-line border border-slate-800/80">
                {WHATSAPP_VIRAL_TEMPLATE}
              </div>
            </div>

            {/* 5 Tested Ad Hooks */}
            <div className="space-y-2.5">
              <span className="font-bold text-slate-300 uppercase tracking-wider block text-[11px]">
                5 Tested High-Conversion Ads (PDF Page 20)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {MARKETING_AD_HOOKS.slice(0, 4).map((ad, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-amber-400">{ad.channel}</span>
                      <h5 className="font-bold text-white mt-1">"{ad.headline}"</h5>
                      <p className="text-[11px] text-slate-400 mt-1">{ad.subtext}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyText(`${ad.headline}\n${ad.subtext}\n${ad.cta}`, `ad-${idx}`)}
                      className="mt-2.5 flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300"
                    >
                      {copiedKey === `ad-${idx}` ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      <span>Copy Hook</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Facebook Page Campaign Box */}
            <div className="luxury-surface-gold rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#F7D07A] font-bold">
                  <Facebook className="h-4 w-4 text-[#FFB319]" />
                  <span>Official Facebook Page Campaign (696969 Marketing)</span>
                </div>
                <a
                  href="https://www.facebook.com/share/1CE62Y7JGU/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="luxury-gold-btn flex items-center gap-1 rounded-lg px-3 py-1 font-bold text-[11px] transition"
                >
                  <span>Open Page</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <p className="text-slate-300 text-[11px]">
                Connect candidates directly to your Facebook Page for community webinars, live CV teardowns, and daily ATS tips.
              </p>
              <div className="flex items-center justify-between rounded-xl bg-slate-950/80 border border-slate-800 p-2.5">
                <code className="text-[11px] text-amber-300 truncate">https://www.facebook.com/share/1CE62Y7JGU/</code>
                <button
                  type="button"
                  onClick={() => copyText('https://www.facebook.com/share/1CE62Y7JGU/', 'fb-link')}
                  className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 shrink-0 ml-2"
                >
                  {copiedKey === 'fb-link' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>Copy Link</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
