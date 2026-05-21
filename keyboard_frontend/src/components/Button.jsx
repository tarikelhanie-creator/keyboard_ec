import React from 'react';

/**
 * Premium Cyberpunk Button Component
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {'primary' | 'secondary' | 'yellow' | 'outline'} props.variant
 * @param {boolean} props.glow
 * @param {string} props.className
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} props.rest
 */
const Button = ({
  children,
  variant = 'primary',
  glow = true,
  className = '',
  ...rest
}) => {
  // Styles based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary': // Cyan
        return 'bg-cyber-cyan/10 hover:bg-cyber-cyan/25 text-cyber-cyan border-cyber-cyan shadow-[0_0_8px_rgba(0,240,255,0.2)] hover:shadow-[0_0_15px_rgba(0,240,255,0.4)]';
      case 'secondary': // Magenta
        return 'bg-cyber-magenta/10 hover:bg-cyber-magenta/25 text-cyber-magenta border-cyber-magenta shadow-[0_0_8px_rgba(255,0,127,0.2)] hover:shadow-[0_0_15px_rgba(255,0,127,0.4)]';
      case 'yellow': // Yellow warning
        return 'bg-cyber-yellow/10 hover:bg-cyber-yellow/25 text-cyber-yellow border-cyber-yellow shadow-[0_0_8px_rgba(254,254,0,0.2)] hover:shadow-[0_0_15px_rgba(254,254,0,0.4)]';
      case 'outline': // Simple outline
        return 'bg-transparent hover:bg-white/5 text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white';
      default:
        return 'bg-cyber-cyan/10 hover:bg-cyber-cyan/25 text-cyber-cyan border-cyber-cyan';
    }
  };

  return (
    <button
      className={`
        relative px-6 py-2.5 font-display text-sm font-bold tracking-widest uppercase transition-all duration-300
        border clip-cyber-corner-sm cursor-pointer active:scale-95 select-none
        ${getVariantStyles()}
        ${className}
      `}
      {...rest}
    >
      {/* Visual Glitch Corner Effect */}
      <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-current opacity-70 clip-cyber-corner-sm" />
      <span className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-current opacity-70 clip-cyber-corner-sm" />
      
      {/* Content wrapper */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};

export default Button;
