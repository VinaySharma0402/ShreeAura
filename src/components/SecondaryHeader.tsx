import { motion } from "motion/react";

interface SecondaryHeaderProps {
    setCurrentPage: (page: string, options?: any) => void;
}

export default function SecondaryHeader({ setCurrentPage }: SecondaryHeaderProps) {
    const categories = [
        "Deals",
        "Food",
        "Beverages",
        "Household",
        "Personal Care",
    ];

    const foodSubcategories = [
        "Vegetables",
        "Fruit",
        "Meat & Poultry",
        "Fish & Seafood",
        "Bakery",
        "Dairy & Eggs",
        "Pastas & Grains",
        "Cereals & Snacks"
    ];

    const beveragesSubcategories = [
        "Tea",
        "Coffee",
        "Soft Drinks",
        "Beer",
        "Wine"
    ];

    const householdSubcategories = [
        "Home & Kitchen",
        "Cleaning Supplies"
    ];

    const personalCareSubcategories = [
        "Personal Hygiene",
        "Babies"
    ];

    return (
        <div className="bg-white border-b border-gray-100 hidden md:block relative z-40">
            <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-center gap-16">
                {/* Categories */}
                <div className="flex items-center gap-12">
                    {categories.map((cat, index) => (
                        <div key={index} className="relative group h-full">
                            <button
                                onClick={() => setCurrentPage("search", { category: cat })}
                                className="text-[15px] font-normal text-gray-700 hover:text-[var(--primary)] transition-colors tracking-wide font-['Outfit'] py-2"
                            >
                                {cat}
                            </button>

                            {/* Dropdown for Food */}
                            {cat === "Food" && (
                                <div className="absolute top-full left-0 pt-0 w-56 hidden group-hover:block z-50">
                                    <div className="bg-white border border-gray-100 shadow-xl py-2 flex flex-col items-start rounded-sm">
                                        {foodSubcategories.map((sub) => (
                                            <button
                                                key={sub}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setCurrentPage("search", { category: sub });
                                                }}
                                                className="w-full text-left px-6 py-2.5 text-[15px] text-gray-700 hover:text-[var(--primary)] hover:bg-gray-50 transition-colors font-['Outfit']"
                                            >
                                                {sub}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Dropdown for Beverages */}
                            {cat === "Beverages" && (
                                <div className="absolute top-full left-0 pt-0 w-56 hidden group-hover:block z-50">
                                    <div className="bg-white border border-gray-100 shadow-xl py-2 flex flex-col items-start rounded-sm">
                                        {beveragesSubcategories.map((sub) => (
                                            <button
                                                key={sub}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setCurrentPage("search", { category: sub });
                                                }}
                                                className="w-full text-left px-6 py-2.5 text-[15px] text-gray-700 hover:text-[var(--primary)] hover:bg-gray-50 transition-colors font-['Outfit']"
                                            >
                                                {sub}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Dropdown for Household */}
                            {cat === "Household" && (
                                <div className="absolute top-full left-0 pt-0 w-56 hidden group-hover:block z-50">
                                    <div className="bg-white border border-gray-100 shadow-xl py-2 flex flex-col items-start rounded-sm">
                                        {householdSubcategories.map((sub) => (
                                            <button
                                                key={sub}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setCurrentPage("search", { category: sub });
                                                }}
                                                className="w-full text-left px-6 py-2.5 text-[15px] text-gray-700 hover:text-[var(--primary)] hover:bg-gray-50 transition-colors font-['Outfit']"
                                            >
                                                {sub}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Dropdown for Personal Care */}
                            {cat === "Personal Care" && (
                                <div className="absolute top-full left-0 pt-0 w-56 hidden group-hover:block z-50">
                                    <div className="bg-white border border-gray-100 shadow-xl py-2 flex flex-col items-start rounded-sm">
                                        {personalCareSubcategories.map((sub) => (
                                            <button
                                                key={sub}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setCurrentPage("search", { category: sub });
                                                }}
                                                className="w-full text-left px-6 py-2.5 text-[15px] text-gray-700 hover:text-[var(--primary)] hover:bg-gray-50 transition-colors font-['Outfit']"
                                            >
                                                {sub}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* My Orders / Special Links */}
                <motion.button
                    onClick={() => setCurrentPage("orders")}
                    whileHover={{ scale: 1.05 }}
                    className="text-[15px] font-normal text-red-500 hover:text-red-600 transition-colors tracking-wide font-['Outfit']"
                >
                    My Orders
                </motion.button>
            </div>
        </div>
    );
}
