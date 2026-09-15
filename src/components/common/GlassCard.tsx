import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'frosted' | 'dark' | 'glow' | 'accent';
  onClick?: () => void;
  id?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  variant = 'light',
  onClick,
  id,
}) => {
  // Styles strictly matched with the reference images:
  // - High corner radius (rounded-[26px])
  // - Translucent frosted pure white background (bg-white/90 backdrop-blur-xl)
  // - Clean white perimeter bezel (border border-white/90)
  // - Soft diffused ambient drop shadow
  const variantStyles = {
    light:
      'bg-white/90 backdrop-blur-2xl border border-white/95 shadow-[0_10px_30px_-5px_rgba(12,74,110,0.05),0_2px_8px_-2px_rgba(0,0,0,0.02)]',
    frosted:
      'bg-white/75 backdrop-blur-2xl border border-white/90 shadow-[0_8px_28px_-6px_rgba(14,165,233,0.06)]',
    dark:
      'bg-slate-900/85 backdrop-blur-2xl border border-white/10 text-white shadow-xl',
    glow:
      'bg-gradient-to-br from-white/95 via-white/90 to-[#E1F2FB]/70 backdrop-blur-2xl border border-sky-200/50 shadow-[0_12px_32px_-6px_rgba(14,165,233,0.12)]',
    accent:
      'bg-gradient-to-br from-[#00A3FF] to-[#0080FF] text-white shadow-[0_14px_30px_-6px_rgba(0,163,255,0.35)] border border-white/30',
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`rounded-[26px] transition-all duration-200 ${variantStyles[variant]} ${
        onClick
          ? 'cursor-pointer active:scale-[0.985] hover:bg-white/95 hover:shadow-[0_16px_36px_-6px_rgba(14,165,233,0.09)]'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
