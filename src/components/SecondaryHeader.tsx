import { motion } from "motion/react";

interface SecondaryHeaderProps {
    setCurrentPage: (page: string, options?: any) => void;
}

export default function SecondaryHeader({ setCurrentPage }: SecondaryHeaderProps) {
    const categories = [
        { name: "Deals", action: () => setCurrentPage("search", { category: "Deals" }) },
        { name: "Top Rated", action: () => scrollToSection("top-rated") },
        { name: "Popular Categories", action: () => scrollToSection("popular-categories") },
        { name: "Shop by Name", action: () => scrollToSection("shop-by-name") },
    ];

    // Function to scroll to a section on the home page
    const scrollToSection = (sectionId: string) => {
        // First navigate to home page if not already there
        setCurrentPage("home");

        // Then scroll to the section after a short delay
        setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 100);
    };

    return (
        <div className="bg-white border-b border-gray-100 hidden md:block relative z-40">
            <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-center gap-16">
                {/* Categories */}
                <div className="flex items-center gap-12">
                    {categories.map((cat, index) => (
                        <div key={index} className="relative group h-full">
                            <button
                                onClick={cat.action}
                                className="text-[15px] font-normal text-gray-700 hover:text-[var(--primary)] transition-colors tracking-wide font-['Outfit'] py-2"
                            >
                                {cat.name}
                            </button>
                        </div>
                    ))}
                </div>

                {/* My Orders / Special Links */}
                <motion.button
                    onClick={() => setCurrentPage("orders")}
                    whileHover={{ scale: 1.05 }}
                    className="text-[15px] font-normal text-gray-700 hover:text-[var(--primary)] transition-colors tracking-wide font-['Outfit']"
                >
                    My Orders
                </motion.button>
            </div>
        </div>
    );
}

