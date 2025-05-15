import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  hoverEffect?: 'scale' | 'lift' | 'glow';
  variant?: 'default' | 'outline' | 'ghost';
  children: React.ReactNode;
}

const AnimatedButton = ({
  className,
  hoverEffect = 'scale',
  variant = 'default',
  children,
  ...props
}: AnimatedButtonProps) => {
  const effectClasses = {
    scale: 'hover:scale-105 active:scale-95',
    lift: 'hover:-translate-y-1',
    glow: 'hover:shadow-lg hover:shadow-primary/25',
  };

  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 ease-in-out',
        'px-4 py-2 disabled:pointer-events-none disabled:opacity-50',
        effectClasses[hoverEffect],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default AnimatedButton;
