export interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address?: string;
  isAdmin: boolean;
  createdAt: string;
  token?: string;
}

export interface Food {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
  isFeatured: boolean;
  ratings: number;
  numReviews: number;
  ingredients: string[];
  specialOffer: boolean;
  customizationOptions: {
    sizes?: {
      name: string;
      price: number;
    }[];
    crusts?: {
      name: string;
      price: number;
    }[];
    toppings?: {
      name: string;
      price: number;
    }[];
  };
  nutritionalInfo?: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
  createdAt: string;
}

export interface CartItem {
  food: Food;
  quantity: number;
  price: number;
  customizations: {
    size?: {
      name: string;
      price: number;
    };
    crust?: {
      name: string;
      price: number;
    };
    toppings?: {
      name: string;
      price: number;
    }[];
  };
  specialInstructions?: string;
}

export interface Order {
  _id: string;
  user: User | string;
  items: {
    food: Food | string;
    quantity: number;
    price: number;
    customizations: {
      size?: {
        name: string;
        price: number;
      };
      crust?: {
        name: string;
        price: number;
      };
      toppings?: {
        name: string;
        price: number;
      }[];
    };
    specialInstructions?: string;
  }[];
  totalAmount: number;
  deliveryAddress: string;
  status:
    | "Pending"
    | "Confirmed"
    | "Preparing"
    | "Out for Delivery"
    | "Delivered"
    | "Cancelled";
  paymentMethod: "Cash on Delivery" | "Online Payment";
  paymentStatus: "Pending" | "Completed" | "Failed";
  orderDate: string;
  deliveryTime?: string;
  contactNumber: string;
}

export interface Review {
  _id: string;
  user: User | string;
  food: Food | string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}
