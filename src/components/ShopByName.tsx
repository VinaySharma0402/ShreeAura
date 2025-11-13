import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { HomePageApi } from "./services/homepage";

interface FeaturedProductsProps {
  setCurrentPage: (
    page: string,
    options?: { category?: string; price?: number; brand?: string; name?: string }
  ) => void;
}

interface NameCard {
  id: string | number;
  name: string;
  image: string;
}

const CACHE_KEY = "shop_by_name_cache";
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

const AnimatedSection = ({ children, delay = 0 }: any) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.section
      ref={ref}
      className="py-8 px-4 bg-[#1a0f1a]"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.section>
  );
};

export default function ShopByName({ setCurrentPage }: FeaturedProductsProps) {
  const [names, setNames] = useState<NameCard[]>([]);
  const [loading, setLoading] = useState(true);

  const handleSearch = (query: string) => {
    const finalQuery = query.trim();
    if (!finalQuery) return;
    setCurrentPage("search", { name: finalQuery });
  };

  useEffect(() => {
    const fetchShopByName = async () => {
      try {
        // Check local cache first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const age = Date.now() - timestamp;

          // Use cache if it's still valid
          if (age < CACHE_DURATION_MS) {
            setNames(data);
            setLoading(false);
            return;
          }
        }

        // Otherwise fetch new data
        const res = await HomePageApi.getShopByName();
        setNames(res.data);

        // Save to local storage
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: res.data, timestamp: Date.now() })
        );
      } catch (err) {
        console.error("Error fetching shop by name:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShopByName();
  }, []);

  return (
    <AnimatedSection delay={0.3}>
      <div className="max-w-6xl mx-auto text-center">
        {/* Section Header */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-extrabold text-[#FFD369] mb-10 tracking-wide"
        >
          Shop by Name
        </motion.h2>

        {/* Cards Grid */}
        {loading ? (
          <p className="text-[#FFD369] py-8 text-center">Loading items...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-items-center">
            {names.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{
                  scale: 1.08,
                  y: -6,
                  boxShadow: "0 0 25px rgba(255, 211, 105, 0.4)",
                }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleSearch(item.name)}
                className="relative w-full max-w-[220px] aspect-[3/4] rounded-2xl overflow-hidden bg-[#2C1E4A]/70 border border-[#FFD369]/30 shadow-md hover:shadow-lg cursor-pointer group transition-all duration-300"
              >
                {/* Image */}
                <motion.img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80"></div>

                {/* Text Overlay */}
                <div className="absolute bottom-0 w-full text-center pb-4">
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-[#FFD369] font-bold text-lg tracking-wide uppercase drop-shadow-lg"
                  >
                    {item.name}
                  </motion.p>
                </div>

                {/* Hover Glow Ring */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#FFD369]/50 transition-all duration-300"
                  whileHover={{
                    boxShadow:
                      "inset 0 0 15px rgba(255,211,105,0.3), 0 0 20px rgba(255,211,105,0.3)",
                  }}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}
