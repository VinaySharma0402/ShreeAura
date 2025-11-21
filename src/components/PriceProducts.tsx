import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

interface PriceProduct {
  id: number;
  price: number;
  currency?: string;
}

interface PriceProductsProps {
  products: PriceProduct[];
  onSelectPrice: (price: number) => void;
}

export default function PriceProducts({
  products,
  onSelectPrice,
}: PriceProductsProps) {
  const slogans = [
    "Glow that speaks luxury ✨",
    "Elegance meets simplicity 💫",
    "Because self-care is priceless 💕",
    "Radiance you can feel 🌸",
    "Beauty begins here 🌟",
    "Timeless glow awaits 💖",
    "Indulge in your aura ✨",
  ];

  return (
    <div className="relative py-7 px-6 bg-gradient-to-br from-[#1a0f1a] via-[#231134] to-[#2C1E4A] text-center overflow-hidden">
      {/* Floating sparkles for premium aura */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ repeat: Infinity, duration: 6 }}
        className="absolute top-10 left-10 text-[#FFD369]/40 text-4xl"
      >
        <Sparkles />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ repeat: Infinity, duration: 6, delay: 3 }}
        className="absolute bottom-10 right-10 text-[#FFD369]/40 text-4xl"
      >
        <Sparkles />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-extrabold text-[#FFD369] mb-3"
      >
        Explore Our Exclusive Combos
      </motion.h2>
      <p className="text-white/70 mb-10 max-w-xl mx-auto text-sm md:text-base">
        Experience curated collections crafted for every mood, moment, and
        style. Choose your vibe — and let the magic unfold.
      </p>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-8 max-w-6xl mx-auto">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            whileHover={{
              scale: 1.05,
              rotate: 1,
              boxShadow: "0 0 30px rgba(255,211,105,0.3)",
            }}
            onClick={() => onSelectPrice(product.price)}
            className="group relative rounded-2xl border border-[#FFD369]/30 bg-gradient-to-br from-[#2C1E4A]/70 to-[#3B1E58]/80 backdrop-blur-md transition-all duration-500 p-8 cursor-pointer overflow-hidden"
          >
            {/* Floating shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#FFD369]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3, delay: index * 0.2 }}
              className="flex flex-col items-center justify-center space-y-3"
            >
              <p className="text-4xl font-extrabold text-[#FFD369] tracking-wide drop-shadow-md">
                {product.currency || "₹"}
                {product.price}
              </p>
              <p className="text-white/80 text-sm italic font-medium">
                {slogans[index % slogans.length]}
              </p>
            </motion.div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              className="mt-6 px-6 py-2 rounded-xl bg-[#FFD369] text-[#1a0f1a] font-semibold text-sm tracking-wide transition-all duration-300 hover:bg-[#ffcc4d] hover:shadow-[0_0_15px_rgba(255,211,105,0.5)]"
              
           >
              View Combo
            </motion.button>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="text-white/60 text-sm mt-12 italic"
      >
        ✨ Hand-picked beauty experiences crafted for your everyday glow ✨
      </motion.p>
    </div>
  );
}
