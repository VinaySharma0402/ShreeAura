import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { HomePageApi } from "./services/homepage";
import { useCart } from "../contexts/CartContext";

interface TopRatedProduct {
    productId: string;
    name: string;
    mrp: number;
    imageUrl: string;
}

export default function TopRateds({ setCurrentPage }: { setCurrentPage: (page: string, options?: any) => void }) {
    const [products, setProducts] = useState<TopRatedProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchTopRated = async () => {
            try {
                const response = await HomePageApi.getTopRatedProducts();
                // Handle different response structures
                const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
                // Map API data to only include name, mrp, and imageUrl
                const mappedProducts = data.map((item: any) => ({
                    productId: item.productId,
                    name: item.name,
                    mrp: item.mrp,
                    imageUrl: item.imageUrl
                }));
                setProducts(mappedProducts);
            } catch (error) {
                console.error("Failed to fetch top rated products:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTopRated();
    }, []);

    const updateQuantity = (id: string, delta: number) => {
        setQuantities(prev => {
            const current = prev[id] || 1;
            const newValue = Math.max(1, current + delta);
            return { ...prev, [id]: newValue };
        });
    };

    const handleAddToCart = (item: TopRatedProduct) => {
        const qty = quantities[item.productId] || 1;
        addToCart({
            productId: item.productId,
            name: item.name,
            sellingPrice: item.mrp,
            mrp: item.mrp,
            image: item.imageUrl,
            rating: 0,
            reviews: 0,
            category: "Top Rated"
        }, qty);
    };

    if (loading) {
        return <div className="py-16 text-center">Loading Top Rated Products...</div>;
    }

    if (products.length === 0) {
        return null; // Don't render if no products
    }

    return (
        <section className="py-16 bg-white">
            <div className="max-w-[1400px] mx-auto px-6">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-[#1c1c1c] font-['Outfit']">Top Rated</h2>
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
                        <div key={item.productId} className="border border-gray-200 p-4 bg-white relative group">

                            {/* Badge */}
                            <div className="absolute top-4 left-4 z-10 bg-[#ED1C24] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                                Top Rated
                            </div>

                            {/* Image */}
                            <div className="aspect-square mb-4 overflow-hidden">
                                <ImageWithFallback
                                    src={item.imageUrl}
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
                                        ₹{item.mrp.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Quantity Stepper */}
                            <div className="flex items-center border border-gray-300 rounded-none h-10 mb-3">
                                <button
                                    onClick={() => updateQuantity(item.productId, -1)}
                                    className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50"
                                >
                                    <Minus className="w-3 h-3" />
                                </button>
                                <div className="flex-1 flex items-center justify-center text-sm font-medium text-gray-900">
                                    {quantities[item.productId] || 1}
                                </div>
                                <button
                                    onClick={() => updateQuantity(item.productId, 1)}
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
                        Shop Top Rated
                    </Button>
                </div>

            </div>
        </section>
    );
}
