import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Cpu } from 'lucide-react';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-cyber-cyan/20 border-t-cyber-cyan rounded-full animate-spin" />
          <Cpu className="h-6 w-6 text-cyber-cyan absolute animate-pulse" />
        </div>
        <div className="font-display text-xs font-bold tracking-widest text-slate-500 uppercase animate-pulse">
          Synchronizing Secure Keychains...
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page and save original navigation route
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
