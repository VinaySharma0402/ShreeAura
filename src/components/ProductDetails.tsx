import { useLocation } from "react-router-dom";
import { Star } from "lucide-react";
import type { Product } from "./ProductCard";
import { useCart } from "../contexts/CartContext";
import { toast } from "sonner";

export default function ProductDetails() {
  const location = useLocation();
  const product: Product = location.state;

  const { addToCart, items: cartItems } = useCart();

  if (!product) {
    return (
      <div className="text-center p-10 text-white text-lg">
        No product found. Please go back and select a product again.
      </div>
    );
  }

  const inCart = cartItems.some((i) => i.productId === product.productId);

  // ------------------------------
  // ADD TO CART
  // ------------------------------
  const handleAddToCart = () => {
    if (!product.stock) {
      toast.error("This product is out of stock!");
      return;
    }

    if (inCart) {
      toast.message("Already in cart. Redirecting...");
      window.location.href = "/cart";
      return;
    }

    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  // ------------------------------
  // BUY NOW
  // ------------------------------
  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!product.stock) {
      toast.error("This product is out of stock!");
      return;
    }

    addToCart(product);

    toast.success(`Redirecting to checkout...`);
    window.location.href = "/cart";
  };

  const discount =
    product.mrp > product.sellingPrice
      ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[#1a0f1a] text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* ================= LEFT SECTION ================= */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-3">
            {[product.imageUrl || product.image].map((img, i) => (
              <img
                key={i}
                src={img}
                className="w-14 h-14 rounded-lg object-cover border border-white/20 cursor-pointer hover:scale-105 transition"
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1">
            <img
              src={product.imageUrl || product.image}
              className="w-full rounded-xl shadow-lg"
            />

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                className="w-1/2 py-3 bg-[#FFD369] text-black font-bold rounded-lg hover:bg-[#ffce57] transition"
                onClick={handleAddToCart}
              >
                {inCart ? "GO TO CART" : "ADD TO CART"}
              </button>

              <button
                className="w-1/2 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition"
                onClick={handleBuyNow}
              >
                BUY NOW
              </button>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SECTION ================= */}
        <div>
          {/* Product Name */}
          <h1 className="text-2xl md:text-3xl font-bold leading-snug">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1 bg-green-600 px-2 py-1 rounded-md text-xs">
              <span>{product.rating}</span>
              <Star size={14} />
            </div>
            <span className="text-white/70 text-sm">{product.reviews} Reviews</span>
          </div>

          {/* Price */}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-3xl font-bold text-[#FFD369]">
              ₹{product.sellingPrice}
            </span>

            <span className="line-through text-white/60">₹{product.mrp}</span>

            {discount > 0 && (
              <span className="text-green-400 font-semibold">{discount}% off</span>
            )}
          </div>

          {/* Brand */}
          <p className="mt-3 text-white/80 text-sm">Brand: {product.brand}</p>

         

          {/* Description */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Product Description</h3>
            <p className="text-white/80 mt-2 leading-relaxed">
              {product.description || "No description available."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
