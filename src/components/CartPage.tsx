import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useCart } from "../contexts/CartContext";
import { useEffect } from "react";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../components/services/auth";


interface CartPageProps {
  setCurrentPage: (page: string) => void;
}

export default function CartPage({ setCurrentPage }: CartPageProps) {
  const { items, updateQuantity, removeFromCart, getCartTotal, setCartTotal, cartTotal } = useCart();
  const navigate = useNavigate();
  const subtotal = getCartTotal();

  const tax = 1;

  // Shipping logic
  const baseShipping = 10;
  const extraDeliveryCharge = subtotal < 200 ? 20 : 0;
  const shipping = baseShipping + extraDeliveryCharge;

  const total = subtotal + tax + shipping;
  setCartTotal(total);
  console.log("Cart Total in CartPage:", cartTotal);
  const location = useLocation();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoggedIn()) {
      toast.error("Please login first to view your cart", {
        action: {
          label: "Login",
          onClick: () => navigate("/login"),
        },
        duration: 5000,
      });
      navigate("/login");
    }
  }, [navigate]);

  // Scroll to top on page mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const handleProceedToCheckout = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.warning(
        <div className="flex flex-col items-start gap-2">
          <p className="text-sm">⚠️ Please login first to proceed to checkout.</p>
          <Button
            onClick={() => setCurrentPage("login")}
            className="bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 py-1 px-3 text-sm"
          >
            Go to Login
          </Button>
        </div>,
        { duration: 4000 }
      );
      return;
    }

    setCurrentPage("checkout");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <ShoppingBag className="w-20 h-20 text-[var(--secondary)] mx-auto animate-bounce" />
          <h2 className="text-3xl font-bold text-[var(--foreground)]">Your cart is empty</h2>
          <Button
            onClick={() => navigate("/")}
            className="bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 px-6 py-3 shadow-lg"
          >
            Continue Shopping
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] pt-10 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-[var(--foreground)] mb-6">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Card className="bg-white border-gray-200 shadow-sm">
                    <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
                      <ImageWithFallback
                        src={item.imageUrl || item.image}
                        alt={item.name}
                        className="w-full sm:w-24 h-24 object-cover rounded-lg border border-gray-100"
                      />
                      <div className="flex-1 space-y-2">
                        <h3 className="text-[var(--foreground)] font-semibold text-lg">{item.name}</h3>
                        <p className="text-[var(--primary)] font-bold">
                          ₹{item.sellingPrice.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            className="text-gray-600 hover:text-[var(--primary)]"
                          >
                            <Minus size={16} />
                          </Button>
                          <span className="text-[var(--foreground)] font-medium w-6 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            className="text-gray-600 hover:text-[var(--primary)]"
                          >
                            <Plus size={16} />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.productId)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 pl-0"
                        >
                          <Trash2 size={14} className="mr-1" /> Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div>
            <Card className="bg-white border-gray-200 shadow-sm sticky top-24">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-2xl font-bold text-[var(--foreground)]">Summary</h2>
                <Separator className="bg-gray-100" />
                <div className="text-[var(--foreground)] space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="text-[var(--foreground)] font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Handling charge</span>
                    <span className="text-[var(--foreground)] font-medium">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-[var(--foreground)] font-medium">₹{baseShipping.toFixed(2)}</span>
                  </div>
                  {subtotal < 200 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Charge</span>
                      <span className="text-[var(--foreground)] font-medium">₹{extraDeliveryCharge.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator className="bg-gray-100 my-2" />
                  <div className="flex justify-between font-bold text-[var(--primary)] text-xl">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                  {subtotal < 200 && (
                    <p className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded-md">
                      Get free delivery above ₹200!
                    </p>
                  )}
                  {subtotal >= 200 && (
                    <p className="text-sm text-green-600 bg-green-50 p-2 rounded-md">
                      🎉 Orders above ₹200 get free delivery!
                    </p>
                  )}
                </div>

                {/* Checkout button now checks login */}
                <Button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 py-3 shadow-md transition-all"
                >
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
