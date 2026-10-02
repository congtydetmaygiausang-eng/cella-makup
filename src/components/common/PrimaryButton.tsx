import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'glass' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const variantStyles = {
    primary: 'bg-gradient-to-r from-[#264736] to-[#1E3A2F] text-white hover:from-[#1E3A2F] hover:to-[#15271E] active:scale-[0.98] shadow-[0_4px_16px_rgba(26,51,38,0.25)] border border-[#264736]/20 font-bold',
    gradient: 'bg-gradient-to-r from-[#264736] via-[#2F5943] to-[#1A3326] text-white hover:opacity-95 shadow-[0_6px_20px_rgba(26,51,38,0.3)] border border-white/10 font-bold',
    secondary: 'bg-[#EAF2EC] text-[#264736] hover:bg-[#DEEAE1] active:bg-[#D5E3D8] border border-[#264736]/20 font-bold',
    outline: 'bg-white text-[#1A2820] border border-[#264736]/20 hover:bg-[#EAF2EC]/50 active:bg-[#EAF2EC]',
    glass: 'backdrop-blur-md bg-white/90 text-[#264736] border border-[#264736]/15 shadow-xs hover:bg-white font-bold',
    ghost: 'bg-transparent text-[#3D5A48] hover:bg-[#EAF2EC]/60 hover:text-[#1A2820]',
  };

  const sizeStyles = {
    sm: 'h-9 px-3.5 text-xs rounded-xl gap-1.5',
    md: 'h-11 px-5 text-sm font-semibold rounded-2xl gap-2',
    lg: 'h-13 px-6 text-base font-semibold rounded-2xl gap-2.5',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-[0.98] select-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${
        fullWidth ? 'w-full' : ''
      } ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
};
