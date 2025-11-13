import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { HomePageApi } from "./services/homepage";

interface FeaturedProductsProps {
  setCurrentPage: (page: string, options?: { category?: string }) => void;
}

interface Category {
  id: string | number;
  name: string;
  image: string;
}

const CACHE_KEY = "shop_by_category_cache";
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour cache

const AnimatedSection = ({ children, delay = 0 }: any) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.section
      ref={ref}
      className="py-7 px-6 relative overflow-hidden bg-[#1a0f1a]"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.section>
  );
};

const CategoryCard = ({
  category,
  onClick,
  index,
}: {
  category: Category;
  onClick: (name: string) => void;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.05 }}
    whileHover={{ scale: 1.08, rotate: 1 }}
    whileTap={{ scale: 0.96 }}
    className="cursor-pointer relative rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(255,211,105,0.15)] hover:shadow-[0_0_40px_rgba(255,211,105,0.4)] w-full aspect-[4/5] max-w-[220px] group bg-[#2C1E4A]/40 backdrop-blur-md border border-[#FFD369]/20 transition-all duration-300"
    onClick={() => onClick(category.name)}
  >
    <motion.img
      src={category.image}
      alt={category.name}
      className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
    <div className="absolute bottom-0 left-0 right-0 text-center p-3">
      <motion.p
        className="text-[#FFD369] font-bold text-base uppercase tracking-wide relative inline-block"
        whileHover={{ scale: 1.05 }}
      >
        {category.name}
        <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#FFD369] group-hover:w-full transition-all duration-300"></span>
      </motion.p>
    </div>
  </motion.div>
);

export default function ShopByCategory({ setCurrentPage }: FeaturedProductsProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const age = Date.now() - timestamp;

          if (age < CACHE_DURATION_MS) {
            // Use cached data
            setCategories(data);
            setLoading(false);
            return;
          }
        }

        // Otherwise fetch from API
        const res = await HomePageApi.getShopByCategory();
        setCategories(res.data);

        // Save to localStorage
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: res.data, timestamp: Date.now() })
        );
      } catch (err) {
        console.error("Error fetching shop by category:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <AnimatedSection delay={0.2}>
      <motion.div
        className="absolute w-[400px] h-[400px] bg-[#FFD369]/10 rounded-full blur-3xl -top-10 -left-20"
        animate={{ x: [0, 30, -30, 0], y: [0, 20, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[350px] h-[350px] bg-[#7DFFB1]/10 rounded-full blur-3xl bottom-10 right-10"
        animate={{ x: [0, -30, 30, 0], y: [0, -20, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-[1300px] mx-auto relative z-10">
        {loading ? (
          <p className="text-center text-[#FFD369] py-10">Loading categories...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 justify-items-center px-2">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={(name: string) =>
                  setCurrentPage("search", { category: name })
                }
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}
