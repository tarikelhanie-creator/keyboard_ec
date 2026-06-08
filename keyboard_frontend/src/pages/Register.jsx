import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { ShieldAlert, User, Mail, KeyRound, Loader2, ShieldCheck, Store, ShoppingBag } from 'lucide-react';

const Register = () => {
  const [step, setStep] = useState('role'); // 'role' or 'form'
  const [selectedRole, setSelectedRole] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setStep('form');
  };

  const handleBackToRole = () => {
    setStep('role');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError("Password confirmation does not match the secret keycode.");
      return;
    }

    setSubmitting(true);

    try {
      await register(name, email, password, selectedRole);
      setSuccess(true);

      try {
        await login(email, password);
        setTimeout(() => {
          navigate('/products', { replace: true });
        }, 1500);
      } catch (loginErr) {
        console.warn("Auto-login failed. Redirecting to manual authorization port.", loginErr);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      let errorMessage = "Registration credentials rejected.";
      if (typeof err === 'object') {
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

  if (step === 'role') {
    return (
      <div className="max-w-4xl mx-auto py-12 text-left relative">
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-cyber-magenta/5 blur-2xl rounded-full pointer-events-none" />

        <Card title="SELECT YOUR ROLE" glowColor="magenta" tag="SYSTEM INIT">
          <div className="space-y-6">
            <p className="text-slate-400 text-xs leading-relaxed">
              Choose your role in the marketplace. This determines your access level and features.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer Role Card */}
              <div
                onClick={() => handleRoleSelection('customer')}
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedRole === 'customer'
                    ? 'border-cyber-cyan bg-cyber-cyan/10'
                    : 'border-slate-800 bg-slate-900/30 hover:border-cyber-cyan/50'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <ShoppingBag className="h-6 w-6 text-cyber-cyan" />
                  <h3 className="font-display text-lg font-bold uppercase tracking-wider text-slate-100">
                    Customer
                  </h3>
                </div>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                  Browse and purchase premium keyboards from verified sellers.
                </p>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-cyber-cyan mt-1">✓</span>
                    <span>Browse all products</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyber-cyan mt-1">✓</span>
                    <span>Advanced search & filters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyber-cyan mt-1">✓</span>
                    <span>Add to cart & checkout</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyber-cyan mt-1">✓</span>
                    <span>Track your orders</span>
                  </li>
                </ul>
              </div>

              {/* Seller Role Card */}
              <div
                onClick={() => handleRoleSelection('seller')}
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedRole === 'seller'
                    ? 'border-cyber-magenta bg-cyber-magenta/10'
                    : 'border-slate-800 bg-slate-900/30 hover:border-cyber-magenta/50'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Store className="h-6 w-6 text-cyber-magenta" />
                  <h3 className="font-display text-lg font-bold uppercase tracking-wider text-slate-100">
                    Seller
                  </h3>
                </div>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                  Sell your keyboards to a global audience of enthusiasts.
                </p>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-cyber-magenta mt-1">✓</span>
                    <span>Create & manage products</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyber-magenta mt-1">✓</span>
                    <span>Upload product images</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyber-magenta mt-1">✓</span>
                    <span>Track inventory</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyber-magenta mt-1">✓</span>
                    <span>View sales analytics</span>
                  </li>
                </ul>
              </div>
            </div>

            {selectedRole && (
              <div className="pt-4">
                <Button 
                  variant="secondary" 
                  onClick={() => setStep('form')}
                  className="w-full justify-center py-3 font-display"
                >
                  Continue as {selectedRole === 'customer' ? 'Customer' : 'Seller'}
                </Button>
              </div>
            )}

            <div className="text-center border-t border-slate-900/60 pt-4 text-xs text-slate-500">
              ALREADY HAVE AN ACCOUNT?{' '}
              <Link to="/login" className="text-cyber-magenta hover:underline tracking-wider font-semibold">
                AUTHORIZE CONTEXT
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-12 text-left relative">
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-cyber-magenta/5 blur-2xl rounded-full pointer-events-none" />

      <Card title={`INITIALIZE ${selectedRole?.toUpperCase()} IDENTITY`} glowColor="magenta" tag="IDENTITY MATRIX">
        <form onSubmit={handleSubmit} className="space-y-5">
          <p className="text-slate-400 text-xs leading-relaxed">
            Register your unique signature variables inside the centralized database terminal.
          </p>

          {success && (
            <div className="flex gap-2.5 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-500 leading-relaxed animate-pulse">
              <ShieldCheck className="h-5 w-5 flex-shrink-0" />
              <div>
                <span className="font-bold font-display uppercase tracking-widest block">PORT COMMITTED:</span>
                Identity registered. Deploying neural keybindings...
              </div>
            </div>
          )}

          {error && !success && (
            <div className="flex gap-2.5 p-4 bg-cyber-magenta/10 border border-cyber-magenta/30 rounded-lg text-xs text-cyber-magenta leading-relaxed">
              <ShieldAlert className="h-5 w-5 flex-shrink-0" />
              <div>
                <span className="font-bold font-display uppercase tracking-widest block">PORT REJECTED:</span>
                {error}
              </div>
            </div>
          )}

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

          <div className="pt-2 space-y-2">
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
            <Button 
              variant="outline" 
              type="button" 
              onClick={handleBackToRole}
              disabled={submitting}
              className="w-full justify-center py-3 font-display"
            >
              ← CHANGE ROLE
            </Button>
          </div>

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
