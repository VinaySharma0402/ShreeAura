import { motion, AnimatePresence } from "motion/react";
import { X, Trash, Plus, Minus } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useNavigate } from "react-router-dom";

export default function CartDrawer() {
    const { items, removeFromCart, updateQuantity, getCartTotal, isCartOpen, toggleCart } = useCart();
    const navigate = useNavigate();

    const subtotal = getCartTotal();
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    const handleCheckout = () => {
        toggleCart(false);
        navigate("/checkout");
    };

    const handleViewCart = () => {
        toggleCart(false);
        navigate("/cart");
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => toggleCart(false)}
                        className="fixed inset-0 bg-black/50 z-[9998]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.3 }}
                        className="fixed top-0 right-0 h-full w-[400px] max-w-full bg-white z-[9999] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-[#ED1C24] text-white p-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold font-['Outfit']">Cart ({itemCount} items)</h2>
                            <button onClick={() => toggleCart(false)} className="hover:bg-white/20 p-1 rounded transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                                    <p className="text-lg font-medium">Your cart is empty</p>
                                    <Button
                                        onClick={() => toggleCart(false)}
                                        className="mt-4 bg-[#ED1C24] hover:bg-red-700 text-white"
                                    >
                                        Continue Shopping
                                    </Button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.productId} className="flex gap-4 border-b border-gray-100 pb-4">
                                        {/* Image */}
                                        <div className="w-20 h-20 border border-gray-200 rounded-md overflow-hidden flex-shrink-0">
                                            <ImageWithFallback
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-medium text-gray-900 line-clamp-2 text-sm">
                                                    {item.name}
                                                </h3>
                                                <button
                                                    onClick={() => removeFromCart(item.productId)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="flex justify-between items-end mt-2">
                                                {/* Price */}
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-[#1c1c1c]">${item.sellingPrice.toFixed(2)}</span>
                                                    {item.mrp > item.sellingPrice && (
                                                        <span className="text-xs text-gray-400 line-through">${item.mrp.toFixed(2)}</span>
                                                    )}
                                                </div>

                                                {/* Qty */}
                                                <div className="flex items-center border border-gray-300 rounded h-8">
                                                    <button
                                                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                        className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                        className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-4 border-t border-gray-200 bg-gray-50">
                                {/* Subtotal */}
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-lg font-medium text-gray-700">Estimated total</span>
                                    <span className="text-xl font-bold text-[#1c1c1c]">${subtotal.toFixed(2)}</span>
                                </div>

                                {/* Buttons */}
                                <div className="space-y-3">
                                    <Button
                                        onClick={handleCheckout}
                                        className="w-full bg-[#ED1C24] hover:bg-red-700 text-white font-bold h-12 uppercase tracking-wide"
                                    >
                                        Checkout
                                    </Button>
                                    <Button
                                        onClick={handleViewCart}
                                        className="w-full bg-white border border-[#ED1C24] text-[#ED1C24] hover:bg-gray-50 font-bold h-12 uppercase tracking-wide"
                                    >
                                        View Cart
                                    </Button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
