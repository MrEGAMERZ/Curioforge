import React from 'react';

export function Badge({ children, tone = 'info', icon, className = '' }) {
  const tones = {
    info: 'bg-info/15 text-info border-info/30',
    success: 'bg-success/15 text-success border-success/30',
    warning: 'bg-warning/15 text-warning border-warning/30',
    danger: 'bg-danger/15 text-danger border-danger/30',
    purple: 'bg-accent-500/15 text-accent-400 border-accent-500/30',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${tones[tone] || tones.info} ${className}`}>
      {icon}
      {children}
    </span>
  );
}

export function Chip({ children, active = false, onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 border ${
        active
          ? 'bg-primary-600 text-white border-primary-500 shadow-glow'
          : 'bg-surface-raised text-ink-secondary hover:text-ink-primary hover:bg-surface border-line-subtle'
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function Spinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg className={`animate-spin text-primary-400 ${sizeClasses[size]}`} fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  );
}

export function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="p-6 bg-danger/10 border border-danger/30 rounded-xl text-center space-y-3">
      <div className="w-10 h-10 rounded-full bg-danger/20 text-danger flex items-center justify-center mx-auto text-xl">⚠️</div>
      <h3 className="font-semibold text-ink-primary">{title}</h3>
      {message && <p className="text-sm text-ink-muted max-w-md mx-auto">{message}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-4 py-2 bg-surface-raised hover:bg-surface border border-line-strong text-xs font-medium rounded-lg text-ink-primary"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="p-8 text-center border border-dashed border-line-subtle rounded-2xl bg-surface/40 space-y-3">
      {icon && <div className="text-3xl text-primary-400 flex justify-center">{icon}</div>}
      <h3 className="text-lg font-semibold text-ink-primary">{title}</h3>
      {description && <p className="text-sm text-ink-muted max-w-md mx-auto">{description}</p>}
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
