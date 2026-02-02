import { useState, useEffect, type JSX } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  X,
  Eye,
  Download,
  ChevronDown,
  Star,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { getUserIdFromToken } from "./services/auth";
import { fetchOrders, cancelOrder, submitReview, checkReviewAvaibility } from "./services/costumer";
import type { OrderResponse, Review } from "./services/costumer";

interface OrdersPageProps {
  setCurrentPage: (page: string) => void;
}

export default function OrdersPage({ setCurrentPage }: OrdersPageProps) {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("all");
  const [showDropdown, setShowDropdown] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  // Review modal state
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewProduct, setReviewProduct] = useState<{ name: string; image: string; productId: string; sellerId: string } | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [checkingReview, setCheckingReview] = useState<string | null>(null); // productId being checked
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const userId = getUserIdFromToken() || "";
      const data: OrderResponse[] = await fetchOrders(userId);
      console.log(data)
      setOrders(data);
      console.log(orders)
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const statusMap: Record<number, { label: string; color: string; icon: JSX.Element }> = {
    0: { label: "Pending", color: "bg-yellow-500", icon: <Clock className="w-4 h-4" /> },
    1: { label: "Processing", color: "bg-blue-500", icon: <Package className="w-4 h-4" /> },
    2: { label: "Shipped", color: "bg-purple-500", icon: <Truck className="w-4 h-4" /> },
    3: { label: "Delivered", color: "bg-green-500", icon: <CheckCircle className="w-4 h-4" /> },
    4: { label: "Cancelled", color: "bg-red-500", icon: <X className="w-4 h-4" /> },
  };

  const filterOrdersByStatus = (status?: number) =>
    status === undefined ? orders : orders.filter((o) => o.status === status);

  const tabs = [
    { value: "all", label: `All (${orders.length})` },
    { value: "0", label: `Pending (${filterOrdersByStatus(0).length})` },
    { value: "1", label: `Processing (${filterOrdersByStatus(1).length})` },
    { value: "2", label: `Shipped (${filterOrdersByStatus(2).length})` },
    { value: "3", label: `Delivered (${filterOrdersByStatus(3).length})` },
    { value: "4", label: `Cancelled (${filterOrdersByStatus(4).length})` },
  ];

  const handleCancelOrder = async (order: OrderResponse) => {
    if (!cancelReason.trim()) {
      alert("Please provide a reason for cancellation.");
      return;
    }
    try {


      await cancelOrder(order.orderId);
      alert("Order cancelled successfully!");
      setCancelDialogOpen(false);
      setCancelReason("");
      await loadOrders();
    } catch (err) {
      console.error("Cancel failed:", err);
      alert("Failed to cancel order.");
    }
  };

  // Handle review submission
  const handleSubmitReview = async () => {
    if (reviewRating === 0) {
      alert("Please select a rating.");
      return;
    }
    if (!reviewProduct || !selectedOrder) return;

    setReviewSubmitting(true);
    try {
      const userId = getUserIdFromToken() || "";

      // Get user data from token for the review payload
      const token = localStorage.getItem("token");
      let userData = { id: userId, name: "", phone: "", email: "" };
      if (token) {
        try {
          const decoded: any = JSON.parse(atob(token.split(".")[1]));
          if (decoded.User) {
            userData = {
              id: decoded.User.id || userId,
              name: decoded.User.name || "",
              phone: decoded.User.phone || "",
              email: decoded.User.email || ""
            };
          }
        } catch (e) {
          console.error("Failed to decode token for user data:", e);
        }
      }

      // Create review payload matching backend format
      const reviewData: Review = {
        users: userData,
        product: {
          productId: reviewProduct.productId,
          seller: {
            id: reviewProduct.sellerId || "",
            name: "",
            email: "",
            phone: "",
            password: "",
            state: "",
            city: "",
            address: "",
            pincode: 0,
            chatId: 0
          }
        },
        rating: reviewRating,
        review: reviewTitle || "",
        description: reviewComment || "",
        createdAt: new Date().toISOString()
      };
      await submitReview(reviewData);
      toast.success("Review submitted successfully! 🎉");
      // Reset and close
      setReviewDialogOpen(false);
      setReviewProduct(null);
      setReviewRating(0);
      setReviewTitle("");
      setReviewComment("");
    } catch (err) {
      console.error("Review submission failed:", err);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
  };

  const OrderCard = ({ order, index }: { order: OrderResponse; index: number }) => {
    const status = statusMap[order.status] || statusMap[0];

    // Normalize products: backend may return either `products` (object) or `productsList` (array)
    const productListFromArray = Array.isArray((order as any).productsList)
      ? (order as any).productsList.map((p: any) => ({
        name: p.ProductName,
        image: p.ProductImage,
        qty: p.Quantity,
        price: p.ProductPrice,
      }))
      : [];

    const productEntries = productListFromArray.length
      ? productListFromArray
      : Object.entries(order.products || {}).
        filter(([key, value]) => typeof value === "number" && !/price/i.test(key))
        .map(([name, qty]) => ({ name, qty: qty as number, price: (order.products as any).productPrice }));

    return (
      <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
        <Card className="bg-white border-gray-200 hover:border-[var(--primary)] transition-all duration-300 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Order #{index + 1}
                </h3>
                <p className="text-sm text-gray-600">
                  Placed on {new Date(order.orderTime).toLocaleDateString()}
                </p>

                {/* 🟥 Show refund info if cancelled */}
                {order.status === 4 && (
                  <p className="text-sm text-red-400 mt-1">
                    {order.phone
                      ? `In case of online transaction refund , contact +918544090329.`
                      : "Refund will be processed to your linked account."}
                  </p>
                )}
              </div>

              <Badge className={`${status.color} text-white flex items-center gap-1`}>
                {status.icon}
                {status.label}
              </Badge>
            </div>


            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Items:</span>
                <span className="text-gray-900">{productEntries.reduce((s: any, p: any) => s + (p.qty || 1), 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="text-xl font-bold text-[var(--primary)]">
                  ₹{Number(order.totalPrice).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-[var(--primary)] text-[var(--primary)]"
                onClick={() => {
                  setSelectedOrder(order);
                  setDialogOpen(true);
                }}
              >
                <Eye className="w-4 h-4 mr-2" /> View Details
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="border-[var(--primary)]/50 text-[var(--primary)]/70 hover:bg-[var(--primary)]/10"
                onClick={() => {
                  navigate("/invoice", { state: order });
                }}
              >
                <Download className="w-4 h-4 mr-2" /> Invoice
              </Button>

              {/* 🟥 Cancel Button (only for Pending orders) */}
              {order.status === 0 && (
                <Button
                  size="sm"
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => {
                    setSelectedOrder(order);
                    setCancelDialogOpen(true);
                  }}
                >
                  <X className="w-4 h-4 mr-2" /> Cancel Order
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--background)] pt-7 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-4xl font-bold text-[var(--primary)] mb-2">My Orders</h1>
            <p className="text-gray-600">Track and manage your order history easily.</p>
          </motion.div>

          {loading ? (
            <p className="text-gray-900 text-center">Loading orders...</p>
          ) : orders.length > 0 ? (
            <Tabs
              defaultValue="all"
              value={selectedTab}
              onValueChange={setSelectedTab}
              className="space-y-6"
            >
              <motion.div variants={itemVariants}>
                <TabsList className="hidden sm:grid w-full grid-cols-6 bg-white border border-gray-200 sticky top-0 z-10 backdrop-blur-md shadow-sm">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="text-gray-700 data-[state=active]:text-[var(--primary)] data-[state=active]:font-semibold"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* 📱 Mobile Dropdown */}
                <div className="sm:hidden relative z-10">
                  <Button
                    variant="outline"
                    className="w-full border-gray-200 text-[var(--primary)] bg-white flex justify-between items-center shadow-sm"
                    onClick={() => setShowDropdown((prev) => !prev)}
                  >
                    {tabs.find((t) => t.value === selectedTab)?.label}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>

                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl"
                      >
                        {tabs.map((tab) => (
                          <button
                            key={tab.value}
                            onClick={() => {
                              setSelectedTab(tab.value);
                              setShowDropdown(false);
                            }}
                            className={`block w-full text-left px-4 py-3 hover:bg-[var(--primary)]/10 text-[var(--primary)] ${selectedTab === tab.value
                              ? "bg-[var(--primary)]/10 font-semibold"
                              : ""
                              }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {tabs.map((tab) => (
                <TabsContent
                  key={tab.value}
                  value={tab.value}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-900"
                >
                  {filterOrdersByStatus(
                    tab.value === "all" ? undefined : Number(tab.value)
                  ).map((order, index) => (
                    <OrderCard key={index} order={order} index={index} />
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <motion.div variants={itemVariants}>
              <Card className="bg-white border-gray-200 text-center py-12 shadow-md">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No orders yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start shopping to see your orders here!
                </p>
                <Button
                  className="bg-[var(--primary)] text-white"
                  onClick={() => setCurrentPage("products")}
                >
                  Start Shopping
                </Button>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* 🧾 Dialog: Order Details */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white border-gray-200 max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[var(--primary)]">
              Order Details
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Complete information about your order
            </DialogDescription>
          </DialogHeader>

          {selectedOrder ? (
            <div className="space-y-4">
              {/* 🧍 Address Section */}
              <div className="p-4 bg-gray-50 rounded-lg text-gray-700">
                <h4 className="font-semibold text-[var(--primary)] mb-2">Delivery Address</h4>
                <p>{selectedOrder.address}</p>
                <p>📞 {selectedOrder.phone}</p>
              </div>

              {/* 🛍️ Products Section */}
              {(Array.isArray((selectedOrder as any).productsList) ? (selectedOrder as any).productsList : []).map((p: any, idx: number) => (
                <div key={idx} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  {/* Product Image */}
                  <ImageWithFallback
                    src={p.ProductImage || "/placeholder.png"}
                    alt={p.ProductName}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  {/* Product Details */}
                  <div className="flex-1">
                    <h5 className="text-gray-900 font-medium">{p.ProductName}</h5>
                    <span className="text-[var(--primary)]">Qty: {p.Quantity} | Price: ₹{Number(p.ProductPrice).toFixed(2)}</span>
                  </div>
                  {/* Review Button - Far right */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 flex items-center gap-1 shrink-0"
                    disabled={checkingReview === (p.ProductId || p.productId)}
                    onClick={async () => {
                      console.log("Full product data for review:", JSON.stringify(p, null, 2)); // Debug: check all fields
                      // Try multiple possible field names for productId
                      const productId = p.ProductId || p.productId || p.product_id || p.id || p.Id || p.Productid || "";
                      const userId = getUserIdFromToken() || "";

                      console.log("Extracted productId:", productId, "| userId:", userId);
                      console.log("Available keys in product:", Object.keys(p));

                      if (!productId || !userId) {
                        toast.error("Unable to check review eligibility. ProductId not found in order data.");
                        console.error("Missing productId or userId. Product keys:", Object.keys(p));
                        return;
                      }

                      setCheckingReview(productId);
                      try {
                        const response = await checkReviewAvaibility(userId, productId);
                        console.log("Review availability response:", response);

                        // Check if response indicates user can review
                        // Backend returns "true" if user can review, "false" if already reviewed
                        if (response.toLowerCase().trim() === "false") {
                          toast.error("You have already reviewed this product.");
                          return;
                        }

                        // User can review - open the dialog
                        // Try to get sellerId from product data (seller is nested object)
                        const sellerId = p.seller?.id || p.SellerId || p.sellerId || "";
                        console.log("Extracted sellerId:", sellerId);

                        setReviewProduct({
                          name: p.ProductName,
                          image: p.ProductImage,
                          productId: productId,
                          sellerId: sellerId,
                        });
                        setReviewDialogOpen(true);
                      } catch (err: any) {
                        // Check the error message to provide more specific feedback
                        console.error("Review availability check error:", err);
                        const errorMessage = err?.message || "Unknown error";
                        console.log("Full error message:", errorMessage);

                        // Show the actual error to help debug
                        if (errorMessage.toLowerCase().includes("already reviewed") ||
                          errorMessage.toLowerCase().includes("review exists") ||
                          errorMessage.includes("409")) {
                          toast.error("You have already reviewed this product.");
                        } else if (errorMessage.includes("404") || errorMessage.toLowerCase().includes("not found")) {
                          toast.error("Product not found for review.");
                        } else if (errorMessage.includes("401") || errorMessage.toLowerCase().includes("unauthorized")) {
                          toast.error("Please login to submit a review.");
                        } else {
                          // Show the actual error for debugging - this helps identify real issues
                          toast.error(`Review check failed: ${errorMessage}`);
                        }
                      } finally {
                        setCheckingReview(null);
                      }
                    }}
                  >
                    <Star className="w-4 h-4" />
                    {checkingReview === (p.ProductId || p.productId) ? "Checking..." : "Review"}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-6">No items found</p>
          )}
        </DialogContent>
      </Dialog>

      {/* ❌ Cancel Order Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="bg-white border-gray-200 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[var(--primary)]">Cancel Order</DialogTitle>
            <DialogDescription className="text-gray-600">
              Please provide a reason for cancelling your order.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Reason for cancellation..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="bg-gray-50 border-gray-200 text-gray-900"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                className="text-gray-700 border-gray-200"
                onClick={() => setCancelDialogOpen(false)}
              >
                Close
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => selectedOrder && handleCancelOrder(selectedOrder)}
              >
                Confirm Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ⭐ Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="bg-white border-gray-200 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[var(--primary)]">Write a Review</DialogTitle>
            <DialogDescription className="text-gray-600">
              Share your experience with this product
            </DialogDescription>
          </DialogHeader>

          {reviewProduct && (
            <div className="space-y-4">
              {/* Product Info */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <ImageWithFallback
                  src={reviewProduct.image || "/placeholder.png"}
                  alt={reviewProduct.name}
                  className="w-12 h-12 object-cover rounded-md"
                />
                <span className="font-medium text-gray-900">{reviewProduct.name}</span>
              </div>

              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-8 h-8 ${star <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title (optional)</label>
                <Input
                  placeholder="Summarize your experience..."
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="bg-gray-50 border-gray-200 text-gray-900"
                />
              </div>

              {/* Review Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <Textarea
                  placeholder="Tell us more about your experience..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="bg-gray-50 border-gray-200 text-gray-900 min-h-[100px]"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  className="text-gray-700 border-gray-200"
                  onClick={() => setReviewDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white"
                  onClick={handleSubmitReview}
                  disabled={reviewSubmitting || reviewRating === 0}
                >
                  {reviewSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
