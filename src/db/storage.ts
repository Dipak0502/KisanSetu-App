import {
  User,
  Farmer,
  DeliveryArea,
  Category,
  Product,
  Order,
  OrderItem,
  Complaint,
  OrderStatus,
  CartItem
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_FARMERS,
  INITIAL_DELIVERY_AREAS,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_COMPLAINTS
} from './initialData';

const STORAGE_KEY = 'kisansetu_db_v5';

export interface AppDatabase {
  users: User[];
  farmers: Farmer[];
  delivery_areas: DeliveryArea[];
  categories: Category[];
  products: Product[];
  orders: Order[];
  complaints: Complaint[];
}

const FORBIDDEN_REGEX = /baingan|gawar|turai|ridge gourd|cluster bean|bottle gourd|lemongrass|turmeric|ginger|honey/i;

function loadDatabase(): AppDatabase {
  // Clear any outdated schema versions
  try {
    ['kisansetu_db', 'kisansetu_db_v2', 'kisansetu_db_v3', 'kisansetu_db_v4'].forEach(k => localStorage.removeItem(k));
  } catch {
    // ignore
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.products) && parsed.products.length >= 40) {
        // Filter out any lingering removed items if previously cached
        const sanitizedProducts = parsed.products.filter(
          (p: Product) => !FORBIDDEN_REGEX.test(p.name)
        );
        parsed.products = sanitizedProducts;
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read from localStorage, using initial dataset', err);
  }

  const initial: AppDatabase = {
    users: [...INITIAL_USERS],
    farmers: [...INITIAL_FARMERS],
    delivery_areas: [...INITIAL_DELIVERY_AREAS],
    categories: [...INITIAL_CATEGORIES],
    products: [...INITIAL_PRODUCTS],
    orders: [...INITIAL_ORDERS],
    complaints: [...INITIAL_COMPLAINTS],
  };

  saveDatabase(initial);
  return initial;
}

function saveDatabase(db: AppDatabase) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (err) {
    console.warn('Failed to persist to localStorage', err);
  }
}

let db = loadDatabase();

export const StorageService = {
  resetToInitial(): AppDatabase {
    db = {
      users: [...INITIAL_USERS],
      farmers: [...INITIAL_FARMERS],
      delivery_areas: [...INITIAL_DELIVERY_AREAS],
      categories: [...INITIAL_CATEGORIES],
      products: [...INITIAL_PRODUCTS],
      orders: [...INITIAL_ORDERS],
      complaints: [...INITIAL_COMPLAINTS],
    };
    saveDatabase(db);
    return db;
  },

  getDb(): AppDatabase {
    return db;
  },

  // USERS & AUTH
  getUsers(): User[] {
    return [...db.users];
  },

  getUserById(userId: number): User | undefined {
    return db.users.find(u => u.user_id === userId);
  },

  getUserByEmail(email: string): User | undefined {
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  registerUser(params: {
    name: string;
    email: string;
    role: 'consumer' | 'farmer';
    farm_name?: string;
    location?: string;
    phone?: string;
    pincodes?: string[];
  }): { user: User; farmer?: Farmer } {
    if (this.getUserByEmail(params.email)) {
      throw new Error(`An account with email ${params.email} already exists.`);
    }

    const nextUserId = Math.max(...db.users.map(u => u.user_id), 0) + 1;
    const newUser: User = {
      user_id: nextUserId,
      name: params.name.trim(),
      email: params.email.trim().toLowerCase(),
      role: params.role,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    db.users.push(newUser);

    let newFarmer: Farmer | undefined;
    if (params.role === 'farmer') {
      const nextFarmerId = Math.max(...db.farmers.map(f => f.farmer_id), 0) + 1;
      newFarmer = {
        farmer_id: nextFarmerId,
        user_id: nextUserId,
        farm_name: params.farm_name?.trim() || `${params.name}'s Farm`,
        location: params.location?.trim() || 'Local Area',
        phone: params.phone?.trim() || '+91 98000 00000',
        verification_status: 'pending', // FR-A3: Stays pending until admin verifies
        bio: 'Newly registered farmer waiting for marketplace review.',
        experience_years: 1,
      };
      db.farmers.push(newFarmer);

      // add delivery pincodes
      const pincodes = params.pincodes && params.pincodes.length > 0 ? params.pincodes : ['400001'];
      pincodes.forEach(pin => {
        const nextAreaId = Math.max(...db.delivery_areas.map(a => a.area_id), 0) + 1;
        db.delivery_areas.push({
          area_id: nextAreaId,
          farmer_id: nextFarmerId,
          pincode: pin.trim(),
        });
      });
    }

    saveDatabase(db);
    return { user: newUser, farmer: newFarmer };
  },

  setUserActive(userId: number, isActive: boolean): User {
    const user = db.users.find(u => u.user_id === userId);
    if (!user) throw new Error('User not found');
    user.is_active = isActive;
    saveDatabase(db);
    return user;
  },

  // FARMERS
  getFarmers(): Farmer[] {
    return [...db.farmers];
  },

  getFarmerByUserId(userId: number): Farmer | undefined {
    return db.farmers.find(f => f.user_id === userId);
  },

  getFarmerById(farmerId: number): Farmer | undefined {
    return db.farmers.find(f => f.farmer_id === farmerId);
  },

  updateFarmerVerification(farmerId: number, status: 'approved' | 'rejected'): Farmer {
    const farmer = db.farmers.find(f => f.farmer_id === farmerId);
    if (!farmer) throw new Error('Farmer record not found');
    farmer.verification_status = status;
    saveDatabase(db);
    return farmer;
  },

  // DELIVERY AREAS
  getDeliveryAreas(farmerId?: number): DeliveryArea[] {
    if (farmerId !== undefined) {
      return db.delivery_areas.filter(a => a.farmer_id === farmerId);
    }
    return [...db.delivery_areas];
  },

  addDeliveryPincode(farmerId: number, pincode: string): DeliveryArea {
    const cleanPin = pincode.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      throw new Error('Please enter a valid 6-digit postal pincode.');
    }
    const exists = db.delivery_areas.some(a => a.farmer_id === farmerId && a.pincode === cleanPin);
    if (exists) throw new Error('Pincode already exists in delivery area.');
    const nextAreaId = Math.max(...db.delivery_areas.map(a => a.area_id), 0) + 1;
    const newArea: DeliveryArea = {
      area_id: nextAreaId,
      farmer_id: farmerId,
      pincode: cleanPin,
    };
    db.delivery_areas.push(newArea);
    saveDatabase(db);
    return newArea;
  },

  removeDeliveryPincode(areaId: number, farmerId: number) {
    db.delivery_areas = db.delivery_areas.filter(a => !(a.area_id === areaId && a.farmer_id === farmerId));
    saveDatabase(db);
  },

  // CATEGORIES
  getCategories(): Category[] {
    return [...db.categories];
  },

  // PRODUCTS
  getProducts(options?: {
    category_id?: number;
    search?: string;
    pincode?: string;
    onlyActive?: boolean;
    farmer_id?: number;
  }): Product[] {
    let result = db.products.map(p => {
      const farmer = db.farmers.find(f => f.farmer_id === p.farmer_id);
      const user = farmer ? db.users.find(u => u.user_id === farmer.user_id) : undefined;
      return {
        ...p,
        farmer: farmer ? {
          farmer_id: farmer.farmer_id,
          farm_name: farmer.farm_name,
          location: farmer.location,
          phone: farmer.phone,
          name: user?.name || 'Farmer',
          verification_status: farmer.verification_status,
        } : undefined
      };
    });

    if (options?.onlyActive !== false) {
      // only active products and only from approved farmers
      result = result.filter(p => p.is_active && p.farmer?.verification_status === 'approved');
    }

    if (options?.farmer_id !== undefined) {
      result = result.filter(p => p.farmer_id === options.farmer_id);
    }

    if (options?.category_id) {
      result = result.filter(p => p.category_id === options.category_id);
    }

    if (options?.search) {
      const query = options.search.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.farmer?.farm_name.toLowerCase().includes(query) ||
        p.farmer?.location.toLowerCase().includes(query)
      );
    }

    if (options?.pincode) {
      const pin = options.pincode.trim();
      if (pin) {
        const eligibleFarmerIds = new Set(
          db.delivery_areas.filter(a => a.pincode === pin).map(a => a.farmer_id)
        );
        result = result.filter(p => eligibleFarmerIds.has(p.farmer_id));
      }
    }

    return result;
  },

  getProductById(productId: number): Product | undefined {
    const p = db.products.find(item => item.product_id === productId);
    if (!p) return undefined;
    const farmer = db.farmers.find(f => f.farmer_id === p.farmer_id);
    const user = farmer ? db.users.find(u => u.user_id === farmer.user_id) : undefined;
    return {
      ...p,
      farmer: farmer ? {
        farmer_id: farmer.farmer_id,
        farm_name: farmer.farm_name,
        location: farmer.location,
        phone: farmer.phone,
        name: user?.name || 'Farmer',
        verification_status: farmer.verification_status,
      } : undefined
    };
  },

  addProduct(farmerId: number, data: {
    category_id: number;
    name: string;
    description: string;
    price: number;
    unit: string;
    quantity: number;
    image?: string;
  }): Product {
    const farmer = db.farmers.find(f => f.farmer_id === farmerId);
    if (!farmer) throw new Error('Farmer not found');
    if (farmer.verification_status !== 'approved') {
      throw new Error('Your farmer account is pending verification. Only approved farmers can add products.');
    }

    if (data.price <= 0) throw new Error('Price must be greater than 0.');
    if (data.quantity < 0) throw new Error('Quantity cannot be negative.');

    const nextProductId = Math.max(...db.products.map(p => p.product_id), 0) + 1;
    const newProduct: Product = {
      product_id: nextProductId,
      farmer_id: farmerId,
      category_id: data.category_id,
      name: data.name.trim(),
      description: data.description.trim(),
      price: Number(data.price),
      unit: data.unit.trim(),
      quantity: Number(data.quantity),
      image: data.image?.trim() || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
      is_active: true,
      harvest_date: new Date().toISOString().split('T')[0],
    };

    db.products.push(newProduct);
    saveDatabase(db);
    return newProduct;
  },

  updateProduct(productId: number, farmerId: number | null, updates: {
    price?: number;
    quantity?: number;
    is_active?: boolean;
    name?: string;
    description?: string;
    category_id?: number;
    unit?: string;
    image?: string;
  }): Product {
    const prod = db.products.find(p => p.product_id === productId);
    if (!prod) throw new Error('Product not found');

    // If farmerId is provided (not admin), enforce farmer ownership
    if (farmerId !== null && prod.farmer_id !== farmerId) {
      throw new Error('Unauthorized: You can only edit your own products.');
    }

    if (updates.price !== undefined) {
      if (updates.price <= 0) throw new Error('Price must be greater than 0');
      prod.price = Number(updates.price);
    }
    if (updates.quantity !== undefined) {
      if (updates.quantity < 0) throw new Error('Quantity cannot be negative');
      prod.quantity = Number(updates.quantity);
    }
    if (updates.is_active !== undefined) {
      prod.is_active = updates.is_active;
    }
    if (updates.name !== undefined) prod.name = updates.name.trim();
    if (updates.description !== undefined) prod.description = updates.description.trim();
    if (updates.unit !== undefined) prod.unit = updates.unit.trim();
    if (updates.category_id !== undefined) prod.category_id = updates.category_id;
    if (updates.image !== undefined) prod.image = updates.image.trim();

    saveDatabase(db);
    return prod;
  },

  deleteProduct(productId: number, farmerId: number | null) {
    const prod = db.products.find(p => p.product_id === productId);
    if (!prod) throw new Error('Product not found');
    if (farmerId !== null && prod.farmer_id !== farmerId) {
      throw new Error('Unauthorized: You can only delete your own products.');
    }
    db.products = db.products.filter(p => p.product_id !== productId);
    saveDatabase(db);
  },

  // TRANSACTIONAL ORDER PLACEMENT (FR-O1)
  // Atomic stock check and decrement
  placeOrder(params: {
    consumer_id: number;
    items: CartItem[];
    address: string;
    pincode: string;
    payment_method: 'cod' | 'online';
  }): Order {
    if (!params.items || params.items.length === 0) {
      throw new Error('Your cart is empty.');
    }

    const consumer = db.users.find(u => u.user_id === params.consumer_id);
    if (!consumer) throw new Error('User session not found.');

    // 1. Transaction Check Phase (Row lock simulation)
    // Check all items have sufficient quantity
    for (const item of params.items) {
      const prod = db.products.find(p => p.product_id === item.product_id);
      if (!prod) {
        throw new Error(`Product ${item.product.name} is no longer available.`);
      }
      if (!prod.is_active) {
        throw new Error(`Product ${prod.name} is currently inactive.`);
      }
      if (prod.quantity < item.quantity) {
        throw new Error(`Insufficient stock for "${prod.name}". Available: ${prod.quantity} ${prod.unit}, Requested: ${item.quantity} ${prod.unit}.`);
      }
    }

    // 2. Transaction Execution Phase: Decrement stock
    for (const item of params.items) {
      const prod = db.products.find(p => p.product_id === item.product_id)!;
      prod.quantity -= item.quantity;
    }

    // 3. Create Order
    const nextOrderId = Math.max(...db.orders.map(o => o.order_id), 100) + 1;
    const total_amount = params.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    const orderItems: OrderItem[] = params.items.map((item, idx) => ({
      item_id: nextOrderId * 10 + idx,
      order_id: nextOrderId,
      product_id: item.product_id,
      farmer_id: item.product.farmer_id,
      quantity: item.quantity,
      unit_price: item.product.price, // price snapshot at purchase time
      product_name: item.product.name,
      unit: item.product.unit,
      farmer_name: item.product.farmer?.farm_name || 'Direct Farm',
    }));

    const newOrder: Order = {
      order_id: nextOrderId,
      consumer_id: params.consumer_id,
      total_amount,
      status: 'placed',
      created_at: new Date().toISOString(),
      consumer_name: consumer.name,
      items: orderItems,
      payment: {
        payment_id: nextOrderId,
        order_id: nextOrderId,
        method: params.payment_method,
        payment_status: 'pending',
      },
      delivery: {
        delivery_id: nextOrderId,
        order_id: nextOrderId,
        address: params.address.trim(),
        pincode: params.pincode.trim(),
        delivery_status: 'pending',
      },
    };

    db.orders.unshift(newOrder);
    saveDatabase(db);
    return newOrder;
  },

  // TRANSACTIONAL CANCEL ORDER (FR-O4)
  // Consumer may cancel while status is 'placed'. Restores stock atomically.
  cancelOrder(orderId: number, userId: number, isFarmerOrAdmin = false): Order {
    const order = db.orders.find(o => o.order_id === orderId);
    if (!order) throw new Error('Order not found.');

    if (!isFarmerOrAdmin && order.consumer_id !== userId) {
      throw new Error('Unauthorized to cancel this order.');
    }

    if (order.status !== 'placed' && !isFarmerOrAdmin) {
      throw new Error(`Cannot cancel order in "${order.status}" status. Only orders with status "placed" can be cancelled.`);
    }

    if (order.status === 'delivered') {
      throw new Error('Cannot cancel an order that has already been delivered.');
    }

    if (order.status === 'cancelled') {
      throw new Error('Order is already cancelled.');
    }

    // Atomic Stock Restoration
    if (order.items && order.items.length > 0) {
      for (const item of order.items) {
        const prod = db.products.find(p => p.product_id === item.product_id);
        if (prod) {
          prod.quantity += item.quantity;
        }
      }
    }

    order.status = 'cancelled';
    if (order.delivery) {
      order.delivery.delivery_status = 'pending';
    }
    if (order.payment) {
      order.payment.payment_status = 'failed';
    }

    saveDatabase(db);
    return order;
  },

  // ORDER STATUS PROGRESSION (FR-O3, Section 5 Key Logic)
  // Allowed: placed -> confirmed -> packed -> out_for_delivery -> delivered
  // placed/confirmed -> cancelled
  updateOrderStatus(orderId: number, farmerId: number | null, newStatus: OrderStatus): Order {
    const order = db.orders.find(o => o.order_id === orderId);
    if (!order) throw new Error('Order not found.');

    // If farmer is making update, verify farmer has items in this order
    if (farmerId !== null) {
      const hasFarmerItems = order.items?.some(i => i.farmer_id === farmerId);
      if (!hasFarmerItems) {
        throw new Error('Unauthorized: This order does not contain products from your farm.');
      }
    }

    const current = order.status;
    const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
      placed: ['confirmed', 'cancelled'],
      confirmed: ['packed', 'cancelled'],
      packed: ['out_for_delivery'],
      out_for_delivery: ['delivered'],
      delivered: [],
      cancelled: [],
    };

    if (!allowedTransitions[current].includes(newStatus)) {
      throw new Error(`Invalid status transition from "${current}" to "${newStatus}". Must follow sequential workflow.`);
    }

    // If cancelling via farmer/admin, restore stock
    if (newStatus === 'cancelled') {
      if (order.items) {
        for (const item of order.items) {
          const prod = db.products.find(p => p.product_id === item.product_id);
          if (prod) prod.quantity += item.quantity;
        }
      }
      if (order.payment) order.payment.payment_status = 'failed';
    }

    if (newStatus === 'delivered') {
      if (order.delivery) order.delivery.delivery_status = 'delivered';
      if (order.payment && order.payment.method === 'cod') {
        order.payment.payment_status = 'paid';
      }
    } else if (newStatus === 'out_for_delivery') {
      if (order.delivery) order.delivery.delivery_status = 'dispatched';
    }

    order.status = newStatus;
    saveDatabase(db);
    return order;
  },

  getOrders(options?: {
    consumer_id?: number;
    farmer_id?: number;
  }): Order[] {
    let list = [...db.orders];

    if (options?.consumer_id) {
      list = list.filter(o => o.consumer_id === options.consumer_id);
    }

    if (options?.farmer_id) {
      list = list.filter(o => o.items?.some(item => item.farmer_id === options.farmer_id));
    }

    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  getOrderById(orderId: number): Order | undefined {
    return db.orders.find(o => o.order_id === orderId);
  },

  // COMPLAINTS (FR-AD3)
  getComplaints(): Complaint[] {
    return [...db.complaints].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  addComplaint(params: {
    user_id: number;
    order_id?: number | null;
    message: string;
  }): Complaint {
    const user = db.users.find(u => u.user_id === params.user_id);
    const nextId = Math.max(...db.complaints.map(c => c.complaint_id), 0) + 1;
    const complaint: Complaint = {
      complaint_id: nextId,
      user_id: params.user_id,
      order_id: params.order_id || null,
      message: params.message.trim(),
      status: 'open',
      created_at: new Date().toISOString(),
      user_name: user?.name || 'User',
      user_email: user?.email || '',
    };
    db.complaints.unshift(complaint);
    saveDatabase(db);
    return complaint;
  },

  resolveComplaint(complaintId: number, adminNotes: string): Complaint {
    const complaint = db.complaints.find(c => c.complaint_id === complaintId);
    if (!complaint) throw new Error('Complaint not found.');
    complaint.status = 'resolved';
    complaint.admin_notes = adminNotes.trim();
    saveDatabase(db);
    return complaint;
  }
};
