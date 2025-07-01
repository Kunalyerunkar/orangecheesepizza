import axios from "axios";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// Create a direct axios instance for debugging
const directAxios = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Define user type
interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  isAdmin?: boolean;
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  sendVerificationCode: (phoneNumber: string) => Promise<any>;
  verifyCode: (phoneNumber: string, code: string) => Promise<void>;
}

interface RegisterData {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Create Auth Provider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isMounted = useRef(true);

  // Set up cleanup when component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Safe state setter functions that check if component is still mounted
  const safeSetUser = (data: User | null) => {
    if (isMounted.current) setUser(data);
  };

  const safeSetIsAuthenticated = (value: boolean) => {
    if (isMounted.current) setIsAuthenticated(value);
  };

  const safeSetIsLoading = (value: boolean) => {
    if (isMounted.current) setIsLoading(value);
  };

  // Check if user is already logged in
  useEffect(() => {
    let isCancelled = false;

    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (token && !isCancelled) {
          // Set auth headers for all future requests
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Get user data
          const response = await axios.get("/api/users/me");
          if (!isCancelled) {
            safeSetUser(response.data);
            safeSetIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // Clear any invalid tokens
        localStorage.removeItem("authToken");
        axios.defaults.headers.common["Authorization"] = "";
      } finally {
        if (!isCancelled) {
          safeSetIsLoading(false);
        }
      }
    };

    checkAuthStatus();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Login function
  const login = async (identifier: string, password: string) => {
    safeSetIsLoading(true);
    try {
      const response = await axios.post("/api/users/login", {
        identifier, // Can be email or phone
        password,
      });

      const { user, token } = response.data;

      // Save token to localStorage
      localStorage.setItem("authToken", token);

      // Set axios default header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      safeSetUser(user);
      safeSetIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      safeSetIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: RegisterData) => {
    safeSetIsLoading(true);
    try {
      const response = await axios.post("/api/users/register", userData);

      const { user, token } = response.data;

      // Save token to localStorage
      localStorage.setItem("authToken", token);

      // Set axios default header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      safeSetUser(user);
      safeSetIsAuthenticated(true);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      safeSetIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Remove token
    localStorage.removeItem("authToken");

    // Remove authorization header
    axios.defaults.headers.common["Authorization"] = "";

    // Reset state
    safeSetUser(null);
    safeSetIsAuthenticated(false);
  };

  // Send verification code for phone login/registration
  const sendVerificationCode = async (phoneNumber: string) => {
    try {
      console.log("Sending verification code to:", phoneNumber);

      // Try both the standard axios and the direct axios instance
      let response;
      try {
        // First try with regular axios (using proxy)
        console.log("Attempting to send verification code using proxy");
        response = await axios.post("/api/users/send-verification", {
          phoneNumber,
        });
        console.log(
          "Proxy verification code request succeeded:",
          response.data
        );
      } catch (err: any) {
        console.log("First attempt failed, trying direct connection:", err);

        // Log detailed error if available
        if (err.response?.data?.error) {
          console.error("Detailed error:", err.response.data.error);
          if (err.response.data.stack) {
            console.error("Error stack:", err.response.data.stack);
          }
        }

        // If that fails, try the direct instance
        console.log("Attempting direct connection to backend server");
        response = await directAxios.post("/api/users/send-verification", {
          phoneNumber,
        });
        console.log(
          "Direct verification code request succeeded:",
          response.data
        );
      }

      console.log("Verification code sent response:", response.data);

      // Show instructions for getting the verification code
      console.log(
        "%c ===========================================",
        "background: #222; color: #bada55"
      );
      console.log(
        "%c IMPORTANT: To get your verification code, check the backend server logs",
        "background: #222; color: #bada55"
      );
      console.log(
        "%c The code will be displayed as: 'Verification code for +XXXXXXXXXX: XXXXXX'",
        "background: #222; color: #bada55"
      );
      console.log(
        "%c ===========================================",
        "background: #222; color: #bada55"
      );

      return response;
    } catch (error: any) {
      console.error("Failed to send verification code:", error);

      // Log detailed error if available
      if (error.response?.data?.error) {
        console.error("Detailed error:", error.response.data.error);
        if (error.response.data.stack) {
          console.error("Error stack:", error.response.data.stack);
        }
      }

      throw error;
    }
  };

  // Verify code for phone login/registration
  const verifyCode = async (phoneNumber: string, code: string) => {
    try {
      console.log("Verifying code for:", phoneNumber, "Code:", code);

      // Try both the standard axios and the direct axios instance
      let response;
      try {
        // First try with regular axios (using proxy)
        console.log("Attempting to verify code using proxy");
        response = await axios.post("/api/users/verify-code", {
          phoneNumber,
          code,
        });
        console.log("Proxy verification succeeded:", response.data);
      } catch (err: any) {
        console.log(
          "First verification attempt failed, trying direct connection:",
          err
        );

        // Log detailed error if available
        if (err.response?.data?.error) {
          console.error("Detailed error:", err.response.data.error);
          if (err.response.data.stack) {
            console.error("Error stack:", err.response.data.stack);
          }
        }

        // If that fails, try the direct instance
        console.log(
          "Attempting direct connection to backend server for verification"
        );
        response = await directAxios.post("/api/users/verify-code", {
          phoneNumber,
          code,
        });
        console.log("Direct verification succeeded:", response.data);
      }

      console.log("Verification response:", response.data);

      const { user, token } = response.data;

      // Save token to localStorage
      localStorage.setItem("authToken", token);

      // Set axios default header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      directAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      safeSetUser(user);
      safeSetIsAuthenticated(true);
    } catch (error: any) {
      console.error("Code verification failed:", error);

      // Log detailed error if available
      if (error.response?.data?.error) {
        console.error("Detailed error:", error.response.data.error);
        if (error.response.data.stack) {
          console.error("Error stack:", error.response.data.stack);
        }
      }

      throw error;
    }
  };

  // Create value object
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    sendVerificationCode,
    verifyCode,
  };

  // Provide the auth context to children
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
