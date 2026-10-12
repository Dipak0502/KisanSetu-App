import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../db/storage';
import { X, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ComplaintModalProps {
  isOpen: boolean;
  orderId?: number | null;
  onClose: () => void;
  onSubmitted: () => void;
}

export const ComplaintModal: React.FC<ComplaintModalProps> = ({
  isOpen,
  orderId,
  onClose,
  onSubmitted,
}) => {
  const { currentUser } = useAuth();
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('Please sign in to lodge a complaint.');
      return;
    }

    if (!message.trim()) {
      setError('Please provide details for the admin review team.');
      return;
    }

    try {
      StorageService.addComplaint({
        user_id: currentUser.user_id,
        order_id: orderId,
        message: message.trim(),
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setMessage('');
        onSubmitted();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to file complaint.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-bold text-stone-900 font-display">Complaint Submitted</h3>
            <p className="text-xs text-stone-500">
              The marketplace administrator has received your grievance and will review directly with the farm producer.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-800" />
              <h3 className="text-lg font-bold text-stone-900 font-display">
                Report Issue {orderId ? `on Order #${orderId}` : 'to Admin'}
              </h3>
            </div>

            <p className="text-xs text-stone-500">
              KisanSetu enforces strict farm quality, packaging standards, and doorstep transparency. Please describe the problem:
            </p>

            {error && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Your Feedback / Concern
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. Tomatoes were bruised during transit, or delivery delayed without notice..."
                className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg"
              >
                Submit to Admin
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
