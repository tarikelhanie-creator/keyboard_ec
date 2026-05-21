import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cyber-bg text-slate-100 relative overflow-hidden select-none selection:bg-cyber-cyan/35 selection:text-white">
      {/* Moving Tech Matrix Grid Background */}
      <div className="cyber-grid cyber-grid-animate absolute inset-0 z-0 pointer-events-none" />
      
      {/* Cyberpunk Scanlines */}
      <div className="scanlines" />
      <div className="scanline-bar animate-scanline" />

      {/* Cyber Background Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyber-cyan/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[60%] rounded-full bg-cyber-magenta/3 blur-[120px] pointer-events-none z-0" />
      
      {/* Top Fixed Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow pt-28 pb-12 relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      {/* Bottom Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
