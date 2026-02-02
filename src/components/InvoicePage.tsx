import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Download, ArrowLeft, FileText } from "lucide-react";
import { Button } from "./ui/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";
import type { OrderResponse } from "./services/costumer";

export default function InvoicePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const order = location.state as OrderResponse;

  if (!order) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <FileText className="w-20 h-20 text-[var(--primary)]/50 mx-auto" />
          <h2 className="text-3xl font-bold text-gray-900">No Order Found</h2>
          <p className="text-gray-600">Please select an order first.</p>
          <Button
            onClick={() => navigate(-1)}
            className="bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 px-6 py-3"
          >
            Go Back
          </Button>
        </motion.div>
      </div>
    );
  }

  const getProductPrice = (order: OrderResponse, name: string): number | undefined => {
    const p = (order.products as any) || {};

    const tryParse = (val: any) => {
      if (typeof val === "number") return val;
      if (typeof val === "string" && val.trim() !== "" && !isNaN(Number(val)))
        return Number(val);
      return undefined;
    };

    const patterns = [
      `price_${name}`,
      `${name}Price`,
      `${name}_price`,
      `price${name}`,
    ];

    for (const k of patterns) {
      if (k in p) {
        const v = tryParse(p[k]);
        if (v !== undefined) return v;
      }
    }

    // If backend provides a scalar productPrice (applies to all products), use it
    if (p.productPrice !== undefined && (typeof p.productPrice === "number" || typeof p.productPrice === "string")) {
      const v = tryParse(p.productPrice);
      if (v !== undefined) return v;
    }

    if (p.productPrice && typeof p.productPrice === "object") {
      const v = tryParse(p.productPrice[name]);
      if (v !== undefined) return v;
    }
    if (p.productPrices && typeof p.productPrices === "object") {
      const v = tryParse(p.productPrices[name]);
      if (v !== undefined) return v;
    }

    for (const k of Object.keys(p)) {
      if (/price/i.test(k) && k.toLowerCase().includes(name.toLowerCase().replace(/\s+/g, ""))) {
        const v = tryParse(p[k]);
        if (v !== undefined) return v;
      }
    }

    return undefined;
  };

  // Support `productsList` shape returned by backend: array of { ProductName, Quantity, ProductPrice }
  const productList = Array.isArray((order as any).productsList)
    ? (order as any).productsList.map((p: any) => ({
      name: p.ProductName,
      qty: p.Quantity,
      price: p.ProductPrice,
    }))
    : Object.entries(order.products || {})
      .filter(([key, value]) => typeof value === "number" && !/price/i.test(key))
      .map(([name, qty]) => ({ name, qty: qty as number, price: getProductPrice(order, name) }));
  const orderDate = new Date(order.orderTime || (order as any).orderDateTime || Date.now());
  const invoiceNumber = order.orderId ? `INV-${String(order.orderId).slice(-8).toUpperCase()}` : `INV-${Date.now()}`;

  // Status badge styles
  const statusMap: Record<number, { label: string; color: string }> = {
    0: { label: "Pending", color: "bg-yellow-500" },
    1: { label: "Processing", color: "bg-blue-500" },
    2: { label: "Shipped", color: "bg-purple-500" },
    3: { label: "Delivered", color: "bg-green-500" },
    4: { label: "Cancelled", color: "bg-red-500" },
  };

  const status = statusMap[order.status] || statusMap[0];

  // Download as PDF
  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;

    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`${invoiceNumber}.pdf`);
    } catch (error) {
      console.error("Failed to download PDF:", error);
      alert("Failed to download PDF");
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[var(--background)] pt-8 pb-12"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[var(--primary)] hover:text-[var(--primary)]/80 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Orders
          </motion.button>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleDownloadPDF}
              className="bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 flex items-center gap-2 font-semibold"
            >
              <Download size={20} />
              Download Invoice
            </Button>
          </motion.div>
        </div>

        {/* Invoice Container - Make it printable */}
        <div
          ref={invoiceRef}
          className="bg-white text-gray-900 rounded-lg shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/80 text-white p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">SHREEAURA</h1>
                <p className="text-sm opacity-75">Beauty & Cosmetics</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-[var(--secondary)]">INVOICE</p>
                <p className="text-sm opacity-75">{invoiceNumber}</p>
              </div>
            </div>

            {/* Order Status Banner */}
            <div className="flex justify-between items-center pt-6 border-t border-white/20">
              <div>
                <p className="text-sm opacity-75">Order Date</p>
                <p className="text-lg font-semibold">
                  {orderDate.toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className={`${status.color} px-4 py-2 rounded-lg font-semibold`}>
                {status.label}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8">
            {/* Order Info Grid */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              {/* Bill To */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3">
                  Bill To
                </h3>
                <div className="text-gray-900">
                  <p className="font-semibold mb-1">Customer</p>
                  <p className="text-sm">Phone: {order.phone}</p>
                </div>
              </div>

              {/* Ship To */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3">
                  Ship To
                </h3>
                <div className="text-gray-900 text-sm">
                  <p className="mb-1">{order.address}</p>
                  <p>📞 {order.phone}</p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-gray-300 my-8"></div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 font-semibold">Product</th>
                    <th className="text-center py-3 font-semibold">Quantity</th>
                    <th className="text-right py-3 font-semibold">Unit Price</th>
                    <th className="text-right py-3 font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {productList.map((p: any, idx: number) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4">{p.name}</td>
                      <td className="text-center py-4">{p.qty}</td>
                      <td className="text-right py-4">
                        {p.price !== undefined ? `₹${Number(p.price).toFixed(2)}` : `-`}
                      </td>
                      <td className="text-right py-4">
                        {p.price !== undefined ? `₹${(Number(p.price) * Number(p.qty)).toFixed(2)}` : `-`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-gray-300 my-8"></div>

            {/* Summary */}
            <div className="flex justify-end mb-8">
              <div className="w-64">
                {(() => {
                  const productSubtotal = productList.reduce(
                    (s: number, p: any) => s + (p.price ? Number(p.price) * Number(p.qty) : 0),
                    0
                  );
                  const hasPrices = productList.some((p: any) => p.price !== undefined);

                  // Charges
                  const shipping = 10;
                  const handling = 1; // 10% handling charge on product subtotal
                  const delivery = productSubtotal < 200 && productSubtotal > 0 ? 20 : 0;

                  // Subtotal per user's rule: product price + shipping + 10% handling + conditional delivery
                  const subtotalToShow = hasPrices ? productSubtotal + shipping + handling + delivery : order.totalPrice;

                  return (
                    <>
                      <div className="flex justify-between py-2 text-sm">
                        <span>Products Total:</span>
                        <span>₹{productSubtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-2 text-sm">
                        <span>Shipping:</span>
                        <span>₹{shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-2 text-sm">
                        <span>Handling:</span>
                        <span>₹{handling.toFixed(2)}</span>
                      </div>
                      {delivery > 0 && (
                        <div className="flex justify-between py-2 text-sm">
                          <span>Delivery Charge:</span>
                          <span>₹{delivery.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between py-3 border-t-2 border-gray-300 font-bold text-lg">
                        <span>Total Amount:</span>
                        <span className="text-[var(--primary)]">₹{subtotalToShow.toFixed(2)}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t-2 border-gray-300 pt-6 text-center text-sm text-gray-600">
              <p className="mb-2">Thank you for your purchase!</p>
              <p>Order ID: {order.orderId}</p>
              <p className="text-xs mt-2 opacity-50">
                This is a computer-generated invoice. No signature required.
              </p>
            </div>
          </div>
        </div>

        {/* Download Button (Mobile Friendly) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-4 mt-8"
        >
          <Button
            onClick={handleDownloadPDF}
            className="bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 font-semibold px-8 py-3"
          >
            <Download size={20} className="mr-2" />
            Download as PDF
          </Button>
          <Button
            onClick={() => window.print()}
            variant="outline"
            className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/10 font-semibold px-8 py-3"
          >
            <FileText size={20} className="mr-2" />
            Print Invoice
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
