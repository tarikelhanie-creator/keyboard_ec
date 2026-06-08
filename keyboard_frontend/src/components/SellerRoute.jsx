import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Cpu } from 'lucide-react';

const SellerRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cyber-bg space-y-6">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-cyber-cyan/20 border-t-cyber-cyan rounded-full animate-spin" />
          <Cpu className="h-6 w-6 text-cyber-cyan absolute animate-pulse" />
        </div>
        <p className="font-display text-xs font-bold tracking-widest text-slate-500 uppercase">
          Verifying seller credentials...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user.role !== 'seller') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default SellerRoute;
