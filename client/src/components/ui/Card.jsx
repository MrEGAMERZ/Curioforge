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
      className={`bg-white rounded-2xl border border-curio-border shadow-card ${
        interactive ? 'hover:border-curio-blue hover:-translate-y-0.5 transition-all duration-150 cursor-pointer' : ''
      } ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
