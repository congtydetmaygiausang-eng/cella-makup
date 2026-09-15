import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Share, PlusSquare, X, CheckCircle2, Smartphone, Sparkles } from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 relative text-slate-900 space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center active:scale-90 transition-all"
        >
          <X className="w-4.5 h-4.5" />
        </button>

        {/* App Identity Banner */}
        <div className="flex items-center gap-3.5 pt-1">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0F0C20] via-[#1E1B4B] to-[#31105C] p-2.5 shadow-md flex items-center justify-center shrink-0 border border-purple-400/30">
            <img src="/icon.svg" alt="CELLA" className="w-full h-full object-contain" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>Cài đặt CELLA App</span>
              <Sparkles className="w-4 h-4 text-purple-600" />
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Thêm ra màn hình chính để dùng như ứng dụng gốc
            </p>
          </div>
        </div>

        {/* Status: Already installed */}
        {isInstalled && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Ứng dụng CELLA đã được cài đặt trên thiết bị của bạn!</span>
          </div>
        )}

        {/* Android / Chrome One-Click Install */}
        {!isInstalled && isInstallable && !installSuccess && (
          <div className="space-y-3 pt-2">
            <p className="text-xs text-slate-600 leading-relaxed">
              Nhấn nút bên dưới để tải và đưa biểu tượng <strong>CELLA Beauty & Academy</strong> trực tiếp ra màn hình chính, khởi động nhanh và mở toàn màn hình không có thanh địa chỉ duyệt web.
            </p>
            <button
              onClick={handleInstallClick}
              className="w-full py-3.5 rounded-2xl bg-[#0068FF] hover:bg-[#0055D4] text-white font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4.5 h-4.5 stroke-[2.5]" />
              <span>Cài đặt ra Màn hình chính ngay</span>
            </button>
          </div>
        )}

        {/* Success message */}
        {installSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Đã gửi lệnh cài đặt thành công! Kiểm tra màn hình chính của bạn.</span>
          </div>
        )}

        {/* iOS Safari Guided Steps */}
        {(!isInstallable || isIOS) && !isInstalled && !installSuccess && (
          <div className="space-y-3.5 pt-1">
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 space-y-2.5">
              <span className="font-bold flex items-center gap-1.5 text-indigo-900">
                <Smartphone className="w-4 h-4 text-indigo-600" />
                Hướng dẫn cài đặt trên iPhone / iPad (Safari):
              </span>
              <ol className="space-y-2 pl-4 list-decimal font-medium text-slate-700 text-[11.5px]">
                <li className="leading-snug">
                  Nhấn vào nút <strong className="text-indigo-600 inline-flex items-center gap-0.5"><Share className="w-3.5 h-3.5" /> Chia sẻ (Share)</strong> ở thanh dưới cùng trình duyệt Safari.
                </li>
                <li className="leading-snug">
                  Cuộn xuống và chọn <strong className="text-indigo-600 inline-flex items-center gap-0.5"><PlusSquare className="w-3.5 h-3.5" /> Thêm vào MH chính (Add to Home Screen)</strong>.
                </li>
                <li className="leading-snug">
                  Nhấn <strong className="text-indigo-600">Thêm (Add)</strong> ở góc trên bên phải để hoàn tất.
                </li>
              </ol>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-2">
              <span className="font-bold text-slate-800 block">
                Hướng dẫn cho Android / Chrome:
              </span>
              <p className="text-[11.5px] text-slate-600">
                Nhấn vào dấu <strong>3 chấm (⋮)</strong> ở góc trên trình duyệt Chrome &rarr; Chọn <strong>Cài đặt ứng dụng</strong> hoặc <strong>Thêm vào màn hình chính</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
          <span>Dung lượng: ~2.5 MB • Không tốn bộ nhớ</span>
          <button onClick={onClose} className="font-bold text-[#0068FF] hover:underline">
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
