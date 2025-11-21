import React from "react";
import { motion } from "motion/react";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
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
  onBuyNow,
}: ProductCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToWishlist?.(product);
    toast.success(`${product.name} added to wishlist!`);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
  e.stopPropagation();

  if (product.stock !== undefined && product.stock === 0) {
    toast.error("This product is out of stock!");
    return;
  }

  // 1️⃣ Add to cart
  onAddToCart?.(product);

  // 2️⃣ Redirect to cart if parent passed function
  onBuyNow?.(product);

  // 3️⃣ Toast message
  toast.success(`Redirecting to checkout for ${product.name}...`);
};

  const isGoToCart = buttonText?.toLowerCase().includes("go to cart");
  const discount =
    product.mrp > product.sellingPrice
      ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
      : 0;

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="
        bg-gradient-to-b from-[#2a1c3f] to-[#1a0f1a]
        shadow-lg hover:shadow-2xl hover:shadow-[#FFD369]/40
        rounded-xl overflow-hidden cursor-pointer
        group w-full max-w-[240px]
        transition-all duration-300
      "
    >
      {/* Product Image */}
      <div
        className="relative aspect-square overflow-hidden rounded-xl"
        onClick={() => onClick?.(product)}
      >
        <ImageWithFallback
          src={product.imageUrl || product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Badge */}
        {product.badge && (
          <Badge className="absolute top-2 left-2 bg-gradient-to-r from-[#FFD369] to-[#FFB347] text-[#1a0f1a] border-none text-xs px-2 py-1 shadow-md">
            {product.badge}
          </Badge>
        )}

        {/* Wishlist */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          className="absolute top-2 right-2"
        >
          <Button
            variant="ghost"
            size="icon"
            className="
              bg-black/30 text-white
              hover:bg-gradient-to-r hover:from-[#FFD369] hover:to-[#FFB347] hover:text-[#1a0f1a]
              w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-200
            "
            onClick={handleAddToWishlist}
          >
            <motion.div whileTap={{ scale: 1.2 }}>
              <Heart className="w-4 h-4" />
            </motion.div>
          </Button>
        </motion.div>

        {/* Out of Stock */}
        {!product.stock && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
            <span className="text-white text-xs font-semibold uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        <h3
          className="text-white font-bold text-base leading-tight truncate hover:text-[#FFD369] transition-colors cursor-pointer"
          onClick={() => onClick?.(product)}
        >
          {product.name}
        </h3>

        <h5 className="text-white/80 text-xs">{product.brand}</h5>
        <p className="text-white/70 text-sm line-clamp-2">{product.description}</p>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-[#FFD369] font-bold text-base">
            ₹{product.sellingPrice.toFixed(2)}
          </span>

          {product.mrp > product.sellingPrice && (
            <span className="text-white/50 text-sm line-through">
              ₹{product.mrp.toFixed(2)}
            </span>
          )}

          {discount > 0 && (
            <span className="text-green-400 text-sm font-semibold">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          {/* Add to Cart */}
          <Button
            className={`
              w-full py-2 text-sm font-semibold transition-all duration-200
              hover:shadow-lg hover:shadow-[#FFD369]/40
              ${
                product.stock === 0
                  ? "bg-gray-500 text-white cursor-not-allowed"
                  : isGoToCart
                  ? "bg-[#4B1C3F] text-[#FFD369] hover:bg-[#5e2450]"
                  : "bg-gradient-to-r from-[#FFD369] to-[#FFB347] text-[#1a0f1a] hover:scale-105"
              }
            `}
            disabled={product.stock === 0}
            onClick={handleAddToCart}
          >
            {product.stock === 0 ? (
              "Notify Me"
            ) : (
              <div className="flex items-center justify-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                {buttonText || "Add to Cart"}
              </div>
            )}
          </Button>

          {/* Buy Now */}
          {(product.stock ?? 1) > 0 && (
            <Button
              className="
                w-full py-2 text-sm font-semibold 
                bg-[#4B1C3F] text-[#FFD369]
                hover:bg-[#5e2450] hover:shadow-lg hover:shadow-[#FFD369]/40 
                transition-all duration-200
              "
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
