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
    sm: 'w-8 h-8',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32',
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {withGlow && (
        <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-60 animate-pulse pointer-events-none" />
      )}
      <img
        src="/cella-logo.png"
        alt="CELLA MAKEUP ACADEMY"
        className={`relative z-10 object-contain drop-shadow-md rounded-2xl bg-white ${sizeMap[size]}`}
      />
    </div>
  );
};
