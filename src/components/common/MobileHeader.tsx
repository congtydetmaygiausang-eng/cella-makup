import React from 'react';
import { ChevronLeft, Bell, Wifi, Menu, ChevronDown } from 'lucide-react';

interface MobileHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  onNotificationClick?: () => void;
  unreadNotifs?: boolean;
  showMenuButton?: boolean;
  onMenuClick?: () => void;
  isMenuOpen?: boolean;
  variant?: 'light' | 'dark' | 'transparent';
  className?: string;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
  onNotificationClick,
  unreadNotifs = false,
  showMenuButton = false,
  onMenuClick,
  isMenuOpen = false,
  variant = 'light',
  className = '',
}) => {
  const isDark = variant === 'dark';

  return (
    <div
      className={`w-full sticky top-0 z-40 transition-colors ${
        isDark
          ? 'bg-slate-900/90 text-white backdrop-blur-xl border-b border-white/10'
          : variant === 'transparent'
          ? 'bg-transparent text-slate-900'
          : 'bg-white/75 backdrop-blur-2xl border-b border-white/60 text-slate-900 shadow-[0_4px_20px_-4px_rgba(12,74,110,0.03)]'
      } ${className}`}
    >
      {/* iOS Status Bar */}
      <div className={`flex items-center justify-between px-6 pt-2 pb-0.5 text-xs font-semibold tracking-tight ${
        isDark ? 'text-white' : 'text-slate-700'
      }`}>
        <span className="font-bold">9:41</span>
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9zm0 2c3.87 0 7 3.13 7 7 0 1.57-.52 3.01-1.4 4.18L12 19.64l-5.6-3.46C5.52 15.01 5 13.57 5 12c0-3.87 3.13-7 7-7z" opacity="0.2"/>
            <path d="M12 6c-3.31 0-6 2.69-6 6 0 1.34.44 2.57 1.18 3.56L12 18.5l4.82-2.94C17.56 14.57 18 13.34 18 12c0-3.31-2.69-6-6-6z" />
          </svg>
          <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />
          <div className="flex items-center">
            <div className={`w-4.5 h-2.5 rounded-[3px] border ${isDark ? 'border-white' : 'border-slate-700'} p-[1px] flex items-center`}>
              <div className={`h-full w-2.5 rounded-[1px] ${isDark ? 'bg-white' : 'bg-slate-700'}`} />
            </div>
            <div className={`w-0.5 h-1 rounded-r-xs ${isDark ? 'bg-white' : 'bg-slate-700'} ml-[0.5px]`} />
          </div>
        </div>
      </div>

      {/* Main Navigation Bar with Circular Floating Buttons */}
      {(title || showBack || rightAction || onNotificationClick || onMenuClick || showMenuButton) && (
        <div className="flex items-center justify-between px-4 py-2.5 min-h-[54px]">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {showBack && (
              <button
                id="header-back-btn"
                onClick={onBack}
                aria-label="Quay lại"
                className="w-10 h-10 rounded-full bg-white/95 shadow-sm border border-white/90 text-slate-800 flex items-center justify-center transition-all duration-150 active:scale-90 hover:bg-white"
                title="Quay lại"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
            )}
            {title && (
              <div className="truncate">
                <h1 className="text-lg font-bold tracking-tight text-slate-900 truncate flex items-center gap-1.5">
                  <span>{title}</span>
                  {onMenuClick && (
                    <button
                      onClick={onMenuClick}
                      className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                      title="Mở menu thả xuống"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isMenuOpen ? 'rotate-180 text-[#00A3FF]' : ''
                        }`}
                      />
                    </button>
                  )}
                </h1>
                {subtitle && (
                  <p className={`text-xs font-medium truncate ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
                    {subtitle}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {rightAction}

            {onNotificationClick && (
              <button
                onClick={onNotificationClick}
                className="w-10 h-10 rounded-full bg-white/95 shadow-sm border border-white/90 text-slate-800 flex items-center justify-center transition-all duration-150 active:scale-90 hover:bg-white relative"
                title="Thông báo"
              >
                <Bell className="w-4.5 h-4.5 text-slate-700 stroke-[2.2]" />
                {unreadNotifs && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-[#00A3FF] rounded-full ring-2 ring-white animate-pulse" />
                )}
              </button>
            )}

            {(onMenuClick || showMenuButton) && (
              <button
                id="header-menu-dropdown-btn"
                onClick={onMenuClick}
                aria-label="Menu chức năng"
                className={`w-10 h-10 rounded-full shadow-sm border flex items-center justify-center transition-all duration-150 active:scale-90 ${
                  isMenuOpen
                    ? 'bg-[#00A3FF] text-white border-sky-400 shadow-md ring-2 ring-sky-200'
                    : 'bg-white/95 border-white/90 text-slate-700 hover:bg-white'
                }`}
                title="Mở Menu thả xuống"
              >
                <Menu className="w-4.5 h-4.5 stroke-[2.4]" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
