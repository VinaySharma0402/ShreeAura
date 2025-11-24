import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import ProductCard, { type Product } from "./ProductCard";
import { Slider } from "./ui/slider";
import { Checkbox } from "./ui/checkbox";
import { Separator } from "./ui/separator";

import { useCart } from "../contexts/CartContext";
import { HomePageApi } from "../components/services/homepage";
import { motion } from "motion/react";
import { Filter, SearchX } from "lucide-react";

interface SearchPageProps {
  setCurrentPage: (page: string, options?: any) => void;
  setSelectedProduct?: (product: Product) => void;
  onAddToCart?: (product: Product, quantity?: number) => void;
}

interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  rating: number;
  inStock: boolean;
}

export default function SearchPage({
  setCurrentPage,
  onAddToCart,
}: SearchPageProps) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const qName = params.get("name") || "";
  const qCategory = params.get("category") || "";
  const qBrand = params.get("brand") || "";
  const qPrice = params.get("price") ? Number(params.get("price")) : undefined;

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { addToCart, items: cartItems } = useCart();

  // categories options for sidebar (fetched)
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await HomePageApi.getCategories();
        if (Array.isArray(res.data)) {
          setCategoryOptions(res.data.map((c: any) => c.name));
        } else {
          setCategoryOptions([]);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategoryOptions([]);
      }
    };

    fetchCategories();
  }, []);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    categories: qCategory ? [qCategory] : [],
    brands: qBrand ? [qBrand] : [],
    priceRange: [0, qPrice ?? 5000],
    rating: 0,
    inStock: false,
  });

  // Pending filters (used by UI until Apply)
  const [pendingFilters, setPendingFilters] = useState<FilterState>(filters);

  const handlePendingChange = (key: keyof FilterState, value: any) =>
    setPendingFilters((prev) => ({ ...prev, [key]: value }));

  const togglePendingFilter = (
    key: "categories" | "brands",
    value: string
  ) => {
    setPendingFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const applyFilters = () => {
    setFilters(pendingFilters);
    setDropdownOpen(false);
  };

  const clearAllFilters = async () => {
    const cleared: FilterState = {
      categories: [],
      brands: [],
      priceRange: [0, 5000],
      rating: 0,
      inStock: false,
    };

    setPendingFilters(cleared);
    setFilters(cleared);
    setLoading(true);

    try {
      const res = await HomePageApi.getAllProducts();
      const results: Product[] = res.data || [];
      setAllProducts(results);
      // will trigger the filters effect to setProducts
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setAllProducts([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const activeFiltersCount =
    filters.categories.length +
    filters.brands.length +
    (filters.rating > 0 ? 1 : 0) +
    (filters.inStock ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 500 ? 1 : 0);

  // ---------- Fetch products (uses API search when qName present) ----------
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        let results: Product[] = [];

        // Use API search when query name is present and non-empty
        if (qName.trim() !== "") {
          const res = await HomePageApi.searchProductsByName(qName.trim());
          results = res.data || [];
          console.log("API search results for", qName, ":", results);
        } else {
          const res = await HomePageApi.getAllProducts();
          results = res.data || [];
        }

        setAllProducts(results);

        // Apply initial URL param filters immediately so user sees correct initial list
        let filtered = [...results];

        if (qName.trim() !== "") {
          filtered = filtered.filter((p) =>
            p.name.toLowerCase().includes(qName.toLowerCase())
          );
        }

        if (qCategory) {
          filtered = filtered.filter((p) => p.category === qCategory);
        }

        if (qBrand) {
          filtered = filtered.filter((p) => p.brand === qBrand);
        }

        if (qPrice !== undefined) {
          filtered = filtered.filter((p) => p.sellingPrice <= qPrice);
        }

        setProducts(filtered);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setAllProducts([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
    // Intentionally depend on qName/qCategory/qBrand/qPrice (URL params)
  }, [qName, qCategory, qBrand, qPrice]);

  // ---------- Initialize filters / pendingFilters separately (do NOT live inside fetch effect) ----------
  useEffect(() => {
    const uiFilters: FilterState = {
      categories: qCategory ? [qCategory] : [],
      brands: qBrand ? [qBrand] : [],
      priceRange: [0, qPrice ?? 5000],
      rating: 0,
      inStock: false,
    };

    setFilters(uiFilters);
    setPendingFilters(uiFilters);
    // This runs when URL params change — separate from fetch effect to avoid overriding products
  }, [qName, qCategory, qBrand, qPrice]);

  // ---------- Apply the filters to allProducts (when filters or allProducts change) ----------
  useEffect(() => {
    let filtered = [...allProducts];

    if (filters.categories.length > 0) {
      filtered = filtered.filter((p) =>
        filters.categories.includes(p.category || "")
      );
    }

    if (filters.brands.length > 0) {
      filtered = filtered.filter((p) => filters.brands.includes(p.brand || ""));
    }

    const [minPrice, maxPrice] = filters.priceRange;
    filtered = filtered.filter(
      (p) => p.sellingPrice >= minPrice && p.sellingPrice <= maxPrice
    );

    if (filters.rating > 0) {
      filtered = filtered.filter((p) => p.rating >= filters.rating);
    }

    if (filters.inStock) {
      filtered = filtered.filter((p) => !!p.stock);
    }

    setProducts(filtered);
  }, [filters, allProducts]);

  // ---------- Cart handling ----------
  const handleAddToCart = (product: Product) => {
    if (!product.stock) return;

    const inCart = cartItems.some((i) => i.productId === product.productId);
    if (inCart) {
      setCurrentPage("cart");
    } else {
      addToCart(product);
      onAddToCart?.(product, 1);
    }
  };

  // ---------- Filter Sidebar component ----------
  const FilterSidebar = () => (
    <div className="space-y-5 bg-[#1a0f1a]/70 p-5 rounded-2xl border border-[#FFD369]/20 shadow-lg shadow-[#FFD369]/10 backdrop-blur-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#FFD369] flex items-center gap-2">
          <Filter className="w-5 h-5 text-[#FFD369]" /> Filters
        </h3>
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs text-gray-300 hover:text-[#FFD369]"
            >
              Clear ({activeFiltersCount})
            </Button>
          )}
          <Button
            onClick={applyFilters}
            className="bg-[#FFD369] text-[#1a0f1a] hover:bg-[#ffcb47] font-semibold px-3 py-1.5 text-sm rounded-lg transition-all"
          >
            Apply
          </Button>
        </div>
      </div>

      <Separator className="bg-[#FFD369]/30" />

      {/* Category Section */}
      <div className="space-y-3">
        <h4 className="font-semibold text-white text-sm uppercase tracking-wide">
          Categories
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {categoryOptions.map((cat) => (
            <motion.label
              key={cat}
              whileHover={{ x: 4 }}
              className="flex items-center space-x-2 text-gray-300 cursor-pointer"
            >
              <Checkbox
                checked={pendingFilters.categories.includes(cat)}
                onCheckedChange={() => togglePendingFilter("categories", cat)}
              />
              <span>{cat}</span>
            </motion.label>
          ))}
        </div>
      </div>

      <Separator className="bg-[#FFD369]/30" />

      {/* Price Range */}
      <div className="space-y-3">
        <h4 className="font-semibold text-white text-sm uppercase tracking-wide">
          Price Range
        </h4>
        <Slider
          value={pendingFilters.priceRange}
          onValueChange={(v) =>
            handlePendingChange("priceRange", v as [number, number])
          }
          min={0}
          max={5000}
          step={5}
        />
        <div className="flex justify-between text-gray-400 text-sm">
          <span>₹{pendingFilters.priceRange[0]}</span>
          <span>₹{pendingFilters.priceRange[1]}</span>
        </div>
      </div>

      <Separator className="bg-[#FFD369]/30" />

      {/* In Stock */}
      <label className="flex items-center space-x-2 text-gray-300 cursor-pointer">
        <Checkbox
          checked={pendingFilters.inStock}
          onCheckedChange={(c) => handlePendingChange("inStock", c)}
        />
        <span>In Stock Only</span>
      </label>
    </div>
  );

  // ---------- Render ----------
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0f0a10] to-[#1a0f1a] text-white">
      {/* Full Page Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0f0a10]/90 backdrop-blur-sm">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-14 h-14 border-4 border-[#FFD369] border-t-transparent rounded-full mb-6"
          />
          <p className="text-lg font-semibold text-[#FFD369] tracking-wide">
            Fetching Products...
          </p>
        </div>
      )}

      <div className="container mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <Button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full bg-[#FFD369]/20 hover:bg-[#FFD369]/30 text-[#FFD369] font-semibold flex justify-center items-center gap-2"
          >
            <Filter className="w-5 h-5" />
            {dropdownOpen ? "Hide Filters" : "Show Filters"}
          </Button>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 border rounded-2xl bg-[#1a0f1a]/90 shadow-lg"
            >
              <FilterSidebar />
            </motion.div>
          )}
        </div>

        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-24 h-fit">
          <FilterSidebar />
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          {!loading && products.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center"
            >
              {products.map((product) => {
                const inCart = cartItems.some(
                  (i) => i.productId === product.productId
                );
                const isOutOfStock = !product.stock;
                const buttonText = isOutOfStock
                  ? "Out of Stock"
                  : inCart
                  ? "Go to Cart"
                  : "Add to Cart";

                return (
                  <motion.div
                    key={product.productId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full"
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={() => !isOutOfStock && handleAddToCart(product)}
                      onBuyNow={() => {
                        handleAddToCart(product);
                        setCurrentPage("cart");
                      }}
                      onClick={() =>
                        setCurrentPage("product-detail", {
                          id: product.productId,
                          product: product,
                        })
                      }
                      buttonText={buttonText}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            !loading && (
              <div className="flex flex-col items-center justify-center py-24">
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="bg-[#2C1E4A]/40 p-6 rounded-full border border-[#FFD369]/30 shadow-lg shadow-[#FFD369]/10"
                >
                  <SearchX className="w-14 h-14 text-[#FFD369]" />
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[#FFD369] font-bold text-2xl mt-6"
                >
                  No Products Found
                </motion.h3>

                <p className="text-gray-400 text-center mt-2 max-w-sm">
                  We couldn’t find any products matching your filters.
                  Try adjusting your selections or explore some of our popular picks below.
                </p>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-[#FFD369]/80 text-center mt-6 text-sm"
                >
                  Still not sure? Check out what others are loving 👇
                </motion.p>

                <div className="flex flex-wrap justify-center gap-3 mt-4">
                  {[
                    "Scrunchies",
                    "Lipstick",
                    "Perfume",
                    "Clutcher",
                    "Nosepin",
                    "Bindi Set",
                  ].map((name, index) => (
                    <motion.button
                      key={index}
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: "rgba(255,211,105,0.2)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage("search", { name })}
                      className="px-4 py-2 bg-[#2C1E4A]/50 border border-[#FFD369]/40 text-[#FFD369] rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all"
                    >
                      {name}
                    </motion.button>
                  ))}
                </div>

                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-5xl mt-10"
                >
                  🛍️
                </motion.div>
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
}
