import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { StorageService } from './db/storage';
import { Product, Order } from './types';
import { RoleSwitcherBar } from './components/RoleSwitcherBar';
import { Header } from './components/Header';
import { ConsumerMarketplace } from './components/ConsumerMarketplace';
import { FarmersDirectory } from './components/FarmersDirectory';
import { OrdersModal } from './components/OrdersModal';
import { FarmerDashboard } from './components/FarmerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AuthModal } from './components/AuthModal';
import { ComplaintModal } from './components/ComplaintModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Sprout, ShieldCheck, Heart } from 'lucide-react';

function AppContent() {
  const { currentUser, currentFarmer, refreshUser } = useAuth();

  const [currentTab, setCurrentTab] = useState<'marketplace' | 'farmers' | 'orders' | 'farmer_dashboard' | 'admin_dashboard'>('marketplace');
  const [pincodeFilter, setPincodeFilter] = useState('400001');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Modals
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login',
  });
  const [complaintModal, setComplaintModal] = useState<{ isOpen: boolean; orderId?: number | null }>({
    isOpen: false,
  });

  // State trigger to re-render when storage changes
  const [, setDbVersion] = useState(0);
  const triggerRefresh = () => {
    setDbVersion(v => v + 1);
    refreshUser();
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleFarmerDirectorySelect = (farmerId: number) => {
    setCurrentTab('marketplace');
    // Scroll down to catalog
    setTimeout(() => {
      const el = document.getElementById('marketplace-catalog');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const consumerOrders = currentUser ? StorageService.getOrders({ consumer_id: currentUser.user_id }) : [];

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900 selection:bg-emerald-100 selection:text-emerald-900 w-full max-w-full overflow-x-hidden">
      {/* Demo Evaluation Persona Switcher */}
      <RoleSwitcherBar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onResetDb={triggerRefresh}
        onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
      />

      {/* Primary Top Bar (Three-Zone Contract) */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        pincodeFilter={pincodeFilter}
        setPincodeFilter={setPincodeFilter}
        onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-24 md:pb-8">
        {currentTab === 'marketplace' && (
          <ConsumerMarketplace
            onSelectProduct={handleSelectProduct}
            pincodeFilter={pincodeFilter}
            setPincodeFilter={setPincodeFilter}
          />
        )}

        {currentTab === 'farmers' && (
          <FarmersDirectory
            onSelectFarmer={handleFarmerDirectorySelect}
          />
        )}

        {currentTab === 'orders' && (
          <OrdersModal
            orders={consumerOrders}
            onRefresh={triggerRefresh}
            onLodgeComplaint={(orderId) => setComplaintModal({ isOpen: true, orderId })}
          />
        )}

        {currentTab === 'farmer_dashboard' && (
          <FarmerDashboard
            onRefreshAll={triggerRefresh}
          />
        )}

        {currentTab === 'admin_dashboard' && (
          <AdminDashboard
            onRefreshAll={triggerRefresh}
          />
        )}
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        onProceedCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal (COD Transactional Logic) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={(order) => {
          triggerRefresh();
          setCurrentTab('orders');
        }}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
        onSuccess={() => {
          setAuthModal({ isOpen: false, mode: 'login' });
          triggerRefresh();
        }}
      />

      {/* Complaint / Dispute Modal */}
      <ComplaintModal
        isOpen={complaintModal.isOpen}
        orderId={complaintModal.orderId}
        onClose={() => setComplaintModal({ isOpen: false })}
        onSubmitted={triggerRefresh}
      />

      {/* Mobile App Bottom Tab Navigation */}
      <MobileBottomNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
      />

      {/* Quiet, Minimalist Footer */}
      <footer className="bg-white border-t border-stone-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px]">
                KS
              </span>
              <span className="font-semibold text-stone-800">KisanSetu Marketplace</span>
              <span>· Direct Farm-to-Consumer Platform</span>
            </div>

            <div className="flex items-center gap-6 text-stone-600">
              <button onClick={() => setCurrentTab('marketplace')} className="hover:text-stone-900 transition-colors">
                Marketplace
              </button>
              <button onClick={() => setCurrentTab('farmers')} className="hover:text-stone-900 transition-colors">
                Verified Farmers
              </button>
              <button
                onClick={() => setComplaintModal({ isOpen: true, orderId: null })}
                className="hover:text-stone-900 transition-colors"
              >
                Grievance Redressal
              </button>
            </div>

            <div className="text-stone-400">
              Cash on Delivery (COD) · Fair Producer Pricing
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
