import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import shreeaurahero from "../assets/shreeaurahero.jpeg";
import girlsProduct from "../assets/girlsproducts.png";



import FeaturedProducts from "./Featured";
import PriceProducts from "./PriceProducts";
import SearchPage from "./SearchPage";
import ShopByName from "./ShopByName";
import BlogPage from "./BlogPage";

interface HomePageProps {
  setCurrentPage: (
    page: string,
    options?: { category?: string; price?: number; brand?: string }
  ) => void;
}

export default function HomePage({ setCurrentPage }: HomePageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(true);
  const [selectedPrice] = useState<number | null>(null);
useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);
  const heroSlides = [
    { id: 1, image: girlsProduct, title: "Explore the Latest Fashion", subtitle: "Trendy Styles Just for You", name:"Makeup essential" },
    { id: 2, image: shreeaurahero, title: "Explore product", subtitle: "Find the Perfect Gift for Every Occasion", name:"Welcome" },
  ];

  const pricePlans = [
    { id: 1, price: 99, subtitle: "STORE", note: "LIVE NOW" },
    { id: 2, price: 199, subtitle: "STORE", note: "LIVE NOW" },
    { id: 3, price: 299, subtitle: "STORE", note: "LIVE NOW" },
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

  const handlePriceClick = (price: number) => {
    setCurrentPage("search", { price });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#140a24] via-[#1e1333] to-[#140a24] relative overflow-hidden text-white">

      {/* Floating Motion Background Orbs */}
      <motion.div
        className="absolute w-[500px] h-[500px] bg-[#FFD369]/20 rounded-full blur-3xl -top-32 -left-20"
        animate={{ x: [0, 30, -30, 0], y: [0, 20, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] bg-[#7DFFB1]/10 rounded-full blur-3xl bottom-0 right-0"
        animate={{ x: [0, -40, 40, 0], y: [0, -20, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Hero Section */}
{/* Hero Section */}
<section className="relative overflow-hidden w-full md:w-[87%] mx-auto min-h-[40vh] lg:min-h-[65vh] rounded-3xl shadow-[0_0_30px_rgba(255,211,105,0.2)] my-3">
  <AnimatePresence mode="wait">
    {heroSlides.map(
      (slide, index) =>
        index === currentSlide && (
          <motion.div
            key={slide.id}
            className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8 }}
          >
            <ImageWithFallback
              src={slide.image}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            {/* Overlay (no pointer events) */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 rounded-3xl pointer-events-none"></div>

            {/* Hero Text */}
            <div className="relative z-20 flex flex-col justify-center items-start h-full px-8 md:px-16">
              <motion.h1
                className="text-4xl md:text-6xl font-extrabold text-[#FFD369] drop-shadow-xl mb-4"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                {slide.title}
              </motion.h1>
              <motion.p
                className="text-lg md:text-2xl text-white/90 mb-6"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                {slide.subtitle}
              </motion.p>
              <motion.button
                onClick={() => setCurrentPage("search")}
                aria-label="Explore products"
                initial={{ y: 0 }}
                animate={{
                  y: [0, -6, 0],
                  boxShadow: [
                    "0 0 0px rgba(255,211,105,0)",
                    "0 0 28px rgba(255,211,105,0.28)",
                    "0 0 0px rgba(255,211,105,0)",
                  ],
                }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.98 }}
                className="relative inline-flex items-center gap-3 bg-linear-to-r from-[#FFD369] via-[#FFDF7A] to-[#FFD369] text-[#1a0f1a] font-extrabold px-8 py-4 md:px-10 md:py-5 rounded-full shadow-2xl hover:from-[#ffdc66] hover:to-[#ffd369] transition-all text-lg md:text-2xl"
              >
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/80 text-[#1a0f1a] shadow-md">
                  <ArrowRight className="w-4 h-4" />
                </span>
                <span>Shop Now</span>
                <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#FFD369] opacity-60 blur-sm" />
              </motion.button>
            </div>
          </motion.div>
        )
    )}
  </AnimatePresence>

  {/* Navigation Arrows — FIXED for mobile */}
  <button
    onClick={prevSlide}
    className="absolute top-1/2 left-5 -translate-y-1/2 bg-black/40 backdrop-blur-sm text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#FFD369] hover:text-[#1a0f1a] transition-all duration-300 z-50 active:scale-95"
  >
    <ChevronLeft size={24} />
  </button>
  <button
    onClick={nextSlide}
    className="absolute top-1/2 right-5 -translate-y-1/2 bg-black/40 backdrop-blur-sm text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#FFD369] hover:text-[#1a0f1a] transition-all duration-300 z-50 active:scale-95"
  >
    <ChevronRight size={24} />
  </button>

  {/* Dots */}
  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
    {heroSlides.map((_, index) => (
      <motion.div
        key={index}
        onClick={() => {
          setCurrentSlide(index);
          setIsAutoSliding(false);
          setTimeout(() => setIsAutoSliding(true), 10000);
        }}
        className={`rounded-full cursor-pointer transition-all duration-300 ${
          index === currentSlide
            ? "w-5 h-5 bg-[#FFD369] shadow-[0_0_15px_#FFD369]"
            : "w-3 h-3 bg-white/40"
        }`}
        whileHover={{ scale: 1.3 }}
      ></motion.div>
    ))}
  </div>
</section>


      {/* Featured Products */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <FeaturedProducts setCurrentPage={setCurrentPage} />
      </motion.div>

      {/* Price-based Products */}
      <motion.div
        className="p-4 bg-[#2C1E4A]/60 rounded-2xl shadow-inner mx-auto w-[90%] mt-5"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <PriceProducts products={pricePlans} onSelectPrice={handlePriceClick} />
        {selectedPrice && (
          <SearchPage
            setCurrentPage={setCurrentPage}
            setSelectedProduct={() => {}}
            onAddToCart={() => {}}
          />
        )}
      </motion.div>

      {/* Shop by Name */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mt-7"
      >
        <ShopByName
          setCurrentPage={
            setCurrentPage as (page: string, options?: { name?: string }) => void
          }
        />
      </motion.div>

      {/* Blog Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mt-16 mb-20"
      >
        <BlogPage />
      </motion.div>
    </div>
  );
}
