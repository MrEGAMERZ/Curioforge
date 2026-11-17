import React from 'react';

export function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'danger'
  size = 'md',        // 'sm' | 'md' | 'lg'
  iconLeft,
  iconRight,
  loading = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-bg-base select-none';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 h-8 gap-1.5',
    md: 'text-sm px-4 py-2 h-10 gap-2',
    lg: 'text-base px-5 py-2.5 h-12 gap-2.5',
  };

  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-500 text-white shadow-glow hover:shadow-glow active:scale-[0.98]',
    secondary: 'bg-surface-raised hover:bg-surface border border-line-strong text-ink-primary active:scale-[0.98]',
    ghost: 'bg-transparent hover:bg-surface text-ink-secondary hover:text-ink-primary',
    danger: 'bg-danger/10 hover:bg-danger/20 border border-danger/30 text-danger active:scale-[0.98]',
  };

  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : iconLeft}
      <span>{children}</span>
      {!loading && iconRight}
    </button>
  );
}
