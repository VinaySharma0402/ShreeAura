import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ShoppingCart, ChevronLeft } from "lucide-react";

export default function MobileAppPromo() {
    return (
        <section className="relative w-full h-[600px] overflow-hidden bg-gray-900 flex items-center justify-center">

            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <ImageWithFallback
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=2000" // Person holding phone/shopping
                    alt="Mobile Shopping Background"
                    className="w-full h-full object-cover opacity-60 blur-sm scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
            </div>

            <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center h-full">

                {/* Left: Phone Mockup */}
                <div className="flex justify-center md:justify-end">
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative w-[280px] h-[580px] bg-white rounded-[40px] shadow-2xl border-[8px] border-white overflow-hidden"
                    >
                        {/* Phone Top Bar */}
                        <div className="flex justify-between items-center p-4 pt-6">
                            <ChevronLeft className="w-5 h-5 text-gray-800" />
                            <div className="relative">
                                <ShoppingCart className="w-5 h-5 text-gray-800" />
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold px-1 rounded-full">0</span>
                            </div>
                        </div>

                        {/* Product Image */}
                        <div className="px-6 py-2">
                            <ImageWithFallback
                                src="https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=300" // Corn
                                alt="Corn on the Cob"
                                className="w-full h-40 object-contain drop-shadow-lg"
                            />
                        </div>

                        {/* Product Details Card */}
                        <div className="bg-[#FFF8E7] rounded-t-[30px] h-full p-6 pt-8 mt-4 flex flex-col">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">SKU: 0002</p>
                            <h3 className="text-2xl font-bold text-gray-900 leading-tight mb-2 font-['Outfit']">Corn on the Cob</h3>
                            <p className="text-[#ED1C24] font-bold text-lg mb-1">$3.99</p>

                            <div className="mb-6">
                                <p className="text-[10px] text-gray-500 mb-1">Quantity</p>
                                <div className="w-12 h-8 border border-gray-400 flex items-center justify-center font-bold text-sm bg-transparent">
                                    6
                                </div>
                            </div>

                            <div className="space-y-3 mt-auto mb-12">
                                <button className="w-full bg-[#8B0000] text-white py-3 rounded-full font-bold text-sm uppercase shadow-lg">
                                    Add to Cart
                                </button>
                                <button className="w-full bg-[#ED1C24] text-white py-3 rounded-full font-bold text-sm uppercase shadow-lg">
                                    Buy Now
                                </button>
                            </div>
                        </div>

                    </motion.div>
                </div>

                {/* Right: Text Content */}
                <div className="text-left text-white max-w-lg">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-xl font-bold mb-2 font-['Outfit']"
                    >
                        Save Time & Money
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 font-['Outfit']"
                    >
                        Shop With Us<br />on the Go
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-lg text-gray-200 mb-8 font-['Outfit'] leading-relaxed"
                    >
                        Your weekly shopping routine, at your<br />door in just a click
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="flex gap-4"
                    >
                        {/* App Store Button */}
                        <button className="bg-black border border-white/20 rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-gray-900 transition-colors">
                            <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.8-1.31.02-2.3-1.23-3.14-2.43-1.7-2.45-3-6.24-1.17-9.5 1.05-1.85 2.92-2.99 4.97-3.03 1.45.03 2.67.92 3.5.92.79 0 2.43-1.05 4.19-.94 1.35.09 2.16.29 2.87.5 1.15.34 2.22 1.09 2.97 2.15-2.6 1.54-2.16 5.86.58 7.39-.01.07-.06.21-.11.36zm-4.75-14.6c.94-1.12 1.56-2.66 1.38-4.22-1.35.06-3.01.91-4.01 2.07-.86.99-1.54 2.56-1.35 4.09 1.51.11 3.03-.79 3.98-1.94z" /></svg>
                            <div className="text-left">
                                <div className="text-[10px] leading-tight text-gray-300">Download on the</div>
                                <div className="text-lg font-bold leading-tight">App Store</div>
                            </div>
                        </button>

                        {/* Google Play Button */}
                        <button className="bg-black border border-white/20 rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-gray-900 transition-colors">
                            <svg className="w-8 h-8" viewBox="0 0 24 24">
                                <path d="M4 3v18l11-9L4 3z" className="fill-[#00E261]" />
                                <path d="M4 21h11l-5-5L4 21z" className="fill-[#00C6F5]" />
                                <path d="M15 12L4 3v18l11-9z" className="fill-[#FFC800]" />
                                <path d="M15 12L4 21h12.5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H4l11 9z" className="fill-[#FF3E42]" />
                            </svg>
                            <div className="text-left">
                                <div className="text-[10px] leading-tight text-gray-300 uppercase">Get it on</div>
                                <div className="text-lg font-bold leading-tight">Google Play</div>
                            </div>
                        </button>
                    </motion.div>
                </div>

            </div>
        </section>
    );
}
