export interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  createdAt?: FirebaseFirestore.Timestamp;
}

export interface Product {
  id?: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
  price: number;
  imageUrl?: string;
  createdBy: string;
  createdAt?: FirebaseFirestore.Timestamp;
  updatedAt?: FirebaseFirestore.Timestamp;
}

export interface AuthRequest extends Express.Request {
  user?: {
    uid: string;
    email: string;
    role: string;
  };
}

// Extend Express Request globally
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email: string;
        role: string;
      };
    }
  }
}
