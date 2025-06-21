import { ClerkProvider } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

// Layout components
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";

// Common components
import PizzaPreloader from "./components/common/PizzaPreloader";
import PreloaderProvider from "./components/common/PreloaderProvider";

// Pages
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import FoodDetailPage from "./pages/FoodDetailPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MenuPage from "./pages/MenuPage";
import NotFoundPage from "./pages/NotFoundPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import OrdersPage from "./pages/OrdersPage";
import PreloaderExamplePage from "./pages/PreloaderExamplePage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";

// Admin pages
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminFoodsPage from "./pages/admin/AdminFoodsPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  const [clerkKey, setClerkKey] = useState<string>("");
  const [showInitialLoader, setShowInitialLoader] = useState(true);

  useEffect(() => {
    // Load Clerk publishable key from environment variables
    const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "";
    setClerkKey(key);

    // Ensure the pizza preloader runs at least once
    // It will hide itself after minDisplayTime (3000ms)
    // We don't need to manually hide it here
  }, []);

  // If initial loader is showing or clerk key is not yet loaded, show the pizza preloader
  if (showInitialLoader || !clerkKey) {
    return (
      <PizzaPreloader
        minDisplayTime={3000}
        onComplete={() => setShowInitialLoader(false)}
      />
    );
  }

  return (
    <ClerkProvider publishableKey={clerkKey}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <PreloaderProvider>
            <div className="flex flex-col min-h-screen pizza-cursor">
              <Header />
              <main className="flex-grow">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/menu" element={<MenuPage />} />
                  <Route path="/food/:id" element={<FoodDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route
                    path="/preloader-examples"
                    element={<PreloaderExamplePage />}
                  />

                  {/* Protected routes */}
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route
                    path="/order-confirmation/:id"
                    element={<OrderConfirmationPage />}
                  />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/orders/:id" element={<OrderDetailPage />} />
                  <Route path="/profile" element={<ProfilePage />} />

                  {/* Admin routes */}
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route
                    path="/admin/dashboard"
                    element={<AdminDashboardPage />}
                  />
                  <Route path="/admin/foods" element={<AdminFoodsPage />} />
                  <Route path="/admin/orders" element={<AdminOrdersPage />} />
                  <Route path="/admin/users" element={<AdminUsersPage />} />

                  {/* 404 route */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
            <Toaster position="top-center" reverseOrder={false} />
          </PreloaderProvider>
        </Router>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default App;
