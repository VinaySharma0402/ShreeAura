import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useCart } from "../contexts/CartContext";
import { useEffect } from "react";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import { set } from "react-hook-form";

interface CartPageProps {
  setCurrentPage: (page: string) => void;
}

export default function CartPage({ setCurrentPage }: CartPageProps) {
  const { items, updateQuantity, removeFromCart, getCartTotal ,setCartTotal} = useCart();
  const subtotal = getCartTotal();

  const tax = subtotal * 0.18;

  // Shipping logic
  const baseShipping = 10;
  const extraDeliveryCharge = subtotal < 200 ? 20 : 0;
  const shipping = baseShipping + extraDeliveryCharge;

  const total = subtotal + tax + shipping;
  setCartTotal(total);
  const location = useLocation();
  
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
            className="bg-[#FFD369] text-[#1a0f1a] hover:bg-[#ffcb47] py-1 px-3 text-sm"
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
      <div className="min-h-screen bg-[#1a0f1a] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <ShoppingBag className="w-20 h-20 text-[#FFD369] mx-auto animate-bounce" />
          <h2 className="text-3xl font-bold text-white">Your cart is empty</h2>
          <Button
            onClick={() => setCurrentPage("home")}
            className="bg-[#FFD369] text-[#1a0f1a] hover:bg-[#ffcb47] px-6 py-3"
          >
            Continue Shopping
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a0f1a] pt-10 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-[#FFD369] mb-6">Shopping Cart</h1>

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
                  <Card className="bg-[#2C1E4A] border-[#FFD369]/20">
                    <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
                      <ImageWithFallback
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full sm:w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1 space-y-2">
                        <h3 className="text-white font-semibold">{item.name}</h3>
                        <p className="text-[#FFD369] font-bold">
                          ₹{item.sellingPrice.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            className="text-white"
                          >
                            <Minus size={16} />
                          </Button>
                          <span className="text-white">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            className="text-white"
                          >
                            <Plus size={16} />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.productId)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={14} /> Remove
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
            <Card className="bg-[#2C1E4A] border-[#FFD369]/20 sticky top-24">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-2xl font-bold text-[#FFD369]">Summary</h2>
                <Separator className="bg-white/20" />
                <div className="text-white space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹{shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#FFD369] text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                  {subtotal < 200 && (
                    <p className="text-sm text-yellow-300">
                      Orders below ₹200 have an extra delivery charge of ₹20.
                    </p>
                  )}
                  {subtotal >= 200 && (
                    <p className="text-sm text-green-400">
                      🎉 Orders above ₹200 get free delivery!
                    </p>
                  )}
                </div>

                {/* Checkout button now checks login */}
                <Button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-[#FFD369] text-[#1a0f1a] hover:bg-[#ffcb47] py-3"
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
