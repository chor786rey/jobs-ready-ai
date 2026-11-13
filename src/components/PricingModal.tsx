import React, { useState } from 'react';
import { X, Check, Sparkles, ShieldCheck, IndianRupee, ArrowRight, CreditCard, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PRICING_PLANS } from '../data/sampleData';
import { PricingPlan } from '../types';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: string;
  onSelectPlan: (plan: PricingPlan) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  currentTier,
  onSelectPlan,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = (plan: PricingPlan) => {
    if (plan.priceINR === 0) {
      onSelectPlan(plan);
      onClose();
      return;
    }

    setSelectedPlan(plan);
    setIsProcessing(true);

    // Simulate instant UPI / Razorpay payment
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }

      setTimeout(() => {
        onSelectPlan(plan);
        setPaymentSuccess(false);
        setSelectedPlan(null);
        onClose();
      }, 1800);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C1017]/85 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl border border-[#2B3340] bg-[#0C1017] p-5 sm:p-8 shadow-2xl my-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl bg-[#131924] border border-[#2B3340] p-2 text-[#949EB0] hover:text-[#F4F1EA] hover:border-[#FFB319]/40 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Title */}
        <div className="text-center max-w-lg mx-auto">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F7D07A] mb-2">
            <Sparkles className="h-3.5 w-3.5 text-[#FFB319]" />
            <span>Honest Freemium Pricing</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F4F1EA] tracking-tight">
            Invest in Your Dream Job
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-[#949EB0]">
            Start for ₹0 free. Upgrade when you are ready to apply and practice interviews with confidence.
          </p>
        </div>

        {/* Payment Success State */}
        {paymentSuccess && selectedPlan && (
          <div className="my-8 rounded-2xl border border-emerald-500/40 bg-[#131924] p-6 text-center animate-in zoom-in-95">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-[#0C1017] mb-3 shadow-lg shadow-emerald-500/20">
              <Check className="h-8 w-8 stroke-[3]" />
            </div>
            <h3 className="text-xl font-bold text-[#F4F1EA]">
              Payment Successful!
            </h3>
            <p className="text-xs text-emerald-300 mt-1">
              You are now unlocked on the <strong>{selectedPlan.name} Plan</strong>.
            </p>
          </div>
        )}

        {/* Plans Grid */}
        {!paymentSuccess && (
          <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-4">
            {PRICING_PLANS.slice(0, 3).map((plan) => {
              const isPopular = plan.popular;
              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl p-5 flex flex-col justify-between transition-all ${
                    isPopular
                      ? 'luxury-surface-gold shadow-xl ring-1 ring-[#FFB319]/30'
                      : 'luxury-surface hover:border-[#FFB319]/35'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-bold text-[#F4F1EA]">
                        {plan.name}
                      </h3>
                      {isPopular && (
                        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#FFB319]">
                          {plan.badge || 'Most Popular'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#949EB0] mt-1 min-h-[32px]">
                      {plan.description}
                    </p>

                    <div className="my-4 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-[#F4F1EA] tabular-nums">
                        ₹{plan.priceINR}
                      </span>
                      {plan.billingPeriod && (
                        <span className="text-xs text-[#949EB0]">{plan.billingPeriod}</span>
                      )}
                    </div>

                    <div className="space-y-2 border-t border-[#2B3340] pt-3">
                      {plan.features.map((f, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-[#C6CCD8]">
                          <Check className="h-3.5 w-3.5 text-[#FFB319] shrink-0 mt-0.5" />
                          <span className="leading-snug">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleCheckout(plan)}
                    className={`mt-6 w-full flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition active:scale-95 whitespace-nowrap ${
                      isPopular
                        ? 'luxury-gold-btn'
                        : 'bg-[#1D2533] hover:bg-[#2B3340] border border-[#2B3340] text-[#F4F1EA]'
                    }`}
                  >
                    {isProcessing && selectedPlan?.id === plan.id ? (
                      <span>Processing UPI...</span>
                    ) : plan.priceINR === 0 ? (
                      <span>{currentTier === plan.id ? 'Current Plan (Free)' : 'Select Free Tier'}</span>
                    ) : (
                      <>
                        <span>Get {plan.name} (₹{plan.priceINR})</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Monthly & Elite Tier Strip */}
        {!paymentSuccess && (
          <div className="mt-4 luxury-surface rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-[#F4F1EA]">Looking for Unlimited Monthly Career Assistance?</span>
              <p className="text-[#949EB0] mt-0.5">
                Job Search Pro (₹499/mo) and Elite Career (₹999) include 24/7 unlimited AI coaching, live interview mocks, and recruiter network placement.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleCheckout(PRICING_PLANS[3])}
              className="luxury-gold-btn rounded-xl px-4 py-2 text-xs font-bold shrink-0 transition whitespace-nowrap"
            >
              Choose Job Search Pro (₹499/mo)
            </button>
          </div>
        )}

        {/* Trust Badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-[#949EB0] border-t border-[#2B3340]/80 pt-4">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Instant Access via UPI / Card</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="h-4 w-4 text-[#FFB319]" />
            <span>Published by 696969 Marketing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-[#FFB319]" />
            <span>Recruiter&rsquo;s Eye™ by Abhinandan Pandey</span>
          </div>
        </div>
      </div>
    </div>
  );
};
