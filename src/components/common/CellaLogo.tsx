import React from 'react';

interface CellaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withGlow?: boolean;
  className?: string;
}

export const CellaLogo: React.FC<CellaLogoProps> = ({
  size = 'md',
  withGlow = true,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {withGlow && (
        <div className="absolute inset-0 bg-gradient-to-tr from-[#5850EC] via-[#818CF8] to-[#C084FC] rounded-full blur-xl opacity-60 animate-pulse pointer-events-none" />
      )}
      <svg
        className={`relative z-10 ${sizeMap[size]}`}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="cellaGradientCenter" x1="50" y1="15" x2="50" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#818CF8" />
            <stop offset="50%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#4338CA" />
          </linearGradient>
          <linearGradient id="cellaGradientLeft" x1="15" y1="20" x2="60" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
          <linearGradient id="cellaGradientRight" x1="85" y1="20" x2="40" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C084FC" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>
        </defs>
        
        {/* Left petal */}
        <path
          d="M 50 82 C 30 76 18 56 18 36 C 18 25 28 17 38 23 C 45 27 49 42 50 82 Z"
          fill="url(#cellaGradientLeft)"
          opacity="0.92"
        />
        {/* Right petal */}
        <path
          d="M 50 82 C 70 76 82 56 82 36 C 82 25 72 17 62 23 C 55 27 51 42 50 82 Z"
          fill="url(#cellaGradientRight)"
          opacity="0.92"
        />
        {/* Center lotus flame petal */}
        <path
          d="M 50 14 C 54 28 62 44 60 64 C 58 74 53 82 50 85 C 47 82 42 74 40 64 C 38 44 46 28 50 14 Z"
          fill="url(#cellaGradientCenter)"
        />
        {/* Inner light glint */}
        <circle cx="50" cy="42" r="3.5" fill="#FFFFFF" opacity="0.9" filter="drop-shadow(0 0 4px #FFFFFF)" />
      </svg>
    </div>
  );
};
