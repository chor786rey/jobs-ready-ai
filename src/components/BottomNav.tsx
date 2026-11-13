import React from 'react';
import { Home, BarChart3, FileEdit, Briefcase, MessageSquareText, Video } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // ignore
      }
    }
  };

  const navItems = [
    { id: 'home' as ActiveTab, label: 'Home', icon: Home },
    { id: 'dashboard' as ActiveTab, label: 'Score', icon: BarChart3 },
    { id: 'career-coach' as ActiveTab, label: 'Coach', icon: MessageSquareText },
    { id: 'multimedia-studio' as ActiveTab, label: 'Studio', icon: Video },
    { id: 'rewriter' as ActiveTab, label: 'Rewriter', icon: FileEdit },
    { id: 'jobs' as ActiveTab, label: 'Jobs', icon: Briefcase },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#2B3340]/90 bg-[#0C1017]/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom,0px)]">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-1.5 sm:py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                triggerHaptic();
                onTabChange(item.id);
              }}
              className={`relative flex min-h-[48px] min-w-[56px] flex-col items-center justify-center rounded-xl px-2 py-1 transition-all ${
                isActive
                  ? 'text-[#FFB319] font-bold'
                  : 'text-[#949EB0] hover:text-[#F4F1EA] font-medium'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1.5 h-0.5 w-7 rounded-full bg-gradient-to-r from-[#F7D07A] via-[#FFB319] to-[#F59E0B] shadow-sm shadow-[#FFB319]/40" />
              )}
              <Icon className={`h-5 w-5 transition-transform ${isActive ? 'scale-105' : ''}`} />
              <span className="mt-0.5 text-[11px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
