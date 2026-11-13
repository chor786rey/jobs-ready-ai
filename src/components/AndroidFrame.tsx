import React from 'react';
import { Wifi, Battery, Signal, Smartphone, Laptop } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  isActive: boolean;
  onToggle: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  isActive,
  onToggle,
}) => {
  if (!isActive) {
    return <div className="min-h-screen w-full">{children}</div>;
  }

  // Get current time formatted (e.g. 9:41)
  const timeStr = '9:41';

  return (
    <div className="min-h-screen w-full bg-slate-950 py-4 sm:py-8 px-2 flex flex-col items-center justify-start">
      {/* Device Frame Header Switcher */}
      <div className="mb-4 flex items-center gap-2 rounded-full bg-slate-900 border border-slate-800 px-3.5 py-1.5 text-xs text-slate-300 shadow-md">
        <span className="flex items-center gap-1.5 font-bold text-amber-400">
          <Smartphone className="h-4 w-4" />
          <span>Android Pixel 8 Simulator</span>
        </span>
        <span className="text-slate-600">|</span>
        <button
          type="button"
          onClick={onToggle}
          className="text-xs text-slate-400 hover:text-white underline decoration-slate-600"
        >
          Exit to Fullscreen
        </button>
      </div>

      {/* Android Phone Chassis */}
      <div className="relative w-full max-w-[412px] h-[860px] rounded-[48px] bg-slate-900 p-3 shadow-2xl ring-1 ring-slate-700/80 ring-offset-4 ring-offset-slate-950 border-[6px] border-slate-800 flex flex-col overflow-hidden">
        {/* Android Speaker & Camera Punch Hole */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-2 z-50 pointer-events-none">
          <div className="h-3 w-3 rounded-full bg-black ring-2 ring-slate-800/80 shadow-inner" />
        </div>

        {/* Android Status Bar */}
        <div className="relative z-50 flex h-7 w-full items-center justify-between px-6 pt-1 text-[11px] font-bold text-slate-300 select-none pointer-events-none bg-slate-950">
          <span>{timeStr}</span>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Signal className="h-3 w-3" />
            <Wifi className="h-3 w-3" />
            <Battery className="h-3.5 w-3.5 text-emerald-400" />
          </div>
        </div>

        {/* Inner Phone Screen Content */}
        <div className="relative flex-1 w-full overflow-y-auto overflow-x-hidden bg-slate-950 text-slate-100 rounded-b-[36px]">
          {children}
        </div>

        {/* Android Navigation Gesture Bar */}
        <div className="h-4 w-full bg-slate-950 flex items-center justify-center pointer-events-none z-50">
          <div className="h-1 w-28 rounded-full bg-slate-600" />
        </div>
      </div>
    </div>
  );
};
