import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";

export default function PromoBanners({ setCurrentPage }: { setCurrentPage: (page: string, options?: any) => void }) {
    return (
        <section className="py-8 bg-white overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Banner 1: Wine (Teal) */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="relative h-[400px] bg-[#AEECE5] overflow-hidden group cursor-pointer"
                >
                    {/* Background Image (Wine Bottles) */}
                    <ImageWithFallback
                        src="https://images.unsplash.com/photo-1559563362-c667ba5f5480?auto=format&fit=crop&q=80&w=1000"
                        alt="Rose Wine Background"
                        className="absolute right-[-50px] top-0 h-full w-2/3 object-cover object-center mix-blend-multiply opacity-80 rotate-12 group-hover:rotate-6 transition-transform duration-700"
                    />

                    {/* Red Circle Badge */}
                    <div className="absolute top-[8%] right-[30%] bg-[#ED1C24] text-white rounded-full w-24 h-24 flex flex-col items-center justify-center text-center leading-tight shadow-md z-10 p-2">
                        <span className="text-sm font-medium">Limited</span>
                        <span className="text-lg font-bold">Supply</span>
                    </div>

                    {/* Content */}
                    <div className="relative z-20 h-full flex flex-col justify-center items-start pl-12 max-w-[50%]">
                        <p className="text-[#1c1c1c] font-medium text-lg mb-1 font-['Outfit']">It's Wine O'Clock!</p>
                        <h2 className="text-4xl md:text-5xl font-bold text-[#1c1c1c] leading-[1.1] mb-4 font-['Outfit']">
                            Great Deals on Selected Wines
                        </h2>
                        <p className="text-gray-700 mb-6 text-sm leading-relaxed font-['Outfit']">
                            I'm a paragraph. Click here to add your own text and edit me.
                        </p>
                        <Button
                            onClick={() => setCurrentPage("search", { category: "Beverages" })}
                            className="bg-[#ED1C24] hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wide shadow-sm font-['Outfit']"
                        >
                            Shop Now
                        </Button>
                    </div>
                </motion.div>

                {/* Banner 2: Cleaning (Yellow) */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="relative h-[400px] bg-[#FFF2CC] overflow-hidden group cursor-pointer"
                >
                    {/* Background Image (Cleaning Sponge/Gloves) */}
                    <ImageWithFallback
                        src="https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&q=80&w=1000"
                        alt="Cleaning Supplies Background"
                        className="absolute right-0 top-0 h-full w-2/3 object-cover object-center mix-blend-multiply rotate-[-10deg] group-hover:rotate-0 transition-transform duration-700 opacity-90"
                    />

                    {/* Content */}
                    <div className="relative z-20 h-full flex flex-col justify-center items-start pl-12 max-w-[60%]">
                        <p className="text-[#1c1c1c] font-medium text-lg mb-1 font-['Outfit']">Deal of the Week</p>
                        <div className="flex items-start gap-1 mb-2">
                            <h2 className="text-7xl font-bold text-[#1c1c1c] font-['Outfit'] tracking-tight">40%</h2>
                            <span className="text-xl font-medium pt-4 font-['Outfit']">off</span>
                        </div>

                        <h3 className="text-3xl font-bold text-[#1c1c1c] mb-6 font-['Outfit']">
                            Cleaning Supplies
                        </h3>

                        <Button
                            onClick={() => setCurrentPage("search", { category: "Household" })}
                            className="bg-[#ED1C24] hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wide shadow-sm font-['Outfit']"
                        >
                            Shop Now
                        </Button>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
