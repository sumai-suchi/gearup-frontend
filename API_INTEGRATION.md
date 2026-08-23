# ?? API Integration & Component Mapping Documentation

This document maps all frontend components and Next.js App Router routes in **GearUp** to their corresponding backend REST API endpoints.

## ?? REST API Base Configuration
- **Environment Variable**: `NEXT_PUBLIC_API_URL` (e.g. `https://gearup-api.vercel.app`)
- **Headers**: `Content-Type: application/json`, `Authorization: Bearer <jwt_token>`

---

## ??? Endpoint to Component Mapping Matrix

| Frontend Next.js Route | UI Component / View | Method | Backend API Endpoint | Purpose / Functionality |
|---|---|---|---|---|
| `/` | `HomePage` | `GET` | `/api/gear` | Fetch featured gear listings for home catalog grid |
| `/gear` | `GearCatalogPage` | `GET` | `/api/gear` | Query equipment with category, brand, price slider & search filters |
| `/gear/[id]` | `GearDetailsPage` | `GET` | `/api/gear/:id` | Detailed view of specifications, provider details, and gallery |
| `/gear/[id]` | `GearDetailsPage` | `GET` | `/api/reviews?gearId=:id` | Fetch customer feedback reviews for target gear |
| `/gear/[id]` | `BookingWidget` | `POST` | `/api/rentals` | Create new rental reservation with calculated dates and deposit |
| `/auth/login` | `LoginPage` | `POST` | `/api/auth/login` | Authenticate user, obtain JWT token & role cookie |
| `/auth/register` | `RegisterPage` | `POST` | `/api/auth/register` | Register new account with role selection (`customer` / `provider`) |
| `/dashboard/customer` | `CustomerDashboardPage` | `GET` | `/api/rentals?customerId=:id` | Fetch customer order history with live status badges |
| `/dashboard/customer` | `ReviewModal` | `POST` | `/api/reviews` | Submit customer star rating & feedback after gear is returned |
| `/dashboard/customer/orders/[id]/pay` | `PaymentInitiationPage` | `POST` | `/api/payments/create-checkout` | Initiate Stripe Checkout or SSLCommerz gateway session |
| `/payment/success` | `PaymentSuccessPage` | `POST` | `/api/payments/confirm` | Verify transaction ID and update rental status to `PAID` |
| `/dashboard/provider` | `ProviderDashboardPage` | `GET` | `/api/provider/stats` | Fetch vendor stats (total listings, pending requests, revenue) |
| `/dashboard/provider/gear` | `ProviderGearListPage` | `GET` | `/api/provider/gear` | Retrieve provider equipment inventory list |
| `/dashboard/provider/gear` | `ProviderGearListPage` | `DELETE` | `/api/provider/gear/:id` | Remove gear listing from inventory |
| `/dashboard/provider/gear` | `ProviderGearListPage` | `PATCH` | `/api/provider/gear/:id` | Toggle gear availability (`isAvailable` true/false) |
| `/dashboard/provider/gear/new` | `AddGearPage` | `POST` | `/api/provider/gear` | Create new equipment listing with images and specs |
| `/dashboard/provider/gear/[id]/edit` | `EditGearPage` | `PATCH` | `/api/provider/gear/:id` | Edit pricing, deposit, stock, and specifications |
| `/dashboard/provider/orders` | `ProviderOrdersPage` | `GET` | `/api/provider/orders` | Retrieve incoming customer orders table |
| `/dashboard/provider/orders` | `ProviderOrdersPage` | `PATCH` | `/api/provider/orders/:id` | Update order status (`PLACED` $\rightarrow$ `CONFIRMED` $\rightarrow$ `PICKED_UP` $\rightarrow$ `RETURNED`) |
| `/dashboard/admin` | `AdminDashboardPage` | `GET` | `/api/admin/stats` | Global platform statistics (total users, active gear, revenue) |
| `/dashboard/admin/users` | `AdminUserManagementPage` | `GET` | `/api/admin/users` | Retrieve list of all platform users |
| `/dashboard/admin/users` | `AdminUserManagementPage` | `PATCH` | `/api/admin/users/:id` | Toggle user status (`Suspend` / `Activate`) |
| `/dashboard/admin/gear` | `AdminGearModerationPage` | `DELETE` | `/api/admin/gear/:id` | Platform moderation force-delete listing |
| `/dashboard/admin/orders` | `AdminOrdersPage` | `GET` | `/api/admin/orders` | Retrieve global platform rental transactions log |

---

## ?? Status Workflow Transitions Matrix

```
[PLACED] ?? (Customer creates booking request)
   ? Provider clicks "Confirm Order"
[CONFIRMED] ?? (Customer sees "Pay Now" button)
   ? Customer completes Stripe / SSLCommerz Payment
[PAID] ?? (Provider sees "Mark Picked Up" button)
   ? Provider hands over gear at shop
[PICKED_UP] ?? (Gear in use by customer)
   ? Customer returns gear to shop
[RETURNED] ? (Customer sees "Leave Review" button)
```
