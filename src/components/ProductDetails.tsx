import { useLocation, useParams } from "react-router-dom";
import { Star, Share2 } from "lucide-react";
import type { Product } from "./ProductCard";
import { useCart } from "../contexts/CartContext";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { HomePageApi } from "./services/homepage";

export default function ProductDetails() {
  const location = useLocation();
  const { productId } = useParams();

  const productFromState = location.state as Product | null;

  const [product, setProduct] = useState<Product | null>(productFromState);
  const [loading, setLoading] = useState(!productFromState);

  const { addToCart, items: cartItems } = useCart();

  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    console.log(currentUrl);
    setCurrentUrl(window.location.href);
  }, []);

  // 🔥 Fetch product by ID if not coming from state
  useEffect(() => {
    console.log("Product fetched by ID===========:", productId);
    if (!productFromState && productId) {
      setLoading(true);
        console.log("Product fetched by ID===========:", productId);
      HomePageApi.getProductById(productId)
        .then((res) => {
          console.log("Product fetched by ID===========:", res.data);
          setProduct(res.data);
        })
        .catch(() => {
          toast.error("Failed to load product");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [productId, productFromState]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center p-10 text-white text-lg">
        No product found.
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

  // ------------------------------
  // SHARE
  // ------------------------------
  const handleShare = async () => {
  try {
    const url = window.location.origin + `/product/${product.productId}`;

    if (navigator.share) {
      await navigator.share({
        url, // ✅ ONLY URL here
      });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Product link copied!");
    }
  } catch {
    toast.error("Unable to share product");
  }
};


  const discount =
    product.mrp > product.sellingPrice
      ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[#1a0f1a] text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* LEFT */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex md:flex-col gap-3">
            {[product.imageUrl || product.image].map((img, i) => (
              <img
                key={i}
                src={img}
                className="w-14 h-14 rounded-lg object-cover border border-white/20"
              />
            ))}
          </div>

          <div className="flex-1">
            <img
              src={product.imageUrl || product.image}
              className="w-full rounded-xl shadow-lg"
            />

            <div className="flex gap-4 mt-6">
              <button
                className="w-1/2 py-3 bg-[#FFD369] text-black font-bold rounded-lg"
                onClick={handleAddToCart}
              >
                {inCart ? "GO TO CART" : "ADD TO CART"}
              </button>

              <button
                className="w-1/2 py-3 bg-orange-500 text-white font-bold rounded-lg"
                onClick={handleBuyNow}
              >
                BUY NOW
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <div className="flex justify-between items-start">
            <h1 className="text-2xl md:text-3xl font-bold">
              {product.name}
            </h1>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg"
            >
              <Share2 size={16} />
              Share
            </button>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1 bg-green-600 px-2 py-1 rounded-md text-xs">
              <span>{product.rating}</span>
              <Star size={14} />
            </div>
            <span className="text-white/70 text-sm">
              {product.reviews} Reviews
            </span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-3xl font-bold text-[#FFD369]">
              ₹{product.sellingPrice}
            </span>
            <span className="line-through text-white/60">
              ₹{product.mrp}
            </span>
            {discount > 0 && (
              <span className="text-green-400">{discount}% off</span>
            )}
          </div>

          <p className="mt-3 text-white/80 text-sm">
            Brand: {product.brand}
          </p>

          <div className="mt-6">
            <h3 className="text-lg font-semibold">Product Description</h3>
            <p className="text-white/80 mt-2">
              {product.description || "No description available."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
