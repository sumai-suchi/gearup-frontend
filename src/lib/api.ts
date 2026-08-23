import {
  GearItem,
  RentalOrder,
  RentalOrderStatus,
  User,
  UserRole,
  Review,
  PlatformStats,
  GearCategory,
} from "@/types";
import { INITIAL_USERS, INITIAL_GEAR, INITIAL_ORDERS, INITIAL_REVIEWS } from "./mockData";

const rawApiBase = process.env.NEXT_PUBLIC_API_URL;
const API_BASE = rawApiBase
  ? rawApiBase.startsWith("http://") || rawApiBase.startsWith("https://")
    ? rawApiBase.replace(/\/+$/, "")
    : `https://${rawApiBase.replace(/\/+$/, "")}`
  : undefined;

// Local persistent mock store keys
const STORAGE_KEYS = {
  USERS: "gearup_users",
  GEAR: "gearup_gear",
  ORDERS: "gearup_orders",
  REVIEWS: "gearup_reviews",
  AUTH_TOKEN: "gearup_token",
  CURRENT_USER: "gearup_current_user",
};

// In-memory fallback
let memUsers = [...INITIAL_USERS];
let memGear = [...INITIAL_GEAR];
let memOrders = [...INITIAL_ORDERS];
let memReviews = [...INITIAL_REVIEWS];

function getStored<T>(key: string, defaultVal: T[]): T[] {
  if (typeof window === "undefined") return defaultVal;
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(item);
  } catch {
    return defaultVal;
  }
}

function setStored<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error("Storage error:", err);
  }
}

function decodeJwtToken(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// Simulated network delay for realistic UI loading states & skeletons
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  auth: {
    async login(email: string, password?: string): Promise<{ user: User; token: string }> {
      await delay(300);
      if (API_BASE) {
        try {
          const res = await fetch(`${API_BASE}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password }),
          });
          if (res.ok) {
            const body = await res.json();
            const token = body.data?.accessToken || body.accessToken || body.data?.token || body.token || `jwt_${Date.now()}`;
            const refreshToken = body.data?.refreshToken || body.refreshToken || "";
            const decoded = decodeJwtToken(token) || {};
            const userObj = body.data?.user || body.user || decoded || body.data || body;
            
            const normalizedUser: User = {
              id: userObj.id || userObj._id || userObj.userId || decoded.id || decoded.userId || `usr-${Date.now()}`,
              name: userObj.name || userObj.userName || decoded.name || email.split("@")[0],
              email: userObj.email || decoded.email || email,
              role: (userObj.role || decoded.role || "customer").toLowerCase() as UserRole,
              avatar: userObj.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
              status: userObj.status || "active",
              createdAt: userObj.createdAt || new Date().toISOString(),
            };

            if (typeof window !== "undefined") {
              localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(normalizedUser));
              localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
              if (refreshToken) localStorage.setItem("gearup_refresh_token", refreshToken);
              document.cookie = `gearup_role=${normalizedUser.role}; path=/; max-age=86400`;
              document.cookie = `gearup_token=${token}; path=/; max-age=86400`;
              document.cookie = `accessToken=${token}; path=/; max-age=86400`;
            }

            return { user: normalizedUser, token };
          }
        } catch (e) {
          console.warn("Backend API unavailable, falling back to mock engine", e);
        }
      }

      const users = getStored<User>(STORAGE_KEYS.USERS, memUsers);
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        throw new Error("Invalid email or password. Please check your credentials.");
      }

      if (user.status === "suspended") {
        throw new Error("Your account has been suspended by platform moderation.");
      }

      const token = `jwt_mock_${user.id}_${Date.now()}`;
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        document.cookie = `gearup_role=${user.role}; path=/; max-age=86400`;
        document.cookie = `gearup_token=${token}; path=/; max-age=86400`;
      }

      return { user, token };
    },

    async register(data: {
      name: string;
      email: string;
      role: "customer" | "provider" | "CUSTOMER" | "PROVIDER";
      password?: string;
    }): Promise<{ user: User; token: string }> {
      await delay(300);
      if (API_BASE) {
        try {
          const res = await fetch(`${API_BASE}/api/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              name: data.name,
              email: data.email,
              role: data.role,
              password: data.password,
            }),
          });
          if (res.ok) {
            const body = await res.json();
            const token = body.data?.accessToken || body.accessToken || body.data?.token || body.token || `jwt_${Date.now()}`;
            const refreshToken = body.data?.refreshToken || body.refreshToken || "";
            const decoded = decodeJwtToken(token) || {};
            const userObj = body.data?.user || body.user || decoded || body.data || body;
            
            const normalizedUser: User = {
              id: userObj.id || userObj._id || userObj.userId || decoded.id || decoded.userId || `usr-${Date.now()}`,
              name: userObj.name || decoded.name || data.name,
              email: userObj.email || decoded.email || data.email,
              role: (userObj.role || decoded.role || data.role || "customer").toLowerCase() as UserRole,
              avatar: userObj.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
              status: userObj.status || "active",
              createdAt: userObj.createdAt || new Date().toISOString(),
            };

            if (typeof window !== "undefined") {
              localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(normalizedUser));
              localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
              if (refreshToken) localStorage.setItem("gearup_refresh_token", refreshToken);
              document.cookie = `gearup_role=${normalizedUser.role}; path=/; max-age=86400`;
              document.cookie = `gearup_token=${token}; path=/; max-age=86400`;
              document.cookie = `accessToken=${token}; path=/; max-age=86400`;
            }

            return { user: normalizedUser, token };
          }
        } catch (e) {
          console.warn("Backend API unavailable, falling back to mock engine", e);
        }
      }
      const users = getStored<User>(STORAGE_KEYS.USERS, memUsers);
      if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
        throw new Error("An account with this email already exists.");
      }

      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: data.name,
        email: data.email,
        role: data.role,
        phone: "+1 (555) 000-0000",
        address: "Local Explorer",
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
        status: "active",
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      setStored(STORAGE_KEYS.USERS, users);
      memUsers = users;

      const token = `jwt_mock_${newUser.id}_${Date.now()}`;
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        document.cookie = `gearup_role=${newUser.role}; path=/; max-age=86400`;
        document.cookie = `gearup_token=${token}; path=/; max-age=86400`;
      }

      return { user: newUser, token };
    },

    logout() {
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        document.cookie = "gearup_role=; path=/; max-age=0";
        document.cookie = "gearup_token=; path=/; max-age=0";
      }
    },

    getCurrentUser(): User | null {
      if (typeof window === "undefined") return null;
      try {
        const item = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        return item ? JSON.parse(item) : null;
      } catch {
        return null;
      }
    },
  },

  gear: {
    async getAll(filters?: {
      category?: string;
      search?: string;
      minPrice?: number;
      maxPrice?: number;
      brand?: string;
      providerId?: string;
      inStockOnly?: boolean;
    }): Promise<GearItem[]> {
      await delay(200);
      let items = getStored<GearItem>(STORAGE_KEYS.GEAR, memGear);

      if (filters?.providerId) {
        items = items.filter((g) => g.providerId === filters.providerId);
      }
      if (filters?.category && filters.category !== "All") {
        items = items.filter((g) => g.category === filters.category);
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        items = items.filter(
          (g) =>
            g.title.toLowerCase().includes(q) ||
            g.description.toLowerCase().includes(q) ||
            g.brand.toLowerCase().includes(q) ||
            g.category.toLowerCase().includes(q) ||
            g.location.toLowerCase().includes(q)
        );
      }
      if (filters?.brand && filters.brand !== "All") {
        items = items.filter((g) => g.brand === filters.brand);
      }
      if (filters?.minPrice !== undefined) {
        items = items.filter((g) => g.pricePerDay >= filters.minPrice!);
      }
      if (filters?.maxPrice !== undefined && filters.maxPrice > 0) {
        items = items.filter((g) => g.pricePerDay <= filters.maxPrice!);
      }
      if (filters?.inStockOnly) {
        items = items.filter((g) => g.isAvailable && g.stock > 0);
      }

      return items;
    },

    async getById(id: string): Promise<GearItem | null> {
      await delay(150);
      const items = getStored<GearItem>(STORAGE_KEYS.GEAR, memGear);
      return items.find((g) => g.id === id) || null;
    },

    async create(data: Omit<GearItem, "id" | "createdAt" | "rating" | "reviewsCount">): Promise<GearItem> {
      await delay(300);
      const items = getStored<GearItem>(STORAGE_KEYS.GEAR, memGear);
      const newItem: GearItem = {
        ...data,
        id: `gear-${Date.now()}`,
        rating: 5.0,
        reviewsCount: 0,
        createdAt: new Date().toISOString(),
      };
      items.unshift(newItem);
      setStored(STORAGE_KEYS.GEAR, items);
      memGear = items;
      return newItem;
    },

    async update(id: string, updates: Partial<GearItem>): Promise<GearItem> {
      await delay(250);
      const items = getStored<GearItem>(STORAGE_KEYS.GEAR, memGear);
      const index = items.findIndex((g) => g.id === id);
      if (index === -1) throw new Error("Gear item not found");

      items[index] = { ...items[index], ...updates };
      setStored(STORAGE_KEYS.GEAR, items);
      memGear = items;
      return items[index];
    },

    async delete(id: string): Promise<boolean> {
      await delay(250);
      let items = getStored<GearItem>(STORAGE_KEYS.GEAR, memGear);
      items = items.filter((g) => g.id !== id);
      setStored(STORAGE_KEYS.GEAR, items);
      memGear = items;
      return true;
    },
  },

  rentals: {
    async getAll(filters?: {
      customerId?: string;
      providerId?: string;
      status?: RentalOrderStatus;
    }): Promise<RentalOrder[]> {
      await delay(200);
      let orders = getStored<RentalOrder>(STORAGE_KEYS.ORDERS, memOrders);

      if (filters?.customerId) {
        orders = orders.filter((o) => o.customerId === filters.customerId);
      }
      if (filters?.providerId) {
        orders = orders.filter((o) => o.providerId === filters.providerId);
      }
      if (filters?.status) {
        orders = orders.filter((o) => o.status === filters.status);
      }

      return orders.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },

    async getById(id: string): Promise<RentalOrder | null> {
      await delay(150);
      const orders = getStored<RentalOrder>(STORAGE_KEYS.ORDERS, memOrders);
      return orders.find((o) => o.id === id) || null;
    },

    async create(orderData: {
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
    }): Promise<RentalOrder> {
      await delay(300);
      const orders = getStored<RentalOrder>(STORAGE_KEYS.ORDERS, memOrders);
      const newOrder: RentalOrder = {
        ...orderData,
        id: `ord-${Date.now().toString().slice(-5)}`,
        status: "PLACED",
        paymentStatus: "unpaid",
        createdAt: new Date().toISOString(),
      };
      orders.unshift(newOrder);
      setStored(STORAGE_KEYS.ORDERS, orders);
      memOrders = orders;
      return newOrder;
    },

    async updateStatus(id: string, status: RentalOrderStatus): Promise<RentalOrder> {
      await delay(250);
      const orders = getStored<RentalOrder>(STORAGE_KEYS.ORDERS, memOrders);
      const index = orders.findIndex((o) => o.id === id);
      if (index === -1) throw new Error("Order not found");

      orders[index].status = status;
      if (status === "PAID") {
        orders[index].paymentStatus = "paid";
      }
      setStored(STORAGE_KEYS.ORDERS, orders);
      memOrders = orders;
      return orders[index];
    },
  },

  payments: {
    async createCheckoutSession(
      orderId: string,
      gateway: "stripe" | "sslcommerz" = "stripe"
    ): Promise<{ redirectUrl: string; sessionId: string }> {
      await delay(400);
      const orders = getStored<RentalOrder>(STORAGE_KEYS.ORDERS, memOrders);
      const order = orders.find((o) => o.id === orderId);
      if (!order) throw new Error("Order not found for checkout");

      const sessionId = `cs_test_${Math.random().toString(36).substring(2, 12)}`;
      const redirectUrl = `/payment/success?orderId=${orderId}&session_id=${sessionId}&method=${gateway}`;

      return { redirectUrl, sessionId };
    },

    async confirmPayment(orderId: string, paymentId: string, method = "stripe"): Promise<RentalOrder> {
      await delay(300);
      const orders = getStored<RentalOrder>(STORAGE_KEYS.ORDERS, memOrders);
      const index = orders.findIndex((o) => o.id === orderId);
      if (index === -1) throw new Error("Order not found");

      orders[index].status = "PAID";
      orders[index].paymentStatus = "paid";
      orders[index].paymentId = paymentId;
      orders[index].paymentMethod = method as "stripe" | "sslcommerz";

      setStored(STORAGE_KEYS.ORDERS, orders);
      memOrders = orders;
      return orders[index];
    },
  },

  reviews: {
    async getByGearId(gearId: string): Promise<Review[]> {
      await delay(150);
      const reviews = getStored<Review>(STORAGE_KEYS.REVIEWS, memReviews);
      return reviews.filter((r) => r.gearId === gearId);
    },

    async create(data: {
      gearId: string;
      orderId: string;
      userId: string;
      userName: string;
      userAvatar?: string;
      rating: number;
      comment: string;
    }): Promise<Review> {
      await delay(300);
      const reviews = getStored<Review>(STORAGE_KEYS.REVIEWS, memReviews);
      const newReview: Review = {
        ...data,
        id: `rev-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      reviews.unshift(newReview);
      setStored(STORAGE_KEYS.REVIEWS, reviews);
      memReviews = reviews;

      // Mark order as reviewed
      const orders = getStored<RentalOrder>(STORAGE_KEYS.ORDERS, memOrders);
      const oIdx = orders.findIndex((o) => o.id === data.orderId);
      if (oIdx !== -1) {
        orders[oIdx].reviewSubmitted = true;
        setStored(STORAGE_KEYS.ORDERS, orders);
        memOrders = orders;
      }

      // Update gear average rating & review count
      const gear = getStored<GearItem>(STORAGE_KEYS.GEAR, memGear);
      const gIdx = gear.findIndex((g) => g.id === data.gearId);
      if (gIdx !== -1) {
        const gearReviews = reviews.filter((r) => r.gearId === data.gearId);
        const avg = gearReviews.reduce((acc, r) => acc + r.rating, 0) / gearReviews.length;
        gear[gIdx].rating = Number(avg.toFixed(1));
        gear[gIdx].reviewsCount = gearReviews.length;
        setStored(STORAGE_KEYS.GEAR, gear);
        memGear = gear;
      }

      return newReview;
    },
  },

  admin: {
    async getStats(): Promise<PlatformStats> {
      await delay(200);
      const users = getStored<User>(STORAGE_KEYS.USERS, memUsers);
      const gear = getStored<GearItem>(STORAGE_KEYS.GEAR, memGear);
      const orders = getStored<RentalOrder>(STORAGE_KEYS.ORDERS, memOrders);

      const activeRentals = orders.filter(
        (o) => o.status === "PICKED_UP" || o.status === "PAID" || o.status === "CONFIRMED"
      ).length;
      const pendingOrders = orders.filter((o) => o.status === "PLACED").length;
      const totalRevenue = orders
        .filter((o) => o.paymentStatus === "paid")
        .reduce((sum, o) => sum + o.totalAmount, 0);

      return {
        totalUsers: users.length,
        totalGear: gear.length,
        activeRentals,
        totalRevenue,
        pendingOrders,
        providersCount: users.filter((u) => u.role === "provider").length,
        customersCount: users.filter((u) => u.role === "customer").length,
      };
    },

    async getUsers(): Promise<User[]> {
      await delay(200);
      return getStored<User>(STORAGE_KEYS.USERS, memUsers);
    },

    async updateUserStatus(userId: string, status: "active" | "suspended"): Promise<User> {
      await delay(250);
      const users = getStored<User>(STORAGE_KEYS.USERS, memUsers);
      const index = users.findIndex((u) => u.id === userId);
      if (index === -1) throw new Error("User not found");

      users[index].status = status;
      setStored(STORAGE_KEYS.USERS, users);
      memUsers = users;
      return users[index];
    },
  },
};
