# Dfood Backend V2 Capabilities Requirements

This document outlines the database models, API route specifications, and server capabilities required on the backend to support the Admin V2 website.

---

## 1. Ratings & Reviews System
- **Database Schema (`Review`):**
  - `_id`: ObjectId
  - `orderId`: ObjectId (ref `Order`, unique index)
  - `customerId`: ObjectId (ref `User`)
  - `restaurantId`: ObjectId (ref `Restaurant`)
  - `foodItems`: Array of ObjectIds (ref `FoodItem`)
  - `rating`: Number (1 to 5)
  - `comment`: String
  - `status`: String enum (`pending`, `approved`, `reported`, `hidden`)
  - `vendorReply`: { `comment`: String, `repliedAt`: Date }
  - `createdAt`: Date
- **Endpoints:**
  - `GET /api/reviews` (admin queue with filters for status)
  - `GET /api/restaurants/:id/reviews` (public/vendor list)
  - `POST /api/reviews` (customer submit review)
  - `PATCH /api/reviews/:id/status` (admin approve/hide/report review)
  - `POST /api/reviews/:id/reply` (vendor reply to review)

---

## 2. Promotions & Coupons System
- **Database Schema (`Coupon`):**
  - `_id`: ObjectId
  - `code`: String (unique, uppercase index)
  - `type`: String enum (`percentage`, `fixed_amount`, `free_delivery`)
  - `value`: Number (discount amount or percentage)
  - `minOrderValue`: Number
  - `maxDiscountAmount`: Number (for percentage discounts)
  - `startDate`: Date
  - `endDate`: Date
  - `usageLimit`: Number (total allowed uses)
  - `userLimit`: Number (allowed uses per customer user)
  - `usedCount`: Number
  - `isActive`: Boolean
- **Endpoints:**
  - `GET /api/promotions/coupons` (list all coupons)
  - `POST /api/promotions/coupons` (create coupon)
  - `PATCH /api/promotions/coupons/:id` (edit/disable coupon)
  - `POST /api/promotions/coupons/validate` (validate and apply coupon on checkout)

---

## 3. Advanced Catalog Options
- **Model Modifications:**
  - **`Restaurant`:**
    - `coverImage`: String URL
    - `gallery`: Array of String URLs
    - `socialLinks`: { `instagram`: String, `facebook`: String, `twitter`: String }
    - `deliveryZones`: Polygon coordinate fields `{ type: "Polygon", coordinates: [[[Lng, Lat], ...]] }`
    - `status`: String enum (`open`, `closed`, `busy`, `disabled`)
  - **`FoodItem`:**
    - `variants`: Array of `{ name: String, price: Number }`
    - `modifiers`: Array of `{ name: String, price: Number, isRequired: Boolean }`
    - `badges`: Array of String enums (`popular`, `new`, `recommended`, `chef_choice`)
    - `availability`: String enum (`available`, `out_of_stock`, `seasonal`)
  - **`Category`:**
    - `sortOrder`: Number (for drag-to-reorder sorting)
    - `isFeatured`: Boolean
    - `isHidden`: Boolean
    - `icon`: String identifier

---

## 4. Analytics Services
- **Aggregations & Cache Keys (Redis + Mongo):**
  - **Dashboard Analytics:** Aggregated global states (active orders, revenue trends, top foods, repeat customer counts, cancellation rate, average delivery time).
  - **Restaurant Analytics:** Aggregated metrics per vendor restaurant (sales, ratings, item performance).
- **Endpoints:**
  - `GET /api/admin/analytics` (super admin metrics overview)
  - `GET /api/vendor/analytics` (vendor metrics overview)

---

## 5. Audit & Activity Logs
- **Database Schema (`AuditLog`):**
  - `_id`: ObjectId
  - `actorId`: ObjectId (ref `User`)
  - `action`: String (e.g., `restaurant.created`, `food.deleted`, `coupon.updated`, `role.changed`)
  - `resourceId`: ObjectId
  - `ipAddress`: String
  - `deviceDetails`: String
  - `diff`: { `before`: Schema.Types.Mixed, `after`: Schema.Types.Mixed }
  - `createdAt`: Date
- **Endpoints:**
  - `GET /api/admin/audit-logs` (admin filterable log viewer)

---

## 6. Media Library Manager
- **Database Schema (`MediaAsset`):**
  - `_id`: ObjectId
  - `filename`: String
  - `url`: String
  - `publicId`: String (Cloudinary asset ID)
  - `folder`: String
  - `tags`: Array of Strings
  - `size`: Number
  - `format`: String
  - `uploadedBy`: ObjectId (ref `User`)
  - `createdAt`: Date
- **Endpoints:**
  - `GET /api/media` (list files with folders and tag filters)
  - `POST /api/media/upload` (single/multiple upload with automatic optimization)
  - `DELETE /api/media/:id` (delete from Cloudinary and database)
  - `GET /api/media/unused` (identify orphaned/unused URLs in menu item schemas)

---

## 7. Role & Permissions Access Control
- **Model Modifications:**
  - **`User`:**
    - `role`: String enum (`super_admin`, `manager`, `support`, `restaurant_admin`, `content_manager`, `finance`, `customer`)
    - `permissions`: Array of Strings (for overrides)
- **Role Permission Policy Middleware:**
  - Dynamic access rules matching routes with permission arrays.

---

## 8. Notification Center
- **Database Schema (`NotificationCampaign`):**
  - `_id`: ObjectId
  - `title`: String
  - `body`: String
  - `targetAudience`: String enum (`all`, `customers`, `vendors`)
  - `scheduleTime`: Date
  - `sentAt`: Date
  - `status`: String enum (`draft`, `scheduled`, `sent`, `cancelled`)
- **Push Queue Handler:**
  - Scheduler to send background push notifications via Firebase Admin / Expo.
