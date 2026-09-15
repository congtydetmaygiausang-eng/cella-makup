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
    primary: 'bg-[#5850EC] text-white hover:bg-[#4F46E5] active:bg-[#4338CA] shadow-[0_4px_14px_0_rgba(88,80,236,0.39)] border border-transparent',
    gradient: 'bg-gradient-to-r from-[#6366F1] via-[#5850EC] to-[#A855F7] text-white hover:opacity-95 shadow-[0_4px_18px_rgba(88,80,236,0.45)] border border-transparent',
    secondary: 'bg-[#EFF4FF] text-[#5850EC] hover:bg-[#E0EAFF] active:bg-[#D5E2FF] border border-[#5850EC]/15',
    outline: 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 active:bg-slate-100',
    glass: 'backdrop-blur-md bg-white/80 text-[#5850EC] border border-white/60 shadow-sm hover:bg-white',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900',
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
