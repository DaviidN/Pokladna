import React from 'react';

export const Tile: React.FC<{
  qty: number;
  onClick: () => void;
  variant?: 'default' | 'bundle';
  children: React.ReactNode;
}> = ({ qty, onClick, variant = 'default', children }) => (
  <button
    onClick={onClick}
    className={`relative flex min-h-19.5 cursor-pointer flex-col gap-1.5 rounded-[10px]
                border p-3 text-left transition-colors active:scale-[0.985] ${
      variant === 'bundle'
        ? 'border-bundle bg-bundle-soft'
        : 'border-line bg-surface hover:border-line-strong'
    }`}
  >
    {qty > 0 && (
      <span className="absolute right-2 top-2.5 flex h-5 min-w-5 items-center justify-center
                       rounded-full bg-accent px-1 font-mono text-[11px] font-semibold text-accent-ink">
        {qty}
      </span>
    )}
    {children}
  </button>
);