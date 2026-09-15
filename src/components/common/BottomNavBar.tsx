import React from 'react';
import { Home, CheckSquare, Newspaper, Users, Calendar } from 'lucide-react';
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
    { id: 'feed' as NavTab, label: 'Bảng tin', icon: Newspaper },
    { id: 'customers' as NavTab, label: 'Khách hàng', icon: Users },
    { id: 'booking' as NavTab, label: 'Lịch hẹn', icon: Calendar },
  ];

  return (
    <div className="w-full px-4 pb-2 pt-1 pointer-events-none z-30 select-none">
      <nav className="pointer-events-auto max-w-md mx-auto bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] px-2.5 py-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 w-[72px] rounded-[20px] transition-all duration-300 relative group active:scale-95 ${
                isActive 
                  ? 'bg-white/20 text-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)] border border-white/10' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
              }`}
            >
              <div className="relative flex items-center justify-center mb-1">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'stroke-[2.5]' : 'stroke-[2] group-hover:scale-110'}`} />
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md border border-slate-900">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] tracking-wider transition-all ${
                  isActive ? 'font-bold' : 'font-medium'
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
