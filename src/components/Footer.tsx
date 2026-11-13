import React from 'react';
import { Facebook, ExternalLink, ShieldCheck, Award, Building2, User, Sparkles, Heart } from 'lucide-react';
import { Logo } from './Logo';

interface FooterProps {
  onOpenAndroidCenter: () => void;
  onOpenPricing: () => void;
  onOpenMarketing: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAndroidCenter,
  onOpenPricing,
  onOpenMarketing,
}) => {
  return (
    <footer className="mt-16 border-t border-[#2B3340] bg-[#0C1017] text-[#949EB0]">
      {/* Top Banner: Publisher Accreditation */}
      <div className="border-b border-[#2B3340]/80 bg-[#111620] px-4 py-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFB319]/10 border border-[#FFB319]/30 text-[#FFB319] shrink-0">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F7D07A]">
                <span>Official Publisher &amp; Developer</span>
                <span className="text-[#465063]">·</span>
                <span className="text-[#C6CCD8]">Verified Entity</span>
              </div>
              <p className="text-sm text-[#C6CCD8] font-medium mt-0.5">
                Published by <span className="text-[#F4F1EA] font-bold">696969 Marketing</span> · Founded &amp; Developed by{' '}
                <span className="text-[#F7D07A] font-bold">Abhinandan Pandey</span>
              </p>
            </div>
          </div>

          {/* Facebook Official Page Link */}
          <a
            href="https://www.facebook.com/share/1CE62Y7JGU/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-xl bg-[#131924] hover:bg-[#1D2533] border border-[#2B3340] hover:border-[#FFB319]/50 px-4 py-2 text-xs font-semibold text-[#E5E8EE] hover:text-[#F7D07A] transition active:scale-95 whitespace-nowrap shrink-0"
            title="Visit official Facebook Page of 696969 Marketing"
          >
            <Facebook className="h-4 w-4 text-[#FFB319] group-hover:scale-105 transition-transform" />
            <span>Follow 696969 Marketing on Facebook</span>
            <ExternalLink className="h-3.5 w-3.5 text-[#949EB0]" />
          </a>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Publishing Info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <Logo size={36} />
              <div>
                <span className="font-bold text-base tracking-tight text-[#F4F1EA]">
                  JobReady <span className="luxury-gold-text">AI</span>
                </span>
                <span className="block text-[11px] text-[#949EB0]">
                  Published by 696969 Marketing
                </span>
              </div>
            </div>
            <p className="text-xs text-[#949EB0] leading-relaxed max-w-md">
              India&apos;s premier AI career optimization engine. From instant 60-second resume audits and ATS keyword scoring to recruiter-approved bullet rewriting and voice interview coaching.
            </p>

            {/* Publisher Card */}
            <div className="rounded-xl border border-[#2B3340] bg-[#131924]/70 p-3.5 space-y-1.5 max-w-md">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#F4F1EA]">
                <User className="h-3.5 w-3.5 text-[#FFB319]" />
                <span>Executive Leadership</span>
              </div>
              <p className="text-xs text-[#C6CCD8] leading-relaxed">
                <strong className="text-[#F4F1EA]">Publisher:</strong> 696969 Marketing<br />
                <strong className="text-[#F4F1EA]">Creator &amp; Lead Engineer:</strong> Abhinandan Pandey<br />
                <strong className="text-[#F4F1EA]">Platform Status:</strong> Android Ready PWA &amp; TWA Package
              </p>
              <div className="pt-1">
                <a
                  href="https://www.facebook.com/share/1CE62Y7JGU/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F7D07A] hover:text-[#FCE6A6] transition"
                >
                  <Facebook className="h-3.5 w-3.5 text-[#FFB319]" />
                  <span>https://www.facebook.com/share/1CE62Y7JGU/</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Core Platform Modules */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F7D07A]">
              AI Tools &amp; Engines
            </h4>
            <ul className="space-y-2 text-xs text-[#C6CCD8]">
              <li className="hover:text-[#F7D07A] transition flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#FFB319]" />
                <span>AI Resume Scoring (60s)</span>
              </li>
              <li className="hover:text-[#F7D07A] transition flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#FFB319]" />
                <span>ATS Keyword Matrix 2025</span>
              </li>
              <li className="hover:text-[#F7D07A] transition flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#FFB319]" />
                <span>Impact Bullet Rewriter</span>
              </li>
              <li className="hover:text-[#F7D07A] transition flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#FFB319]" />
                <span>Smart Cover Letter Studio</span>
              </li>
              <li className="hover:text-[#F7D07A] transition flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#FFB319]" />
                <span>Voice Interview Coach</span>
              </li>
              <li className="hover:text-[#F7D07A] transition flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#FFB319]" />
                <span>LinkedIn Profile Booster</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Publishing & Quick Launch */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F7D07A]">
              Publishing &amp; Access
            </h4>
            <div className="space-y-2">
              <button
                type="button"
                onClick={onOpenAndroidCenter}
                className="w-full text-left rounded-xl bg-[#131924] border border-[#2B3340] p-2.5 text-xs text-[#C6CCD8] hover:border-[#FFB319]/50 hover:text-[#F4F1EA] transition"
              >
                <div className="font-semibold text-[#F7D07A]">Android Launch Center</div>
                <div className="text-[10px] text-[#949EB0]">Install PWA or Build TWA APK</div>
              </button>

              <button
                type="button"
                onClick={onOpenMarketing}
                className="w-full text-left rounded-xl bg-[#131924] border border-[#2B3340] p-2.5 text-xs text-[#C6CCD8] hover:border-[#FFB319]/50 hover:text-[#F4F1EA] transition"
              >
                <div className="font-semibold text-[#F7D07A]">Marketing &amp; Viral Kit</div>
                <div className="text-[10px] text-[#949EB0]">WhatsApp, Instagram &amp; Ad Hooks</div>
              </button>

              <button
                type="button"
                onClick={onOpenPricing}
                className="w-full text-left rounded-xl bg-[#131924] border border-[#2B3340] p-2.5 text-xs text-[#C6CCD8] hover:border-[#FFB319]/50 hover:text-[#F4F1EA] transition"
              >
                <div className="font-semibold text-[#F7D07A]">Indian Pricing Plans</div>
                <div className="text-[10px] text-[#949EB0]">₹0 Free Tier to ₹99 Quick Pass</div>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Trust, Security & Copyright bar */}
        <div className="mt-10 pt-6 border-t border-[#2B3340]/70 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#949EB0]">
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" />
              256-Bit SSL Encrypted
            </span>
            <span className="flex items-center gap-1.5 text-[#F7D07A] font-semibold">
              <Award className="h-3.5 w-3.5 text-[#FFB319]" />
              Published by 696969 Marketing
            </span>
            <span className="text-[#949EB0]">
              Developed by Abhinandan Pandey
            </span>
          </div>

          <div className="text-center md:text-right text-[11px] text-[#949EB0]">
            <p>© {new Date().getFullYear()} <strong className="text-[#E5E8EE]">696969 Marketing</strong>. All rights reserved.</p>
            <p className="mt-0.5 text-[#949EB0]">
              Connect with us on{' '}
              <a
                href="https://www.facebook.com/share/1CE62Y7JGU/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F7D07A] hover:underline"
              >
                Facebook
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
