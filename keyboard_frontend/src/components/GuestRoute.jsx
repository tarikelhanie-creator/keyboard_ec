import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Cpu } from 'lucide-react';

const GuestRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-cyber-cyan/20 border-t-cyber-cyan rounded-full animate-spin" />
          <Cpu className="h-6 w-6 text-cyber-cyan absolute animate-pulse" />
        </div>
        <div className="font-display text-xs font-bold tracking-widest text-slate-500 uppercase animate-pulse">
          Establishing User Context...
        </div>
      </div>
    );
  }

  if (user) {
    // Already authenticated users redirected to home
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
