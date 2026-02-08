import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Star, Share2, User } from "lucide-react";
import type { Product } from "./ProductCard";
import { useCart } from "../contexts/CartContext";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { HomePageApi } from "./services/homepage";

export default function ProductDetails() {
  const location = useLocation();
  const { productId } = useParams();
  const navigate = useNavigate();

  const productFromState = location.state as Product | null;

  const [product, setProduct] = useState<Product | null>(productFromState);
  const [loading, setLoading] = useState(!productFromState);
  const [rating, setRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [reviews, setReviews] = useState<any[]>([]);

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
          setProduct(res.data || null);
        })
        .catch(() => {
          toast.error("Failed to load product");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [productId, productFromState]);

  // Fetch reviews and calculate rating
  useEffect(() => {
    const fetchReviews = async () => {
      const id = product?.productId || productId;
      if (!id) return;
      try {
        const reviews = await HomePageApi.getProductReviews(id);
        if (reviews && reviews.length > 0) {
          const total = reviews.reduce((acc: number, r: any) => acc + (Number(r.rating) || 0), 0);
          setRating(total / reviews.length);
          setReviewCount(reviews.length);
          setReviews(reviews);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };
    fetchReviews();
  }, [product?.productId, productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] text-gray-900">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center p-10 text-gray-900 text-lg bg-[var(--background)]">
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
      navigate("/cart");
      return;
    }

    addToCart(product);
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
    navigate("/checkout");  // Redirect directly to checkout
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
    <div className="min-h-screen bg-[var(--background)] text-gray-900 p-6 md:p-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* LEFT */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex md:flex-col gap-3">
            {[product.imageUrl || product.image].map((img, i) => (
              <img
                key={i}
                src={img}
                className="w-14 h-14 rounded-lg object-cover border border-gray-200"
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
                className="w-1/2 py-3 bg-[var(--primary)] text-white font-bold rounded-lg hover:bg-[var(--primary)]/90 transition-all"
                onClick={handleAddToCart}
              >
                {inCart ? "GO TO CART" : "ADD TO CART"}
              </button>

              <button
                className="w-1/2 py-3 bg-[var(--secondary)] text-gray-900 font-bold rounded-lg hover:bg-[var(--secondary)]/90 transition-all"
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
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Share2 size={16} />
              Share
            </button>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded-md text-xs">
              <span>{rating > 0 ? rating.toFixed(1) : "0"}</span>
              <Star size={14} className="fill-white" />
            </div>
            <span className="text-gray-500 text-sm">
              {reviewCount > 0 ? `${reviewCount} Reviews` : "No reviews yet"}
            </span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-3xl font-bold text-[var(--primary)]">
              ₹{product.sellingPrice}
            </span>
            <span className="line-through text-gray-400">
              ₹{product.mrp}
            </span>
            {discount > 0 && (
              <span className="text-green-400">{discount}% off</span>
            )}
          </div>

          <p className="mt-3 text-gray-600 text-sm">
            Brand: {product.brand}
          </p>

          <div className="mt-6">
            <h3 className="text-lg font-semibold">Product Description</h3>
            <p className="text-gray-600 mt-2">
              {product.description || "No description available."}
            </p>
          </div>

          {/* Customer Reviews Section */}
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Customer Reviews ({reviewCount})</h3>
            {reviews.length === 0 ? (
              <p className="text-gray-500 italic">No reviews yet. Be the first to review this product!</p>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {reviews.map((review, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-sm font-bold">
                          {review.users?.name?.charAt(0)?.toUpperCase() || <User size={16} />}
                        </div>
                        <span className="font-medium text-gray-900">
                          {review?.userName || "Anonymous"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-0.5 rounded text-xs">
                        <span>{review.rating}</span>
                        <Star size={12} className="fill-white" />
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">
                      {review.description || "No comment"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
