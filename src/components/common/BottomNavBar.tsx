import React from 'react';
import { Home, CheckSquare, Users, Calendar, MoreHorizontal, User } from 'lucide-react';
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
    { id: 'home' as NavTab, label: 'Trang chủ', icon: Home },
    { id: 'tasks' as NavTab, label: 'Công việc', icon: CheckSquare, badge: badgeCount },
    { id: 'customers' as NavTab, label: 'Khách hàng', icon: Users },
    { id: 'booking' as NavTab, label: 'Booking', icon: Calendar },
    { id: 'more' as NavTab, label: 'Thêm', icon: MoreHorizontal, isDot: true },
  ];

  return (
    <div className="w-full pointer-events-none z-30 select-none bg-white">
      <nav className="pointer-events-auto max-w-md mx-auto bg-white border-t border-slate-200/80 px-2.5 py-1.5 flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          // Some screens highlight 'more' (like profile/feed/revenue)
          const isMoreGroup = tab.id === 'more' && ['more', 'profile', 'feed', 'revenue', 'payroll', 'academy', 'lookbook'].includes(currentTab);
          const isActive = currentTab === tab.id || isMoreGroup;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-1 w-[72px] transition-all duration-200 relative group active:scale-95 ${
                isActive 
                  ? 'text-[#544CDE]' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="relative flex items-center justify-center mb-1">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'stroke-[2.5]' : 'stroke-[2] group-hover:scale-110'}`} />
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs border border-white">
                    {tab.badge}
                  </span>
                )}
                {tab.isDot && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-500 shadow-xs border border-white"></span>
                )}
              </div>
              <span
                className={`text-[10px] tracking-wide transition-all ${
                  isActive ? 'font-bold' : 'font-medium'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
      {/* Safe area spacing for iOS */}
      <div className="h-[env(safe-area-inset-bottom,0px)] bg-white"></div>
    </div>
  );
};
