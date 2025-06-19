import axios from "axios";
import { Food, Order, Review, User } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// User API
export const userAPI = {
  register: (userData: Omit<User, "_id" | "isAdmin" | "createdAt" | "token">) =>
    api.post<User>("/users/register", userData),

  login: (phoneNumber: string) =>
    api.post<User>("/users/login", { phoneNumber }),

  getProfile: () => api.get<User>("/users/profile"),

  updateProfile: (userData: Partial<User>) =>
    api.put<User>("/users/profile", userData),

  adminLogin: (username: string, password: string) =>
    api.post<{ id: string; username: string; isAdmin: boolean; token: string }>(
      "/users/admin/login",
      { username, password }
    ),
};

// Food API
export const foodAPI = {
  getAllFoods: (params?: {
    category?: string;
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get<{
      foods: Food[];
      currentPage: number;
      totalPages: number;
      totalItems: number;
    }>("/foods", { params }),

  getFoodById: (id: string) => api.get<Food>(`/foods/${id}`),

  getFeaturedFoods: () => api.get<Food[]>("/foods/featured/items"),

  getSpecialOffers: () => api.get<Food[]>("/foods/offers/special"),

  // Admin only
  createFood: (foodData: FormData) =>
    api.post<Food>("/foods", foodData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  updateFood: (id: string, foodData: FormData) =>
    api.put<Food>(`/foods/${id}`, foodData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  deleteFood: (id: string) => api.delete(`/foods/${id}`),
};

// Order API
export const orderAPI = {
  createOrder: (
    orderData: Omit<Order, "_id" | "orderDate" | "status" | "paymentStatus">
  ) => api.post<Order>("/orders", orderData),

  getUserOrders: () => api.get<Order[]>("/orders/user"),

  getOrderById: (id: string) => api.get<Order>(`/orders/${id}`),

  // Admin only
  getAllOrders: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get<{
      orders: Order[];
      currentPage: number;
      totalPages: number;
      totalItems: number;
    }>("/orders", { params }),

  updateOrderStatus: (id: string, status: Order["status"]) =>
    api.put<Order>(`/orders/${id}/status`, { status }),

  updatePaymentStatus: (id: string, paymentStatus: Order["paymentStatus"]) =>
    api.put<Order>(`/orders/${id}/payment`, { paymentStatus }),

  getOrderStats: () =>
    api.get<{
      pendingOrders: number;
      confirmedOrders: number;
      preparingOrders: number;
      deliveringOrders: number;
      deliveredOrders: number;
      cancelledOrders: number;
      totalRevenue: number;
      recentRevenue: number;
    }>("/orders/stats/all"),
};

// Review API
export const reviewAPI = {
  addReview: (reviewData: {
    foodId: string;
    rating: number;
    comment: string;
  }) => api.post<Review>("/reviews", reviewData),

  getFoodReviews: (foodId: string) =>
    api.get<Review[]>(`/reviews/food/${foodId}`),

  updateReview: (
    id: string,
    reviewData: { rating?: number; comment?: string }
  ) => api.put<Review>(`/reviews/${id}`, reviewData),

  deleteReview: (id: string) => api.delete(`/reviews/${id}`),
};

export default api;
