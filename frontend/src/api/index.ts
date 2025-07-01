import axios, { AxiosError } from "axios";
import { Food, Order, Review, User } from "../types";

// Set API URL from environment or fallback to localhost
const API_URL = "http://localhost:5000/api";

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 seconds
});

// Function to handle Cloudflare-related errors
const isCloudflareError = (error: any): boolean => {
  return (
    error?.response?.status === 403 ||
    error?.response?.status === 401 ||
    error?.response?.status === 429 ||
    error?.message?.includes("Network Error") ||
    error?.message?.includes("timeout")
  );
};

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

// Add a response interceptor for retry logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;

    // Skip retry for certain errors or if we've already tried
    if (
      !config ||
      !isCloudflareError(error) ||
      config._retryCount >= MAX_RETRIES
    ) {
      return Promise.reject(error);
    }

    // Initialize retry count if not present
    config._retryCount = config._retryCount || 0;
    config._retryCount += 1;

    // Log retry attempt
    console.log(
      `Retrying request (${config._retryCount}/${MAX_RETRIES}): ${config.url}`
    );

    // Create a delay before retrying
    const delay = RETRY_DELAY * Math.pow(2, config._retryCount - 1);
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Retry the request
    return api(config);
  }
);

// Helper to handle common API errors
const handleApiError = (error: unknown, fallbackMessage: string): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;

    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }

    if (isCloudflareError(axiosError)) {
      return "Connection issue detected. This might be due to Cloudflare protection. Please try again.";
    }

    if (axiosError.message) {
      return axiosError.message;
    }
  }

  return fallbackMessage;
};

// User API
export const userAPI = {
  register: async (
    userData: Omit<User, "_id" | "isAdmin" | "createdAt" | "token">
  ) => {
    try {
      return await api.post<User>("/users/register", userData);
    } catch (error) {
      throw new Error(
        handleApiError(error, "Failed to register. Please try again.")
      );
    }
  },

  login: async (phoneNumber: string) => {
    try {
      return await api.post<User>("/users/login", { phoneNumber });
    } catch (error) {
      throw new Error(
        handleApiError(error, "Failed to login. Please try again.")
      );
    }
  },

  getProfile: async () => {
    try {
      return await api.get<User>("/users/profile");
    } catch (error) {
      throw new Error(
        handleApiError(error, "Failed to get profile. Please try again.")
      );
    }
  },

  updateProfile: async (userData: Partial<User>) => {
    try {
      return await api.put<User>("/users/profile", userData);
    } catch (error) {
      throw new Error(
        handleApiError(error, "Failed to update profile. Please try again.")
      );
    }
  },

  adminLogin: async (username: string, password: string) => {
    try {
      return await api.post<{
        id: string;
        username: string;
        isAdmin: boolean;
        token: string;
      }>("/users/admin/login", { username, password });
    } catch (error) {
      throw new Error(
        handleApiError(error, "Failed to login as admin. Please try again.")
      );
    }
  },
};

// Food API
export const foodAPI = {
  getAllFoods: async (params?: {
    category?: string;
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }) => {
    try {
      return await api.get<{
        foods: Food[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
      }>("/foods", { params });
    } catch (error) {
      throw new Error(
        handleApiError(error, "Failed to fetch foods. Please try again.")
      );
    }
  },

  getFoodById: async (id: string) => {
    try {
      return await api.get<Food>(`/foods/${id}`);
    } catch (error) {
      throw new Error(
        handleApiError(
          error,
          `Failed to fetch food with ID ${id}. Please try again.`
        )
      );
    }
  },

  getFeaturedFoods: async () => {
    try {
      return await api.get<Food[]>("/foods/featured/items");
    } catch (error) {
      throw new Error(
        handleApiError(
          error,
          "Failed to fetch featured foods. Please try again."
        )
      );
    }
  },

  getSpecialOffers: async () => {
    try {
      return await api.get<Food[]>("/foods/offers/special");
    } catch (error) {
      throw new Error(
        handleApiError(
          error,
          "Failed to fetch special offers. Please try again."
        )
      );
    }
  },

  // Admin only
  createFood: async (foodData: FormData) => {
    try {
      return await api.post<Food>("/foods", foodData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      throw new Error(
        handleApiError(error, "Failed to create food. Please try again.")
      );
    }
  },

  updateFood: async (id: string, foodData: FormData) => {
    try {
      return await api.put<Food>(`/foods/${id}`, foodData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      throw new Error(
        handleApiError(
          error,
          `Failed to update food with ID ${id}. Please try again.`
        )
      );
    }
  },

  deleteFood: async (id: string) => {
    try {
      return await api.delete(`/foods/${id}`);
    } catch (error) {
      throw new Error(
        handleApiError(
          error,
          `Failed to delete food with ID ${id}. Please try again.`
        )
      );
    }
  },
};

// Order API
export const orderAPI = {
  createOrder: async (
    orderData: Omit<Order, "_id" | "orderDate" | "status" | "paymentStatus">
  ) => {
    try {
      return await api.post<Order>("/orders", orderData);
    } catch (error) {
      throw new Error(
        handleApiError(error, "Failed to create order. Please try again.")
      );
    }
  },

  getUserOrders: async () => {
    try {
      return await api.get<Order[]>("/orders/user");
    } catch (error) {
      throw new Error(
        handleApiError(error, "Failed to fetch user orders. Please try again.")
      );
    }
  },

  getOrderById: async (id: string) => {
    try {
      return await api.get<Order>(`/orders/${id}`);
    } catch (error) {
      throw new Error(
        handleApiError(
          error,
          `Failed to fetch order with ID ${id}. Please try again.`
        )
      );
    }
  },

  // Admin only
  getAllOrders: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    try {
      return await api.get<{
        orders: Order[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
      }>("/orders", { params });
    } catch (error) {
      throw new Error(
        handleApiError(error, "Failed to fetch all orders. Please try again.")
      );
    }
  },

  updateOrderStatus: async (id: string, status: Order["status"]) => {
    try {
      return await api.put<Order>(`/orders/${id}/status`, { status });
    } catch (error) {
      throw new Error(
        handleApiError(
          error,
          `Failed to update order status. Please try again.`
        )
      );
    }
  },

  updatePaymentStatus: async (
    id: string,
    paymentStatus: Order["paymentStatus"]
  ) => {
    try {
      return await api.put<Order>(`/orders/${id}/payment`, { paymentStatus });
    } catch (error) {
      throw new Error(
        handleApiError(
          error,
          `Failed to update payment status. Please try again.`
        )
      );
    }
  },

  getOrderStats: async () => {
    try {
      return await api.get<{
        pendingOrders: number;
        confirmedOrders: number;
        preparingOrders: number;
        deliveringOrders: number;
        deliveredOrders: number;
        cancelledOrders: number;
        totalRevenue: number;
        recentRevenue: number;
      }>("/orders/stats/all");
    } catch (error) {
      throw new Error(
        handleApiError(
          error,
          "Failed to fetch order statistics. Please try again."
        )
      );
    }
  },
};

// Review API
export const reviewAPI = {
  addReview: async (reviewData: {
    foodId: string;
    rating: number;
    comment: string;
  }) => {
    try {
      return await api.post<Review>("/reviews", reviewData);
    } catch (error) {
      throw new Error(
        handleApiError(error, "Failed to add review. Please try again.")
      );
    }
  },

  getFoodReviews: async (foodId: string) => {
    try {
      return await api.get<Review[]>(`/reviews/food/${foodId}`);
    } catch (error) {
      throw new Error(
        handleApiError(error, "Failed to fetch reviews. Please try again.")
      );
    }
  },

  updateReview: async (
    id: string,
    reviewData: { rating?: number; comment?: string }
  ) => {
    try {
      return await api.put<Review>(`/reviews/${id}`, reviewData);
    } catch (error) {
      throw new Error(
        handleApiError(error, "Failed to update review. Please try again.")
      );
    }
  },

  deleteReview: async (id: string) => {
    try {
      return await api.delete(`/reviews/${id}`);
    } catch (error) {
      throw new Error(
        handleApiError(error, "Failed to delete review. Please try again.")
      );
    }
  },
};

export default api;
