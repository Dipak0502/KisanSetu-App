import React from 'react';
import { StorageService } from '../db/storage';
import { ShieldCheck, MapPin, Phone, Award, Sprout, ArrowRight } from 'lucide-react';

interface FarmersDirectoryProps {
  onSelectFarmer: (farmerId: number) => void;
}

export const FarmersDirectory: React.FC<FarmersDirectoryProps> = ({ onSelectFarmer }) => {
  const farmers = StorageService.getFarmers().filter(f => f.verification_status === 'approved');
  const products = StorageService.getProducts({ onlyActive: true });
  const users = StorageService.getUsers();

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
      <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[11px] sm:text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>100% Admin Verified Organic Producers</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display">
          Meet Your Local Farmers
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm mt-1.5 sm:mt-2 leading-relaxed">
          Know exactly who cultivates your food, where their fields are located, and how long they've practiced sustainable agriculture.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {farmers.map((farmer) => {
          const user = users.find(u => u.user_id === farmer.user_id);
          const farmProduce = products.filter(p => p.farmer_id === farmer.farmer_id);
          const deliveryAreas = StorageService.getDeliveryAreas(farmer.farmer_id);

          return (
            <div
              key={farmer.farmer_id}
              className="bg-white rounded-xl sm:rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-base font-bold text-stone-900 font-display">
                      {farmer.farm_name}
                    </h3>
                    <div className="text-xs font-medium text-emerald-800 mt-0.5">
                      Lead Grower: {user?.name || 'Farmer'}
                    </div>
                  </div>

                  <span className="shrink-0 p-1.5 bg-emerald-50 text-emerald-700 rounded-lg" title="Admin Verified">
                    <ShieldCheck className="w-5 h-5" />
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-stone-500 mt-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{farmer.location}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{farmer.phone}</span>
                  </div>

                  {farmer.experience_years && (
                    <div className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{farmer.experience_years} years farming experience</span>
                    </div>
                  )}
                </div>

                {farmer.bio && (
                  <p className="mt-3 text-xs text-stone-600 line-clamp-3 leading-relaxed bg-stone-50/70 p-2.5 rounded-xl border border-stone-100">
                    "{farmer.bio}"
                  </p>
                )}

                {/* Serviceable Pincodes */}
                <div className="mt-3 text-[11px] text-stone-500">
                  <span className="font-medium text-stone-700 block mb-1">Delivering to Pincodes:</span>
                  <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                    {deliveryAreas.map(a => (
                      <span key={a.area_id} className="bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded">
                        {a.pincode}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-500 font-mono font-medium">
                  {farmProduce.length} produce listings
                </span>

                <button
                  onClick={() => onSelectFarmer(farmer.farmer_id)}
                  className="px-3 py-1.5 bg-stone-900 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>View Produce</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
