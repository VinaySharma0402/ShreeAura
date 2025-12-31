import { useState, useEffect, type JSX } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  X,
  Eye,
  Download,
  ChevronDown,
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
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { getUserIdFromToken } from "./services/auth";
import { fetchOrders, cancelOrder } from "./services/costumer";
import type { OrderResponse } from "./services/costumer";

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
        <Card className="bg-[#2C1E4A] border-[#FFD369]/20 hover:border-[#FFD369] transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
  <div>
    <h3 className="font-semibold text-white mb-1">
      Order #{index + 1}
    </h3>
    <p className="text-sm text-white/70">
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
                <span className="text-white/70">Items:</span>
                <span className="text-white">{productEntries.reduce((s:any,p:any)=>s+(p.qty||1),0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Total:</span>
                <span className="text-xl font-bold text-[#FFD369]">
                  ₹{Number(order.totalPrice).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-[#FFD369] text-[#FFD369]"
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
                className="border-[#FFD369]/50 text-[#FFD369]/70 hover:bg-[#FFD369]/10"
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
    <div className="min-h-screen bg-[#1a0f1a] pt-7 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-4xl font-bold text-[#FFD369] mb-2">My Orders</h1>
            <p className="text-white/70">Track and manage your order history easily.</p>
          </motion.div>

          {loading ? (
            <p className="text-white text-center">Loading orders...</p>
          ) : orders.length > 0 ? (
            <Tabs
              defaultValue="all"
              value={selectedTab}
              onValueChange={setSelectedTab}
              className="space-y-6"
            >
              <motion.div variants={itemVariants}>
                <TabsList className="hidden sm:grid w-full grid-cols-6 bg-[#2C1E4A]/70 border border-[#FFD369]/20 sticky top-0 z-10 backdrop-blur-md">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="text-white data-[state=active]:text-[#FFD369] data-[state=active]:font-semibold"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* 📱 Mobile Dropdown */}
                <div className="sm:hidden relative z-10">
                  <Button
                    variant="outline"
                    className="w-full border-[#FFD369]/40 text-[#FFD369] bg-[#2C1E4A]/80 flex justify-between items-center"
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
                        className="absolute mt-2 w-full bg-[#2C1E4A] border border-[#FFD369]/20 rounded-lg shadow-xl"
                      >
                        {tabs.map((tab) => (
                          <button
                            key={tab.value}
                            onClick={() => {
                              setSelectedTab(tab.value);
                              setShowDropdown(false);
                            }}
                            className={`block w-full text-left px-4 py-3 hover:bg-[#FFD369]/10 text-[#FFD369] ${
                              selectedTab === tab.value
                                ? "bg-[#FFD369]/10 font-semibold"
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
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white"
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
              <Card className="bg-[#2C1E4A] border-[#FFD369]/20 text-center py-12">
                <Package className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No orders yet
                </h3>
                <p className="text-white/70 mb-6">
                  Start shopping to see your orders here!
                </p>
                <Button
                  className="bg-[#FFD369] text-[#1a0f1a]"
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
        <DialogContent className="bg-[#2C1E4A] border-[#FFD369]/20 max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#FFD369]">
              Order Details
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Complete information about your order
            </DialogDescription>
          </DialogHeader>

          {selectedOrder ? (
            <div className="space-y-4">
              {/* 🧍 Address Section */}
              <div className="p-4 bg-[#1a0f1a] rounded-lg text-white/80">
                <h4 className="font-semibold text-[#FFD369] mb-2">Delivery Address</h4>
                <p>{selectedOrder.address}</p>
                <p>📞 {selectedOrder.phone}</p>
              </div>

              {/* 🛍️ Products Section */}
              {(Array.isArray((selectedOrder as any).productsList) ? (selectedOrder as any).productsList : []).map((p: any, idx: number) => (
                <div key={idx} className="flex items-center space-x-4 p-3 bg-[#1a0f1a] rounded-lg">
                  <ImageWithFallback
                    src={p.ProductImage || "/placeholder.png"}
                    alt={p.ProductName}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h5 className="text-white font-medium">{p.ProductName}</h5>
                    <span className="text-[#FFD369]">Qty: {p.Quantity} | Price: ₹{Number(p.ProductPrice).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/50 text-center py-6">No items found</p>
          )}
        </DialogContent>
      </Dialog>

      {/* ❌ Cancel Order Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="bg-[#2C1E4A] border-[#FFD369]/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#FFD369]">Cancel Order</DialogTitle>
            <DialogDescription className="text-white/70">
              Please provide a reason for cancelling your order.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Reason for cancellation..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="bg-[#1a0f1a] border-[#FFD369]/30 text-white"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                className="text-white border-[#FFD369]/30"
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
    </div>
  );
}
