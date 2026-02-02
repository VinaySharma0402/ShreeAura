import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";
import { getProductReviews } from "./services/costumer";

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
  onBuyNow?: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
  onClick,
  buttonText,
  onBuyNow,
}: ProductCardProps) {
  const [rating, setRating] = useState(product.rating || 0);
  const [reviewsCount, setReviewsCount] = useState(product.reviews || 0);

  // Fetch reviews and calculate average rating
  useEffect(() => {
    const fetchRating = async () => {
      if (!product.productId) return;
      try {
        const reviews = await getProductReviews(product.productId);
        if (reviews && reviews.length > 0) {
          const total = reviews.reduce((acc: number, r: any) => acc + (Number(r.rating) || 0), 0);
          setRating(total / reviews.length);
          setReviewsCount(reviews.length);
        }
      } catch (error) {
        // Silently fail - show default rating from product
        console.error("Failed to fetch rating for product", product.productId);
      }
    };
    fetchRating();
  }, [product.productId]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBuyNow?.(product);
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToWishlist?.(product);
    toast.success(`${product.name} added to wishlist!`);
  };

  const calculateDiscount = (mrp: number, sellingPrice: number) => {
    if (mrp > sellingPrice) {
      return Math.round(((mrp - sellingPrice) / mrp) * 100);
    }
    return 0;
  };

  const discount = calculateDiscount(product.mrp, product.sellingPrice);

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-lg cursor-pointer group w-full max-w-[280px]"
    >
      {/* Product Image */}
      <div
        className="relative bg-gray-100 p-3"
        onClick={() => onClick?.(product)}
      >
        <div className="aspect-square overflow-hidden rounded-lg">
          <ImageWithFallback
            src={product.imageUrl || product.image}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-4 left-4 bg-[#ED1C24] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            {product.badge}
          </div>
        )}

        {/* Wishlist Button */}
        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-red-500 shadow-sm"
            onClick={handleAddToWishlist}
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        {/* Out of Stock Overlay */}
        {!product.stock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center rounded-lg m-3">
            <span className="text-gray-800 text-sm font-bold border-2 border-gray-800 px-4 py-2 rounded-lg uppercase tracking-widest">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        {/* Name */}
        <h3
          className="text-[var(--primary)] font-bold text-base leading-tight hover:text-[var(--primary)]/80 transition-colors cursor-pointer line-clamp-2"
          onClick={() => onClick?.(product)}
        >
          {product.name}
        </h3>

        {/* Brand */}
        {product.brand && (
          <p className="text-gray-600 text-sm font-['Outfit']">
            {product.brand}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-gray-600 text-xs font-['Outfit'] ml-1">
            {rating > 0 ? (
              <>
                {rating.toFixed(1)}
                {reviewsCount > 0 && ` (${reviewsCount})`}
              </>
            ) : (
              <span className="text-gray-400">No reviews yet</span>
            )}
          </span>
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-gray-500 text-sm font-['Outfit'] line-clamp-2">
            🌿 {product.description}
          </p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-[#4CAF50] font-bold text-xl font-['Outfit']">
            ₹{product.sellingPrice.toFixed(2)}
          </span>
          {discount > 0 && (
            <>
              <span className="text-gray-500 text-sm line-through font-['Outfit']">
                ₹{product.mrp.toFixed(2)}
              </span>
              <span className="text-[#4CAF50] text-sm font-bold font-['Outfit']">
                {discount}% OFF
              </span>
            </>
          )}
        </div>

        {/* Buttons */}
        <div className="space-y-2 pt-2">
          {/* Add to Cart Button */}
          <button
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-[var(--primary)] text-[var(--primary)] rounded-full font-bold text-sm hover:bg-[var(--primary)] hover:text-white transition-all font-['Outfit'] ${!product.stock ? "opacity-50 cursor-not-allowed" : ""
              }`}
            disabled={!product.stock}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-4 h-4" />
            {!product.stock ? "Out of Stock" : (buttonText || "Add to Cart")}
          </button>

          {/* Buy Now Button */}
          {product.stock && onBuyNow && (
            <button
              className="w-full py-2.5 px-4 bg-[var(--secondary)] text-gray-900 rounded-full font-bold text-sm hover:bg-[var(--secondary)]/90 transition-all font-['Outfit']"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
