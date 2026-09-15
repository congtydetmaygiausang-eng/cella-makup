import React from 'react';

interface AuraBadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'neutral' | 'cyan';
  size?: 'xs' | 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const AuraBadge: React.FC<AuraBadgeProps> = ({
  children,
  variant = 'primary',
  size = 'sm',
  icon,
  className = '',
}) => {
  // Soft pastel pill badge styling directly inspired by the reference screens (e.g. "+56.4% 30 days", "Running")
  const variantStyles = {
    primary: 'bg-sky-50 text-[#00A3FF] border border-sky-200/80 font-semibold',
    cyan: 'bg-cyan-50 text-cyan-600 border border-cyan-200/80 font-semibold',
    success: 'bg-emerald-50 text-emerald-600 border border-emerald-200/80 font-semibold',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200/80 font-semibold',
    danger: 'bg-rose-50 text-rose-600 border border-rose-200/80 font-semibold',
    info: 'bg-blue-50 text-blue-600 border border-blue-200/80 font-semibold',
    purple: 'bg-purple-50 text-purple-600 border border-purple-200/80 font-semibold',
    neutral: 'bg-slate-100/80 text-slate-600 border border-slate-200/80 font-semibold',
  };

  const sizeStyles = {
    xs: 'text-[11px] px-2.5 py-1',
    sm: 'text-xs px-3 py-1',
    md: 'text-sm px-3.5 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full whitespace-nowrap leading-tight tracking-tight ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
