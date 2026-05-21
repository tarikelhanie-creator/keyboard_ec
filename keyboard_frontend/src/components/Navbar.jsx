import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Cpu, Search, LogOut, LayoutDashboard } from 'lucide-react';
import Button from './Button';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  
  const isActive = (path) => location.pathname === path;

  // Navigation items
  const navItems = [
    { name: 'HOME', path: '/' },
    { name: 'KEYBOARDS', path: '/products' },
    { name: 'CART', path: '/cart', icon: ShoppingCart },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cyber-bg/75 backdrop-blur-xl border-b border-cyber-cyan/15 hover:border-cyber-cyan/30 transition-colors duration-500 shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
      {/* Laser Top Line indicator */}
      <div className="h-[2px] w-full bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-magenta opacity-80" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative p-2 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-lg group-hover:border-cyber-cyan group-hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all duration-300">
                <Cpu className="h-6 w-6 text-cyber-cyan group-hover:rotate-90 transition-transform duration-500" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-cyber-magenta rounded-full animate-ping" />
              </div>
              <span className="font-display font-extrabold text-2xl tracking-widest text-slate-100 group-hover:text-white transition-colors">
                CYBER<span className="text-cyber-cyan">//</span>KEYS
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const ItemIcon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    relative font-display text-sm font-semibold tracking-widest px-3 py-2 transition-all duration-300 flex items-center gap-2
                    ${active ? 'text-cyber-cyan' : 'text-slate-400 hover:text-slate-100'}
                  `}
                >
                  {ItemIcon && <ItemIcon className={`h-4.5 w-4.5 ${active ? 'text-cyber-cyan' : 'text-slate-400'}`} />}
                  {item.name}
                  {item.path === '/cart' && itemCount > 0 && (
                    <span className="ml-1 min-w-[1.25rem] h-5 px-1.5 flex items-center justify-center rounded-full bg-cyber-magenta/20 border border-cyber-magenta/40 text-[10px] font-mono text-cyber-magenta">
                      {itemCount}
                    </span>
                  )}
                  
                  {/* Glowing Active Underline Dot */}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyber-cyan shadow-[0_0_8px_#00f0ff]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Quick search container */}
            <div className="relative">
              <input 
                type="text"
                placeholder="SEARCH DB..."
                className="bg-cyber-dark/80 border border-slate-800 focus:border-cyber-cyan/50 focus:outline-none rounded px-3 py-1.5 text-xs text-slate-300 font-display tracking-widest w-36 focus:w-48 transition-all duration-500 placeholder:text-slate-600 focus:shadow-[0_0_10px_rgba(0,240,255,0.1)]"
              />
              <Search className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
            </div>

            {/* Authentication telemetry status */}
            {user ? (
              <div className="flex items-center gap-4 pl-2 border-l border-slate-800/80">
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="p-2 border border-slate-800 hover:border-cyber-cyan/40 rounded text-slate-400 hover:text-cyber-cyan transition-all"
                    title="Admin Dashboard"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                  </Link>
                )}
                <span className="font-display text-xs font-bold text-cyber-magenta tracking-widest uppercase truncate max-w-[100px]" title={user.name}>
                  USR// {user.name}
                </span>
                
                <button
                  onClick={logout}
                  className="p-2 border border-slate-800 hover:border-cyber-magenta/40 rounded text-slate-400 hover:text-cyber-magenta transition-all cursor-pointer"
                  title="Disconnect Workstation Session"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="pl-2 border-l border-slate-800/80">
                <Link to="/login">
                  <Button variant="outline" className="py-1.5 px-4 text-xs font-display">
                    AUTHORIZE
                  </Button>
                </Link>
              </div>
            )}

            {/* Store Entry CTA */}
            <Link to="/products">
              <Button variant="primary" className="py-1.5 px-4 text-xs font-display">
                ENTER STORE
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all cursor-pointer"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div 
        className={`
          md:hidden fixed inset-x-0 top-20 bg-cyber-dark/98 border-b border-cyber-cyan/20 backdrop-blur-2xl transition-all duration-300 overflow-hidden
          ${isOpen ? 'max-h-[420px] opacity-100 border-t border-slate-900' : 'max-h-0 opacity-0 pointer-events-none'}
        `}
      >
        <div className="px-4 pt-4 pb-6 space-y-3 font-display">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const ItemIcon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-base font-bold tracking-widest transition-all
                  ${active 
                    ? 'bg-cyber-cyan/15 text-cyber-cyan border-l-4 border-cyber-cyan' 
                    : 'text-slate-300 hover:bg-slate-900/60 hover:text-white'}
                `}
              >
                {ItemIcon && <ItemIcon className="h-5 w-5" />}
                {item.name}
                {item.path === '/cart' && itemCount > 0 && (
                  <span className="ml-auto min-w-[1.25rem] h-5 px-1.5 flex items-center justify-center rounded-full bg-cyber-magenta/20 border border-cyber-magenta/40 text-[10px] font-mono text-cyber-magenta">
                    {itemCount}
                  </span>
                )}
              </Link>
            );
          })}
          
          <div className="pt-4 border-t border-slate-950 flex flex-col gap-3">
            <div className="relative mx-2">
              <input 
                type="text"
                placeholder="SEARCH DB..."
                className="w-full bg-cyber-bg border border-slate-800 focus:border-cyber-cyan/50 focus:outline-none rounded px-3 py-2 text-sm text-slate-300 tracking-widest placeholder:text-slate-600"
              />
              <Search className="absolute right-3 top-3 h-4 w-4 text-slate-500 pointer-events-none" />
            </div>

            {/* Mobile Auth options */}
            {user ? (
              <div className="flex flex-col gap-2 mx-2 pt-2 border-t border-slate-900/60">
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={() => setIsOpen(false)} className="w-full">
                    <Button variant="outline" className="w-full justify-center text-xs py-2.5">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      ADMIN DASHBOARD
                    </Button>
                  </Link>
                )}
                <div className="text-center font-display text-xs font-bold text-cyber-magenta tracking-widest uppercase py-1">
                  LOGGED IN AS: {user.name}
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="w-full justify-center text-xs py-2.5"
                >
                  DISCONNECT SESSION (LOGOUT)
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 mx-2">
                <Link to="/login" className="w-full text-center" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full justify-center text-xs py-2.5">
                    AUTHORIZE WORKSTATION (LOGIN)
                  </Button>
                </Link>
              </div>
            )}
            
            <Link to="/products" className="w-full text-center" onClick={() => setIsOpen(false)}>
              <Button variant="primary" className="w-full justify-center py-2.5">
                ENTER STORE
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
