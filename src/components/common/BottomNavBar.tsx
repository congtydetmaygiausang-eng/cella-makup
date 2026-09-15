import React from 'react';
import { Home, CheckSquare, Users, Calendar } from 'lucide-react';
import { NavTab } from '../../types';

interface BottomNavBarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  badgeCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onTabChange,
  badgeCount,
}) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'tasks' as NavTab, label: 'Nhiệm vụ', icon: CheckSquare, badge: badgeCount },
    { id: 'customers' as NavTab, label: 'Khách hàng', icon: Users },
    { id: 'booking' as NavTab, label: 'Lịch hẹn', icon: Calendar },
  ];

  return (
    <div className="w-full px-4 pb-2 pt-1 pointer-events-none z-30 select-none">
      <nav className="pointer-events-auto max-w-md mx-auto bg-white/92 backdrop-blur-2xl border border-white/95 rounded-[32px] shadow-[0_12px_36px_-6px_rgba(12,74,110,0.08),0_2px_8px_-1px_rgba(0,0,0,0.03)] px-3 py-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3.5 rounded-2xl transition-all duration-200 relative group active:scale-95 ${
                isActive ? 'text-[#00A3FF]' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <div className="relative flex items-center justify-center">
                {/* Active subtle pill highlight */}
                {isActive ? (
                  <div className="w-10 h-10 rounded-2xl bg-sky-50 flex items-center justify-center text-[#00A3FF] shadow-xs ring-1 ring-sky-100">
                    <Icon className="w-5 h-5 stroke-[2.5]" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center">
                    <Icon className="w-5 h-5 stroke-[2] group-hover:scale-105 transition-transform" />
                  </div>
                )}

                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#00A3FF] text-white text-[10px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center ring-2 ring-white shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] mt-0.5 tracking-tight transition-all ${
                  isActive ? 'font-bold text-[#00A3FF]' : 'font-medium text-slate-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
