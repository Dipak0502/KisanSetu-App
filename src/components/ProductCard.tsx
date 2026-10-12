import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Check, Plus, Minus, MapPin } from 'lucide-react';
import { SafeImage } from './SafeImage';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { items, addToCart, updateQuantity } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const cartItem = items.find(i => i.product_id === product.product_id);
  const currentCartQty = cartItem ? cartItem.quantity : 0;

  const isLowStock = product.quantity > 0 && product.quantity < 5;
  const isOutOfStock = product.quantity <= 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setErrorMessage('');
    const res = addToCart(product, 1);
    if (res.success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1200);
    } else {
      setErrorMessage(res.message || 'Cannot add');
      setTimeout(() => setErrorMessage(''), 2500);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentCartQty < product.quantity) {
      updateQuantity(product.product_id, currentCartQty + 1);
    } else {
      setErrorMessage(`Max stock is ${product.quantity}`);
      setTimeout(() => setErrorMessage(''), 2500);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentCartQty > 0) {
      updateQuantity(product.product_id, currentCartQty - 1);
    }
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group bg-white rounded-xl sm:rounded-2xl border border-stone-200/90 hover:border-emerald-600/50 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden cursor-pointer active:scale-[0.99]"
    >
      {/* Product Image Slot */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        <SafeImage
          src={product.image}
          alt={product.name}
          fallbackTitle={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Stock / Freshness Indicator Badge */}
        <div className="absolute top-2 right-2 z-10">
          {isOutOfStock ? (
            <span className="bg-stone-900/90 backdrop-blur-xs text-stone-200 text-[10px] sm:text-[11px] font-medium px-1.5 sm:px-2 py-0.5 rounded shadow-xs">
              Out of stock
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-700/95 backdrop-blur-xs text-amber-50 text-[10px] sm:text-[11px] font-medium px-1.5 sm:px-2 py-0.5 rounded shadow-xs tabular-nums">
              Only {product.quantity} left
            </span>
          ) : (
            <span className="bg-emerald-900/80 backdrop-blur-xs text-emerald-100 text-[10px] sm:text-[11px] font-medium px-1.5 sm:px-2 py-0.5 rounded shadow-xs">
              Fresh
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Farm origin */}
          <div className="flex items-center gap-1 text-[11px] sm:text-xs text-stone-500 mb-1">
            <span className="font-medium text-emerald-800 truncate max-w-[100px] sm:max-w-none">
              {product.farmer?.farm_name || 'Direct Farm'}
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="truncate flex items-center gap-0.5">
              <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0 text-stone-400" />
              <span className="truncate">{product.farmer?.location?.split(',')[0] || 'Local'}</span>
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-xs sm:text-sm md:text-base font-semibold text-stone-900 line-clamp-2 leading-snug group-hover:text-emerald-800 transition-colors">
            {product.name}
          </h3>

          {/* Short description (desktop only to keep mobile cards neat) */}
          <p className="hidden sm:line-clamp-2 text-xs text-stone-500 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Row (Responsive for 2-column mobile) */}
        <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-stone-100 space-y-1.5 sm:space-y-2">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-sm sm:text-lg font-bold text-stone-900 tabular-nums">
                ₹{product.price}
              </span>
              <span className="text-[10px] sm:text-xs text-stone-500">
                / {product.unit}
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-stone-400 tabular-nums hidden sm:inline">
              Stock: {product.quantity}
            </span>
          </div>

          {/* Action Row */}
          <div
            className="w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {isOutOfStock ? (
              <div className="w-full py-1.5 text-center text-[11px] font-semibold text-stone-400 bg-stone-100 rounded-lg">
                Sold Out
              </div>
            ) : currentCartQty > 0 ? (
              <div className="flex items-center justify-between border-2 border-emerald-700 bg-emerald-50/50 rounded-lg overflow-hidden h-8 sm:h-9">
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="w-8 sm:w-9 h-full flex items-center justify-center text-emerald-800 hover:bg-emerald-100 active:bg-emerald-200 transition-colors shrink-0"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs sm:text-sm font-mono font-bold text-emerald-950 tabular-nums truncate px-1 text-center min-w-0">
                  {currentCartQty} {product.unit}
                </span>
                <button
                  type="button"
                  disabled={currentCartQty >= product.quantity}
                  onClick={handleIncrement}
                  className="w-8 sm:w-9 h-full flex items-center justify-center text-emerald-800 hover:bg-emerald-100 active:bg-emerald-200 disabled:opacity-40 transition-colors shrink-0"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAdd}
                className={`w-full py-1.5 sm:py-2 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all touch-manipulation shadow-xs active:scale-95 h-8 sm:h-9 ${
                  justAdded
                    ? 'bg-emerald-700 text-white'
                    : 'bg-stone-900 text-white hover:bg-emerald-800'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span className="text-[11px] sm:text-xs">Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[11px] sm:text-xs hidden sm:inline">Add to Basket</span>
                    <span className="text-[11px] sm:hidden">Add</span>
                  </>
                )}
              </button>
            )}
          </div>

          {errorMessage && (
            <div className="text-[10px] text-rose-600 font-medium line-clamp-1 text-center">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
