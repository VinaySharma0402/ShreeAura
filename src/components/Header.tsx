import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, ShoppingBag, User } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useCart } from "../contexts/CartContext";
import { HomePageApi } from "./services/homepage";
import logo from "../assets/aura_shree_logo.png";

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (
    page: string,
    options?: { category?: string; price?: number; brand?: string; name?: string }
  ) => void;
}

interface TokenPayload {
  User: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export default function Header({ setCurrentPage }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<TokenPayload["User"] | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // ✅ added loader state
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { getCartCount, toggleCart } = useCart();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    try {
      const response = await HomePageApi.searchProductsByName(query);
      console.log("Search results:", response.data);
      setCurrentPage("search", { name: query });
    } catch (err) {
      console.error("Search API error:", err);
    }
  };

  useEffect(() => {
    const tokenString = localStorage.getItem("token");
    if (!tokenString) return;
    let jwt = "";
    try {
      const parsed = JSON.parse(tokenString);
      jwt = parsed.token || tokenString;
    } catch {
      jwt = tokenString;
    }
    try {
      const decoded: TokenPayload = jwtDecode(jwt);
      setUser(decoded.User);
    } catch (err) {
      console.error("Failed to decode token:", err);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ Updated logout function with loader + clear all storage
  const logout = async () => {
    setIsLoggingOut(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // loader for 1s
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    setCurrentPage("home");
    setIsLoggingOut(false);
  };

  // ✅ Loader overlay
  if (isLoggingOut) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-14 h-14 border-4 border-[#FFD369] border-t-transparent rounded-full animate-spin"
        />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[#FFD369] mt-6 text-lg font-medium"
        >
          Logging out...
        </motion.p>
      </div>
    );
  }

  // ✅ everything else below is unchanged
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/95 sticky top-0 z-50 backdrop-blur-md border-b border-[var(--border)] py-2"
    >
      {/* Desktop Header */}
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-2">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setCurrentPage("home")}
        >
          <div className="relative">
            <motion.img
              src={logo}
              alt="Logo"
              width={42}
              height={42}
              className="rounded-full"
              whileHover={{ rotate: 8 }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
            Shree Grocery
          </span>
        </motion.div>

        {/* Search Bar */}
        {!isMobile && (
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 max-w-[600px] mx-auto relative hidden md:block group"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search for vegetables, fruits, etc..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 pl-6 pr-14 text-gray-800 bg-gray-50/50 border border-gray-200 rounded-full outline-none focus:bg-white focus:border-[var(--primary)] focus:shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] transition-all duration-300 placeholder-gray-400 font-['Outfit'] text-[15px]"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-[var(--primary)] rounded-full flex items-center justify-center text-white shadow-md hover:bg-red-600 transition-colors"
              >
                <Search size={18} strokeWidth={2.5} />
              </motion.button>
            </div>
          </motion.form>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-6 relative">
          {/* Seller - visible on both mobile and desktop */}
          <motion.a
            href="https://seller.shreeaura.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--foreground)] hover:text-[var(--primary)] font-medium text-sm tracking-wide transition-colors hidden sm:block"
          >
            Become a Seller
          </motion.a>

          {/* Login / User */}
          {!user ? (
            <motion.button
              onClick={() => setCurrentPage("login")}
              className="text-[var(--foreground)] hover:text-[var(--primary)] font-medium text-sm tracking-wide transition-colors flex items-center gap-1"
            >
              <User size={18} />
              {!isMobile && <span>Log In</span>}
              {isMobile && <span className="text-xs">Login</span>}
            </motion.button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <motion.button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="flex items-center gap-2 text-[var(--foreground)] hover:text-[var(--primary)] transition-colors font-medium text-sm tracking-wide"
              >
                <User size={18} />
                {!isMobile && <span>{user.name}</span>}
              </motion.button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-12 left-1/2 -translate-x-1/2 md:left-auto md:right-0 md:translate-x-0 bg-white border border-gray-100 rounded-none shadow-xl w-[160px] md:w-[180px] overflow-hidden z-50 py-2"
                  >
                    {/* Mobile-only: Become a Seller in dropdown */}
                    <a
                      href="https://seller.shreeaura.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block sm:hidden w-full text-left px-5 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[var(--primary)] transition-colors"
                    >
                      Become a Seller
                    </a>
                    <button
                      className="w-full text-left px-5 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[var(--primary)] transition-colors"
                      onClick={() => setCurrentPage("profile")}
                    >
                      Profile
                    </button>
                    <button
                      className="w-full text-left px-5 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[var(--primary)] transition-colors"
                      onClick={() => setCurrentPage("orders")}
                    >
                      My Orders
                    </button>
                    <button
                      className="w-full text-left px-5 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      onClick={logout}
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Cart */}
          <motion.button
            onClick={() => toggleCart(true)}
            className="relative flex items-center gap-1 text-[var(--foreground)] hover:text-[var(--primary)] transition-colors font-medium"
          >
            <ShoppingBag size={22} strokeWidth={1.5} />
            <AnimatePresence>
              {getCartCount() > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  className="absolute -top-1 -right-2 bg-[var(--primary)] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold"
                >
                  {getCartCount()}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Search */}
      {isMobile && (
        <form
          onSubmit={handleSearch}
          className="relative block md:hidden px-4 py-2 bg-white border-t border-gray-100"
        >
          <input
            type="text"
            placeholder="Search for groceries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3 pl-5 pr-12 text-[var(--foreground)] bg-gray-100 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all duration-300"
          />
          <motion.div
            whileTap={{ scale: 0.9 }}
            onClick={handleSearch as any}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-[var(--primary)] transition-colors"
          >
            <Search size={20} />
          </motion.div>
        </form>
      )}
    </motion.header>
  );
}
