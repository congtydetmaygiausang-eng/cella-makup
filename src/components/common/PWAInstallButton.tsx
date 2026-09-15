import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';
import { Download, Smartphone } from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'compact' | 'pill' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'compact',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  // If already installed, hide prompt button
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      const installed = await install();
      if (!installed) {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  if (variant === 'compact') {
    return (
      <>
        <button
          onClick={handleClick}
          id="btn-pwa-install-compact"
          aria-label="Cài đặt ứng dụng về màn hình chính"
          title="Cài đặt ứng dụng về máy ra màn hình chính"
          className={`w-10 h-10 rounded-full bg-gradient-to-tr from-[#1E1B4B] to-[#4F46E5] text-white shadow-md border border-indigo-300/40 flex items-center justify-center transition-all duration-150 active:scale-90 hover:brightness-110 relative group ${className}`}
        >
          <Download className="w-4.5 h-4.5 stroke-[2.4] animate-bounce" />
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#1E1B4B]" />
        </button>

        <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  if (variant === 'banner') {
    return (
      <>
        <div
          onClick={handleClick}
          className={`p-3.5 rounded-2xl bg-gradient-to-r from-[#0F0C20] via-[#1E1B4B] to-[#31105C] border border-indigo-500/30 text-white shadow-md flex items-center justify-between cursor-pointer hover:border-indigo-400/50 transition-all active:scale-[0.98] ${className}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#4F46E5] to-[#EC4899] flex items-center justify-center shrink-0 shadow-xs">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Cài đặt ứng dụng ra Màn hình chính</span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-indigo-500/40 border border-indigo-400/50 text-indigo-200">
                  PWA
                </span>
              </h4>
              <p className="text-[11px] text-indigo-200/80 mt-0.5">
                Dùng mượt mà không cần mở trình duyệt, hỗ trợ ngoại tuyến
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0068FF] hover:bg-[#0055D4] text-white text-xs font-bold shadow-xs">
            <Download className="w-3.5 h-3.5" />
            <span>Cài đặt</span>
          </div>
        </div>

        <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  // Pill variant
  return (
    <>
      <button
        onClick={handleClick}
        className={`px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#1E1B4B] to-[#4F46E5] text-white text-xs font-bold shadow-sm flex items-center gap-1.5 active:scale-95 transition-all ${className}`}
      >
        <Download className="w-3.5 h-3.5" />
        <span>Cài đặt App</span>
      </button>

      <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
