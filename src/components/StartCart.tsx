import { useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { toast } from "sonner";

// Mock Data from Screenshot
const products = [
    {
        id: 1,
        name: "Banana Bunch - 1lb",
        price: 1.89,
        image: "https://images.unsplash.com/photo-1571771896395-d2d4b3da0ed6?auto=format&fit=crop&q=80&w=400", // Bananas
    },
    {
        id: 2,
        name: "Whole Milk Gallon, 64 oz.",
        price: 2.69,
        image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=400", // Milk Carton
    },
    {
        id: 3,
        name: "Natural Large White Eggs",
        price: 3.99,
        image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&q=80&w=400", // Eggs
    },
    {
        id: 4,
        name: "100% Whole Wheat Bread 24 oz.",
        price: 4.69,
        image: "https://images.unsplash.com/photo-1598373182133-52452f7691ef?auto=format&fit=crop&q=80&w=400", // Sliced Bread
    },
    {
        id: 5,
        name: "Greenhouse Cucumber - 1lb",
        price: 0.99,
        image: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&q=80&w=400", // Cucumber
    }
];

import { useCart } from "../contexts/CartContext";

export default function StartCart({ setCurrentPage }: { setCurrentPage: (page: string, options?: any) => void }) {
    const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
    const { addToCart } = useCart();

    const updateQuantity = (id: number, delta: number) => {
        setQuantities(prev => {
            const current = prev[id] || 1;
            const newValue = Math.max(1, current + delta);
            return { ...prev, [id]: newValue };
        });
    };

    const handleAddToCart = (item: any) => {
        const qty = quantities[item.id] || 1;
        addToCart({
            productId: String(item.id),
            name: item.name,
            sellingPrice: item.price,
            mrp: item.price,
            image: item.image,
            rating: 0,
            reviews: 0,
            category: "Staples"
        }, qty);
        toast.success(`Added ${qty} ${item.name} to cart`);
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="py-16 bg-white border-b border-gray-100"
        >
            <div className="max-w-[1400px] mx-auto px-6">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-[#1c1c1c] font-['Outfit']">Start Your Cart</h2>
                    <div className="hidden md:flex gap-2">
                        <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors">
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors">
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Carousel / Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {products.map((item) => (
                        <div key={item.id} className="border border-gray-200 p-4 bg-white group hover:shadow-lg transition-shadow duration-300">

                            {/* Image */}
                            <div className="aspect-square mb-4 overflow-hidden">
                                <ImageWithFallback
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Info */}
                            <div className="space-y-1 mb-4 h-20">
                                <h3 className="text-[14px] text-gray-800 font-['Outfit'] h-10 line-clamp-2 leading-tight">
                                    {item.name}
                                </h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-[#ED1C24] font-bold text-lg font-['Outfit']">
                                        ${item.price.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Quantity Stepper */}
                            <div className="flex items-center border border-gray-300 rounded-none h-10 mb-3">
                                <button
                                    onClick={() => updateQuantity(item.id, -1)}
                                    className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50"
                                >
                                    <Minus className="w-3 h-3" />
                                </button>
                                <div className="flex-1 flex items-center justify-center text-sm font-medium text-gray-900">
                                    {quantities[item.id] || 1}
                                </div>
                                <button
                                    onClick={() => updateQuantity(item.id, 1)}
                                    className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50"
                                >
                                    <Plus className="w-3 h-3" />
                                </button>
                            </div>

                            {/* Add to Cart Button */}
                            <Button
                                onClick={() => handleAddToCart(item)}
                                className="w-full bg-black text-white hover:bg-gray-800 rounded-full h-10 text-xs font-bold uppercase tracking-wider font-['Outfit']"
                            >
                                Add to Cart
                            </Button>

                        </div>
                    ))}
                </div>

                {/* Bottom Button */}
                <div className="flex justify-center mt-12">
                    <Button
                        onClick={() => setCurrentPage("search")}
                        className="bg-[#ED1C24] hover:bg-red-700 text-white px-8 py-6 rounded-full font-bold text-lg shadow-md transition-all font-['Outfit']"
                    >
                        Shop More Products
                    </Button>
                </div>

            </div>
        </motion.section>
    );
}
