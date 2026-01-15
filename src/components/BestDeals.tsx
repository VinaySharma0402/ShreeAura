import { useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";

// Mock Data from Screenshot
const deals = [
    {
        id: 1,
        name: "Hand Cream",
        price: 2.99,
        originalPrice: 0,
        image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=400", // Coffee Beans / Tea
        badge: "Best Deal"
    },
    {
        id: 2,
        name: "Herbal Tea 16 ct.",
        price: 3.99,
        originalPrice: 0,
        image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=400", // Herbal Tea box
        badge: "Best Deal"
    },
    {
        id: 3,
        name: "Strawberries - 1lb",
        price: 4.49,
        originalPrice: 4.99,
        image: "https://images.unsplash.com/photo-1587393855524-087f83d95bc9?auto=format&fit=crop&q=80&w=400", // Strawberries
        badge: "Best Deal"
    },
    {
        id: 4,
        name: "Hass Avocados, Ready-to-Eat - 1lb",
        price: 2.69,
        originalPrice: 2.99,
        image: "https://images.unsplash.com/photo-1523049673856-42bc318684a4?auto=format&fit=crop&q=80&w=400", // Avocado
        badge: "Best Deal"
    },
    {
        id: 5,
        name: "Boneless Chicken Thighs - 1lb",
        price: 4.04,
        originalPrice: 4.49,
        image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&q=80&w=400", // Raw Chicken
        badge: "Best Deal"
    }
];

import { useCart } from "../contexts/CartContext";

export default function BestDeals({ setCurrentPage }: { setCurrentPage: (page: string, options?: any) => void }) {
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
            mrp: item.originalPrice || 0,
            image: item.image,
            rating: 0,
            reviews: 0,
            category: "Deals"
        }, qty);
    };

    return (
        <section className="py-16 bg-white">
            <div className="max-w-[1400px] mx-auto px-6">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-[#1c1c1c] font-['Outfit']">Best Deals</h2>
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
                    {deals.map((item) => (
                        <div key={item.id} className="border border-gray-200 p-4 bg-white relative group">

                            {/* Badge */}
                            <div className="absolute top-4 left-4 z-10 bg-[#ED1C24] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                                {item.badge}
                            </div>

                            {/* Image */}
                            <div className="aspect-square mb-4 overflow-hidden">
                                <ImageWithFallback
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Info */}
                            <div className="space-y-1 mb-4">
                                <h3 className="text-[15px] text-gray-800 font-['Outfit'] h-10 line-clamp-2 leading-tight">
                                    {item.name}
                                </h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-[#ED1C24] font-bold text-lg font-['Outfit']">
                                        ${item.price.toFixed(2)}
                                    </span>
                                    {item.originalPrice > 0 && (
                                        <span className="text-gray-400 text-sm line-through font-['Outfit']">
                                            ${item.originalPrice.toFixed(2)}
                                        </span>
                                    )}
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
                                className="w-full bg-black text-white hover:bg-gray-800 rounded-full h-10 text-xs font-bold uppercase tracking-wider"
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
                        Shop Best Deals
                    </Button>
                </div>

            </div>
        </section>
    );
}
