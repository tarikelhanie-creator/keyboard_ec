import React from 'react';

/**
 * Premium Cyberpunk Card Component
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} props.title
 * @param {'cyan' | 'magenta' | 'purple' | 'none'} props.glowColor
 * @param {string} props.tag
 * @param {string} props.className
 */
const Card = ({
  children,
  title,
  glowColor = 'cyan',
  tag,
  className = '',
  ...rest
}) => {
  const getGlowStyles = () => {
    switch (glowColor) {
      case 'cyan':
        return 'border-cyber-cyan/30 hover:border-cyber-cyan shadow-[0_0_15px_rgba(0,240,255,0.05)] hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]';
      case 'magenta':
        return 'border-cyber-magenta/30 hover:border-cyber-magenta shadow-[0_0_15px_rgba(255,0,127,0.05)] hover:shadow-[0_0_20px_rgba(255,0,127,0.15)]';
      case 'purple':
        return 'border-cyber-purple/30 hover:border-cyber-purple shadow-[0_0_15px_rgba(157,78,221,0.05)] hover:shadow-[0_0_20px_rgba(157,78,221,0.15)]';
      default:
        return 'border-slate-800 hover:border-slate-700';
    }
  };

  const getTagBg = () => {
    switch (glowColor) {
      case 'cyan': return 'bg-cyber-cyan text-cyber-bg';
      case 'magenta': return 'bg-cyber-magenta text-white';
      case 'purple': return 'bg-cyber-purple text-white';
      default: return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <div
      className={`
        relative bg-cyber-dark/85 backdrop-blur-md border clip-cyber-corner p-6
        transition-all duration-500 ease-out hover:-translate-y-1.5
        ${getGlowStyles()}
        ${className}
      `}
      {...rest}
    >
      {/* Decorative Grid Mesh Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.02),transparent_60%)] pointer-events-none" />
      
      {/* Laser Corner Accent Lines */}
      <div className={`absolute top-0 left-0 w-8 h-[1px] ${glowColor === 'cyan' ? 'bg-cyber-cyan' : glowColor === 'magenta' ? 'bg-cyber-magenta' : 'bg-cyber-purple'} opacity-60`} />
      <div className={`absolute top-0 left-0 w-[1px] h-8 ${glowColor === 'cyan' ? 'bg-cyber-cyan' : glowColor === 'magenta' ? 'bg-cyber-magenta' : 'bg-cyber-purple'} opacity-60`} />

      {/* Cyber Tag */}
      {tag && (
        <span className={`absolute top-0 right-0 font-display text-[9px] font-extrabold tracking-widest px-3.5 py-0.5 uppercase clip-cyber-tag ${getTagBg()}`}>
          {tag}
        </span>
      )}

      {/* Card Header */}
      {title && (
        <div className="border-b border-white/5 pb-3 mb-4">
          <h3 className="font-display text-lg font-bold uppercase tracking-wider text-slate-100 flex items-center justify-between">
            {title}
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse opacity-80" />
          </h3>
        </div>
      )}

      {/* Card Content */}
      <div className="relative z-10 text-slate-300 text-sm leading-relaxed">
        {children}
      </div>

      {/* Bottom Technical Grid Indicator */}
      <div className="absolute bottom-2 right-4 flex items-center gap-1.5 opacity-20 hover:opacity-50 transition-opacity">
        <span className="w-1 h-1 bg-white" />
        <span className="w-4 h-[1px] bg-white" />
        <span className="w-1 h-1 bg-white" />
      </div>
    </div>
  );
};

export default Card;
