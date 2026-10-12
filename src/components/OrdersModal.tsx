import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { StorageService } from '../db/storage';
import { useAuth } from '../context/AuthContext';
import { Package, Clock, CheckCircle2, Truck, AlertCircle, Ban, MessageSquare, ChevronRight } from 'lucide-react';

interface OrdersModalProps {
  orders: Order[];
  onRefresh: () => void;
  onLodgeComplaint: (orderId: number) => void;
}

export const OrdersModal: React.FC<OrdersModalProps> = ({
  orders,
  onRefresh,
  onLodgeComplaint,
}) => {
  const { currentUser } = useAuth();
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleCancelOrder = (orderId: number) => {
    if (!currentUser) return;
    if (!confirm('Are you sure you want to cancel this order? Reserved produce stock will be restored immediately.')) {
      return;
    }

    try {
      setErrorMsg('');
      setCancellingId(orderId);
      StorageService.cancelOrder(orderId, currentUser.user_id, false);
      setSuccessMsg(`Order #${orderId} has been cancelled and stock restored.`);
      setTimeout(() => setSuccessMsg(''), 4000);
      onRefresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to cancel order.');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'placed': return 1;
      case 'confirmed': return 2;
      case 'packed': return 3;
      case 'out_for_delivery': return 4;
      case 'delivered': return 5;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
            My Farm Direct Orders
          </h1>
          <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5 sm:mt-1">
            Track orders directly from your local farms. Orders can be cancelled while in 'Placed' status.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500">
          <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-stone-800">No Orders Placed Yet</h3>
          <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
            Order fresh produce from local farmers to view real-time status tracking and harvest details here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const step = getStatusStepIndex(order.status);
            const isCancelled = order.status === 'cancelled';
            const canCancel = order.status === 'placed';

            return (
              <div
                key={order.order_id}
                className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="p-4 sm:p-5 bg-stone-50/70 border-b border-stone-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-stone-900 text-sm">
                      Order #{order.order_id}
                    </span>
                    <span className="text-stone-400">·</span>
                    <span className="text-stone-500">
                      Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded text-xs font-semibold capitalize ${
                      isCancelled
                        ? 'bg-rose-100 text-rose-800'
                        : order.status === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                    <span className="font-bold text-stone-900 text-sm font-mono tabular-nums">
                      ₹{order.total_amount}
                    </span>
                  </div>
                </div>

                {/* Status Progress Stepper (FR-O3) */}
                <div className="p-4 sm:p-5 border-b border-stone-100">
                  {isCancelled ? (
                    <div className="flex items-center gap-2 text-rose-700 bg-rose-50 p-3 rounded-xl text-xs font-medium">
                      <Ban className="w-4 h-4 shrink-0" />
                      <span>This order was cancelled. Stock has been returned to the respective farm inventory.</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-5 gap-2 text-center">
                      {[
                        { num: 1, label: 'Placed', mobileLabel: 'Placed' },
                        { num: 2, label: 'Confirmed', mobileLabel: 'Confirmed' },
                        { num: 3, label: 'Packed', mobileLabel: 'Packed' },
                        { num: 4, label: 'Out for Delivery', mobileLabel: 'Out' },
                        { num: 5, label: 'Delivered', mobileLabel: 'Delivered' }
                      ].map((s) => {
                        const isDone = step >= s.num;
                        const isCurrent = step === s.num;

                        return (
                          <div key={s.num} className="flex flex-col items-center">
                            <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-mono font-bold mb-1 transition-colors ${
                              isDone
                                ? 'bg-emerald-700 text-white'
                                : 'bg-stone-200 text-stone-500'
                            }`}>
                              {isDone ? '✓' : s.num}
                            </div>
                            <span className={`text-[10px] sm:text-[11px] leading-tight text-center ${
                              isCurrent ? 'font-bold text-emerald-900' : isDone ? 'text-stone-700 font-medium' : 'text-stone-400'
                            }`}>
                              <span className="sm:hidden">{s.mobileLabel}</span>
                              <span className="hidden sm:inline">{s.label}</span>
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Items Breakdown */}
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                    Purchased Harvest Items ({order.items?.length || 0})
                  </div>

                  <div className="divide-y divide-stone-100">
                    {order.items?.map((item) => (
                      <div key={item.item_id} className="py-2.5 flex items-center justify-between text-xs gap-3">
                        <div>
                          <div className="font-semibold text-stone-900">
                            {item.product_name}
                          </div>
                          <div className="text-[11px] text-stone-500">
                            From: {item.farmer_name}
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-medium text-stone-800 tabular-nums">
                            {item.quantity} {item.unit || 'unit'} × ₹{item.unit_price}
                          </span>
                          <span className="block font-bold text-stone-900 font-mono tabular-nums">
                            = ₹{item.quantity * item.unit_price}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery & Payment Details */}
                  <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600 bg-stone-50/50 p-3 rounded-xl">
                    <div>
                      <span className="text-stone-400 block text-[11px]">Delivery Location:</span>
                      <span className="font-medium text-stone-800">{order.delivery?.address}</span>
                      <span className="font-mono text-stone-500 ml-1">({order.delivery?.pincode})</span>
                    </div>

                    <div>
                      <span className="text-stone-400 block text-[11px]">Payment Mode:</span>
                      <span className="font-semibold text-emerald-800 uppercase">
                        {order.payment?.method || 'COD'} ({order.payment?.payment_status})
                      </span>
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                    <button
                      onClick={() => onLodgeComplaint(order.order_id)}
                      className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1.5 py-1.5 px-2 rounded hover:bg-stone-100 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Report Issue / Support</span>
                    </button>

                    {canCancel && (
                      <button
                        onClick={() => handleCancelOrder(order.order_id)}
                        disabled={cancellingId === order.order_id}
                        className="text-xs font-semibold text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-700 border border-rose-200 py-1.5 px-3 rounded-lg transition-colors"
                      >
                        {cancellingId === order.order_id ? 'Cancelling...' : 'Cancel Order (Restores Stock)'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
