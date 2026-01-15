import React from "react";
import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";

export interface Product {
  productId: string;
  name: string;
  brand?: string;
  sellingPrice: number;
  mrp: number;
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
  stock?: number;
  imageUrl?: string;
  category?: string;
  description?: string;
}

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  onClick?: (product: Product) => void;
  buttonText?: string;
  onBuyNow?: (product: Product) => void; // optional buy now callback
}

export default function ProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
  onClick,
  buttonText,
}: ProductCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToWishlist?.(product);
    toast.success(`${product.name} added to wishlist!`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="
        bg-transparent
        cursor-pointer
        group w-full max-w-[240px]
      "
    >
      {/* Product Image */}
      <div
        className="relative aspect-[3/4] overflow-hidden rounded-none bg-gray-50"
        onClick={() => onClick?.(product)}
      >
        <ImageWithFallback
          src={product.imageUrl || product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-0 left-0 bg-[var(--secondary)] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
            {product.badge}
          </div>
        )}

        {/* Quick Actions Overlay (Wishlist) */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0"
            onClick={handleAddToWishlist}
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        {/* Out of Stock */}
        {!product.stock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
            <span className="text-gray-800 text-sm font-bold border border-gray-800 px-3 py-1 uppercase tracking-widest">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="pt-3 text-center space-y-1">
        <h3
          className="text-[var(--foreground)] font-medium text-base leading-tight hover:text-[var(--primary)] transition-colors cursor-pointer truncate px-2"
          onClick={() => onClick?.(product)}
        >
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center justify-center gap-2">
          {product.mrp > product.sellingPrice && (
            <span className="text-gray-400 text-sm line-through decoration-gray-400">
              ₹{product.mrp.toFixed(2)}
            </span>
          )}
          <span className="text-[var(--foreground)] font-bold text-lg">
            ₹{product.sellingPrice.toFixed(2)}
          </span>
        </div>

        {/* Button - Minimal, only visible on group hover for desktop vibe, or always on mobile */}
        <div className="pt-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 px-4 pb-2">
          <Button
            className={`
                w-full h-9 text-xs font-bold uppercase tracking-wider rounded-none transition-all duration-200
                ${product.stock === 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-[var(--foreground)] text-white hover:bg-[var(--primary)] hover:text-white"
              }
                `}
            disabled={product.stock === 0}
            onClick={handleAddToCart}
          >
            {product.stock === 0 ? "Notify Me" : (buttonText || "Add to Cart")}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
