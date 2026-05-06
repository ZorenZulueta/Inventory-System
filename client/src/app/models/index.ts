export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface Product {
  id?: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
  price: number;
  imageUrl?: string;
  createdBy?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface ProductsResponse {
  data: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  role?: string;
}
