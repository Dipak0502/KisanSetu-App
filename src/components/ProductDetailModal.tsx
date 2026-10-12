import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { StorageService } from '../db/storage';
import { X, ShoppingBag, Check, MapPin, Phone, ShieldCheck, Calendar, ArrowRight } from 'lucide-react';
import { SafeImage } from './SafeImage';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onViewFarmerCatalog?: (farmerId: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onViewFarmerCatalog,
}) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!product) return null;

  const deliveryAreas = StorageService.getDeliveryAreas(product.farmer_id);
  const isOutOfStock = product.quantity <= 0;

  const handleAddToCart = () => {
    setErrorMessage('');
    const res = addToCart(product, quantity);
    if (res.success) {
      setJustAdded(true);
      setTimeout(() => {
        setJustAdded(false);
        onClose();
      }, 1000);
    } else {
      setErrorMessage(res.message || 'Cannot add to cart');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-stone-700 hover:text-stone-900 transition-colors shadow-sm"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Image */}
          <div className="relative aspect-[4/3] md:aspect-auto bg-stone-100 min-h-[220px] sm:min-h-[280px]">
            <SafeImage
              src={product.image}
              alt={product.name}
              fallbackTitle={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right: Contiguous Purchase Module */}
          <div className="p-4 sm:p-6 flex flex-col justify-between">
            <div>
              {/* Farmer and location */}
              <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1.5">
                <span className="font-semibold text-emerald-800">{product.farmer?.farm_name}</span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  {product.farmer?.location}
                </span>
              </div>

              <h2 className="text-xl font-bold text-stone-900 font-display">
                {product.name}
              </h2>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-stone-900 tabular-nums">
                  ₹{product.price}
                </span>
                <span className="text-sm text-stone-500">
                  per {product.unit}
                </span>
              </div>

              <p className="mt-3 text-sm text-stone-600 leading-relaxed">
                {product.description}
              </p>

              {/* Provenance Box */}
              <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-stone-200/70 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Farmer Verification:</span>
                  <span className="font-medium text-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Admin Verified Producer
                  </span>
                </div>

                {product.harvest_date && (
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Harvest Date:</span>
                    <span className="font-medium text-stone-800 flex items-center gap-1 tabular-nums">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      {product.harvest_date}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Available Stock:</span>
                  <span className="font-medium text-stone-800 tabular-nums">
                    {product.quantity} {product.unit} remaining
                  </span>
                </div>

                {/* Serviceable Pincodes */}
                <div className="pt-2 border-t border-stone-200/80">
                  <span className="text-stone-500 block mb-1">Delivers to postal pincodes:</span>
                  <div className="flex flex-wrap gap-1 font-mono text-[11px] text-stone-700">
                    {deliveryAreas.length > 0 ? (
                      deliveryAreas.map(a => (
                        <span key={a.area_id} className="bg-white border border-stone-200 px-1.5 py-0.5 rounded">
                          {a.pincode}
                        </span>
                      ))
                    ) : (
                      <span className="text-stone-400">All local city hubs</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase Action */}
            <div className="mt-6 pt-4 border-t border-stone-100">
              {errorMessage && (
                <div className="text-xs text-rose-600 font-medium mb-3">
                  {errorMessage}
                </div>
              )}

              <div className="flex items-center gap-3">
                {!isOutOfStock && (
                  <div className="flex items-center border border-stone-300 rounded-lg bg-stone-50">
                    <button
                      type="button"
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="px-3 py-2 text-stone-600 hover:text-stone-900"
                    >
                      -
                    </button>
                    <span className="px-2 font-mono font-semibold text-sm tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(q => Math.min(product.quantity, q + 1))}
                      className="px-3 py-2 text-stone-600 hover:text-stone-900"
                    >
                      +
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm ${
                    isOutOfStock
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      : justAdded
                      ? 'bg-emerald-700 text-white'
                      : 'bg-emerald-800 text-white hover:bg-emerald-900 active:scale-95'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Basket</span>
                    </>
                  ) : isOutOfStock ? (
                    <span>Currently Out of Stock</span>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Basket · ₹{product.price * quantity}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
