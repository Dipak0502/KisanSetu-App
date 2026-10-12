import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../db/storage';
import { Order } from '../types';
import { X, CheckCircle, AlertTriangle, Truck, MapPin, ShieldCheck, ArrowRight } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  const { items, subtotal, clearCart } = useCart();
  const { currentUser } = useAuth();

  const [address, setAddress] = useState('Flat 402, Green Meadows, Bandra West');
  const [pincode, setPincode] = useState('400050');
  const [phone, setPhone] = useState('+91 98200 12345');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  // Check delivery area eligibility for each unique farmer
  const farmerDeliveryStatus = items.map(item => {
    const areas = StorageService.getDeliveryAreas(item.product.farmer_id);
    const delivers = areas.some(a => a.pincode === pincode.trim());
    return {
      farm_name: item.product.farmer?.farm_name || 'Farm',
      farmer_id: item.product.farmer_id,
      delivers,
      servicedPincodes: areas.map(a => a.pincode)
    };
  });

  const hasIneligibleFarmers = pincode.length === 6 && farmerDeliveryStatus.some(f => !f.delivers);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentUser) {
      setError('Please sign in or choose a demo persona to place an order.');
      return;
    }

    if (!address.trim()) {
      setError('Delivery address is required.');
      return;
    }

    if (!/^\d{6}$/.test(pincode.trim())) {
      setError('Please enter a valid 6-digit postal pincode.');
      return;
    }

    try {
      setIsSubmitting(true);
      // Atomic stock transaction execution
      const order = StorageService.placeOrder({
        consumer_id: currentUser.user_id,
        items,
        address: `${address.trim()}, Ph: ${phone.trim()}`,
        pincode: pincode.trim(),
        payment_method: paymentMethod,
      });

      clearCart();
      setPlacedOrder(order);
      onOrderSuccess(order);
    } catch (err: any) {
      setError(err?.message || 'Failed to place order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-stone-200 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Close checkout"
        >
          <X className="w-5 h-5" />
        </button>

        {placedOrder ? (
          /* Success Screen */
          <div className="p-5 sm:p-8 text-center space-y-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
              Order Confirmed!
            </h2>

            <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto">
              Your order <span className="font-mono font-bold text-stone-900">#{placedOrder.order_id}</span> has been dispatched directly to the farmers. Stock has been reserved atomically.
            </p>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-left text-xs space-y-2">
              <div className="flex justify-between text-stone-600">
                <span>Payment Method:</span>
                <span className="font-semibold text-stone-900">Cash on Delivery (COD)</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Total Payable at Doorstep:</span>
                <span className="font-bold text-emerald-900 font-mono text-sm">₹{placedOrder.total_amount}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Delivery Address:</span>
                <span className="font-medium text-stone-900 truncate max-w-[240px]">{placedOrder.delivery?.address}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Postal Pincode:</span>
                <span className="font-mono font-semibold text-stone-900">{placedOrder.delivery?.pincode}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Track in My Orders
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmitOrder} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
            <div>
              <h2 className="text-xl font-bold text-stone-900 font-display">
                Doorstep Checkout
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Direct farm-to-consumer delivery with transparent harvest traceability.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Delivery Details */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Delivery Details
              </h3>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Delivery Street Address
                </label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Apartment, building, street, landmark"
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Delivery Pincode
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 400050"
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-lg font-mono focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98200 12345"
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Serviceable Pincode Notification */}
              {hasIneligibleFarmers && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2">
                  <Truck className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <span className="font-semibold">Note:</span> One or more farmers in your basket may require extra transit days to deliver to pincode <span className="font-mono font-bold">{pincode}</span>. We will bundle orders.
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method (FR-O2: COD in v1) */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Payment Method
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <label className={`p-3 rounded-xl border flex flex-col cursor-pointer transition-colors ${
                  paymentMethod === 'cod' ? 'border-emerald-700 bg-emerald-50/50' : 'border-stone-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-900">Cash on Delivery (COD)</span>
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-emerald-700"
                    />
                  </div>
                  <span className="text-[11px] text-stone-500 mt-1">
                    Pay upon inspecting fresh produce at your doorstep (Default v1)
                  </span>
                </label>

                <label className="p-3 rounded-xl border border-stone-200 bg-stone-50 opacity-60 flex flex-col cursor-not-allowed">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-700">Online UPI / Card</span>
                    <span className="text-[10px] bg-stone-200 text-stone-600 px-1.5 py-0.5 rounded">v2 Roadmap</span>
                  </div>
                  <span className="text-[11px] text-stone-500 mt-1">
                    Direct bank settlement (planned for v2)
                  </span>
                </label>
              </div>
            </div>

            {/* Order Summary */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Items ({items.length}):</span>
                <span className="font-mono tabular-nums">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Direct Farmer Delivery:</span>
                <span className="font-medium text-emerald-800">FREE</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-stone-900 pt-2 border-t border-stone-200">
                <span>Total Amount:</span>
                <span className="font-mono tabular-nums text-base text-emerald-900">₹{subtotal}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || items.length === 0}
              className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 active:scale-98 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              {isSubmitting ? (
                <span>Reserving Stock & Placing Order...</span>
              ) : (
                <>
                  <span>Confirm Order (COD) · ₹{subtotal}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
