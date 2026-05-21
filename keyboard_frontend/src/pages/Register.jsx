import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { ShieldAlert, User, Mail, KeyRound, Loader2, ShieldCheck } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Client-side confirm password check
    if (password !== confirmPassword) {
      setError("Password confirmation does not match the secret keycode.");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Submit Registration
      await register(name, email, password);
      setSuccess(true);

      // 2. Automate Login after account initialization
      try {
        await login(email, password);
        setTimeout(() => {
          navigate('/products', { replace: true });
        }, 1500);
      } catch (loginErr) {
        // Fallback if auto-login fails (user can manually log in)
        console.warn("Auto-login failed. Redirecting to manual authorization port.", loginErr);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      // Parse Laravel controller validation errors
      let errorMessage = "Registration credentials rejected.";
      if (typeof err === 'object') {
        // e.g. Laravel fields error object
        const keys = Object.keys(err);
        if (keys.length > 0) {
          errorMessage = err[keys[0]][0] || errorMessage;
        }
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      setError(errorMessage);
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 text-left relative">
      {/* Glitchy visual background accents */}
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-cyber-magenta/5 blur-2xl rounded-full pointer-events-none" />

      <Card title="INITIALIZE IDENTITY" glowColor="magenta" tag="IDENTITY MATRIX">
        <form onSubmit={handleSubmit} className="space-y-5">
          <p className="text-slate-400 text-xs leading-relaxed">
            Register your unique signature variables inside the centralized database terminal.
          </p>

          {/* Success Banner */}
          {success && (
            <div className="flex gap-2.5 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-500 leading-relaxed animate-pulse">
              <ShieldCheck className="h-5 w-5 flex-shrink-0" />
              <div>
                <span className="font-bold font-display uppercase tracking-widest block">PORT COMMITTED:</span>
                Identity registered. Deploying neural keybindings...
              </div>
            </div>
          )}

          {/* Error Alert Display */}
          {error && !success && (
            <div className="flex gap-2.5 p-4 bg-cyber-magenta/10 border border-cyber-magenta/30 rounded-lg text-xs text-cyber-magenta leading-relaxed">
              <ShieldAlert className="h-5 w-5 flex-shrink-0" />
              <div>
                <span className="font-bold font-display uppercase tracking-widest block">PORT REJECTED:</span>
                {error}
              </div>
            </div>
          )}

          {/* Name field */}
          <div className="space-y-1.5">
            <label className="block font-display text-xs font-bold tracking-widest text-slate-400 uppercase">
              USER NAME / ALIAS:
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ALEX_NEWMARK"
                className="w-full bg-cyber-bg/90 border border-slate-800 focus:border-cyber-magenta/50 focus:outline-none rounded px-3 py-2.5 pl-10 text-sm text-slate-200 font-display tracking-widest placeholder:text-slate-700 focus:shadow-[0_0_10px_rgba(255,0,127,0.1)] transition-all"
              />
              <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-600" />
            </div>
          </div>

          {/* Email field */}
          <div className="space-y-1.5">
            <label className="block font-display text-xs font-bold tracking-widest text-slate-400 uppercase">
              EMAIL ROUTING ADDRESS:
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="NETRUNNER@DOMAIN.COM"
                className="w-full bg-cyber-bg/90 border border-slate-800 focus:border-cyber-magenta/50 focus:outline-none rounded px-3 py-2.5 pl-10 text-sm text-slate-200 font-display tracking-widest placeholder:text-slate-700 focus:shadow-[0_0_10px_rgba(255,0,127,0.1)] transition-all"
              />
              <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-600" />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="block font-display text-xs font-bold tracking-widest text-slate-400 uppercase">
              CREATE KEYCODE SECRET:
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="MINIMUM 6 SYMBOLS"
                className="w-full bg-cyber-bg/90 border border-slate-800 focus:border-cyber-magenta/50 focus:outline-none rounded px-3 py-2.5 pl-10 text-sm text-slate-200 font-display tracking-widest placeholder:text-slate-700 focus:shadow-[0_0_10px_rgba(255,0,127,0.1)] transition-all"
              />
              <KeyRound className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-600" />
            </div>
          </div>

          {/* Confirm Password field */}
          <div className="space-y-1.5">
            <label className="block font-display text-xs font-bold tracking-widest text-slate-400 uppercase">
              RE-ENTER KEYCODE SECRET:
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="VERIFY KEYCODE"
                className="w-full bg-cyber-bg/90 border border-slate-800 focus:border-cyber-magenta/50 focus:outline-none rounded px-3 py-2.5 pl-10 text-sm text-slate-200 font-display tracking-widest placeholder:text-slate-700 focus:shadow-[0_0_10px_rgba(255,0,127,0.1)] transition-all"
              />
              <KeyRound className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-600" />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <Button 
              variant="secondary" 
              type="submit" 
              disabled={submitting}
              className="w-full justify-center py-3 font-display"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin mr-2" />
                  CREATING COGNITIVE BINDINGS...
                </>
              ) : (
                <>
                  COMMIT PORT IDENTITY
                </>
              )}
            </Button>
          </div>

          {/* Switch link */}
          <div className="text-center border-t border-slate-900/60 pt-4 text-xs text-slate-500">
            WORKSTATION ALREADY DEPLOYED?{' '}
            <Link to="/login" className="text-cyber-magenta hover:underline tracking-wider font-semibold">
              AUTHORIZE CONTEXT
            </Link>
          </div>

        </form>
      </Card>
    </div>
  );
};

export default Register;
