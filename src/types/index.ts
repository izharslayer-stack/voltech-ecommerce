// ─── Product ──────────────────────────────────────────────────────────────────
export type ProductStatus = 'active' | 'draft';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  longDescription?: string;
  image: string;
  images?: string[];
  stock: number;
  sku?: string;
  rating?: number;
  featured: boolean;
  status: ProductStatus;
  createdAt: string;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
export interface CartItem {
  product: Product;
  quantity: number;
}

// ─── Order ────────────────────────────────────────────────────────────────────
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered';

export interface OrderCustomer {
  name: string;
  email: string;
  phone?: string;
}

export interface OrderShipping {
  address: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: OrderCustomer;
  shipping: OrderShipping;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

// ─── Admin Auth ───────────────────────────────────────────────────────────────
export interface AdminUser {
  email: string;
  name: string;
  avatar?: string;
}

// ─── Customer Auth ────────────────────────────────────────────────────────────
export interface CustomerUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

// ─── Checkout Form ────────────────────────────────────────────────────────────
export interface CheckoutForm {
  email: string;
  phone: string;
  fullName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  cardNumber: string;
  cardExpiry: string;
  cardCVC: string;
  cardName: string;
}

// ─── Toast ────────────────────────────────────────────────────────────────────
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

// ─── Filter / Sort ────────────────────────────────────────────────────────────
export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest';

export interface ProductFilters {
  category: string;
  sort: SortOption;
  search: string;
}
