import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, UserCheck, Sprout, Clock, RotateCcw, UserPlus } from 'lucide-react';
import { StorageService } from '../db/storage';

interface RoleSwitcherBarProps {
  onResetDb: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  currentTab?: 'marketplace' | 'farmers' | 'orders' | 'farmer_dashboard' | 'admin_dashboard';
  setCurrentTab?: (tab: 'marketplace' | 'farmers' | 'orders' | 'farmer_dashboard' | 'admin_dashboard') => void;
}

export const RoleSwitcherBar: React.FC<RoleSwitcherBarProps> = ({
  onResetDb,
  onOpenAuth,
  currentTab,
  setCurrentTab,
}) => {
  const { currentUser, currentFarmer, loginAs } = useAuth();

  const handleSelectRole = (preset: 'consumer_priya' | 'farmer_ramesh' | 'admin' | 'farmer_pending') => {
    loginAs(preset);
    if (setCurrentTab) {
      if (preset === 'admin') {
        setCurrentTab('admin_dashboard');
      } else if (preset === 'farmer_ramesh' || preset === 'farmer_pending') {
        setCurrentTab('farmer_dashboard');
      } else if (preset === 'consumer_priya') {
        if (currentTab === 'farmer_dashboard' || currentTab === 'admin_dashboard') {
          setCurrentTab('marketplace');
        }
      }
    }
  };

  const isConsumerActive = currentUser?.role === 'consumer' && currentUser?.email === 'priya@gmail.com';
  const isFarmerApprovedActive = currentUser?.role === 'farmer' && currentFarmer?.verification_status === 'approved';
  const isFarmerPendingActive = currentUser?.role === 'farmer' && currentFarmer?.verification_status === 'pending';
  const isAdminActive = currentUser?.role === 'admin';

  return (
    <div className="bg-stone-900 text-stone-200 text-xs border-b border-stone-800 w-full z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 sm:py-2">
        {/* Mobile Layout (screens under sm) */}
        <div className="flex flex-col gap-1.5 sm:hidden">
          {/* Top row: Current Active Persona info & Quick Utilities */}
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-stone-400 text-[10px] font-medium shrink-0 uppercase tracking-wider">Persona:</span>
              <span className="bg-stone-800 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-semibold text-[11px] truncate">
                {currentUser ? `${currentUser.name.split(' ')[0]} (${currentUser.role.toUpperCase()})` : 'Guest'}
              </span>
              {isAdminActive && (
                <span className="bg-amber-950 text-amber-300 border border-amber-800 text-[9px] px-1 py-0.5 rounded font-medium shrink-0">
                  Admin
                </span>
              )}
              {currentFarmer && (
                <span className={`text-[9px] px-1 py-0.5 rounded shrink-0 ${
                  currentFarmer.verification_status === 'approved'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  {currentFarmer.verification_status === 'approved' ? 'Verified' : 'Pending'}
                </span>
              )}
            </div>

            {/* Quick auxiliary controls (Pending preset, Register & Reset) */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => handleSelectRole('farmer_pending')}
                className={`text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors ${
                  isFarmerPendingActive
                    ? 'bg-amber-600 text-white font-medium'
                    : 'bg-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-700'
                }`}
                title="Switch to Pending Farmer for verification demo"
              >
                <Clock className="w-2.5 h-2.5" />
                <span>Pending</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenAuth('register')}
                className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 transition-colors"
                title="Open registration dialog"
              >
                + Reg
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset database to initial seed (10+ verified farmers, 50+ products)?')) {
                    StorageService.resetToInitial();
                    onResetDb();
                  }
                }}
                className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
                title="Restore initial seed"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Bottom row: 3 Primary Personas - Consumer, Farmer, Admin (100% visible side-by-side in 3 equal columns) */}
          <div className="grid grid-cols-3 gap-1.5 w-full">
            <button
              type="button"
              onClick={() => handleSelectRole('consumer_priya')}
              className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-md text-[11px] font-medium transition-all ${
                isConsumerActive
                  ? 'bg-emerald-700 text-white shadow-xs ring-1 ring-emerald-500 font-semibold'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Consumer</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectRole('farmer_ramesh')}
              className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-md text-[11px] font-medium transition-all ${
                isFarmerApprovedActive
                  ? 'bg-emerald-700 text-white shadow-xs ring-1 ring-emerald-500 font-semibold'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
              }`}
            >
              <Sprout className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Farmer</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectRole('admin')}
              className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-md text-[11px] font-medium transition-all ${
                isAdminActive
                  ? 'bg-amber-600 text-white shadow-xs ring-1 ring-amber-400 font-semibold'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Admin</span>
            </button>
          </div>
        </div>

        {/* Desktop / Tablet Layout (screens sm and up) */}
        <div className="hidden sm:flex items-center justify-between gap-3">
          {/* Persona info on left */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-stone-400 text-xs font-medium shrink-0">Persona:</span>
            <span className="bg-stone-800 text-emerald-400 px-2 py-0.5 rounded font-mono font-semibold text-xs truncate">
              {currentUser ? `${currentUser.name} (${currentUser.role.toUpperCase()})` : 'Guest'}
            </span>
            {isAdminActive && (
              <span className="bg-amber-950 text-amber-300 border border-amber-800 text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                Super Admin
              </span>
            )}
            {currentFarmer && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded shrink-0 flex items-center gap-1 ${
                currentFarmer.verification_status === 'approved' 
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                  : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}>
                {currentFarmer.verification_status === 'approved' ? 'Verified Farm' : 'Pending Review'}
              </span>
            )}
          </div>

          {/* Quick action role switcher buttons on right */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Core 3 roles */}
            <div className="flex items-center bg-stone-800/90 p-0.5 rounded-lg border border-stone-700/70 gap-0.5">
              <button
                type="button"
                onClick={() => handleSelectRole('consumer_priya')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                  isConsumerActive
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-300 hover:text-white hover:bg-stone-700/60'
                }`}
                title="Switch to Priya (Consumer)"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Priya (Consumer)</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectRole('farmer_ramesh')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                  isFarmerApprovedActive
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-300 hover:text-white hover:bg-stone-700/60'
                }`}
                title="Switch to Ramesh Patil (Approved Farmer)"
              >
                <Sprout className="w-3.5 h-3.5" />
                <span>Ramesh (Farmer)</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectRole('admin')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                  isAdminActive
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-300 hover:text-white hover:bg-stone-700/60'
                }`}
                title="Switch to Admin Console"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>

            {/* Demo & testing buttons */}
            <button
              type="button"
              onClick={() => handleSelectRole('farmer_pending')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                isFarmerPendingActive
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
              }`}
              title="Switch to Gurpreet Singh (Pending Farmer)"
            >
              <Clock className="w-3 h-3" />
              <span>Pending</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenAuth('register')}
              className="bg-stone-800 hover:bg-stone-700 text-stone-300 px-2 py-1 rounded text-xs transition-colors whitespace-nowrap flex items-center gap-1"
            >
              <UserPlus className="w-3 h-3" />
              <span>Register</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (confirm('Reset database to initial seed (10+ verified farmers, 50+ products)?')) {
                  StorageService.resetToInitial();
                  onResetDb();
                }
              }}
              className="bg-stone-800 hover:bg-rose-950 hover:text-rose-300 text-stone-400 px-2 py-1 rounded text-xs transition-colors flex items-center gap-1 whitespace-nowrap"
              title="Restore initial database seed"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset DB</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
