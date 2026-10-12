import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Sprout, ShoppingBag, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'login' | 'register';
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, mode: initialMode, onClose, onSuccess }) => {
  const { login, register, loginAs } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Form states
  const [role, setRole] = useState<'consumer' | 'farmer'>('consumer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');

  // Farmer registration fields
  const [farmName, setFarmName] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [pincodes, setPincodes] = useState('400001, 400050');

  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (mode === 'login') {
        login(email.trim());
        onSuccess();
      } else {
        const pinArray = pincodes.split(',').map(s => s.trim()).filter(Boolean);
        register({
          name: name.trim(),
          email: email.trim(),
          role,
          farm_name: role === 'farmer' ? farmName.trim() : undefined,
          location: role === 'farmer' ? location.trim() : undefined,
          phone: role === 'farmer' ? phone.trim() : undefined,
          pincodes: role === 'farmer' ? pinArray : undefined,
        });
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-6 shadow-2xl border border-stone-200 relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-stone-400 hover:text-stone-700 transition-colors p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5 text-center">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center font-bold text-lg mx-auto mb-2">
            KS
          </div>
          <h2 className="text-xl font-bold text-stone-900 font-display">
            {mode === 'login' ? 'Sign In to KisanSetu' : 'Create an Account'}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            {mode === 'login'
              ? 'Access your direct farm orders or manage your produce inventory.'
              : 'Join as a local food consumer or register your farm producer account.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
            {error}
          </div>
        )}

        {/* Quick Demo Login Preset Buttons */}
        <div className="mb-5 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
          <span className="font-semibold text-stone-700 block mb-2">1-Click Test Personas:</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                loginAs('consumer_priya');
                onSuccess();
              }}
              className="p-2 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-left transition-colors"
            >
              <div className="font-semibold text-stone-900">Priya (Consumer)</div>
              <div className="text-[10px] text-stone-500">priya@gmail.com</div>
            </button>

            <button
              type="button"
              onClick={() => {
                loginAs('farmer_ramesh');
                onSuccess();
              }}
              className="p-2 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-left transition-colors"
            >
              <div className="font-semibold text-emerald-900">Ramesh (Approved)</div>
              <div className="text-[10px] text-stone-500">Patil Organic Agro</div>
            </button>

            <button
              type="button"
              onClick={() => {
                loginAs('farmer_pending');
                onSuccess();
              }}
              className="p-2 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-left transition-colors"
            >
              <div className="font-semibold text-amber-900">Gurpreet (Pending)</div>
              <div className="text-[10px] text-stone-500">Awaiting Admin</div>
            </button>

            <button
              type="button"
              onClick={() => {
                loginAs('admin');
                onSuccess();
              }}
              className="p-2 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-left transition-colors"
            >
              <div className="font-semibold text-stone-900">Admin Officer</div>
              <div className="text-[10px] text-stone-500">Marketplace Admin</div>
            </button>
          </div>
        </div>

        {/* Custom Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {mode === 'register' && (
            <>
              <div>
                <label className="block font-medium text-stone-700 mb-1">Account Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('consumer')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      role === 'consumer' ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Consumer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('farmer')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      role === 'farmer' ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    <Sprout className="w-3.5 h-3.5" />
                    <span>Farmer</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Anand Kumar"
                  className="w-full p-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              {role === 'farmer' && (
                <>
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Farm / Agro Name</label>
                    <input
                      type="text"
                      required
                      value={farmName}
                      onChange={(e) => setFarmName(e.target.value)}
                      placeholder="e.g. Anand Organic Orchards"
                      className="w-full p-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Farm Location / Region</label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Junnar, Pune District"
                      className="w-full p-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98220 54321"
                      className="w-full p-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Serviceable Pincodes (Comma separated)</label>
                    <input
                      type="text"
                      value={pincodes}
                      onChange={(e) => setPincodes(e.target.value)}
                      placeholder="400001, 400050, 411001"
                      className="w-full p-2 border border-stone-300 rounded-lg font-mono focus:ring-1 focus:ring-emerald-700"
                    />
                    <span className="text-[10px] text-stone-400 mt-0.5 block">
                      Farmer accounts will remain pending until verified by Admin.
                    </span>
                  </div>
                </>
              )}
            </>
          )}

          <div>
            <label className="block font-medium text-stone-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full p-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700"
            />
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-semibold transition-colors mt-2"
          >
            {mode === 'login' ? 'Sign In' : 'Complete Registration'}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-stone-100 text-center text-xs text-stone-500">
          {mode === 'login' ? (
            <span>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-emerald-800 font-semibold hover:underline"
              >
                Register as Farmer or Consumer
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-emerald-800 font-semibold hover:underline"
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
