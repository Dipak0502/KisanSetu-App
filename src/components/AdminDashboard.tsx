import React, { useState } from 'react';
import { StorageService } from '../db/storage';
import { Farmer, Product, User, Complaint, Order } from '../types';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  Ban,
  UserCheck,
  AlertTriangle,
  Package,
  Users,
  MessageSquare,
  Power,
  Trash2,
  MapPin,
  Phone
} from 'lucide-react';
import { SafeImage } from './SafeImage';

interface AdminDashboardProps {
  onRefreshAll: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onRefreshAll }) => {
  const [activeTab, setActiveTab] = useState<'farmers' | 'products' | 'complaints' | 'users'>('farmers');
  const [feedback, setFeedback] = useState('');

  // Complaint resolution modal
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');

  const db = StorageService.getDb();
  const farmers = db.farmers;
  const users = db.users;
  const products = db.products;
  const complaints = StorageService.getComplaints();
  const orders = db.orders;

  const pendingFarmers = farmers.filter(f => f.verification_status === 'pending');
  const approvedFarmers = farmers.filter(f => f.verification_status === 'approved');
  const openComplaints = complaints.filter(c => c.status === 'open');

  const handleFarmerVerification = (farmerId: number, status: 'approved' | 'rejected') => {
    try {
      StorageService.updateFarmerVerification(farmerId, status);
      setFeedback(`Farmer status set to "${status}".`);
      setTimeout(() => setFeedback(''), 3000);
      onRefreshAll();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleUserActive = (userId: number, currentActive: boolean) => {
    try {
      StorageService.setUserActive(userId, !currentActive);
      setFeedback(`User ${!currentActive ? 'unblocked' : 'blocked'} successfully.`);
      setTimeout(() => setFeedback(''), 3000);
      onRefreshAll();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleProductActive = (productId: number, currentActive: boolean) => {
    try {
      StorageService.updateProduct(productId, null, { is_active: !currentActive });
      setFeedback(`Product ${!currentActive ? 'activated' : 'deactivated'}.`);
      setTimeout(() => setFeedback(''), 3000);
      onRefreshAll();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteProduct = (productId: number) => {
    if (confirm('Permanently remove this product from the marketplace?')) {
      try {
        StorageService.deleteProduct(productId, null);
        setFeedback('Product deleted.');
        setTimeout(() => setFeedback(''), 3000);
        onRefreshAll();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const handleResolveComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    try {
      StorageService.resolveComplaint(
        selectedComplaint.complaint_id,
        resolutionNote || 'Reviewed with producer. Corrective packaging standards enforced.'
      );
      setSelectedComplaint(null);
      setResolutionNote('');
      setFeedback('Complaint marked as resolved.');
      setTimeout(() => setFeedback(''), 3000);
      onRefreshAll();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-stone-200">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-800 shrink-0" />
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
            Marketplace Administration & Trust Console
          </h1>
        </div>
        <p className="text-[11px] sm:text-xs text-stone-500 mt-1">
          Monitor producer verifications, audit fresh produce listings, resolve customer complaints, and ensure zero fraud.
        </p>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium">
          {feedback}
        </div>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3">
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] sm:text-xs text-stone-500 block">Pending Verifications</span>
          <span className={`text-xl sm:text-2xl font-bold font-mono tabular-nums ${pendingFarmers.length > 0 ? 'text-amber-600' : 'text-stone-900'}`}>
            {pendingFarmers.length}
          </span>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] sm:text-xs text-stone-500 block">Verified Farmers</span>
          <span className="text-xl sm:text-2xl font-bold text-emerald-800 font-mono tabular-nums">
            {approvedFarmers.length}
          </span>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] sm:text-xs text-stone-500 block">Total Produce Items</span>
          <span className="text-xl sm:text-2xl font-bold text-stone-900 font-mono tabular-nums">
            {products.length}
          </span>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] sm:text-xs text-stone-500 block">Orders Processed</span>
          <span className="text-xl sm:text-2xl font-bold text-stone-900 font-mono tabular-nums">
            {orders.length}
          </span>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] sm:text-xs text-stone-500 block">Open Complaints</span>
          <span className={`text-xl sm:text-2xl font-bold font-mono tabular-nums ${openComplaints.length > 0 ? 'text-rose-600' : 'text-stone-900'}`}>
            {openComplaints.length}
          </span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-stone-200 gap-4 text-xs font-semibold overflow-x-auto whitespace-nowrap scrollbar-none pb-0.5">
        <button
          onClick={() => setActiveTab('farmers')}
          className={`pb-3 transition-colors ${
            activeTab === 'farmers' ? 'text-emerald-800 border-b-2 border-emerald-800' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Farmer Verifications ({farmers.length})
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 transition-colors ${
            activeTab === 'products' ? 'text-emerald-800 border-b-2 border-emerald-800' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Products Moderation ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('complaints')}
          className={`pb-3 transition-colors ${
            activeTab === 'complaints' ? 'text-emerald-800 border-b-2 border-emerald-800' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Complaints &amp; Disputes ({complaints.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 transition-colors ${
            activeTab === 'users' ? 'text-emerald-800 border-b-2 border-emerald-800' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          User Accounts ({users.length})
        </button>
      </div>

      {/* TAB 1: Farmers Verification (FR-AD1) */}
      {activeTab === 'farmers' && (
        <div className="space-y-4">
          {pendingFarmers.length > 0 && (
            <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>Pending Verification Queue ({pendingFarmers.length})</span>
              </div>

              <div className="space-y-3">
                {pendingFarmers.map(f => {
                  const user = users.find(u => u.user_id === f.user_id);
                  const deliveryAreas = StorageService.getDeliveryAreas(f.farmer_id);
                  return (
                    <div key={f.farmer_id} className="bg-white p-4 rounded-xl border border-amber-200 text-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-stone-900 text-sm">{f.farm_name}</div>
                        <div className="text-stone-500 mt-0.5">
                          Owner: <strong>{user?.name}</strong> · Email: {user?.email} · Phone: {f.phone}
                        </div>
                        <div className="text-stone-500 mt-1 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" />
                          <span>{f.location}</span>
                          <span className="mx-1">·</span>
                          <span>Delivery Pincodes: {deliveryAreas.map(a => a.pincode).join(', ') || 'None specified'}</span>
                        </div>
                        {f.bio && <p className="text-stone-600 italic mt-1">{f.bio}</p>}
                      </div>

                      <div className="flex items-center gap-2 self-start md:self-auto">
                        <button
                          onClick={() => handleFarmerVerification(f.farmer_id, 'approved')}
                          className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Approve Farmer</span>
                        </button>
                        <button
                          onClick={() => handleFarmerVerification(f.farmer_id, 'rejected')}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-medium rounded-lg text-xs flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* All Verified Farmers */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 bg-stone-50 border-b border-stone-200 font-semibold text-xs text-stone-700">
              Approved Farm Producers ({approvedFarmers.length})
            </div>
            <div className="divide-y divide-stone-100 text-xs">
              {approvedFarmers.map(f => {
                const user = users.find(u => u.user_id === f.user_id);
                const count = products.filter(p => p.farmer_id === f.farmer_id).length;
                const deliveryAreas = StorageService.getDeliveryAreas(f.farmer_id);

                return (
                  <div key={f.farmer_id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-stone-900 text-sm flex items-center gap-2">
                        <span>{f.farm_name}</span>
                        <span className="text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded">
                          Verified Producer
                        </span>
                      </div>
                      <div className="text-stone-500 mt-0.5">
                        {user?.name} · {f.location} · {f.phone}
                      </div>
                      <div className="text-stone-400 text-[11px] mt-1">
                        Active Products: {count} · Delivers to {deliveryAreas.length} pincodes ({deliveryAreas.slice(0, 4).map(a => a.pincode).join(', ')}{deliveryAreas.length > 4 ? '...' : ''})
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleFarmerVerification(f.farmer_id, 'rejected')}
                        className="px-2.5 py-1 text-stone-400 hover:text-rose-600 text-xs rounded hover:bg-stone-100"
                        title="Revoke verification"
                      >
                        Revoke Approval
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Products Moderation (FR-AD2) */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <div className="p-4 bg-stone-50 border-b border-stone-200 font-semibold text-xs text-stone-700 flex justify-between items-center">
            <span>Marketplace Products Catalog ({products.length})</span>
            <span className="text-stone-400 font-normal">All listings across 11+ verified producers</span>
          </div>

          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 sticky top-0 text-stone-600 font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-2.5 px-4">Product</th>
                  <th className="py-2.5 px-4">Farm Origin</th>
                  <th className="py-2.5 px-4">Price</th>
                  <th className="py-2.5 px-4">Stock</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map(p => {
                  const farmer = farmers.find(f => f.farmer_id === p.farmer_id);
                  return (
                    <tr key={p.product_id} className="hover:bg-stone-50/50">
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded overflow-hidden bg-stone-100 shrink-0">
                            <SafeImage
                              src={p.image}
                              alt={p.name}
                              fallbackTitle={p.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="font-semibold text-stone-900">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-stone-600">{farmer?.farm_name || 'Farm'}</td>
                      <td className="py-2.5 px-4 font-mono tabular-nums">₹{p.price}/{p.unit}</td>
                      <td className="py-2.5 px-4 font-mono tabular-nums">{p.quantity}</td>
                      <td className="py-2.5 px-4">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          p.is_active ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                        }`}>
                          {p.is_active ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleToggleProductActive(p.product_id, p.is_active)}
                            className="p-1 text-stone-500 hover:text-stone-800 rounded"
                            title={p.is_active ? 'Deactivate' : 'Activate'}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.product_id)}
                            className="p-1 text-stone-400 hover:text-rose-600 rounded"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Complaints & Disputes (FR-AD3) */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          {complaints.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-400 text-xs">
              No complaints filed.
            </div>
          ) : (
            complaints.map(c => (
              <div
                key={c.complaint_id}
                className="bg-white rounded-2xl border border-stone-200 p-5 text-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-semibold text-stone-900 text-sm">
                      Complaint #{c.complaint_id}
                    </span>
                    <span className="text-stone-400 mx-2">·</span>
                    <span className="text-stone-500">From: {c.user_name} ({c.user_email})</span>
                    {c.order_id && (
                      <>
                        <span className="text-stone-400 mx-2">·</span>
                        <span className="font-mono text-emerald-800 font-semibold">Related Order #{c.order_id}</span>
                      </>
                    )}
                  </div>

                  <span className={`px-2 py-0.5 rounded font-medium text-[11px] uppercase ${
                    c.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {c.status}
                  </span>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl text-stone-700 leading-relaxed">
                  "{c.message}"
                </div>

                {c.admin_notes && (
                  <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-emerald-950">
                    <strong className="block text-[11px] uppercase text-emerald-800 mb-0.5">Admin Resolution Note:</strong>
                    <span>{c.admin_notes}</span>
                  </div>
                )}

                {c.status === 'open' && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setSelectedComplaint(c)}
                      className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold text-xs"
                    >
                      Resolve Complaint
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 4: Users (FR-AD1) */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
            <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {users.map(u => (
                <tr key={u.user_id} className="hover:bg-stone-50/50">
                  <td className="py-3 px-4 font-semibold text-stone-900">{u.name}</td>
                  <td className="py-3 px-4 text-stone-600 font-mono">{u.email}</td>
                  <td className="py-3 px-4 capitalize">
                    <span className="font-medium text-stone-700">{u.role}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      u.is_active ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                    }`}>
                      {u.is_active ? 'Active' : 'Blocked'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => handleToggleUserActive(u.user_id, u.is_active)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded transition-colors ${
                          u.is_active
                            ? 'text-rose-600 hover:bg-rose-50'
                            : 'text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {u.is_active ? 'Block User' : 'Unblock User'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {/* Complaint Resolution Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <h3 className="text-base font-bold text-stone-900">Resolve Complaint #{selectedComplaint.complaint_id}</h3>
            <p className="text-xs text-stone-600 italic">"{selectedComplaint.message}"</p>

            <form onSubmit={handleResolveComplaintSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Resolution Note for User &amp; Audit Log</label>
                <textarea
                  rows={3}
                  required
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="e.g. Discussed with farmer; packaging standards revised and buyer acknowledged."
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg"
                >
                  Confirm Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
