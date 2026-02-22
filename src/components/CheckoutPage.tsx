import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import {
  fetchUserProfile,
  updateUserProfile,
  placeOrder,
  createRazorpayOrder,
  checkRazorpayOrderStatus,
  type User,
} from "../components/services/costumer";
import { isLoggedIn, getUserIdFromToken } from "../components/services/auth";
import { jwtDecode } from "jwt-decode";
import type { TokenPayload } from "./ProfilePage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface CheckoutPageProps {
  setCurrentPage: (page: string) => void;
}

export default function CheckoutPage({ setCurrentPage }: CheckoutPageProps) {
  const { items, clearCart, cartTotal, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const subtotal = getCartTotal();


  const total = subtotal;

  const [isProcessing, setIsProcessing] = useState(false);
  const [suser, setSuser] = useState<User | null>(null);

  const [coords, setCoords] = useState({ lat: 0, lng: 0 });
  const [modeOfPayment, setModeOfPayment] = useState("cod");
  const [locationWarning, setLocationWarning] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoggedIn()) {
      toast.error("Please login first to checkout", {
        action: {
          label: "Login",
          onClick: () => navigate("/login"),
        },
        duration: 5000,
      });
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);
  console.log(suser + "-----------------" + transactionId);
  const [shipping, setShipping] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    address: "",
    pincode: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const decoded: TokenPayload = jwtDecode(token);
      fetchUserProfile(decoded.User.id)
        .then((userData) => {
          setSuser(userData);
          setShipping({
            name: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
            address: userData.address || "",
            city: userData.city || "",
            state: userData.state || "",
            pincode: userData.pincode || "",
          });
        })
        .catch((err) => console.error("Failed to fetch profile:", err));
    } catch (err) {
      console.error("Failed to decode token:", err);
    }
  }, []);

  const handlePlaceOrder = async () => {
    if (!isLoggedIn()) {
      toast.error("Please log in to place an order");
      setCurrentPage("login");
      return;
    }

    if (!shipping.name || !shipping.address || !shipping.city || !shipping.pincode) {
      toast.error("Please fill all shipping details");
      return;
    }

    if (shipping.state !== "Bihar" || shipping.city !== "Patna") {
      toast.error("We currently deliver only in Patna, Bihar");
      return;
    }

    setIsProcessing(true);
    try {
      const userId = getUserIdFromToken() || user?.id;
      const products = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      const orderPayload = {
        userId: userId!,
        products,
        address: `${shipping.address}, ${shipping.city}, ${shipping.state}`,
        pincode: parseInt(shipping.pincode),
        price: total,
        phone: shipping.phone,
        modeOfPayment,
      };

      // If user exists and shipping differs from saved profile, update profile first
      try {
        if (userId && suser) {
          const changed: Partial<User> = {};
          if ((suser.name || "") !== (shipping.name || "")) changed.name = shipping.name;
          if ((suser.email || "") !== (shipping.email || "")) changed.email = shipping.email;
          if ((suser.phone || "") !== (shipping.phone || "")) changed.phone = shipping.phone;
          if ((suser.address || "") !== (shipping.address || "")) changed.address = shipping.address;
          if ((suser.city || "") !== (shipping.city || "")) changed.city = shipping.city;
          if ((suser.state || "") !== (shipping.state || "")) changed.state = shipping.state;
          if ((suser.pincode || "") !== (shipping.pincode || "")) changed.pincode = shipping.pincode;

          // If any field changed, call update API
          if (Object.keys(changed).length > 0) {
            setIsProcessing(true);
            await updateUserProfile(userId!, changed);
            // Refresh local suser to reflect updated data
            const refreshed = await fetchUserProfile(userId!);
            setSuser(refreshed);
            toast.success("Profile updated with latest shipping details.");
          }
        }
      } catch (err: any) {
        console.error("Failed to update profile before placing order:", err);
        setIsProcessing(false);
        toast.error(err?.message || "Failed to update profile. Please try again.");
        return;
      }

      if (modeOfPayment === "cod") {
        await placeOrder(orderPayload, coords.lat, coords.lng, "");
        setShowSuccessDialog(true);
        clearCart();
        return;
      }

      if (modeOfPayment === "online") {
        const orderData = await createRazorpayOrder(userId!, total);

        const options = {
          key: "rzp_live_RiT8Zekj3HQoUk",
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Shree Aura ",
          description: "Your Order Payment",
          order_id: orderData.id,
          handler: async (response: any) => {
            setTransactionId(response.razorpay_order_id);
            const status = await checkRazorpayOrderStatus(
              response.razorpay_order_id,
              response.razorpay_payment_id
            );
            try {
              setIsProcessing(true);
              await placeOrder(
                { ...orderPayload, paymentMethod: "online" },
                coords.lat,
                coords.lng,
                response.razorpay_order_id
              );

              if (status.includes("Successful")) {
                setShowSuccessDialog(true);
                clearCart();
              } else {
                toast.error("Payment not verified, please contact support.");
              }
            } catch (err) {
              console.error("❌ Order placement failed:", err);
              setIsProcessing(false);
              toast.error("Payment succeeded but order not saved.");
            }
          },
          prefill: {
            name: shipping.name,
            email: shipping.email,
            contact: shipping.phone,
          },
          theme: { color: "#FFD369" },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", (response: any) => {
          console.error("Payment failed:", response.error);
          toast.error("Payment failed. Please try again.");
        });

        rzp.open();
      }
    } catch (err: any) {
      console.error("Order error:", err);
      setIsProcessing(false);
      toast.error(err.message || "Failed to process order");
    } finally {
      setIsProcessing(false);
    }
  };

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    setIsProcessing(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        toast.success("Location fetched successfully!");
        setIsProcessing(false);
      },
      () => {
        toast.error("Unable to fetch location");
        setIsProcessing(false);
      }
    );
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setShipping({ ...shipping, state: value });
    setLocationWarning(value !== "Bihar" ? "⚠️ We currently deliver only in Bihar (Patna)." : "");
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setShipping({ ...shipping, city: value });
    setLocationWarning(value !== "Patna" ? "⚠️ We currently deliver only in Patna, Bihar." : "");
  };

  const isOrderDisabled =
    isProcessing ||
    !shipping.name ||
    !shipping.address ||
    !shipping.city ||
    !shipping.pincode ||
    shipping.state !== "Bihar" ||
    shipping.city !== "Patna";

  const handleSuccessClose = () => {
    setShowSuccessDialog(false);
    setCurrentPage("orders");
  };

  return (
    <div className="relative min-h-screen bg-[var(--background)] flex items-center justify-center py-12 px-4">
      {/* 🔄 Loader Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50">
          <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[var(--primary)] mt-3 font-medium">Processing...</p>
        </div>
      )}

      <div className="bg-white p-8 rounded-2xl w-full max-w-2xl border border-gray-200 shadow-xl relative z-10">
        <h2 className="text-3xl font-bold text-[var(--primary)] text-center mb-8">Checkout</h2>

        {/* Shipping Form */}
        <div className="space-y-5 mb-8">
          <h3 className="text-xl font-semibold text-[var(--primary)]">Shipping Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["name", "email", "phone", "address", "pincode"].map((field) => (
              <div key={field} className="flex flex-col">
                <Label className="capitalize text-gray-700 mb-1">{field}</Label>
                <Input
                  value={shipping[field as keyof typeof shipping] || ""}
                  onChange={(e) => setShipping({ ...shipping, [field]: e.target.value })}
                  className="bg-gray-50 border border-gray-200 text-gray-900 rounded-md p-2"
                  placeholder={`Enter ${field}`}
                />
              </div>
            ))}

            <div className="flex flex-col">
              <Label className="text-gray-700 mb-1">State</Label>
              <select
                value={shipping.state}
                onChange={handleStateChange}
                className="bg-gray-50 border border-gray-200 text-gray-900 rounded-md p-2"
              >
                <option value="">Select State</option>
                <option value="Bihar">Bihar</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex flex-col">
              <Label className="text-gray-700 mb-1">City</Label>
              <select
                value={shipping.city}
                onChange={handleCityChange}
                className="bg-gray-50 border border-gray-200 text-gray-900 rounded-md p-2"
              >
                <option value="">Select City</option>
                <option value="Patna">Patna</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          {locationWarning && (
            <p className="text-red-400 text-sm mt-2 text-center">{locationWarning}</p>
          )}
        </div>

        {/* Payment Method */}
        <div className="mb-8 space-y-3">
          <h3 className="text-xl font-semibold text-[var(--primary)]">Payment Method</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <label className="flex items-center space-x-2 text-gray-900">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={modeOfPayment === "cod"}
                onChange={(e) => setModeOfPayment(e.target.value)}
              />
              <span>Cash on Delivery</span>
            </label>
            <label className="flex items-center space-x-2 text-gray-900">
              <input
                type="radio"
                name="payment"
                value="online"
                checked={modeOfPayment === "online"}
                onChange={(e) => setModeOfPayment(e.target.value)}
              />
              <span>Online Payment</span>
            </label>
          </div>
        </div>

        {/* Location */}
        <div className="mb-8 space-y-2">
          <h3 className="text-xl font-semibold text-[var(--primary)]">Location</h3>
          <Button
            onClick={fetchLocation}
            className="w-full bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20"
          >
            📍 Share My Location
          </Button>
          <p className="text-gray-600 text-sm mt-1">
            Please share your location — it will help our delivery partner reach you faster!
          </p>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8">
          <h3 className="text-lg font-semibold text-[var(--primary)] mb-3">Order Summary</h3>
          <div className="space-y-2 text-gray-900">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">

            </div>
            <div className="flex justify-between text-lg font-bold text-[var(--primary)] pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Place Order Button */}
        <Button
          onClick={handlePlaceOrder}
          className={`w-full py-3 text-lg font-semibold ${isOrderDisabled
            ? "bg-gray-300 cursor-not-allowed text-gray-500"
            : "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90"
            }`}
        >
          {isProcessing ? "Processing..." : `Place Order ₹${total.toFixed(2)}`}
        </Button>
      </div>

      {/* ✅ Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={handleSuccessClose}>
        <AnimatePresence>
          {showSuccessDialog && (
            <>
              {/* 🎉 Confetti burst */}
              <Confetti numberOfPieces={150} recycle={false} />

              <DialogContent className="bg-white border border-gray-200 shadow-2xl rounded-2xl text-center p-8 animate-in fade-in zoom-in duration-300">

                {/* Animated checkmark circle */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 120, damping: 10 }}
                  className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center
              bg-[var(--primary)] shadow-[0_0_25px_var(--primary)]"
                >
                  <motion.span
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-white text-4xl font-extrabold"
                  >
                    ✓
                  </motion.span>
                </motion.div>

                <DialogHeader>
                  <DialogTitle className="text-[var(--primary)] text-3xl font-bold drop-shadow-md">
                    🎉 Order Successfully Placed!
                  </DialogTitle>

                  <DialogDescription className="text-gray-700 mt-3 text-lg leading-relaxed">
                    Thank you for choosing <b className="text-[var(--primary)]">Shree Aura</b>!
                    Your order is on its way.
                  </DialogDescription>
                </DialogHeader>

                {/* Animated button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    onClick={handleSuccessClose}
                    className="mt-6 px-6 py-3 bg-[var(--primary)] text-white text-lg rounded-xl font-semibold
                hover:bg-[var(--primary)]/90 hover:scale-[1.05] transition-all shadow-lg"
                  >
                    View My Orders
                  </Button>
                </motion.div>

              </DialogContent>
            </>
          )}
        </AnimatePresence>
      </Dialog>
    </div>
  );
}
