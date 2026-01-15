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
          const isStringArray = typeof res.data[0] === 'string';
          setCategoryOptions(isStringArray ? res.data : res.data.map((c: any) => c.name));
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

  const shuffleArray = <T,>(arr: T[]): T[] => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const [filters, setFilters] = useState<FilterState>({
    categories: qCategory ? [qCategory] : [],
    brands: qBrand ? [qBrand] : [],
    priceRange: [0, qPrice ?? 5000],
    rating: 0,
    inStock: false,
  });

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

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        let results: Product[] = [];

        if (qName.trim() !== "") {
          const res = await HomePageApi.searchProductsByName(qName.trim());
          results = res.data || [];
        } else {
          const res = await HomePageApi.getAllProducts();
          results = res.data || [];
        }

        setAllProducts(results);

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

        setProducts(shuffleArray(filtered));
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setAllProducts([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, [qName, qCategory, qBrand, qPrice]);

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
  }, [qName, qCategory, qBrand, qPrice]);

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

    setProducts(shuffleArray(filtered));
  }, [filters, allProducts]);

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

  const FilterSidebar = () => (
    <div className="space-y-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 font-['Outfit']">
          <Filter className="w-5 h-5 text-[var(--primary)]" /> Filters
        </h3>
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs text-gray-500 hover:text-[var(--primary)] font-['Outfit']"
            >
              Clear ({activeFiltersCount})
            </Button>
          )}
          <Button
            onClick={applyFilters}
            className="bg-[var(--primary)] text-white hover:bg-red-700 font-bold px-4 py-1.5 text-sm rounded-full transition-all shadow-sm font-['Outfit']"
          >
            Apply
          </Button>
        </div>
      </div>

      <Separator className="bg-gray-100" />

      {/* Category Section */}
      <div className="space-y-3">
        <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide font-['Outfit']">
          Categories
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {categoryOptions.map((cat) => (
            <motion.label
              key={cat}
              whileHover={{ x: 4 }}
              className="flex items-center space-x-2 text-gray-600 cursor-pointer hover:text-[var(--primary)] font-['Outfit']"
            >
              <Checkbox
                checked={pendingFilters.categories.includes(cat)}
                onCheckedChange={() => togglePendingFilter("categories", cat)}
                className="border-gray-300 data-[state=checked]:bg-[var(--primary)] data-[state=checked]:border-[var(--primary)]"
              />
              <span className="text-gray-700">{cat}</span>
            </motion.label>
          ))}
        </div>
      </div>

      <Separator className="bg-gray-100" />

      {/* Price Range */}
      <div className="space-y-3">
        <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide font-['Outfit']">
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
          className="py-4"
        />
        <div className="flex justify-between text-gray-500 text-sm font-medium font-['Outfit']">
          <span>₹{pendingFilters.priceRange[0]}</span>
          <span>₹{pendingFilters.priceRange[1]}</span>
        </div>
      </div>

      <Separator className="bg-gray-100" />

      {/* In Stock */}
      <label className="flex items-center space-x-2 text-gray-600 cursor-pointer hover:text-[var(--primary)] font-['Outfit']">
        <Checkbox
          checked={pendingFilters.inStock}
          onCheckedChange={(c) => handlePendingChange("inStock", c)}
          className="border-gray-300 data-[state=checked]:bg-[var(--primary)] data-[state=checked]:border-[var(--primary)]"
        />
        <span>In Stock Only</span>
      </label>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] font-['Outfit']">

      {/* Search Header Info */}
      <div className="bg-[#FFF8E7] py-6 border-b border-[#F7E8C6]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#1c1c1c]">
                {qCategory ? qCategory : (qName ? `Search: "${qName}"` : "All Groceries")}
              </h1>
              <p className="text-gray-600 mt-1 text-sm">
                {products.length} {products.length === 1 ? 'product' : 'products'} found
              </p>
            </div>

            {/* Sort (Placeholder for future) */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-[var(--primary)] focus:border-[var(--primary)] block w-full p-2.5">
                <option>Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest Arrivals</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Full Page Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-14 h-14 border-4 border-[var(--primary)] border-t-transparent rounded-full mb-6"
          />
          <p className="text-lg font-semibold text-[var(--primary)] tracking-wide">
            Fetching Freshness...
          </p>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 items-start">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4 w-full">
          <Button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full bg-white text-gray-800 font-bold flex justify-center items-center gap-2 border border-gray-200 shadow-sm py-3"
          >
            <Filter className="w-5 h-5 text-[var(--primary)]" />
            {dropdownOpen ? "Hide Filters" : "Show Filters"}
          </Button>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 border rounded-2xl bg-white shadow-lg z-20 relative"
            >
              <FilterSidebar />
            </motion.div>
          )}
        </div>

        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0 sticky top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto">
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
                    // Pass prop to ensure button is visible or style is correct if needed in future
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
                  className="bg-gray-50 p-6 rounded-full border border-gray-100 shadow-sm mb-6"
                >
                  <SearchX className="w-14 h-14 text-gray-300" />
                </motion.div>

                <h3 className="text-gray-900 font-bold text-2xl">
                  No Products Found
                </h3>

                <p className="text-gray-500 text-center mt-2 max-w-sm">
                  We couldn’t find any products matching your filters.
                  Try adjusting your selections.
                </p>

                <Button
                  variant="outline"
                  className="mt-6 border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={clearAllFilters}
                >
                  Clear All Filters
                </Button>
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
}
