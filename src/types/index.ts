export type UserRole = "customer" | "provider" | "admin" | "CUSTOMER" | "PROVIDER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: string;
  status: "active" | "suspended";
  createdAt: string;
}

export type GearCategory =
  | "Cycling"
  | "Camping & Hiking"
  | "Water Sports"
  | "Winter Sports"
  | "Climbing"
  | "Fitness & Gym"
  | "Outdoor Games";

export interface GearItem {
  id: string;
  title: string;
  description: string;
  category: GearCategory;
  brand: string;
  pricePerDay: number;
  securityDeposit: number;
  images: string[];
  specs: { [key: string]: string };
  isAvailable: boolean;
  stock: number;
  condition: "New" | "Excellent" | "Good" | "Fair";
  location: string;
  providerId: string;
  providerName: string;
  providerRating: number;
  rating: number;
  reviewsCount: number;
  createdAt: string;
}

export type RentalOrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PAID"
  | "PICKED_UP"
  | "RETURNED"
  | "CANCELLED";

export interface RentalOrder {
  id: string;
  gearId: string;
  gearTitle: string;
  gearImage: string;
  gearCategory: GearCategory;
  customerId: string;
  customerName: string;
  customerEmail: string;
  providerId: string;
  providerName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  dailyRate: number;
  subtotal: number;
  securityDeposit: number;
  totalAmount: number;
  status: RentalOrderStatus;
  paymentStatus: "unpaid" | "paid" | "refunded";
  paymentId?: string;
  paymentMethod?: "stripe" | "sslcommerz";
  createdAt: string;
  reviewSubmitted?: boolean;
}

export interface Review {
  id: string;
  gearId: string;
  orderId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface PlatformStats {
  totalUsers: number;
  totalGear: number;
  activeRentals: number;
  totalRevenue: number;
  pendingOrders: number;
  providersCount: number;
  customersCount: number;
}
