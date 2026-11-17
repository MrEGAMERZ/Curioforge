import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  loading = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-curio-blue focus:ring-offset-2 select-none';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 h-8 gap-1.5',
    md: 'text-sm px-4 py-2 h-10 gap-2',
    lg: 'text-base px-5 py-2.5 h-12 gap-2.5',
  };

  const variantClasses = {
    primary: 'bg-curio-blue hover:bg-curio-blue-hover text-white shadow-sm active:scale-[0.98]',
    secondary: 'bg-white hover:bg-curio-bg-alt border border-curio-border text-curio-text shadow-sm active:scale-[0.98]',
    ghost: 'bg-transparent hover:bg-curio-bg-alt text-curio-text-secondary hover:text-curio-text',
    danger: 'bg-red-50 hover:bg-red-100 border border-red-200 text-curio-red active:scale-[0.98]',
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
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : iconLeft}
      <span>{children}</span>
      {!loading && iconRight}
    </button>
  );
}
