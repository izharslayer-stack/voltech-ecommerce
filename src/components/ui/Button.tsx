'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-[#1a1a1a] text-white hover:bg-[#315C45] active:bg-[#274d38] border border-transparent',
  secondary:
    'bg-[#315C45] text-white hover:bg-[#274d38] active:bg-[#1f3d2e] border border-transparent',
  outline:
    'bg-transparent text-[#171717] border border-[#171717] hover:bg-[#171717] hover:text-white',
  ghost:
    'bg-transparent text-[#6F6F68] hover:text-[#171717] hover:bg-[#F0EFE9] border border-transparent',
  danger:
    'bg-red-600 text-white hover:bg-red-700 border border-transparent',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-4 text-xs tracking-wide',
  md: 'h-11 px-6 text-sm tracking-wide',
  lg: 'h-13 px-8 text-base tracking-wide',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'right',
  fullWidth = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
        'rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315C45] focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {!loading && icon && iconPosition === 'left' && icon}
      {children}
      {!loading && icon && iconPosition === 'right' && icon}
    </button>
  );
}
