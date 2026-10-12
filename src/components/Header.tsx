import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, MapPin, User, LogOut, ChevronDown } from 'lucide-react';

interface HeaderProps {
  currentTab: 'marketplace' | 'farmers' | 'orders' | 'farmer_dashboard' | 'admin_dashboard';
  setCurrentTab: (tab: 'marketplace' | 'farmers' | 'orders' | 'farmer_dashboard' | 'admin_dashboard') => void;
  pincodeFilter: string;
  setPincodeFilter: (pin: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  pincodeFilter,
  setPincodeFilter,
  onOpenAuth,
}) => {
  const { currentUser, currentFarmer, logout } = useAuth();
  const { totalCount, setIsCartOpen } = useCart();
  const [showPincodeInput, setShowPincodeInput] = React.useState(false);
  const [pincodeVal, setPincodeVal] = React.useState(pincodeFilter || '400001');

  const handleApplyPincode = (e: React.FormEvent) => {
    e.preventDefault();
    setPincodeFilter(pincodeVal.trim());
    setShowPincodeInput(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-1.5 sm:gap-8 h-14 sm:h-16 w-full min-w-0">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={() => setCurrentTab('marketplace')}
              className="text-base sm:text-xl font-bold tracking-tight text-emerald-900 flex items-center gap-1.5 sm:gap-2 text-left"
            >
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs sm:text-base shadow-sm shrink-0">
                KS
              </span>
              <span className="font-display">KisanSetu</span>
            </button>
          </div>

          {/* Zone 2: 4-5 concise single-line text links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
            <button
              onClick={() => setCurrentTab('marketplace')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentTab === 'marketplace' ? 'text-emerald-700 font-semibold border-b-2 border-emerald-700' : ''
              }`}
            >
              Marketplace
            </button>

            <button
              onClick={() => setCurrentTab('farmers')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentTab === 'farmers' ? 'text-emerald-700 font-semibold border-b-2 border-emerald-700' : ''
              }`}
            >
              Verified Farmers
            </button>

            {currentUser?.role === 'consumer' && (
              <button
                onClick={() => setCurrentTab('orders')}
                className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                  currentTab === 'orders' ? 'text-emerald-700 font-semibold border-b-2 border-emerald-700' : ''
                }`}
              >
                My Orders
              </button>
            )}

            {currentUser?.role === 'farmer' && (
              <button
                onClick={() => setCurrentTab('farmer_dashboard')}
                className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                  currentTab === 'farmer_dashboard' ? 'text-emerald-700 font-semibold border-b-2 border-emerald-700' : ''
                }`}
              >
                Farmer Studio
              </button>
            )}

            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setCurrentTab('admin_dashboard')}
                className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                  currentTab === 'admin_dashboard' ? 'text-emerald-700 font-semibold border-b-2 border-emerald-700' : ''
                }`}
              >
                Admin Console
              </button>
            )}
          </nav>

          {/* Zone 3: 1 primary action cluster */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
            {/* Quick Delivery Pincode Selector */}
            <div className="relative">
              <button
                onClick={() => setShowPincodeInput(!showPincodeInput)}
                className="flex items-center gap-1 text-[11px] sm:text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-md transition-colors"
                title="Change delivery pincode"
              >
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-700 shrink-0" />
                <span className="hidden sm:inline">Pincode:</span>
                <span className="font-mono font-semibold">{pincodeFilter || 'All'}</span>
                <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-stone-500" />
              </button>

              {showPincodeInput && (
                <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-xl border border-stone-200 p-3 z-50">
                  <div className="text-xs font-semibold text-stone-800 mb-1">Set Delivery Area Pincode</div>
                  <p className="text-[11px] text-stone-500 mb-2">
                    Filters products to farmers delivering directly to your postal code (e.g. 400001, 400050, 411001, 110001, 560034).
                  </p>
                  <form onSubmit={handleApplyPincode} className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={pincodeVal}
                      onChange={(e) => setPincodeVal(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 400001"
                      className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
                    />
                    <button
                      type="submit"
                      className="bg-emerald-700 text-white text-xs px-3 py-1.5 rounded font-medium hover:bg-emerald-800 transition-colors shrink-0"
                    >
                      Set
                    </button>
                  </form>
                  {pincodeFilter && (
                    <button
                      onClick={() => {
                        setPincodeFilter('');
                        setPincodeVal('');
                        setShowPincodeInput(false);
                      }}
                      className="text-[11px] text-stone-500 hover:text-rose-600 mt-2 underline block"
                    >
                      Clear pincode filter (Show All)
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 sm:p-2 text-stone-700 hover:text-emerald-800 hover:bg-stone-100 rounded-lg transition-colors"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-700 text-white font-mono text-[10px] sm:text-[11px] font-bold h-4 sm:h-5 min-w-[16px] sm:min-w-[20px] px-1 rounded-full flex items-center justify-center shadow-sm">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Auth controls */}
            {currentUser ? (
              <div className="flex items-center gap-1 sm:gap-2 pl-1 border-l border-stone-200">
                <button
                  onClick={() => {
                    if (currentUser.role === 'farmer') setCurrentTab('farmer_dashboard');
                    else if (currentUser.role === 'admin') setCurrentTab('admin_dashboard');
                    else setCurrentTab('orders');
                  }}
                  className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-stone-800 font-medium hover:text-emerald-800 transition-colors py-1 px-1.5 sm:px-2 rounded hover:bg-stone-100"
                >
                  <User className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                  <span className="max-w-[60px] sm:max-w-[100px] truncate">{currentUser.name.split(' ')[0]}</span>
                </button>
                <button
                  onClick={logout}
                  className="p-1 sm:p-1.5 text-stone-400 hover:text-rose-600 hover:bg-stone-100 rounded transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('login')}
                className="px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-xs font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 transition-colors whitespace-nowrap shrink-0 shadow-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
