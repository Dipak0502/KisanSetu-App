import { User, Farmer, DeliveryArea, Category, Product, Order, OrderItem, Payment, Delivery, Complaint } from '../types';
import { ASSET_IMAGES } from '../assets/images';

export const INITIAL_CATEGORIES: Category[] = [
  { category_id: 1, name: 'Vegetables', description: 'Freshly harvested organic vegetables straight from the field' },
  { category_id: 2, name: 'Fruits', description: 'Sun-ripened orchard fruits picked at peak sweetness' },
  { category_id: 3, name: 'Grains & Pulses', description: 'Naturally dried heirloom grains, millets, and unpolished lentils' },
  { category_id: 4, name: 'Dairy & Pantry', description: 'A2 raw cow milk, hand-churned ghee, natural sugarcane jaggery, cold-pressed oils' },
];

export const INITIAL_USERS: User[] = [
  // Admin
  { user_id: 1, name: 'Admin Officer', email: 'admin@farmertoconsumer.local', role: 'admin', is_active: true, created_at: '2026-01-10T08:00:00Z' },
  
  // Farmers
  { user_id: 2, name: 'Ramesh Patil', email: 'ramesh@farmertoconsumer.local', role: 'farmer', is_active: true, created_at: '2026-02-01T09:30:00Z' },
  { user_id: 3, name: 'Savitri Devi', email: 'savitri@greenroots.org', role: 'farmer', is_active: true, created_at: '2026-02-05T10:15:00Z' },
  { user_id: 4, name: 'Harishankar Rao', email: 'harishankar@malnadfarms.in', role: 'farmer', is_active: true, created_at: '2026-02-10T11:00:00Z' },
  { user_id: 5, name: 'Balvinder Singh', email: 'balvinder@punjabharvest.org', role: 'farmer', is_active: true, created_at: '2026-02-12T14:20:00Z' },
  { user_id: 6, name: 'Anandi Bai', email: 'anandi@sahyadrinatural.in', role: 'farmer', is_active: true, created_at: '2026-02-15T08:45:00Z' },
  { user_id: 7, name: 'Kishan Lal Meena', email: 'kishan@aravalliorganics.in', role: 'farmer', is_active: true, created_at: '2026-02-18T12:10:00Z' },
  { user_id: 8, name: 'Devendra Joshi', email: 'devendra@himachalorchards.in', role: 'farmer', is_active: true, created_at: '2026-02-20T16:00:00Z' },
  { user_id: 9, name: 'Lakshmi Narayanan', email: 'lakshmi@kaverivalley.in', role: 'farmer', is_active: true, created_at: '2026-02-22T09:15:00Z' },
  { user_id: 10, name: 'Mahadev Jadhav', email: 'mahadev@krishnabiofarms.in', role: 'farmer', is_active: true, created_at: '2026-02-25T13:40:00Z' },
  { user_id: 11, name: 'Shanta Murthy', email: 'shanta@mysurublooms.org', role: 'farmer', is_active: true, created_at: '2026-03-01T10:30:00Z' },
  { user_id: 12, name: 'Subhash Chandra Bose', email: 'subhash@gangeticfields.org', role: 'farmer', is_active: true, created_at: '2026-03-05T15:00:00Z' },
  // Pending Farmer for admin verification demo
  { user_id: 13, name: 'Gurpreet Singh', email: 'gurpreet@doaborganics.in', role: 'farmer', is_active: true, created_at: '2026-03-11T11:30:00Z' },

  // Consumers
  { user_id: 14, name: 'Priya Sharma', email: 'priya@gmail.com', role: 'consumer', is_active: true, created_at: '2026-03-01T14:00:00Z' },
  { user_id: 15, name: 'Rahul Verma', email: 'rahul.verma@example.com', role: 'consumer', is_active: true, created_at: '2026-03-02T16:30:00Z' },
  { user_id: 16, name: 'Ananya Sen', email: 'ananya.sen@example.com', role: 'consumer', is_active: true, created_at: '2026-03-03T18:00:00Z' },
];

export const INITIAL_FARMERS: Farmer[] = [
  { farmer_id: 1, user_id: 2, farm_name: 'Patil Organic Agro', location: 'Nashik Valley, Maharashtra', phone: '+91 98230 45120', verification_status: 'approved', bio: 'Specializing in chemical-free table grapes, vine tomatoes, and native leafy greens for 14 years.', experience_years: 14 },
  { farmer_id: 2, user_id: 3, farm_name: 'Green Roots Organics', location: 'Baramati, Pune, Maharashtra', phone: '+91 98221 88390', verification_status: 'approved', bio: 'Certified ZBNF natural farm growing ancient millets and seasonal gourds.', experience_years: 9 },
  { farmer_id: 3, user_id: 4, farm_name: 'Malnad Hillside Farms', location: 'Shimoga, Karnataka', phone: '+91 94481 22904', verification_status: 'approved', bio: 'Rain-fed coffee estates, raw spice plantations, and cold-pressed coconut oil.', experience_years: 18 },
  { farmer_id: 4, user_id: 5, farm_name: 'Punjab Pure Harvesters', location: 'Ludhiana, Punjab', phone: '+91 98140 76541', verification_status: 'approved', bio: 'Traditional heirloom Sharbati wheat, basmati paddy, and mustard greens.', experience_years: 22 },
  { farmer_id: 5, user_id: 6, farm_name: 'Sahyadri Natural Produce', location: 'Igatpuri, Western Ghats', phone: '+91 97654 32189', verification_status: 'approved', bio: 'Pristine mountain-water fed organic garlic, winter greens, green chillies, and farm root vegetables.', experience_years: 11 },
  { farmer_id: 6, user_id: 7, farm_name: 'Aravalli Organic Oasis', location: 'Alwar, Rajasthan', phone: '+91 94142 55670', verification_status: 'approved', bio: 'Desi chickpea, bajra, cold-pressed yellow mustard oil and solar-dried spices.', experience_years: 8 },
  { farmer_id: 7, user_id: 8, farm_name: 'Himachal Orchard Heritage', location: 'Kotgarh, Shimla, HP', phone: '+91 98160 33491', verification_status: 'approved', bio: 'High altitude crisp Royal Gala apples, wild apricots, and mountain walnuts.', experience_years: 25 },
  { farmer_id: 8, user_id: 9, farm_name: 'Kaveri Valley Dairy & Fields', location: 'Thanjavur, Tamil Nadu', phone: '+91 94433 11892', verification_status: 'approved', bio: 'Desi Kangayam breed cow A2 milk, curd, and organic Ponni raw rice.', experience_years: 16 },
  { farmer_id: 9, user_id: 10, farm_name: 'Krishna Bio Farms', location: 'Satara, Maharashtra', phone: '+91 98500 44923', verification_status: 'approved', bio: 'Rich black soil farm yielding sweet strawberries, carrots, and beetroot.', experience_years: 7 },
  { farmer_id: 10, user_id: 11, farm_name: 'Mysuru Blooms & Greens', location: 'Mandya, Karnataka', phone: '+91 98450 67123', verification_status: 'approved', bio: 'Direct garden fresh English vegetables, bell peppers, and fresh cow milk ghee.', experience_years: 12 },
  { farmer_id: 11, user_id: 12, farm_name: 'Gangetic Fertile Fields', location: 'Varanasi Rural, UP', phone: '+91 94500 23411', verification_status: 'approved', bio: 'Ancient Banarasi Langra mangoes, heirloom toor dal, and organic jaggery.', experience_years: 20 },
  // Pending verification
  { farmer_id: 12, user_id: 13, farm_name: 'Doaba Green Fields', location: 'Jalandhar, Punjab', phone: '+91 98720 99881', verification_status: 'pending', bio: 'New cooperative farm requesting verification to sell organic pulses and cold-pressed oils.', experience_years: 3 },
];

export const INITIAL_DELIVERY_AREAS: DeliveryArea[] = [
  // Ramesh Patil (Nashik & Mumbai / Pune hubs)
  { area_id: 1, farmer_id: 1, pincode: '400001' },
  { area_id: 2, farmer_id: 1, pincode: '400050' },
  { area_id: 3, farmer_id: 1, pincode: '400078' },
  { area_id: 4, farmer_id: 1, pincode: '422001' },
  { area_id: 5, farmer_id: 1, pincode: '411001' },

  // Savitri Devi (Pune / Baramati)
  { area_id: 6, farmer_id: 2, pincode: '411001' },
  { area_id: 7, farmer_id: 2, pincode: '411004' },
  { area_id: 8, farmer_id: 2, pincode: '411038' },
  { area_id: 9, farmer_id: 2, pincode: '400001' },

  // Harishankar Rao (Bangalore / Karnataka)
  { area_id: 10, farmer_id: 3, pincode: '560001' },
  { area_id: 11, farmer_id: 3, pincode: '560034' },
  { area_id: 12, farmer_id: 3, pincode: '560095' },

  // Balvinder Singh (Delhi NCR / Punjab)
  { area_id: 13, farmer_id: 4, pincode: '110001' },
  { area_id: 14, farmer_id: 4, pincode: '110020' },
  { area_id: 15, farmer_id: 4, pincode: '141001' },

  // Sahyadri Natural (Mumbai & Pune)
  { area_id: 16, farmer_id: 5, pincode: '400001' },
  { area_id: 17, farmer_id: 5, pincode: '400050' },
  { area_id: 18, farmer_id: 5, pincode: '411001' },

  // Aravalli (Delhi NCR & Jaipur)
  { area_id: 19, farmer_id: 6, pincode: '110001' },
  { area_id: 20, farmer_id: 6, pincode: '110020' },

  // Himachal Orchards (All metros via cold-pack)
  { area_id: 21, farmer_id: 7, pincode: '110001' },
  { area_id: 22, farmer_id: 7, pincode: '400001' },
  { area_id: 23, farmer_id: 7, pincode: '560001' },
  { area_id: 24, farmer_id: 7, pincode: '411001' },

  // Kaveri Valley (Bangalore & Chennai)
  { area_id: 25, farmer_id: 8, pincode: '560001' },
  { area_id: 26, farmer_id: 8, pincode: '560034' },
  { area_id: 27, farmer_id: 8, pincode: '600001' },

  // Krishna Bio (Pune & Mumbai)
  { area_id: 28, farmer_id: 9, pincode: '411001' },
  { area_id: 29, farmer_id: 9, pincode: '411004' },
  { area_id: 30, farmer_id: 9, pincode: '400050' },

  // Mysuru Blooms (Bangalore)
  { area_id: 31, farmer_id: 10, pincode: '560001' },
  { area_id: 32, farmer_id: 10, pincode: '560034' },
  { area_id: 33, farmer_id: 10, pincode: '560095' },

  // Gangetic Fields (Delhi NCR & UP)
  { area_id: 34, farmer_id: 11, pincode: '110001' },
  { area_id: 35, farmer_id: 11, pincode: '221001' },

  // Gurpreet (Pending farmer)
  { area_id: 36, farmer_id: 12, pincode: '141001' },
];

export const INITIAL_PRODUCTS: Product[] = [
  // Ramesh Patil (Farmer 1)
  { product_id: 1, farmer_id: 1, category_id: 1, name: 'Organic Vine-Ripe Country Tomatoes', description: 'Sun-ripened indigenous desi tomatoes with rich umami flavor, harvested at dawn.', price: 45, unit: 'kg', quantity: 60, image: ASSET_IMAGES.products.tomatoes, is_active: true, harvest_date: '2026-10-10' },
  { product_id: 2, farmer_id: 1, category_id: 1, name: 'Nashik Tender Spinach (Palak)', description: 'Crisp, pesticide-free green leaves, rich in iron, bundled with roots intact.', price: 30, unit: 'bunch', quantity: 45, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-10-11' },
  { product_id: 3, farmer_id: 1, category_id: 1, name: 'Organic Red Onions (Kanda)', description: 'Pungent, firm high-sulfur red onions with long shelf-life from Nashik soil.', price: 40, unit: 'kg', quantity: 120, image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-10-08' },
  { product_id: 4, farmer_id: 1, category_id: 1, name: 'Farm Fresh Green Bell Peppers (Shimla Mirch)', description: 'Crisp, crunchy, thick-walled capsicum grown under shade net without synthetics.', price: 65, unit: 'kg', quantity: 3, image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-10-11' }, // Low stock (<5)
  { product_id: 5, farmer_id: 1, category_id: 2, name: 'Naturally Ripened Alphonso Mangoes (Hapus)', description: 'Rich, golden fragrant Devgad Alphonso mangoes ripened in grass hay without carbide.', price: 240, unit: 'dozen', quantity: 35, image: ASSET_IMAGES.products.mangoes, is_active: true, harvest_date: '2026-10-09' },

  // Savitri Devi (Farmer 2)
  { product_id: 7, farmer_id: 2, category_id: 1, name: 'White Radish (Fresh Desi Mooli)', description: 'Crisp, mildly pungent white radishes with fresh leafy greens from the morning harvest.', price: 35, unit: 'kg', quantity: 40, image: ASSET_IMAGES.products.mooli, is_active: true, harvest_date: '2026-10-11' },
  { product_id: 8, farmer_id: 2, category_id: 3, name: 'Native Organic Foxtail Millet (Kangni)', description: 'Unpolished ancient whole grain rich in fiber and micronutrients.', price: 140, unit: 'kg', quantity: 80, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-09-20' },
  { product_id: 9, farmer_id: 2, category_id: 3, name: 'Pearl Millet (Desi Bajra Flour)', description: 'Stone-ground whole grain winter flour, rich in natural oils and iron.', price: 75, unit: 'kg', quantity: 4, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-09-25' }, // Low stock (<5)

  // Harishankar Rao (Farmer 3)
  { product_id: 10, farmer_id: 3, category_id: 4, name: 'Cold-Pressed Virgin Coconut Oil', description: 'Wood-churned (Marachekku) unrefined oil from organically tended coconut groves.', price: 340, unit: 'liter', quantity: 50, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-09-15' },
  { product_id: 11, farmer_id: 3, category_id: 2, name: 'Robusta Banana (Kela)', description: 'Naturally tree-ripened without calcium carbide, sweet and firm.', price: 60, unit: 'dozen', quantity: 70, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-10-10' },
  { product_id: 12, farmer_id: 3, category_id: 1, name: 'Fresh Malnad Curry Leaves', description: 'Aromatic, deep green native curry leaves freshly harvested from rain-fed shrubs.', price: 15, unit: 'bunch', quantity: 90, image: 'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-10-11' },
  { product_id: 13, farmer_id: 3, category_id: 4, name: 'Whole Black Malabar Peppercorns', description: 'Sun-dried pungent whole black peppercorns from shaded Malnad vines.', price: 190, unit: '250g', quantity: 45, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-08-30' },

  // Balvinder Singh (Farmer 4)
  { product_id: 14, farmer_id: 4, category_id: 3, name: 'Punjab Sharbati Whole Wheat Atta', description: '100% stone-milled golden grain whole wheat flour for soft, fragrant rotis.', price: 65, unit: 'kg', quantity: 150, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-09-01' },
  { product_id: 15, farmer_id: 4, category_id: 3, name: 'Aged Traditional Basmati Rice', description: 'Extra-long grain naturally aged 2 years, non-sticky and deeply fragrant.', price: 160, unit: 'kg', quantity: 95, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-08-15' },
  { product_id: 16, farmer_id: 4, category_id: 1, name: 'Fresh Winter Sarson Greens (Mustard Leaves)', description: 'Crisp, spicy Punjabi sarson leaves for authentic winter saag preparation.', price: 40, unit: 'kg', quantity: 30, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-10-11' },
  { product_id: 17, farmer_id: 4, category_id: 4, name: 'Cold-Pressed Kachi Ghani Mustard Oil', description: 'Pure pungent virgin mustard oil cold-pressed in wooden churners in Ludhiana.', price: 210, unit: 'liter', quantity: 60, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-09-10' },

  // Sahyadri Natural (Farmer 5)
  { product_id: 18, farmer_id: 5, category_id: 1, name: 'Desi Organic Garlic Bulbs (Lahsun)', description: 'Whole unbleached aromatic garlic bulbs with thin papery skins, high in allicin and natural pungency.', price: 80, unit: '500g', quantity: 40, image: ASSET_IMAGES.products.garlic, is_active: true, harvest_date: '2026-10-09' },
  { product_id: 20, farmer_id: 5, category_id: 1, name: 'Fresh Fresh Green Chillies (Lavangi)', description: 'Fiery, spicy small desi chillies bursting with fresh capsaicin kick.', price: 35, unit: '250g', quantity: 50, image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-10-11' },
  { product_id: 21, farmer_id: 5, category_id: 1, name: 'Tender Fenugreek Leaves (Fresh Methi)', description: 'Farm-fresh tender methi bunches, freshly cut for authentic winter saag and theplas.', price: 25, unit: 'bunch', quantity: 45, image: ASSET_IMAGES.products.methi, is_active: true, harvest_date: '2026-10-11' },

  // Aravalli Organic (Farmer 6)
  { product_id: 22, farmer_id: 6, category_id: 3, name: 'Desi Brown Chickpeas (Kala Chana)', description: 'Non-GMO small brown chickpeas, high in protein and natural dietary fiber.', price: 95, unit: 'kg', quantity: 70, image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-08-25' },
  { product_id: 23, farmer_id: 6, category_id: 3, name: 'Unpolished Moong Dal (Yellow Split)', description: 'Naturally split green gram without any artificial polish or color coating.', price: 145, unit: 'kg', quantity: 55, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-09-05' },
  { product_id: 24, farmer_id: 6, category_id: 1, name: 'Desert Grown Crisp Carrots (Gajar)', description: 'Sweet, deep orange crunchy carrots irrigated with sweet well-water.', price: 55, unit: 'kg', quantity: 45, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-10-10' },

  // Himachal Orchard Heritage (Farmer 7)
  { product_id: 25, farmer_id: 7, category_id: 2, name: 'Kotgarh Royal Delicious Apples', description: 'Hand-picked crisp mountain apples with balanced sweetness and floral scent.', price: 195, unit: 'kg', quantity: 65, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-09-28' },
  { product_id: 26, farmer_id: 7, category_id: 2, name: 'Himachal Golden Pears (Nashpati)', description: 'Juicy, soft textured organic mountain pears from high-altitude slopes.', price: 140, unit: 'kg', quantity: 30, image: 'https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-10-02' },
  { product_id: 27, farmer_id: 7, category_id: 4, name: 'Sun-Dried Wild Himalayan Apricots', description: 'Tart-sweet chewy wild apricots dried on clean stone roofs in Kotgarh.', price: 290, unit: '500g', quantity: 22, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-08-20' },
  { product_id: 28, farmer_id: 7, category_id: 4, name: 'Raw In-Shell Himalayan Walnuts (Akhrot)', description: 'Paper-shell new harvest walnuts with rich oil content and creamy crunch.', price: 420, unit: 'kg', quantity: 2, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-09-12' }, // Low stock (<5)

  // Kaveri Valley Dairy & Fields (Farmer 8)
  { product_id: 29, farmer_id: 8, category_id: 4, name: 'A2 Native Desi Cow Fresh Milk (Pasteurized)', description: 'Whole, unhomogenized A2 beta-casein milk from free-grazing Kangayam cows.', price: 85, unit: 'liter', quantity: 40, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-10-12' },
  { product_id: 30, farmer_id: 8, category_id: 4, name: 'Bilona Churned Desi Cow Ghee', description: 'Slow-cooked golden aromatic clarified butter made from whole curd fermentation.', price: 850, unit: '500ml', quantity: 35, image: ASSET_IMAGES.products.ghee, is_active: true, harvest_date: '2026-10-05' },
  { product_id: 31, farmer_id: 8, category_id: 3, name: 'Organic Traditional Ponni Raw Rice', description: 'Medium slender heritage grain grown with Kaveri river canal irrigation.', price: 92, unit: 'kg', quantity: 110, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-08-10' },

  // Krishna Bio Farms (Farmer 9)
  { product_id: 32, farmer_id: 9, category_id: 2, name: 'Mahabaleshwar Sweet Strawberries', description: 'Fragrant, deep ruby red organic strawberries packed in breathable punnets.', price: 160, unit: '500g', quantity: 25, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-10-11' },
  { product_id: 33, farmer_id: 9, category_id: 1, name: 'Organic Earth Beetroot', description: 'Sweet, earthy globes rich in natural dietary nitrates and antioxidants.', price: 48, unit: 'kg', quantity: 35, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-10-10' },
  { product_id: 34, farmer_id: 9, category_id: 1, name: 'Fresh Desi Cucumber (Kakdi)', description: 'Crisp, cooling thin-skinned Indian cucumbers with high water content.', price: 38, unit: 'kg', quantity: 45, image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-10-11' },
  { product_id: 35, farmer_id: 9, category_id: 1, name: 'Tender Green Coriander (Kothmir)', description: 'Root-washed aromatic native coriander sprigs harvested this morning.', price: 20, unit: 'bunch', quantity: 60, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-10-12' },

  // Mysuru Blooms & Greens (Farmer 10)
  { product_id: 36, farmer_id: 10, category_id: 1, name: 'Hydro-Organically Grown Green Lettuce', description: 'Crisp butterhead lettuce grown with organic neem cake inputs in Mandya.', price: 75, unit: 'bunch', quantity: 20, image: 'https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-10-11' },
  { product_id: 37, farmer_id: 10, category_id: 1, name: 'Fresh English Broccoli Heads', description: 'Tight, dark emerald green florets bursting with glucosinolates.', price: 90, unit: 'piece', quantity: 28, image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-10-10' },
  { product_id: 38, farmer_id: 10, category_id: 2, name: 'Organic Red Papaya', description: 'Sweet, buttery salmon-fleshed fruit naturally vine ripened.', price: 65, unit: 'piece', quantity: 22, image: 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-10-09' },
  { product_id: 39, farmer_id: 10, category_id: 1, name: 'Baby Potatoes (Chhote Aloo)', description: 'Washed new crop baby potatoes, fantastic for roast dum aloo.', price: 42, unit: 'kg', quantity: 75, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-10-08' },

  // Gangetic Fertile Fields (Farmer 11)
  { product_id: 40, farmer_id: 11, category_id: 3, name: 'Heritage Unpolished Toor Dal (Arhar)', description: 'Whole cleaned organic pigeon pea dal cooked quickly into fragrant creamy sambar or dal fry.', price: 165, unit: 'kg', quantity: 85, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-08-28' },
  { product_id: 41, farmer_id: 11, category_id: 4, name: 'Solid Organic Sugarcane Jaggery (Gud)', description: 'Chemical-free natural dark jaggery blocks made without clarifiers or soda.', price: 80, unit: 'kg', quantity: 60, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-09-14' },
  { product_id: 42, farmer_id: 11, category_id: 2, name: 'Kashmiri Sweet Pomegranates (Anar)', description: 'Ruby red arils bursting with sweet tart antioxidant-rich juice.', price: 180, unit: 'kg', quantity: 38, image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-10-06' },
  { product_id: 43, farmer_id: 11, category_id: 1, name: 'Crisp White Cauliflower (Phool Gobi)', description: 'Tightly packed clean white heads sheltered by lush protective leaves.', price: 48, unit: 'piece', quantity: 40, image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-10-10' },

  // Farm fresh replacements removing Baingan and Gawar as requested
  { product_id: 44, farmer_id: 1, category_id: 1, name: 'Fresh Green Cabbage (Band Gobi)', description: 'Tightly layered, crisp sweet cabbage heads fresh from Nashik morning harvest.', price: 35, unit: 'piece', quantity: 40, image: ASSET_IMAGES.products.cabbage, is_active: true, harvest_date: '2026-10-11' },
  { product_id: 45, farmer_id: 2, category_id: 1, name: 'Fresh Desi Country Lemons (Kagzi Nimbu)', description: 'Thin-skinned, highly aromatic juicy yellow lemons packed with fresh citrus zest.', price: 40, unit: '250g', quantity: 50, image: ASSET_IMAGES.products.lemons, is_active: true, harvest_date: '2026-10-11' },
  { product_id: 46, farmer_id: 3, category_id: 2, name: 'Nagpur Mandarin Oranges (Santra)', description: 'Juicy, easy-to-peel sweet citrus segments bursting with natural Vitamin C.', price: 90, unit: 'kg', quantity: 50, image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-10-08' },
  { product_id: 47, farmer_id: 4, category_id: 3, name: 'Roasted Desi Gram Flour (Sattu)', description: 'Traditional roasted black gram flour, instant protein superfood for drinks & rotis.', price: 110, unit: 'kg', quantity: 45, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-09-15' },
  { product_id: 48, farmer_id: 5, category_id: 1, name: 'Farm Harvest Sweet Potato (Shakarkand)', description: 'Naturally grown Indian sweet potatoes with dense, sweet golden-orange nutrient-rich flesh.', price: 50, unit: 'kg', quantity: 40, image: ASSET_IMAGES.products.sweetPotato, is_active: true, harvest_date: '2026-08-15' },
  { product_id: 49, farmer_id: 6, category_id: 1, name: 'Organic Green Peas (Fresh Matar)', description: 'Sweet plump peas hand-podded from tender seasonal pods.', price: 70, unit: '500g', quantity: 30, image: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-10-11' },
  { product_id: 50, farmer_id: 7, category_id: 2, name: 'Himachal Dried Apple Rings', description: 'Naturally air-dried apple slices with concentrated tart-sweet flavor, no sugar added.', price: 175, unit: '250g', quantity: 25, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-09-20' },
  { product_id: 51, farmer_id: 8, category_id: 3, name: 'Traditional Red Rice (Kavuni / Matta)', description: 'Anthocyanin-rich whole red grain rice, prized for nourishment and low glycemic load.', price: 120, unit: 'kg', quantity: 65, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-08-30' },
  { product_id: 52, farmer_id: 9, category_id: 1, name: 'Tender Farm Okra (Bhindi / Ladyfinger)', description: 'Crisp, tender organic green bhindi pods free from synthetic chemicals, freshly picked.', price: 46, unit: 'kg', quantity: 35, image: ASSET_IMAGES.products.okra, is_active: true, harvest_date: '2026-10-11' },
  { product_id: 53, farmer_id: 10, category_id: 1, name: 'Fresh Farm Mint Leaves (Pudina)', description: 'Deep aromatic menthol-rich Indian garden mint for fresh chutneys and teas.', price: 18, unit: 'bunch', quantity: 50, image: 'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-10-12' },
  { product_id: 54, farmer_id: 11, category_id: 2, name: 'Sweet Indian Guavas (Amrood)', description: 'Fragrant pink and white fleshed guavas with crisp bite and sweet pulp.', price: 65, unit: 'kg', quantity: 40, image: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=600&auto=format&fit=crop&q=80', is_active: true, harvest_date: '2026-10-09' },
  { product_id: 55, farmer_id: 10, category_id: 1, name: 'Fresh Sweet Golden Corn (Desi Bhutta)', description: 'Tender juicy sweet corn cobs in natural green husks, freshly harvested from Mandya fields.', price: 30, unit: 'piece', quantity: 55, image: ASSET_IMAGES.products.corn, is_active: true, harvest_date: '2026-10-12' }
];

export const INITIAL_ORDERS: Order[] = [
  {
    order_id: 101,
    consumer_id: 14, // Priya
    total_amount: 195,
    status: 'delivered',
    created_at: '2026-10-08T10:15:00Z',
    consumer_name: 'Priya Sharma',
    items: [
      { item_id: 1, order_id: 101, product_id: 1, farmer_id: 1, quantity: 2, unit_price: 45, product_name: 'Organic Vine-Ripe Country Tomatoes', unit: 'kg', farmer_name: 'Patil Organic Agro' },
      { item_id: 2, order_id: 101, product_id: 2, farmer_id: 1, quantity: 2, unit_price: 30, product_name: 'Nashik Tender Spinach (Palak)', unit: 'bunch', farmer_name: 'Patil Organic Agro' },
      { item_id: 3, order_id: 101, product_id: 3, farmer_id: 1, quantity: 1, unit_price: 45, product_name: 'Organic Red Onions (Kanda)', unit: 'kg', farmer_name: 'Patil Organic Agro' }
    ],
    payment: { payment_id: 1, order_id: 101, method: 'cod', payment_status: 'paid' },
    delivery: { delivery_id: 1, order_id: 101, address: 'Flat 402, Green Meadows, Bandra West', pincode: '400050', delivery_status: 'delivered' }
  },
  {
    order_id: 102,
    consumer_id: 14, // Priya
    total_amount: 320,
    status: 'packed',
    created_at: '2026-10-11T14:30:00Z',
    consumer_name: 'Priya Sharma',
    items: [
      { item_id: 4, order_id: 102, product_id: 5, farmer_id: 1, quantity: 2, unit_price: 110, product_name: 'Naturally Ripened Alphonso Mangoes (Hapus)', unit: 'dozen', farmer_name: 'Patil Organic Agro' },
      { item_id: 5, order_id: 102, product_id: 7, farmer_id: 2, quantity: 2, unit_price: 35, product_name: 'White Radish (Fresh Desi Mooli)', unit: 'kg', farmer_name: 'Green Roots Organics' },
      { item_id: 6, order_id: 102, product_id: 2, farmer_id: 1, quantity: 1, unit_price: 30, product_name: 'Nashik Tender Spinach (Palak)', unit: 'bunch', farmer_name: 'Patil Organic Agro' }
    ],
    payment: { payment_id: 2, order_id: 102, method: 'cod', payment_status: 'pending' },
    delivery: { delivery_id: 2, order_id: 102, address: 'Flat 402, Green Meadows, Bandra West', pincode: '400050', delivery_status: 'pending' }
  },
  {
    order_id: 103,
    consumer_id: 15, // Rahul
    total_amount: 470,
    status: 'placed',
    created_at: '2026-10-12T05:20:00Z',
    consumer_name: 'Rahul Verma',
    items: [
      { item_id: 7, order_id: 103, product_id: 1, farmer_id: 1, quantity: 3, unit_price: 45, product_name: 'Organic Vine-Ripe Country Tomatoes', unit: 'kg', farmer_name: 'Patil Organic Agro' },
      { item_id: 8, order_id: 103, product_id: 10, farmer_id: 3, quantity: 1, unit_price: 340, product_name: 'Cold-Pressed Virgin Coconut Oil', unit: 'liter', farmer_name: 'Malnad Hillside Farms' }
    ],
    payment: { payment_id: 3, order_id: 103, method: 'cod', payment_status: 'pending' },
    delivery: { delivery_id: 3, order_id: 103, address: 'Plot 12, Koramangala 4th Block', pincode: '560034', delivery_status: 'pending' }
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    complaint_id: 1,
    user_id: 15,
    order_id: 101,
    message: 'One bunch of spinach had slightly bruised stems due to transit vibration. Would request better padded crates next time.',
    status: 'resolved',
    admin_notes: 'Reviewed with Farmer Ramesh. Farmer has adopted breathable perforated crates for leafy greens. Customer notified.',
    created_at: '2026-10-09T11:00:00Z',
    user_name: 'Rahul Verma',
    user_email: 'rahul.verma@example.com'
  }
];
