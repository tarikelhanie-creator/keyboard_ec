import React from 'react';

const QuantitySelector = ({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  size = 'md',
}) => {
  const decrement = () => {
    if (disabled || value <= min) return;
    onChange(value - 1);
  };

  const increment = () => {
    if (disabled || value >= max) return;
    onChange(value + 1);
  };

  const padding = size === 'sm' ? 'px-1.5 py-0.5' : 'px-2 py-0.5';
  const valuePadding = size === 'sm' ? 'px-3' : 'px-4';

  return (
    <div
      className={`inline-flex items-center bg-cyber-bg border border-slate-800 rounded font-display ${disabled ? 'opacity-50' : ''}`}
      aria-label="Quantity selector"
    >
      <button
        type="button"
        onClick={decrement}
        disabled={disabled || value <= min}
        className={`${padding} text-slate-400 hover:text-cyber-cyan cursor-pointer font-bold disabled:cursor-not-allowed disabled:opacity-40`}
        aria-label="Decrease quantity"
      >
        -
      </button>
      <span className={`${valuePadding} text-xs font-mono text-slate-200 min-w-[2ch] text-center`}>
        {value}
      </span>
      <button
        type="button"
        onClick={increment}
        disabled={disabled || value >= max}
        className={`${padding} text-slate-400 hover:text-cyber-cyan cursor-pointer font-bold disabled:cursor-not-allowed disabled:opacity-40`}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
