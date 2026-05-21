import React from 'react';

const GlassPanel = ({ children, className = '', strong = false, title, action }) => {
  return (
    <div className={`rounded-2xl p-6 ${strong ? 'glass-panel-strong' : 'glass-panel'} ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-4 mb-5">
          {title && (
            <h2 className="font-display font-bold text-sm uppercase tracking-widest text-slate-200">
              {title}
            </h2>
          )}
          {action}
        </div>
      )}
      {children}
    </div>
  );
};

export default GlassPanel;
