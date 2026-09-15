import React, { useState } from 'react';
import { CellaLogo } from '../components/common/CellaLogo';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { Sparkles, ArrowRight, ShieldCheck, Star } from 'lucide-react';

interface SplashScreenProps {
  onEnterApp: () => void;
  onOpenLookbook?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onEnterApp,
  onOpenLookbook,
}) => {
  const [promoMode, setPromoMode] = useState(false);

  return (
    <div className="relative min-h-[700px] h-full w-full bg-[#0B0C16] text-white flex flex-col justify-between p-6 select-none overflow-hidden">
      {/* Background silk purple smoke & aura lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#5850EC]/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-28 w-80 h-80 bg-[#A855F7]/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 left-10 w-96 h-96 bg-[#312E81]/40 rounded-full blur-3xl" />

        {/* Sinusoidal subtle light wave lines (matching screenshot 1) */}
        <svg
          className="absolute bottom-36 left-0 w-full h-32 opacity-40"
          viewBox="0 0 400 120"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M-20 60 C 80 20, 160 100, 260 40 C 340 -10, 390 70, 420 50"
            stroke="url(#waveGrad1)"
            strokeWidth="1.5"
          />
          <path
            d="M-20 80 C 100 40, 180 110, 280 60 C 350 20, 390 80, 420 60"
            stroke="url(#waveGrad2)"
            strokeWidth="1"
          />
          <defs>
            <linearGradient id="waveGrad1" x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#818CF8" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#C084FC" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="waveGrad2" x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366F1" stopOpacity="0.1" />
              <stop offset="60%" stopColor="#818CF8" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Top status bar placeholder */}
      <div className="relative z-10 flex justify-between items-center text-xs text-slate-300 font-semibold px-2">
        <span>9:41</span>
        <button
          onClick={() => setPromoMode(!promoMode)}
          className="px-2.5 py-1 rounded-full text-[11px] bg-white/10 hover:bg-white/20 text-indigo-200 border border-white/10 transition-colors"
        >
          {promoMode ? 'Chế độ Logo' : 'Chế độ Ưu đãi'}
        </button>
      </div>

      {/* Center content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 my-auto">
        {!promoMode ? (
          <>
            {/* Logo and Brand */}
            <div className="mb-6 transform hover:scale-105 transition-transform duration-300">
              <CellaLogo size="xl" withGlow />
            </div>

            <h1 className="text-3xl font-extrabold tracking-[0.25em] text-white uppercase mb-3">
              C E L L A
            </h1>

            <p className="text-slate-300 text-sm font-medium tracking-wide">
              Quản trị thông minh
            </p>
            <p className="text-slate-300 text-sm font-medium tracking-wide mt-1">
              Vận hành đơn giản.
            </p>

            <div className="mt-8 flex flex-col gap-3 w-full max-w-xs">
              <PrimaryButton
                variant="gradient"
                size="lg"
                fullWidth
                onClick={onEnterApp}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Vào ứng dụng CELLA
              </PrimaryButton>

              {onOpenLookbook && (
                <button
                  onClick={onOpenLookbook}
                  className="text-xs text-indigo-300 hover:text-white py-2 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Xem Lookbook Mẫu Makeup Hot Trend</span>
                </button>
              )}
            </div>
          </>
        ) : (
          /* Promo Mode matching screenshot 2 */
          <div className="w-full max-w-sm flex flex-col items-center animate-fade-in">
            <div className="mb-3">
              <CellaLogo size="md" withGlow />
              <p className="text-[12px] font-bold tracking-widest text-white mt-1">CELLA</p>
            </div>

            <div className="relative w-44 h-44 rounded-full overflow-hidden border-2 border-purple-400/40 shadow-[0_0_30px_rgba(168,85,247,0.4)] my-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80"
                alt="CELLA Beauty Model"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C16]/60 via-transparent to-transparent" />
            </div>

            <h2 className="text-xl font-bold text-white mt-2 leading-tight">
              Đăng ký để nhận ngay ưu đãi
            </h2>
            <p className="text-slate-300 text-xs mt-1.5 max-w-xs">
              Trải nghiệm makeup tự nhiên rạng rỡ & soi da 1:1 miễn phí
            </p>

            <div className="mt-6 w-full space-y-2.5">
              <PrimaryButton
                variant="gradient"
                size="lg"
                fullWidth
                onClick={onEnterApp}
              >
                Đăng ký ngay
              </PrimaryButton>

              <button
                onClick={() => setPromoMode(false)}
                className="text-xs text-slate-400 hover:text-white py-1.5 transition-colors"
              >
                Trở lại màn hình mở đầu
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Slogan (matching screenshot 1) */}
      <div className="relative z-10 text-left text-xs text-slate-400 space-y-1 pl-2">
        <p className="text-slate-300 font-medium">Better People</p>
        <p className="text-slate-300 font-medium">Better Beauty</p>
        <p className="text-indigo-300 font-semibold">A Brighter Tomorrow</p>
      </div>

      {/* Home indicator line */}
      <div className="relative z-10 w-32 h-1 bg-white/40 rounded-full mx-auto mt-4" />
    </div>
  );
};
