import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Terminal } from 'lucide-react';
import Button from './Button';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { 
      name: 'Discord', 
      href: '#', 
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5">
          <path d="M18.666 4.544c-1.344-.624-2.784-1.088-4.304-1.344-.192.336-.416.784-.576 1.152a13.33 13.33 0 0 0-3.568 0C10.04 3.984 9.816 3.536 9.64 3.2a15.42 15.42 0 0 0-4.304 1.344C2.592 8.528 1.832 13.632 2.184 18.648a15.46 15.46 0 0 0 4.672 2.368c.384-.528.72-.112.992-1.744a10.23 10.23 0 0 1-1.568-.752c.128-.096.256-.192.384-.288a10.97 10.97 0 0 0 10.656 0c.128.096.256.192.384.288-.496.288-1.024.544-1.568.752.272.64.608 1.216.992 1.744a15.44 15.44 0 0 0 4.672-2.368c.416-5.744-.672-10.8-2.672-14.104z"/>
          <circle cx="9" cy="12" r="1.5"/>
          <circle cx="15" cy="12" r="1.5"/>
        </svg>
      )
    },
    { 
      name: 'Twitter', 
      href: '#', 
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5">
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
        </svg>
      )
    },
    { 
      name: 'Instagram', 
      href: '#', 
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
        </svg>
      )
    },
    { 
      name: 'GitHub', 
      href: '#', 
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
          <path d="M9 18c-4.51 2-5-2-7-2"/>
        </svg>
      )
    },
  ];

  return (
    <footer className="relative bg-cyber-dark/95 border-t border-cyber-magenta/15 pt-16 pb-8 overflow-hidden z-10">
      {/* Visual background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,0,127,0.03),transparent_70%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Info and Brand */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-cyber-magenta" />
              <span className="font-display font-extrabold text-xl tracking-widest text-slate-100">
                CYBER<span className="text-cyber-magenta">//</span>KEYS
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Forging high-performance mechanical inputs for the cybernetically augmented. Low latency. Premium acoustics. Hot-swappable matrices.
            </p>
            {/* Social icons */}
            <div className="flex space-x-4 pt-2">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="p-2 bg-cyber-bg/80 border border-slate-800 rounded text-slate-400 hover:text-cyber-magenta hover:border-cyber-magenta hover:shadow-[0_0_8px_rgba(255,0,127,0.3)] transition-all duration-350"
                    aria-label={social.name}
                  >
                    <IconComponent />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Products */}
          <div>
            <h4 className="font-display text-sm font-bold tracking-widest text-slate-100 uppercase mb-4 flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5 text-cyber-cyan" />
              HARDWARE
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/products" className="text-slate-400 hover:text-cyber-cyan transition-colors">60% Compact Layouts</Link>
              </li>
              <li>
                <Link to="/products" className="text-slate-400 hover:text-cyber-cyan transition-colors">75% Ergonomic Formats</Link>
              </li>
              <li>
                <Link to="/products" className="text-slate-400 hover:text-cyber-cyan transition-colors">TKL & Full Size</Link>
              </li>
              <li>
                <Link to="/products" className="text-slate-400 hover:text-cyber-cyan transition-colors">Custom Machined Cases</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h4 className="font-display text-sm font-bold tracking-widest text-slate-100 uppercase mb-4 flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5 text-cyber-cyan" />
              FIRMWARE
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#" className="text-slate-400 hover:text-cyber-cyan transition-colors">VIA/QMK Configurator</a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-cyber-cyan transition-colors">USB-C Flashing Guide</a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-cyber-cyan transition-colors">CyberKeys SDK</a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-cyber-cyan transition-colors">Sound Profile Library</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-bold tracking-widest text-slate-100 uppercase mb-4 flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5 text-cyber-magenta" />
              JOIN INTEL NETWORK
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Get notified of hyper-limited drop releases and custom community runs.
            </p>
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="EMAIL_ADDR@DOMAIN.COM"
                  className="w-full bg-cyber-bg border border-slate-800 focus:border-cyber-magenta/50 focus:outline-none rounded px-3 py-2 text-xs text-slate-300 font-display tracking-widest placeholder:text-slate-700 focus:shadow-[0_0_10px_rgba(255,0,127,0.1)]"
                />
              </div>
              <Button variant="secondary" className="w-full justify-center text-xs py-2">
                ESTABLISH CONNECTION
              </Button>
            </div>
          </div>

        </div>

        {/* Bottom copyright & system stats */}
        <div className="border-t border-slate-900 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div>
            &copy; {currentYear} CYBERKEYS CORP. ALL SYSTEM RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4 font-display tracking-wider">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>CORE SECURE</span>
            </div>
            <span>V2.8.0-LATENCY: 0.12MS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
