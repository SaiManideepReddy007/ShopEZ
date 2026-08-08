# ShopEZ

ShopEZ is your one-stop destination for effortless online shopping. Browse a wide product catalog, add items to your cart, place orders, and track them — all with a full admin dashboard for managing products and orders.

## Tech Stack

**Frontend:** React (Vite), React Router, Axios
**Backend:** Node.js, Express.js
**Database:** MongoDB with Mongoose
**Authentication:** JWT (JSON Web Tokens), bcrypt for password hashing

## Features

- User registration and login with role selection (Customer / Admin)
- Browse products with category, gender, and price filters
- Product detail pages with image slider
- Add to cart, update quantity, remove items
- Checkout with shipping details and order placement
- Order history with cancellation for pending orders
- Admin dashboard: add/delete products, manage all orders, update order status

## Project Structure

```
ShopEZ/
  client/          React frontend
    src/
      api/         Axios instance
      components/  Navbar
      context/     Auth context
      pages/       Home, Products, ProductDetail, Cart, Checkout, Profile, Admin, Login, Register
  server/          Express backend
    config/        MongoDB connection
    controllers/   Business logic
    middleware/    Auth + error handling
    models/        Mongoose schemas
    routes/        API routes
```

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB running locally (or a MongoDB Atlas connection string)

### 1. Clone the repository
```
git clone https://github.com/SaiManideepReddy007/ShopEZ.git
cd ShopEZ
```

### 2. Backend setup
```
cd server
npm install
```

Create a `.env` file in the `server` folder:
```
MONGO_URI=mongodb://localhost:27017/shopez
PORT=5000
JWT_SECRET=your_secret_key_here
```

Start the backend:
```
node server.js
```
Server runs on `http://localhost:5000`

### 3. Frontend setup
Open a new terminal:
```
cd client
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/users/register | Register a new user |
| POST | /api/users/login | Login and receive JWT |
| GET | /api/products | Get all products |
| GET | /api/products/:id | Get single product |
| POST | /api/products | Add product (admin only) |
| PUT/DELETE | /api/products/:id | Update/delete product (admin only) |
| GET/POST | /api/cart | Manage cart items |
| POST | /api/orders | Place an order |
| GET | /api/orders/user/:userId | Get a user's orders |
| PUT | /api/orders/:id/cancel | Cancel a pending order |
| GET | /api/orders | Get all orders (admin only) |
| PUT | /api/orders/:id | Update order status (admin only) |

## Author

Sai Manideep Reddy Gujjula
