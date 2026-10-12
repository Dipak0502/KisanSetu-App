import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Store, Sprout, ShoppingBag, Package, LayoutDashboard, ShieldCheck, User } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: 'marketplace' | 'farmers' | 'orders' | 'farmer_dashboard' | 'admin_dashboard';
  setCurrentTab: (tab: 'marketplace' | 'farmers' | 'orders' | 'farmer_dashboard' | 'admin_dashboard') => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  setCurrentTab,
  onOpenAuth,
}) => {
  const { currentUser } = useAuth();
  const { totalCount, setIsCartOpen } = useCart();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] safe-area-inset-bottom">
      <div className="grid grid-cols-5 h-14">
        {/* Tab 1: Marketplace */}
        <button
          onClick={() => setCurrentTab('marketplace')}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            currentTab === 'marketplace' ? 'text-emerald-800 font-semibold' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Store className="w-5 h-5" />
          <span className="text-[10px] leading-none">Shop</span>
        </button>

        {/* Tab 2: Farmers */}
        <button
          onClick={() => setCurrentTab('farmers')}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            currentTab === 'farmers' ? 'text-emerald-800 font-semibold' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Sprout className="w-5 h-5" />
          <span className="text-[10px] leading-none">Farmers</span>
        </button>

        {/* Tab 3: Cart with Badge */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center gap-1 text-stone-500 hover:text-emerald-800 transition-colors"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-emerald-700 text-white font-mono text-[10px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center shadow-xs">
                {totalCount}
              </span>
            )}
          </div>
          <span className="text-[10px] leading-none">Basket</span>
        </button>

        {/* Tab 4: Orders or Dashboard */}
        {currentUser?.role === 'farmer' ? (
          <button
            onClick={() => setCurrentTab('farmer_dashboard')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              currentTab === 'farmer_dashboard' ? 'text-emerald-800 font-semibold' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] leading-none">Studio</span>
          </button>
        ) : currentUser?.role === 'admin' ? (
          <button
            onClick={() => setCurrentTab('admin_dashboard')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              currentTab === 'admin_dashboard' ? 'text-emerald-800 font-semibold' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] leading-none">Admin</span>
          </button>
        ) : (
          <button
            onClick={() => setCurrentTab('orders')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              currentTab === 'orders' ? 'text-emerald-800 font-semibold' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Package className="w-5 h-5" />
            <span className="text-[10px] leading-none">Orders</span>
          </button>
        )}

        {/* Tab 5: Account */}
        <button
          onClick={() => {
            if (!currentUser) {
              onOpenAuth('login');
            } else if (currentUser.role === 'farmer') {
              setCurrentTab('farmer_dashboard');
            } else if (currentUser.role === 'admin') {
              setCurrentTab('admin_dashboard');
            } else {
              setCurrentTab('orders');
            }
          }}
          className="flex flex-col items-center justify-center gap-1 text-stone-500 hover:text-stone-900 transition-colors"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] leading-none truncate max-w-[50px]">
            {currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}
          </span>
        </button>
      </div>
    </nav>
  );
};
