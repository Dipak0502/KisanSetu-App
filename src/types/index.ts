export type UserRole = 'farmer' | 'consumer' | 'admin';

export type FarmerVerificationStatus = 'pending' | 'approved' | 'rejected';

export type OrderStatus = 'placed' | 'confirmed' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled';

export type PaymentMethod = 'cod' | 'online';
export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type DeliveryStatus = 'pending' | 'dispatched' | 'delivered';
export type ComplaintStatus = 'open' | 'resolved';

export interface User {
  user_id: number;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface Farmer {
  farmer_id: number;
  user_id: number;
  farm_name: string;
  location: string;
  phone: string;
  verification_status: FarmerVerificationStatus;
  bio?: string;
  experience_years?: number;
}

export interface DeliveryArea {
  area_id: number;
  farmer_id: number;
  pincode: string;
}

export interface Category {
  category_id: number;
  name: string;
  description?: string;
  icon?: string;
}

export interface Product {
  product_id: number;
  farmer_id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  unit: string; // 'kg', 'dozen', 'piece', '500g', 'bunch', 'liter'
  quantity: number; // available stock
  image: string;
  is_active: boolean;
  harvest_date?: string;
  farmer?: {
    farmer_id: number;
    farm_name: string;
    location: string;
    phone: string;
    name: string;
    verification_status: FarmerVerificationStatus;
  };
}

export interface OrderItem {
  item_id: number;
  order_id: number;
  product_id: number;
  farmer_id: number;
  quantity: number;
  unit_price: number; // price snapshot at purchase
  product_name?: string;
  unit?: string;
  farmer_name?: string;
}

export interface Payment {
  payment_id: number;
  order_id: number;
  method: PaymentMethod;
  payment_status: PaymentStatus;
}

export interface Delivery {
  delivery_id: number;
  order_id: number;
  address: string;
  pincode: string;
  delivery_status: DeliveryStatus;
}

export interface Order {
  order_id: number;
  consumer_id: number;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  items?: OrderItem[];
  payment?: Payment;
  delivery?: Delivery;
  consumer_name?: string;
}

export interface Complaint {
  complaint_id: number;
  user_id: number;
  order_id?: number | null;
  message: string;
  status: ComplaintStatus;
  admin_notes?: string;
  created_at: string;
  user_name?: string;
  user_email?: string;
}

export interface CartItem {
  product_id: number;
  product: Product;
  quantity: number;
}
