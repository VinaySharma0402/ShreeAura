import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";

export default function SecondaryPromos({ setCurrentPage }: { setCurrentPage: (page: string, options?: any) => void }) {
    return (
        <section className="py-8 bg-white overflow-hidden pb-16">
            <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Banner 1: Grocery & Kitchen (Beige) */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="relative h-auto md:h-[400px] bg-[#FFF3DA] overflow-hidden group cursor-pointer flex flex-col md:block"
                >
                    {/* Background Image (Kitchen/Grocery) */}
                    <ImageWithFallback
                        src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=1000"
                        alt="Grocery & Kitchen Background"
                        className="relative md:absolute md:right-0 md:top-10 h-[250px] md:h-[80%] w-full md:w-1/2 object-contain object-center md:object-right rotate-0 group-hover:scale-105 transition-transform duration-700 order-2 md:order-none z-10"
                    />

                    {/* Content */}
                    <div className="relative z-20 h-auto md:h-full flex flex-col justify-center items-start p-8 md:pl-12 w-full md:max-w-[50%] order-1 md:order-none">
                        <p className="text-[#1c1c1c] font-medium text-base mb-1 font-['Outfit']">Kitchen Essentials</p>
                        <div className="mb-4">
                            <h2 className="text-3xl md:text-4xl font-bold text-[#1c1c1c] leading-[1.1] mb-1 font-['Outfit']">
                                Great Deals on Your
                            </h2>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1c1c1c] leading-[1.1] font-['Outfit']">
                                Grocery & Kitchen
                            </h2>
                        </div>

                        <Button
                            onClick={() => setCurrentPage("search", { category: "Grocery & Kitchen" })}
                            className="bg-[#ED1C24] hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wide shadow-sm font-['Outfit']"
                        >
                            Shop Now
                        </Button>
                    </div>
                </motion.div>

                {/* Banner 2: Earrings (Light Blue) */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="relative h-auto md:h-[400px] bg-[#B2EBF2] overflow-hidden group cursor-pointer flex flex-col md:block"
                >
                    {/* Red Circle Badge */}
                    <div className="absolute top-4 right-4 md:top-[10%] md:right-[35%] bg-[#ED1C24] text-white rounded-full w-20 h-20 md:w-28 md:h-28 flex flex-col items-center justify-center text-center leading-tight shadow-md z-20 rotate-12">
                        <span className="text-base md:text-xl font-bold leading-none">Super</span>
                        <span className="text-base md:text-xl font-bold leading-none">Deal</span>
                    </div>

                    {/* Background Image (Earrings) */}
                    <div className="relative md:absolute md:right-0 md:top-0 h-[250px] md:h-full w-full md:w-[60%] order-2 md:order-none">
                        <ImageWithFallback
                            src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800"
                            alt="Earrings"
                            className="w-full h-full object-contain object-center md:object-bottom md:pt-10 group-hover:scale-105 transition-transform duration-700"
                        />
                    </div>

                    {/* Content */}
                    <div className="relative z-20 h-auto md:h-full flex flex-col justify-center items-start p-8 md:pl-12 w-full md:max-w-[50%] order-1 md:order-none">
                        <p className="text-[#1c1c1c] font-medium text-lg mb-1 font-['Outfit']">Trendy Collection</p>
                        <div className="flex items-start gap-1 mb-2">
                            <h2 className="text-7xl font-bold text-[#1c1c1c] font-['Outfit'] tracking-tight">30%</h2>
                            <span className="text-xl font-medium pt-4 font-['Outfit']">off</span>
                        </div>

                        <h3 className="text-3xl font-bold text-[#1c1c1c] mb-6 font-['Outfit']">
                            Earrings
                        </h3>

                        <Button
                            onClick={() => setCurrentPage("search", { category: "Earrings" })}
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
