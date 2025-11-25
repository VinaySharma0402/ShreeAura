import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, ShoppingBag, Store, LogIn, User } from "lucide-react";
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
  const { getCartCount } = useCart();

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
      className="bg-[rgba(75,28,63,0.95)] sticky top-0 z-50 backdrop-blur-md border-b border-[rgba(255,211,105,0.2)] shadow-[0_0_15px_rgba(255,211,105,0.05)]"
    >
      {/* Desktop Header */}
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-4 py-3">
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
            <motion.div
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
              style={{ boxShadow: "0 0 15px 2px rgba(255,211,105,0.4)" }}
            />
          </div>
          <span className="text-2xl font-bold text-[#FFD369] tracking-wide hover:text-white transition-all duration-300">
            ShreeAura
          </span>
        </motion.div>

        {/* Search Bar */}
        {!isMobile && (
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 max-w-[650px] mx-5 relative hidden md:block"
          >
            <input
              type="text"
              placeholder="Search for products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 pl-5 pr-12 text-white bg-[rgba(44,30,74,0.8)] border border-[rgba(255,211,105,0.4)] rounded-xl outline-none focus:ring-2 focus:ring-[#FFD369]/40 transition-all duration-300 placeholder-[#FFD369]/60"
            />
            <motion.div
              whileTap={{ scale: 0.9 }}
              onClick={handleSearch as any}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#FFD369] cursor-pointer hover:text-white transition-colors"
            >
              <Search size={22} />
            </motion.div>
          </motion.form>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-5 relative">
          {/* Seller */}
          <motion.a
            href="https://seller.shreeaura.in"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 text-[#FFD369] hover:text-white transition-colors"
          >
            <Store size={20} />
            {!isMobile && <span>Become a Seller</span>}
          </motion.a>

          {/* Login / User */}
          {!user ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setCurrentPage("login")}
              className="flex items-center gap-2 text-[#FFD369] hover:text-white transition-colors"
            >
              <LogIn size={20} />
              {!isMobile && <span>Login</span>}
            </motion.button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowDropdown((prev) => !prev)}
                className="flex items-center gap-2 text-[#FFD369] hover:text-white transition-colors"
              >
                <User size={20} />
                {!isMobile && <span>{user.name}</span>}
              </motion.button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-12 left-1/2 -translate-x-1/2 md:left-auto md:right-0 md:translate-x-0 bg-[rgba(33,21,57,0.95)] border border-[rgba(255,211,105,0.3)] rounded-lg shadow-lg w-[160px] md:w-[180px] backdrop-blur-md overflow-hidden z-50"
                  >
                    <button
                      className="w-full text-left px-4 py-3 text-[#FFD369] hover:bg-[rgba(255,211,105,0.1)] transition-colors"
                      onClick={() => setCurrentPage("profile")}
                    >
                      Profile
                    </button>
                    <button
                      className="w-full text-left px-4 py-3 text-[#FFD369] hover:bg-[rgba(255,211,105,0.1)] transition-colors"
                      onClick={() => setCurrentPage("orders")}
                    >
                      My Orders
                    </button>
                    <button
                      className="w-full text-left px-4 py-3 text-[#FFD369] hover:bg-[rgba(255,211,105,0.1)] transition-colors"
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
            whileHover={{ scale: 1.1 }}
            onClick={() => setCurrentPage("cart")}
            className="relative flex items-center gap-2 text-[#FFD369] hover:text-white transition-colors"
          >
            <ShoppingBag size={20} />
            {!isMobile && <span>Cart</span>}
            <AnimatePresence>
              {getCartCount() > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  className="absolute -top-1 -right-2 bg-[#A30B37] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-md"
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
          className="relative block md:hidden px-4 py-2 bg-[rgba(75,28,63,0.95)]"
        >
          <input
            type="text"
            placeholder="Search for products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3 pl-5 pr-12 text-[#FFD369] bg-[rgba(33,21,57,0.95)] border border-[rgba(255,211,105,0.3)] rounded-xl outline-none focus:ring-2 focus:ring-[#FFD369]/40 transition-all duration-300"
          />
          <motion.div
            whileTap={{ scale: 0.9 }}
            onClick={handleSearch as any}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-[#FFD369] cursor-pointer hover:text-white transition-colors"
          >
            <Search size={20} />
          </motion.div>
        </form>
      )}
    </motion.header>
  );
}
