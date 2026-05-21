import React from 'react';
import { Link } from 'react-router-dom';
import { AlertOctagon, CornerDownLeft, RefreshCw } from 'lucide-react';
import Button from '../components/Button';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 relative py-12">
      {/* Background warning pattern decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,127,0.02),transparent_70%)] pointer-events-none" />

      {/* Cyber Hex Warning Indicator */}
      <div className="relative p-6 bg-cyber-magenta/5 border border-cyber-magenta/30 rounded-2xl animate-bounce">
        <AlertOctagon className="h-16 w-16 text-cyber-magenta animate-pulse" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyber-magenta rounded-full animate-ping" />
      </div>

      {/* Text block */}
      <div className="space-y-4 max-w-lg relative z-10">
        <h1 className="font-display font-extrabold text-7xl md:text-8xl tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-cyber-magenta to-cyber-purple m-0 uppercase animate-flicker">
          404
        </h1>
        <h2 className="font-display font-bold text-xl md:text-2xl tracking-widest uppercase text-slate-200">
          SYSTEM ERROR: SECTION_OFFLINE
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed font-sans">
          The subnet page array you requested has been wiped, dereferenced, or is protected by high-level neural black ICE. Ensure credentials are valid.
        </p>
      </div>

      {/* Technical status panel code */}
      <div className="bg-cyber-dark/80 border border-slate-900 rounded-lg px-6 py-3 text-xs font-mono text-slate-500 max-w-sm">
        <div className="flex justify-between gap-6">
          <span>TARGET_URI:</span>
          <span className="text-cyber-magenta">{window.location.pathname}</span>
        </div>
        <div className="flex justify-between gap-6 mt-1.5">
          <span>PROTOCOL:</span>
          <span className="text-slate-400">CYBERKEYS//IP-V6</span>
        </div>
      </div>

      {/* Button actions */}
      <div className="flex flex-wrap gap-4 justify-center pt-2">
        <Link to="/">
          <Button variant="secondary" className="px-8 py-3">
            <CornerDownLeft className="h-4 w-4 mr-2" />
            RETURN TO SAFE WORKSTATION
          </Button>
        </Link>
        <button 
          onClick={() => window.location.reload()} 
          className="inline-flex items-center gap-2 px-6 py-2.5 border border-slate-800 hover:border-slate-700 rounded font-display text-xs font-bold tracking-widest text-slate-400 hover:text-slate-200 uppercase cursor-pointer transition-all"
        >
          <RefreshCw className="h-4 w-4" />
          RETRY SIGNAL CONNECTION
        </button>
      </div>
    </div>
  );
};

export default NotFound;
