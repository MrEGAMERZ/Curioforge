import React from 'react';

export function Card({
  children,
  className = '',
  interactive = false,
  padding = 'p-5',
  ...props
}) {
  return (
    <div
      className={`bg-surface rounded-xl border border-line-subtle shadow-card ${
        interactive ? 'hover:border-line-strong hover:-translate-y-0.5 transition-all duration-150 cursor-pointer' : ''
      } ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
