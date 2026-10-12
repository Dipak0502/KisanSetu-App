import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../db/storage';
import { Product, Order, OrderStatus, Category, DeliveryArea } from '../types';
import {
  Sprout,
  Plus,
  AlertTriangle,
  Package,
  TrendingUp,
  MapPin,
  CheckCircle,
  Clock,
  Edit2,
  Trash2,
  Power,
  RotateCw,
  X,
  Send
} from 'lucide-react';
import { SafeImage } from './SafeImage';

interface FarmerDashboardProps {
  onRefreshAll: () => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ onRefreshAll }) => {
  const { currentFarmer } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'pincodes'>('products');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [restockProduct, setRestockProduct] = useState<Product | null>(null);
  const [restockQuantity, setRestockQuantity] = useState(25);

  // New product form state
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(1);
  const [price, setPrice] = useState<number | ''>(50);
  const [unit, setUnit] = useState('kg');
  const [quantity, setQuantity] = useState<number | ''>(50);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [formError, setFormError] = useState('');

  // Pincode management
  const [newPincode, setNewPincode] = useState('');
  const [pincodeError, setPincodeError] = useState('');

  // Status feedback
  const [actionFeedback, setActionFeedback] = useState('');

  if (!currentFarmer) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center text-stone-500">
        Please sign in as a farmer to access the Farmer Studio.
      </div>
    );
  }

  const isApproved = currentFarmer.verification_status === 'approved';
  const categories = StorageService.getCategories();
  const farmerProducts = StorageService.getProducts({ farmer_id: currentFarmer.farmer_id, onlyActive: false });
  const incomingOrders = StorageService.getOrders({ farmer_id: currentFarmer.farmer_id });
  const deliveryAreas = StorageService.getDeliveryAreas(currentFarmer.farmer_id);

  // KPIs
  const activeProductsCount = farmerProducts.filter(p => p.is_active).length;
  const lowStockProducts = farmerProducts.filter(p => p.is_active && p.quantity < 5);
  const totalRevenue = incomingOrders
    .filter(o => o.status !== 'cancelled')
    .reduce((acc, order) => {
      const myItems = order.items?.filter(i => i.farmer_id === currentFarmer.farmer_id) || [];
      return acc + myItems.reduce((s, i) => s + (i.unit_price * i.quantity), 0);
    }, 0);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!isApproved) {
      setFormError('Account is pending admin verification. You cannot add products yet.');
      return;
    }

    if (!name.trim()) {
      setFormError('Product name is required.');
      return;
    }

    if (Number(price) <= 0) {
      setFormError('Price must be greater than 0.');
      return;
    }

    if (Number(quantity) < 0) {
      setFormError('Quantity cannot be negative.');
      return;
    }

    try {
      StorageService.addProduct(currentFarmer.farmer_id, {
        category_id: Number(categoryId),
        name: name.trim(),
        description: description.trim() || 'Freshly harvested authentic farm produce.',
        price: Number(price),
        unit: unit.trim(),
        quantity: Number(quantity),
        image: image.trim() || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
      });

      setShowAddModal(false);
      setName('');
      setDescription('');
      setImage('');
      setActionFeedback('Produce listed successfully!');
      setTimeout(() => setActionFeedback(''), 3000);
      onRefreshAll();
    } catch (err: any) {
      setFormError(err.message || 'Failed to add product');
    }
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      StorageService.updateProduct(editingProduct.product_id, currentFarmer.farmer_id, {
        name: editingProduct.name,
        price: Number(editingProduct.price),
        quantity: Number(editingProduct.quantity),
        unit: editingProduct.unit,
        description: editingProduct.description,
        is_active: editingProduct.is_active,
      });
      setEditingProduct(null);
      setActionFeedback('Product updated successfully.');
      setTimeout(() => setActionFeedback(''), 3000);
      onRefreshAll();
    } catch (err: any) {
      alert(err.message || 'Failed to update product');
    }
  };

  const handleToggleActive = (productId: number, currentActive: boolean) => {
    try {
      StorageService.updateProduct(productId, currentFarmer.farmer_id, {
        is_active: !currentActive,
      });
      onRefreshAll();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteProduct = (productId: number) => {
    if (confirm('Delete this product from your farm catalog?')) {
      try {
        StorageService.deleteProduct(productId, currentFarmer.farmer_id);
        onRefreshAll();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockProduct) return;
    try {
      const newQty = restockProduct.quantity + Number(restockQuantity);
      StorageService.updateProduct(restockProduct.product_id, currentFarmer.farmer_id, {
        quantity: newQty,
      });
      setRestockProduct(null);
      setActionFeedback(`Restocked ${restockProduct.name} by +${restockQuantity} ${restockProduct.unit}!`);
      setTimeout(() => setActionFeedback(''), 3000);
      onRefreshAll();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleOrderStatusUpdate = (orderId: number, nextStatus: OrderStatus) => {
    try {
      StorageService.updateOrderStatus(orderId, currentFarmer.farmer_id, nextStatus);
      setActionFeedback(`Order #${orderId} moved to "${nextStatus.replace(/_/g, ' ')}" status.`);
      setTimeout(() => setActionFeedback(''), 3000);
      onRefreshAll();
    } catch (err: any) {
      alert(err.message || 'Failed to transition order status.');
    }
  };

  const handleAddPincode = (e: React.FormEvent) => {
    e.preventDefault();
    setPincodeError('');
    try {
      StorageService.addDeliveryPincode(currentFarmer.farmer_id, newPincode);
      setNewPincode('');
      setActionFeedback('Delivery pincode added.');
      setTimeout(() => setActionFeedback(''), 3000);
      onRefreshAll();
    } catch (err: any) {
      setPincodeError(err.message);
    }
  };

  const handleRemovePincode = (areaId: number) => {
    try {
      StorageService.removeDeliveryPincode(areaId, currentFarmer.farmer_id);
      onRefreshAll();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
      {/* Header Profile */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
              {currentFarmer.farm_name}
            </h1>
            <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium ${
              isApproved
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {isApproved ? 'Verified Producer' : 'Pending Verification'}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-stone-500 mt-1 flex items-center gap-1.5 flex-wrap">
            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span>{currentFarmer.location}</span>
            <span>·</span>
            <span>{currentFarmer.phone}</span>
          </p>
        </div>

        {isApproved && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 sm:py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors self-stretch sm:self-auto shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>List New Produce</span>
          </button>
        )}
      </div>

      {/* Verification Warning (FR-A3) */}
      {!isApproved && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-950 text-sm">Farmer Verification Pending</h3>
            <p className="mt-0.5 text-amber-800 leading-relaxed">
              Your farmer profile has been submitted and is currently under review by the marketplace admin. To protect consumer food safety and authenticity, listing new products is disabled until verified. You can switch to the Admin persona using the top switcher to review and approve this farm.
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-xs text-stone-500 block">Active Products</span>
          <span className="text-2xl font-bold text-stone-900 font-mono tabular-nums">{activeProductsCount}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-xs text-stone-500 block">Low Stock Alerts (&lt;5)</span>
          <span className={`text-2xl font-bold font-mono tabular-nums ${lowStockProducts.length > 0 ? 'text-amber-600' : 'text-stone-900'}`}>
            {lowStockProducts.length}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-xs text-stone-500 block">Incoming Orders</span>
          <span className="text-2xl font-bold text-stone-900 font-mono tabular-nums">{incomingOrders.length}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-xs text-stone-500 block">Gross Farm Sales</span>
          <span className="text-2xl font-bold text-emerald-800 font-mono tabular-nums">₹{totalRevenue}</span>
        </div>
      </div>

      {/* Low Stock Banner Alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong className="font-semibold">{lowStockProducts.length} items</strong> running critically low on stock: {lowStockProducts.map(p => p.name).join(', ')}.
            </span>
          </div>
          <button
            onClick={() => {
              setRestockProduct(lowStockProducts[0]);
              setRestockQuantity(25);
            }}
            className="px-2.5 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded text-[11px] font-semibold whitespace-nowrap"
          >
            Quick Restock
          </button>
        </div>
      )}

      {actionFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium">
          {actionFeedback}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-stone-200 gap-4 text-xs font-semibold overflow-x-auto whitespace-nowrap scrollbar-none pb-0.5">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 transition-colors ${
            activeTab === 'products' ? 'text-emerald-800 border-b-2 border-emerald-800' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          My Products ({farmerProducts.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 transition-colors ${
            activeTab === 'orders' ? 'text-emerald-800 border-b-2 border-emerald-800' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Incoming Orders ({incomingOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('pincodes')}
          className={`pb-3 transition-colors ${
            activeTab === 'pincodes' ? 'text-emerald-800 border-b-2 border-emerald-800' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Serviceable Pincodes ({deliveryAreas.length})
        </button>
      </div>

      {/* TAB 1: Products */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Produce</th>
                  <th className="py-3 px-4">Price / Unit</th>
                  <th className="py-3 px-4">Current Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {farmerProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-stone-400">
                      No produce listed yet. Click "List New Produce" above.
                    </td>
                  </tr>
                ) : (
                  farmerProducts.map((p) => {
                    const isLow = p.quantity < 5;
                    return (
                      <tr key={p.product_id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                              <SafeImage
                                src={p.image}
                                alt={p.name}
                                fallbackTitle={p.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-semibold text-stone-900">{p.name}</div>
                              <div className="text-[11px] text-stone-500 line-clamp-1">{p.description}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-mono tabular-nums font-medium text-stone-800">
                          ₹{p.price} / {p.unit}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`font-mono tabular-nums font-semibold ${isLow ? 'text-amber-600' : 'text-stone-800'}`}>
                              {p.quantity} {p.unit}
                            </span>
                            {isLow && (
                              <button
                                onClick={() => {
                                  setRestockProduct(p);
                                  setRestockQuantity(25);
                                }}
                                className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-medium hover:bg-amber-200"
                              >
                                + Restock
                              </button>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                            p.is_active ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-100 text-stone-500'
                          }`}>
                            {p.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleToggleActive(p.product_id, p.is_active)}
                              className={`p-1.5 rounded transition-colors ${
                                p.is_active ? 'text-stone-400 hover:text-stone-600' : 'text-emerald-700 hover:text-emerald-900'
                              }`}
                              title={p.is_active ? 'Deactivate Product' : 'Activate Product'}
                            >
                              <Power className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingProduct(p)}
                              className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                              title="Edit price/stock"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.product_id)}
                              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-stone-100 rounded transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Incoming Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {incomingOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-400 text-xs">
              No orders received yet for this farm.
            </div>
          ) : (
            incomingOrders.map((order) => {
              const myItems = order.items?.filter(i => i.farmer_id === currentFarmer.farmer_id) || [];
              const myOrderTotal = myItems.reduce((s, i) => s + (i.unit_price * i.quantity), 0);

              return (
                <div key={order.order_id} className="bg-white rounded-2xl border border-stone-200 p-5 text-xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
                    <div>
                      <span className="font-mono font-bold text-stone-900 text-sm">
                        Order #{order.order_id}
                      </span>
                      <span className="text-stone-400 mx-2">·</span>
                      <span className="text-stone-500">Customer: {order.consumer_name || 'Consumer'}</span>
                      <span className="text-stone-400 mx-2">·</span>
                      <span className="text-stone-500">{order.delivery?.address}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded font-medium uppercase text-[11px] ${
                        order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                        order.status === 'cancelled' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                      <span className="font-mono font-bold text-stone-900 text-sm">
                        ₹{myOrderTotal}
                      </span>
                    </div>
                  </div>

                  {/* Farm Items in this order */}
                  <div className="space-y-1">
                    {myItems.map(item => (
                      <div key={item.item_id} className="flex justify-between py-1 text-stone-700">
                        <span>{item.product_name} ({item.quantity} {item.unit})</span>
                        <span className="font-mono tabular-nums">₹{item.quantity * item.unit_price}</span>
                      </div>
                    ))}
                  </div>

                  {/* Status Progression Workflow Controls (FR-F3) */}
                  <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] text-stone-500">
                      Payment Mode: <strong className="uppercase">{order.payment?.method || 'COD'}</strong> ({order.payment?.payment_status})
                    </span>

                    <div className="flex items-center gap-2">
                      {order.status === 'placed' && (
                        <button
                          onClick={() => handleOrderStatusUpdate(order.order_id, 'confirmed')}
                          className="px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold"
                        >
                          Confirm Order
                        </button>
                      )}

                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => handleOrderStatusUpdate(order.order_id, 'packed')}
                          className="px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold"
                        >
                          Mark Packed
                        </button>
                      )}

                      {order.status === 'packed' && (
                        <button
                          onClick={() => handleOrderStatusUpdate(order.order_id, 'out_for_delivery')}
                          className="px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold"
                        >
                          Dispatch (Out for Delivery)
                        </button>
                      )}

                      {order.status === 'out_for_delivery' && (
                        <button
                          onClick={() => handleOrderStatusUpdate(order.order_id, 'delivered')}
                          className="px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold"
                        >
                          Mark Delivered &amp; Paid (COD)
                        </button>
                      )}

                      {(order.status === 'placed' || order.status === 'confirmed') && (
                        <button
                          onClick={() => handleOrderStatusUpdate(order.order_id, 'cancelled')}
                          className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-medium border border-rose-200"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 3: Delivery Pincodes (FR-L1) */}
      {activeTab === 'pincodes' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-stone-900">
              Serviceable Delivery Pincodes
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Customers residing in these postal areas will see your farm produce and can order directly.
            </p>
          </div>

          <form onSubmit={handleAddPincode} className="flex gap-2 max-w-sm">
            <input
              type="text"
              maxLength={6}
              value={newPincode}
              onChange={(e) => setNewPincode(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 6-digit pincode"
              className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg shrink-0"
            >
              Add Area
            </button>
          </form>

          {pincodeError && (
            <div className="text-xs text-rose-600 font-medium">
              {pincodeError}
            </div>
          )}

          <div className="pt-2">
            <div className="text-xs font-medium text-stone-700 mb-2">Active Service Zones:</div>
            <div className="flex flex-wrap gap-2">
              {deliveryAreas.map(a => (
                <div
                  key={a.area_id}
                  className="flex items-center gap-2 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-stone-800"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{a.pincode}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePincode(a.area_id)}
                    className="text-stone-400 hover:text-rose-600 transition-colors ml-1"
                    title="Remove area"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: List New Product */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-stone-900 font-display">List New Fresh Produce</h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Crisp Organic Shimla Mirch"
                  className="w-full p-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    className="w-full p-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700"
                  >
                    {categories.map(c => (
                      <option key={c.category_id} value={c.category_id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Selling Unit</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700"
                  >
                    <option value="kg">kg</option>
                    <option value="bunch">bunch</option>
                    <option value="piece">piece</option>
                    <option value="dozen">dozen</option>
                    <option value="500g">500g</option>
                    <option value="250g">250g</option>
                    <option value="liter">liter</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2 border border-stone-300 rounded-lg font-mono focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Initial Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full p-2 border border-stone-300 rounded-lg font-mono focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://... (Leave empty for default high-res farm photo)"
                  className="w-full p-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Description / Taste Notes</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell consumers about harvest date, soil, pesticide-free practices..."
                  className="w-full p-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg"
                >
                  Publish Produce
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Product */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-stone-900 font-display">Edit {editingProduct.name}</h3>
              <button onClick={() => setEditingProduct(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Price (₹ per {editingProduct.unit})</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                  className="w-full p-2 border border-stone-300 rounded-lg font-mono focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Available Stock ({editingProduct.unit})</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={editingProduct.quantity}
                  onChange={(e) => setEditingProduct({ ...editingProduct, quantity: Number(e.target.value) })}
                  className="w-full p-2 border border-stone-300 rounded-lg font-mono focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full p-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Quick Restock */}
      {restockProduct && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-stone-900">Restock Produce</h3>
              <button onClick={() => setRestockProduct(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Add new harvest quantity to <strong>{restockProduct.name}</strong>. Current stock is {restockProduct.quantity} {restockProduct.unit}.
            </p>

            <form onSubmit={handleRestockSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Additional Quantity to Add ({restockProduct.unit})</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(Number(e.target.value))}
                  className="w-full p-2 border border-stone-300 rounded-lg font-mono focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRestockProduct(null)}
                  className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg"
                >
                  Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
