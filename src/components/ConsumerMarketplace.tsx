import React, { useState, useMemo } from 'react';
import { Product, Category } from '../types';
import { StorageService } from '../db/storage';
import { ASSET_IMAGES } from '../assets/images';
import { ProductCard } from './ProductCard';
import { Search, Filter, MapPin, X, ArrowUpDown, Sprout, Check, Sparkles } from 'lucide-react';

interface ConsumerMarketplaceProps {
  onSelectProduct: (product: Product) => void;
  pincodeFilter: string;
  setPincodeFilter: (pin: string) => void;
}

export const ConsumerMarketplace: React.FC<ConsumerMarketplaceProps> = ({
  onSelectProduct,
  pincodeFilter,
  setPincodeFilter,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'price_high' | 'stock'>('recommended');

  const categories = StorageService.getCategories();
  const allActiveProducts = StorageService.getProducts({ onlyActive: true });

  const filteredProducts = useMemo(() => {
    return allActiveProducts.filter(p => {
      // Category filter
      if (selectedCategoryId !== null && p.category_id !== selectedCategoryId) {
        return false;
      }

      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchFarm = p.farmer?.farm_name.toLowerCase().includes(q) || false;
        const matchLoc = p.farmer?.location.toLowerCase().includes(q) || false;
        if (!matchName && !matchDesc && !matchFarm && !matchLoc) {
          return false;
        }
      }

      // Max price filter
      if (p.price > maxPrice) {
        return false;
      }

      // In stock filter
      if (onlyInStock && p.quantity <= 0) {
        return false;
      }

      // Pincode delivery filter (FR-L2)
      if (pincodeFilter.trim()) {
        const pin = pincodeFilter.trim();
        const areas = StorageService.getDeliveryAreas(p.farmer_id);
        const delivers = areas.some(a => a.pincode === pin);
        if (!delivers) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_low') return a.price - b.price;
      if (sortBy === 'price_high') return b.price - a.price;
      if (sortBy === 'stock') return b.quantity - a.quantity;
      return a.product_id - b.product_id;
    });
  }, [allActiveProducts, selectedCategoryId, search, maxPrice, onlyInStock, pincodeFilter, sortBy]);

  const categoryCardsData = [
    {
      id: 1,
      name: 'Vegetables',
      img: ASSET_IMAGES.categories.veggies,
      count: allActiveProducts.filter(p => p.category_id === 1).length
    },
    {
      id: 2,
      name: 'Fruits',
      img: ASSET_IMAGES.categories.fruits,
      count: allActiveProducts.filter(p => p.category_id === 2).length
    },
    {
      id: 3,
      name: 'Grains & Pulses',
      img: ASSET_IMAGES.categories.grains,
      count: allActiveProducts.filter(p => p.category_id === 3).length
    },
    {
      id: 4,
      name: 'Dairy & Pantry',
      img: ASSET_IMAGES.categories.dairy,
      count: allActiveProducts.filter(p => p.category_id === 4).length
    }
  ];

  return (
    <div className="space-y-5 sm:space-y-8 pb-20 sm:pb-16 w-full min-w-0 overflow-x-hidden">
      {/* Responsive Storefront Hero Banner */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-2 sm:mt-4">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-stone-900 text-white shadow-sm">
          <div className="absolute inset-0">
            <img
              src={ASSET_IMAGES.heroBanner}
              alt="Local Farm Harvest"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center opacity-45 filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/80 to-stone-950/40" />
          </div>

          <div className="relative max-w-4xl px-4 py-7 sm:px-8 sm:py-14 md:py-16">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/80 border border-emerald-700/60 rounded-full text-[11px] font-semibold text-emerald-300 mb-3 tracking-wide">
              <Sprout className="w-3.5 h-3.5" />
              <span>Zero Middlemen · Direct Farm Doorstep Delivery</span>
            </div>

            <h1 className="text-xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-display max-w-2xl leading-tight">
              Direct harvest from certified local farmers to your kitchen table.
            </h1>

            <p className="mt-2 sm:mt-4 text-stone-200 text-xs sm:text-base max-w-xl leading-relaxed">
              Order pesticide-free country vegetables, ripe orchard fruits, cold-pressed oils, and heirloom grains. Verified producers, doorstep Cash on Delivery, zero markups.
            </p>

            <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 bg-stone-900/90 backdrop-blur-md border border-stone-700/80 px-2.5 py-1 sm:px-3 sm:py-2 rounded-xl text-[11px] sm:text-xs text-stone-200">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Delivering to:</span>
                <span className="font-mono font-semibold text-emerald-300">
                  {pincodeFilter ? `Pincode ${pincodeFilter}` : 'All Areas'}
                </span>
              </div>

              <button
                onClick={() => {
                  const el = document.getElementById('marketplace-catalog');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-3 py-1 sm:px-3.5 sm:py-2 bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white font-semibold rounded-xl text-xs transition-all shadow-sm"
              >
                Browse 50+ Produce Items
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Showcase Row (Horizontal Swipe on Mobile, Grid on Tablet/Desktop) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full min-w-0">
        <div className="flex items-center justify-between mb-2.5 sm:mb-3">
          <h2 className="text-sm sm:text-lg font-bold text-stone-900 font-display">
            Browse by Farm Category
          </h2>
          <span className="text-[11px] sm:text-xs text-stone-500 font-medium">
            {allActiveProducts.length} listings
          </span>
        </div>

        {/* Swipeable on mobile with snap, grid on desktop */}
        <div className="flex sm:grid sm:grid-cols-4 gap-2 sm:gap-4 overflow-x-auto pb-1.5 scrollbar-none snap-x w-full min-w-0">
          {categoryCardsData.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(isSelected ? null : cat.id)}
                className={`group relative overflow-hidden rounded-xl sm:rounded-2xl text-left border transition-all h-24 sm:h-32 flex flex-col justify-end p-2.5 sm:p-3.5 min-w-[135px] flex-1 sm:min-w-0 snap-start shrink-0 ${
                  isSelected
                    ? 'border-emerald-700 ring-2 ring-emerald-700 shadow-md'
                    : 'border-stone-200 hover:border-stone-300 shadow-xs'
                }`}
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/40 to-transparent" />

                <div className="relative z-10 text-white">
                  <div className="font-semibold text-xs sm:text-sm leading-snug drop-shadow-sm flex items-center justify-between">
                    <span>{cat.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-stone-300 drop-shadow-sm">
                    {cat.count} fresh items
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Catalog with Search, Filters & Product Grid */}
      <section id="marketplace-catalog" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        {/* Search & Filter Toolbar */}
        <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-stone-200 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search fresh vegetables, fruits, farm names..."
                className="w-full text-xs pl-8 pr-8 py-2 sm:py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:bg-white transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Sorting */}
            <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
              <div className="flex items-center gap-1 text-[11px] sm:text-xs text-stone-500">
                <ArrowUpDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Sort:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs py-1.5 sm:py-2 px-2 sm:px-2.5 bg-stone-50 border border-stone-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-stone-800 font-medium"
              >
                <option value="recommended">Featured Harvest</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="stock">Highest Stock</option>
              </select>
            </div>
          </div>

          {/* Secondary filter chips */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0 min-w-0 w-full sm:w-auto -mx-1 px-1 sm:mx-0 sm:px-0">
              <button
                onClick={() => setSelectedCategoryId(null)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategoryId === null
                    ? 'bg-emerald-800 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                All
              </button>

              {categories.map(c => (
                <button
                  key={c.category_id}
                  onClick={() => setSelectedCategoryId(selectedCategoryId === c.category_id ? null : c.category_id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    selectedCategoryId === c.category_id
                      ? 'bg-emerald-800 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {c.name}
                </button>
              ))}

              <label className="flex items-center gap-1 px-2.5 py-1 bg-stone-100 rounded-lg cursor-pointer text-stone-700 hover:bg-stone-200 text-xs select-none whitespace-nowrap shrink-0">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="accent-emerald-700 rounded w-3 h-3"
                />
                <span>In Stock</span>
              </label>
            </div>

            {/* Pincode indicator banner if active */}
            {pincodeFilter && (
              <div className="flex items-center gap-1 bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded-lg font-mono text-[10px] sm:text-[11px] shrink-0 self-start sm:self-auto">
                <MapPin className="w-3 h-3 text-emerald-700 shrink-0" />
                <span className="truncate max-w-[160px] sm:max-w-none">Delivering to {pincodeFilter}</span>
                <button
                  onClick={() => setPincodeFilter('')}
                  className="text-emerald-700 hover:text-rose-600 ml-1 font-bold p-0.5"
                  title="Remove pincode filter"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between text-xs text-stone-500 px-1">
          <span>
            Showing <strong className="font-semibold text-stone-900 font-mono">{filteredProducts.length}</strong> produce items
          </span>
          {pincodeFilter && (
            <span className="text-[11px] text-emerald-800 hidden sm:inline">
              Filtered for pincode <strong>{pincodeFilter}</strong>
            </span>
          )}
        </div>

        {/* Product Grid: 2 columns on mobile, 3-4 on desktop */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-12 text-center text-stone-500 space-y-3">
            <Sprout className="w-10 h-10 sm:w-12 sm:h-12 text-stone-300 mx-auto" />
            <h3 className="text-sm sm:text-base font-semibold text-stone-800">No Produce Matches Your Filters</h3>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              {pincodeFilter
                ? `No farmers currently deliver to pincode ${pincodeFilter}. Try clearing the pincode or search query.`
                : 'Try adjusting your search keywords or resetting category filters.'}
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategoryId(null);
                setPincodeFilter('');
                setOnlyInStock(false);
              }}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-emerald-800 text-white rounded-lg text-xs font-semibold hover:bg-emerald-900 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.product_id}
                product={product}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
