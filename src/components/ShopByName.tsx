import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { HomePageApi } from "./services/homepage";

interface ShopItem {
    id: number;
    name: string;
    image: string;
}

export default function ShopByName({ setCurrentPage }: { setCurrentPage: (page: string, options?: any) => void }) {
    const [shopItems, setShopItems] = useState<ShopItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch shop items on mount
    useEffect(() => {
        const fetchShopItems = async () => {
            try {
                const response = await HomePageApi.getShopByName();
                const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
                const mappedItems = data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    image: item.image
                }));
                setShopItems(mappedItems);
            } catch (error) {
                console.error("Failed to fetch shop items:", error);
                setShopItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchShopItems();
    }, []);

    // Handle card click - navigate to search page with the name
    const handleCardClick = (name: string) => {
        // Use 'name' parameter which is supported by App.tsx setCurrentPage
        setCurrentPage("search", { name: name });
    };

    if (loading) {
        return <div className="py-16 text-center">Loading Shop By Name...</div>;
    }

    if (shopItems.length === 0) {
        return null;
    }

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
                    <h2 className="text-3xl font-bold text-[#1c1c1c] font-['Outfit']">Shop By Name</h2>
                    <div className="hidden md:flex gap-2">
                        <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors">
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors">
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Shop Items Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {shopItems.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleCardClick(item.name)}
                            className="border border-gray-200 p-4 bg-white group hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                        >
                            {/* Image */}
                            <div className="aspect-square mb-4 overflow-hidden">
                                <ImageWithFallback
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Name */}
                            <div className="text-center">
                                <h3 className="text-[14px] text-gray-800 font-['Outfit'] line-clamp-2 leading-tight font-medium">
                                    {item.name}
                                </h3>
                            </div>
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
