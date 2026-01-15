import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useEffect, useState } from "react";
import { HomePageApi } from "./services/homepage";

interface Category {
    id: number;
    name: string;
    image: string;
}

export default function PopularCategories({ setCurrentPage }: { setCurrentPage: (page: string, options?: any) => void }) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await HomePageApi.getShopByCategory();
                // API response is expected to be { data: [...] } or just [...] depend on axios wrapper
                // Based on standard axios: response.data
                // Based on user snippet check: response might differ. 
                // Let's assume response.data is the array based on user input example.
                const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
                setCategories(data);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return <div className="py-16 text-center">Loading Categories...</div>;
    }

    if (categories.length === 0) {
        return null; // Don't render if no categories
    }

    return (
        <section className="py-16 bg-white border-b border-gray-100">
            <div className="max-w-[1400px] mx-auto px-6">

                {/* Title */}
                <h2 className="text-3xl font-bold text-[#1c1c1c] font-['Outfit'] mb-8 text-left">
                    Most Popular Categories
                </h2>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-gray-200">
                    {categories.map((cat, index) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.5 }}
                            viewport={{ once: true }}
                            onClick={() => setCurrentPage("search", { category: cat.name })}
                            className="
                group border-r border-b border-gray-200 p-8 
                flex flex-col items-center justify-center 
                cursor-pointer hover:shadow-lg hover:z-10 bg-white transition-all
              "
                        >
                            {/* Image Circle Background */}
                            <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
                                {/* Beige Circle */}
                                <div className="absolute inset-0 bg-[#FFF3DA] rounded-full transform group-hover:scale-110 transition-transform duration-500"></div>

                                {/* Image */}
                                <div className="relative z-10 w-28 h-28 rounded-full overflow-hidden">
                                    <ImageWithFallback
                                        src={cat.image}
                                        alt={cat.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* Category Name */}
                            <h3 className="text-lg font-bold text-[#1c1c1c] font-['Outfit'] group-hover:text-[#ED1C24] transition-colors">
                                {cat.name}
                            </h3>

                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}

