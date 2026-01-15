import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from "motion/react";
import { Routes, Route, useLocation, useNavigate, HashRouter } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";

import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import CartPage from "./components/CartPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ProfilePage from "./components/ProfilePage";
import OrdersPage from "./components/OrdersPage";
import SearchPage from "./components/SearchPage";
import CheckoutPage from "./components/CheckoutPage";
import InvoicePage from "./components/InvoicePage";
import SecondaryHeader from "./components/SecondaryHeader";

import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

import ProductDetails from "./components/ProductDetails";
import Team from "./components/Team";
import CartDrawer from "./components/CartDrawer";

function AnimatedRoutes() {
  const location = useLocation();
  const navigate = useNavigate();

  // In-app navigation stack so we can reliably navigate back inside the app
  // when the hardware back button is pressed. We push each visited route
  // (pathname+search) into the stack. On back, pop and navigate to previous.
  const navStack = useRef<string[]>([]);

  // Push current route to stack (avoid pushing duplicates for same route)
  useEffect(() => {
    const cur = location.pathname + (location.search || '');
    const stack = navStack.current;
    if (stack.length === 0 || stack[stack.length - 1] !== cur) {
      stack.push(cur);
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    let removeListener: any;
    try {
      const { App: CapacitorApp } = require('@capacitor/app');
      if (CapacitorApp && CapacitorApp.addListener) {
        const lastBackPress = { time: 0 };
        removeListener = CapacitorApp.addListener('backButton', () => {
          const stack = navStack.current;
          if (stack.length > 1) {
            // pop current
            stack.pop();
            const previous = stack[stack.length - 1];
            // navigate to previous route (string may include search)
            navigate(previous, { replace: true });
          } else {
            // If the user presses back on root, require a double-press to exit
            const now = Date.now();
            if (now - lastBackPress.time < 2000) {
              if (CapacitorApp.exitApp) CapacitorApp.exitApp();
            } else {
              lastBackPress.time = now;
              toast('Press back again to exit');
            }
          }
        });
      }
    } catch (e) {
      // Capacitor not present (web); ignore
    }

    return () => {
      try {
        if (removeListener && typeof removeListener.remove === 'function') removeListener.remove();
      } catch (err) {
        // ignore
      }
    };
  }, [navigate]);

  // ⭐ FIXED setCurrentPage — product navigation now works correctly
  const setCurrentPage = (
    page: string,
    options?: {
      id?: string;
      product?: any;
      category?: string;
      price?: number;
      brand?: string;
      name?: string;
    }
  ) => {

    const params = new URLSearchParams();
    if (options?.category) params.append("category", options.category);
    if (options?.brand) params.append("brand", options.brand);
    if (options?.price) params.append("price", String(options.price));
    if (options?.name) params.append("name", options.name);

    switch (page) {
      case "home":
        navigate("/");
        break;

      // ⭐ Correct product detail navigation
      case "product-detail":
        if (!options?.id) return console.error("❌ product ID missing!");

        navigate(`/product/${options.id}`, {
          state: options.product,
        });
        break;

      case "cart":
        navigate("/cart");
        break;

      case "login":
        navigate("/login");
        break;

      case "register":
        navigate("/register");
        break;

      case "profile":
        navigate("/profile");
        break;

      case "orders":
        navigate("/orders");
        break;

      case "search":
        navigate(`/search?${params.toString()}`);
        break;

      case "checkout":
        navigate("/checkout");
        break;
      case "team":
        navigate("/team");
        break;
      case "invoice":
        navigate("/invoice", { state: options?.product });
        break;
      default:
        navigate("/");
        break;
    }
  };

  // Animation settings
  const pageVariants = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    in: { opacity: 1, y: 0, scale: 1 },
    out: { opacity: 0, y: -20, scale: 1.02 },
  };

  const pageTransition: any = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4,
  };

  const isSpecialPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">

      {!isSpecialPage && (
        <>
          <Header currentPage={location.pathname} setCurrentPage={setCurrentPage} />
          <SecondaryHeader setCurrentPage={setCurrentPage} />
        </>
      )}

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          className={!isSpecialPage ? "" : "min-h-screen"}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage setCurrentPage={setCurrentPage} />} />

            <Route path="/cart" element={<CartPage setCurrentPage={setCurrentPage} />} />
            <Route path="/login" element={<LoginPage setCurrentPage={setCurrentPage} />} />
            <Route path="/register" element={<RegisterPage setCurrentPage={setCurrentPage} />} />
            <Route path="/profile" element={<ProfilePage setCurrentPage={setCurrentPage} />} />
            <Route path="/orders" element={<OrdersPage setCurrentPage={setCurrentPage} />} />

            {/* ⭐ FIXED product detail route */}
            <Route path="/product/:productId" element={<ProductDetails />} />

            <Route
              path="/search"
              element={
                <SearchPage
                  setCurrentPage={setCurrentPage}
                  setSelectedProduct={(product) => {
                    setCurrentPage("product-detail", {
                      id: product.productId,
                      product,
                    });
                  }}
                />
              }
            />

            <Route
              path="/checkout"
              element={<CheckoutPage setCurrentPage={setCurrentPage} />}
            />
            <Route
              path="/invoice"
              element={<InvoicePage />}
            />
            <Route
              path="/team"
              element={<Team />}
            />
          </Routes>
        </motion.main>
      </AnimatePresence>

      {!isSpecialPage && <Footer />}

      {/* Back Button */}
      {isSpecialPage && (
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={() => setCurrentPage("home")}
            className="bg-[#FFD369] text-[#1a0f1a] px-6 py-3 rounded-lg hover:bg-[#FFD369]/90 transition-all duration-300 font-semibold shadow-lg"
          >
            ← Back to Home
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <HashRouter>
          <AnimatedRoutes />
          <CartDrawer />
          <Toaster
            richColors
            position="top-right"
            toastOptions={{
              style: {
                background: "#2C1E4A",
                border: "1px solid #FFD369",
                color: "#f5f1f5",
                borderRadius: "12px",
              },
            }}
          />
        </HashRouter>
      </CartProvider>
    </AuthProvider>
  );
}
