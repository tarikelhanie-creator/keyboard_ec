import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { Terminal, ShieldAlert, KeyRound, Mail, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Find target redirect path
  const fromPath = location.state?.from?.pathname || '/products';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(email, password);
      navigate(fromPath, { replace: true });
    } catch (err) {
      setError(err);
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 text-left relative">
      {/* Glitchy visual background accents */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-cyber-cyan/5 blur-2xl rounded-full pointer-events-none" />
      
      <Card title="AUTHORIZE CONTEXT" glowColor="cyan" tag="SECURE LOGIN">
        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-slate-400 text-xs leading-relaxed">
            Provide system credentials to establish connection and retrieve API token bindings.
          </p>

          {/* Error Alert Display */}
          {error && (
            <div className="flex gap-2.5 p-4 bg-cyber-magenta/10 border border-cyber-magenta/30 rounded-lg text-xs text-cyber-magenta leading-relaxed">
              <ShieldAlert className="h-5 w-5 flex-shrink-0" />
              <div>
                <span className="font-bold font-display uppercase tracking-widest block">Access Rejected:</span>
                {error}
              </div>
            </div>
          )}

          {/* Email field */}
          <div className="space-y-2">
            <label className="block font-display text-xs font-bold tracking-widest text-slate-400 uppercase">
              CREDENTIAL EMAIL:
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="NETRUNNER@DOMAIN.COM"
                className="w-full bg-cyber-bg/90 border border-slate-800 focus:border-cyber-cyan/50 focus:outline-none rounded px-3 py-2.5 pl-10 text-sm text-slate-200 font-display tracking-widest placeholder:text-slate-700 focus:shadow-[0_0_10px_rgba(0,240,255,0.1)] transition-all"
              />
              <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-600" />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <label className="block font-display text-xs font-bold tracking-widest text-slate-400 uppercase">
              DECK KEYCODE (PASSWORD):
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-cyber-bg/90 border border-slate-800 focus:border-cyber-cyan/50 focus:outline-none rounded px-3 py-2.5 pl-10 text-sm text-slate-200 font-display tracking-widest placeholder:text-slate-700 focus:shadow-[0_0_10px_rgba(0,240,255,0.1)] transition-all"
              />
              <KeyRound className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-600" />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <Button 
              variant="primary" 
              type="submit" 
              disabled={submitting}
              className="w-full justify-center py-3 font-display"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin mr-2" />
                  AUTHENTICATING CLIENT...
                </>
              ) : (
                <>
                  ESTABLISH TERMINAL PORT
                </>
              )}
            </Button>
          </div>

          {/* Switch link */}
          <div className="text-center border-t border-slate-900/60 pt-4 text-xs text-slate-500">
            WORKSTATION UNREGISTERED?{' '}
            <Link to="/register" className="text-cyber-cyan hover:underline tracking-wider font-semibold">
              CREATE IDENTITY DECK
            </Link>
          </div>

        </form>
      </Card>
    </div>
  );
};

export default Login;
