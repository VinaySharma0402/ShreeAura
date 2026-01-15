import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Truck, ShoppingBasket, Headset, Smartphone } from "lucide-react";


import BestDeals from "./BestDeals";
import PromoBanners from "./PromoBanners";
import PopularCategories from "./PopularCategories";
import StartCart from "./StartCart";
import MobileAppPromo from "./MobileAppPromo";
import MostPopular from "./MostPopular";
import SecondaryPromos from "./SecondaryPromos";
import FreshFinds from "./FreshFinds";
import SubscribeSection from "./SubscribeSection";

interface HomePageProps {
  setCurrentPage: (
    page: string,
    options?: { category?: string; price?: number; brand?: string; name?: string }
  ) => void;
}

export default function HomePage({ setCurrentPage }: HomePageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(true);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const heroSlides = [
    {
      id: 1,
      bgColor: "#FFF8E7", // Cream
      titleLines: ["Stock Up on", "Daily Essentials"],
      subtitle: "Easy, Fresh & Convenient",
      secondaryTextLines: ["Save Big on Your", "Favorite Brands"],
      leftImage: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600", // Packaged Bread
      rightImage: "https://images.unsplash.com/photo-1598373182133-52452f7691ef?auto=format&fit=crop&q=80&w=600", // Fresh Bread
      buttonColor: "#ED1C24", // Red
      textColor: "text-[#1c1c1c]",
    },
    {
      id: 2,
      bgColor: "#D1F2F9", // Light Blue
      titleLines: ["Stock Up on", "Daily Essentials"],
      subtitle: "Easy, Fresh & Convenient",
      secondaryTextLines: ["Save Big on Your", "Favorite Brands"],
      leftImage: "https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&q=80&w=500", // Teddy Bear
      rightImage: "https://images.unsplash.com/photo-1556228578-f3b914d9e7d7?auto=format&fit=crop&q=80&w=500", // Baby Products
      buttonColor: "#ED1C24", // Red
      textColor: "text-[#1c1c1c]",
    },
  ];

  // Auto-slide
  useEffect(() => {
    if (!isAutoSliding) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoSliding, heroSlides.length]);

  const nextSlide = () => {
    setIsAutoSliding(false);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setTimeout(() => setIsAutoSliding(true), 10000);
  };

  const prevSlide = () => {
    setIsAutoSliding(false);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setTimeout(() => setIsAutoSliding(true), 10000);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] relative overflow-hidden">

      {/* Floating Motion Background Orbs */}
      <motion.div
        className="absolute w-[500px] h-[500px] bg-[var(--secondary)]/10 rounded-full blur-3xl -top-32 -left-20"
        animate={{ x: [0, 30, -30, 0], y: [0, 20, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] bg-[var(--primary)]/10 rounded-full blur-3xl bottom-0 right-0"
        animate={{ x: [0, -40, 40, 0], y: [0, -20, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden min-h-[450px] md:min-h-[500px] flex items-center bg-gray-50 uppercase">
        <AnimatePresence mode="popLayout">
          {heroSlides.map((slide, index) =>
            index === currentSlide && (
              <motion.div
                key={slide.id}
                className="absolute inset-0 w-full h-full flex items-center justify-center p-0 md:px-4"
                style={{ backgroundColor: slide.bgColor }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 md:grid-cols-12 items-center gap-4 relative z-10 px-4">

                  {/* Left Image */}
                  <motion.div
                    className="hidden md:block md:col-span-3 lg:col-span-3"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <img
                      src={slide.leftImage}
                      alt="Left Hero Asset"
                      className="w-full h-auto max-h-[400px] object-contain drop-shadow-xl -rotate-6 hover:scale-105 transition-transform duration-500"
                    />
                  </motion.div>

                  {/* Center Text - Left Aligned inside the column */}
                  <div className="col-span-1 md:col-span-6 lg:col-span-6 text-left flex flex-col items-start justify-center z-20 pt-8 md:pt-0 pl-4 md:pl-12">
                    <motion.p
                      className="text-gray-800 font-medium text-lg md:text-xl mb-2 tracking-wide font-['Outfit'] lowercase first-letter:uppercase"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {slide.subtitle}
                    </motion.p>

                    <div className="mb-4">
                      {slide.titleLines.map((line, i) => (
                        <motion.h1
                          key={i}
                          className={`text-4xl md:text-6xl font-extrabold leading-tight font-['Outfit'] ${slide.textColor}`}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 + (i * 0.1) }}
                        >
                          {line}
                        </motion.h1>
                      ))}
                    </div>

                    <div className="mb-8">
                      {slide.secondaryTextLines.map((line, i) => (
                        <motion.h2
                          key={i}
                          className="text-xl md:text-3xl font-bold text-gray-800 font-['Outfit'] leading-tight"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4 + (i * 0.1) }}
                        >
                          {line}
                        </motion.h2>
                      ))}
                    </div>

                    <motion.button
                      onClick={() => setCurrentPage("search")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-white px-10 py-3.5 rounded-full font-bold text-lg hover:brightness-110 transition-all shadow-lg font-['Outfit'] capitalize border-none cursor-pointer"
                      style={{ backgroundColor: slide.buttonColor }}
                    >
                      Shop Now
                    </motion.button>
                  </div>

                  {/* Right Image */}
                  <motion.div
                    className="hidden md:block md:col-span-3 lg:col-span-3"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <img
                      src={slide.rightImage}
                      alt="Right Hero Asset"
                      className="w-full h-auto max-h-[400px] object-contain drop-shadow-xl rotate-6 hover:scale-105 transition-transform duration-500"
                    />
                  </motion.div>
                </div>
              </motion.div>
            ))}
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full backdrop-blur-sm transition-all z-20 border-none cursor-pointer">
          <ChevronLeft className="w-8 h-8 text-gray-800" />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full backdrop-blur-sm transition-all z-20 border-none cursor-pointer">
          <ChevronRight className="w-8 h-8 text-gray-800" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
          {heroSlides.map((_, index) => (
            <div
              key={index}
              onClick={() => {
                setIsAutoSliding(false);
                setCurrentSlide(index);
              }}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all ${index === currentSlide ? 'bg-black scale-125' : 'bg-black/30 hover:bg-black/50'}`}
            />
          ))}
        </div>

      </section>

      {/* Service Features Strip (Wix Style) */}
      <div className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-gray-100">

          {/* Feature 1 */}
          <div className="flex items-center gap-4 justify-center px-4">
            <Truck className="w-8 h-8 text-[#ED1C24]" strokeWidth={1.5} />
            <div className="flex flex-col text-left">
              <span className="font-bold text-gray-900 text-[15px] font-['Outfit']">Free Delivery</span>
              <span className="text-gray-500 text-xs font-['Outfit']">To Your Door</span>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-center gap-4 justify-center px-4 border-l border-gray-200 md:border-l-0">
            <ShoppingBasket className="w-8 h-8 text-[#ED1C24]" strokeWidth={1.5} />
            <div className="flex flex-col text-left">
              <span className="font-bold text-gray-900 text-[15px] font-['Outfit']">Local Pickup</span>
              <span className="text-gray-500 text-xs font-['Outfit']">Check Out Locations</span>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-center gap-4 justify-center px-4 border-l border-gray-200">
            <Headset className="w-8 h-8 text-[#ED1C24]" strokeWidth={1.5} />
            <div className="flex flex-col text-left">
              <span className="font-bold text-gray-900 text-[15px] font-['Outfit']">Available for You</span>
              <span className="text-gray-500 text-xs font-['Outfit']">Online Support 24/7</span>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex items-center gap-4 justify-center px-4 border-l border-gray-200">
            <Smartphone className="w-8 h-8 text-[#ED1C24]" strokeWidth={1.5} />
            <div className="flex flex-col text-left">
              <span className="font-bold text-gray-900 text-[15px] font-['Outfit']">Order on the Go</span>
              <span className="text-gray-500 text-xs font-['Outfit']">Download Our App</span>
            </div>
          </div>

        </div>
      </div>

      {/* Best Deals Section */}
      <BestDeals setCurrentPage={setCurrentPage} />

      {/* Promo Banners Section */}
      <PromoBanners setCurrentPage={setCurrentPage} />

      {/* Most Popular Categories */}
      <PopularCategories setCurrentPage={setCurrentPage} />

      {/* Start Your Cart Section */}
      <StartCart setCurrentPage={setCurrentPage} />

      {/* Mobile App Promo */}
      <MobileAppPromo />

      {/* Most Popular Section */}
      <MostPopular setCurrentPage={setCurrentPage} />

      {/* Secondary Promos (Pasta & Cereal) */}
      <SecondaryPromos setCurrentPage={setCurrentPage} />

      {/* Fresh Finds Section */}
      <FreshFinds setCurrentPage={setCurrentPage} />

      {/* Subscribe & Save Section */}
      <SubscribeSection />

    </div>
  );
}
