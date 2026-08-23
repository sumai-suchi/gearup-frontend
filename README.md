# ??? GearUp - Rent Sports & Outdoor Gear Instantly

GearUp is a modern, responsive **Next.js 14 App Router** sports and outdoor equipment rental application with 3 distinct user roles, complete payment gateway integration, live inventory management, and platform moderation.

---

## ?? Test Credentials (MANDATORY REQUIREMENT)

| Role | Email | Password | Access Rights |
|---|---|---|---|
| **Admin (Moderator)** | `admin@gearup.com` | `admin123` | Protected Admin Console (`/dashboard/admin`), User Management (Suspend/Activate), Content Moderation, Platform Revenue |
| **Provider (Vendor)** | `rony@gmail.com` | `sumaiya@123` | Protected Provider Hub (`/dashboard/provider`), Inventory CRUD, Order Confirmation & Return Handover |
| **Customer (Renter)** | `customer@gearup.com` | `customer123` | Protected Customer Portal (`/dashboard/customer`), Browsing, Date Calculations, Stripe/SSLCommerz Checkout, Reviews |

> ?? **Quick Switching**: Click the **"Demo Switcher"** button in the top navbar to log in as any role with 1-click!

---

## ? Features & Checklist Coverage

- [x] **API Integration & Documentation**: Complete `API_INTEGRATION.md` mapping frontend components to endpoints.
- [x] **Consistent UI Error Handling**: Toast notifications (`sonner`), inline form validation, Next.js `error.tsx` boundary, and `not-found.tsx`.
- [x] **Commits Standard**: Structured conventional commit history tracking every phase.
- [x] **Payment Integration**: Stripe Checkout and SSLCommerz payment initiation with `/payment/success` and `/payment/cancel` return handling.
- [x] **3 Role Dashboards & Middleware**: Dynamic UI rendering per role with Next.js Middleware route enforcement.
- [x] **Gear Search & Filter**: Real-time category pills, keyword search, price range sliders, brand filter, stock availability, and sorting.
- [x] **Interactive Booking Widget**: Automatic total rental days, daily rate subtotal, and security deposit calculation.

---

## ??? Tech Stack & Dependencies
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: Sonner (Toast notifications)
- **Date Utility**: Date-fns

---

## ?? Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
