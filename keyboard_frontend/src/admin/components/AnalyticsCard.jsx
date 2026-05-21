import React from 'react';

const accentMap = {
  cyan: 'text-cyber-cyan border-cyber-cyan/30 bg-cyber-cyan/10',
  magenta: 'text-cyber-magenta border-cyber-magenta/30 bg-cyber-magenta/10',
  purple: 'text-cyber-purple border-cyber-purple/30 bg-cyber-purple/10',
  yellow: 'text-cyber-yellow border-cyber-yellow/30 bg-cyber-yellow/10',
};

const AnalyticsCard = ({ label, value, subtext, icon: Icon, accent = 'cyan' }) => {
  return (
    <div className="glass-panel rounded-2xl p-5 hover:border-cyber-cyan/20 transition-all duration-300 group">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-display uppercase tracking-widest text-slate-500 mb-1">
            {label}
          </p>
          <p className="text-2xl sm:text-3xl font-display font-extrabold text-slate-100 tracking-wide">
            {value}
          </p>
          {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${accentMap[accent]}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsCard;
