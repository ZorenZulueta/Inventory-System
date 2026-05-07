# Inventory-System

A full-stack inventory management system built with Angular frontend and Node.js backend, featuring user authentication, product management, and real-time inventory tracking.

## 🚀 Live Links

- **Frontend**: [https://inventory-system-mu-khaki.vercel.app]
- **Backend API**: [https://inventory-system-1-mopu.onrender.com/api]

## 🛠 Tech Stack

### Frontend
- **Angular 21** - Modern web framework
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe JavaScript

### Database
- **Firebase Firestore** - NoSQL cloud database

## 📋 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Frontend Setup
```bash
cd client
npm install
npm start
```

### Backend Setup
```bash
cd server
npm install
npm run dev
```


## 📡 API Overview

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Product Endpoints
- `GET /api/products` - Get all products (with pagination, search, category filter)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/categories` - Get all categories

### Health Check
- `GET /api/health` - API health status

## ✨ Features Implemented

- **User Authentication**
  - User registration with email/password
  - Secure login with JWT tokens
  - Role-based access (admin/user)

- **Dashboard**
  - Overview of total products
  - Low stock alerts
  - Recent products display
  - Category statistics

- **Product Management**
  - Add new products with image upload
  - Edit existing products
  - Delete products
  - View product details
  - Search and filter by category
  - Pagination for large product lists

- **Image Upload**
  - Firebase Storage integration
  - Image preview and validation
  - Automatic image serving

- **Responsive Design**
  - Mobile-friendly interface
  - Tailwind CSS styling
  - Modern UI components

## 📸 Screenshots

### User Interface

#### Login Page
![Login Page](Screenshot/LoginPage.png)
*Secure login interface with email and password fields.*

#### Register Page
![Register Page](Screenshot/RegisterPage.png)
*User registration form.*

#### Admin Dashboard
![Admin Dashboard](Screenshot/AdminDashBoard.png)
*Admin dashboard showing product statistics and recent items.*

#### User Dashboard
![User Dashboard](Screenshot/UserDashBoard.png)
*User dashboard with product overview.*

#### Admin Products List
![Admin Products List](Screenshot/AdminProducts.png)
*Admin product listing with management options.*

#### User Products List
![User Products List](Screenshot/UserProducts.png)
*User product listing with search and filters.*

### API Testing (Postman)

*Note: API testing screenshots not available in current folder. Add Postman screenshots here when available.*

#### Authentication
![Auth API](screenshot/api-auth.png)
*POST /api/auth/login endpoint testing.*

#### Products CRUD
![Products API](screenshot/api-products.png)
*GET /api/products endpoint with pagination.*

#### Product Creation
![Create Product API](screenshot/api-create-product.png)
*POST /api/products with form data and image upload.*

