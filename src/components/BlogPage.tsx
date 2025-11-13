import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { HomePageApi } from "./services/homepage";

const CACHE_KEY = "cachedBlogs";
const CACHE_DURATION = 1000 * 60 * 10; // ✅ 10 minutes cache

export default function BlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch blogs with cache
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const cached = localStorage.getItem(CACHE_KEY);

        if (cached) {
          const { data, timestamp } = JSON.parse(cached);

          // if cache is fresh → use it
          if (Date.now() - timestamp < CACHE_DURATION) {
            console.log("✅ Using cached blogs");
            setBlogs(data);
            setLoading(false);
            return;
          }
        }

        console.log("🌐 Fetching blogs from API...");
        const response = await HomePageApi.getAllBlogs();
        const freshData = response.data || [];

        setBlogs(freshData);
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: freshData, timestamp: Date.now() })
        );
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // 🧭 Scroll indicator logic remains unchanged
  useEffect(() => {
    if (!selectedPost) return;

    const scrollContainer = document.querySelector(
      ".scrollable-blog-content"
    ) as HTMLElement | null;
    const indicator = document.getElementById("scroll-indicator");

    if (!scrollContainer || !indicator) return;

    const handleScroll = () => {
      const atBottom =
        scrollContainer.scrollTop + scrollContainer.clientHeight >=
        scrollContainer.scrollHeight - 10;
      indicator.style.opacity = atBottom ? "0" : "1";
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [selectedPost]);

  return (
    <div className="min-h-screen bg-[#12091E] text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-pink-700/30 to-indigo-900/40 blur-3xl -z-10" />

      {/* Hero Section */}
      <section className="py-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl lg:text-5xl font-extrabold text-[#FFD369] mb-4"
        >
          Beauty & Lifestyle Blog
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-lg lg:text-xl text-white/80 max-w-2xl mx-auto"
        >
          Explore beauty tips, skincare routines, and wellness inspiration.
        </motion.p>
      </section>

      {/* Loading / Empty State */}
      {loading ? (
        <p className="text-center text-white/70 text-lg pb-20">
          Loading blogs...
        </p>
      ) : blogs.length === 0 ? (
        <p className="text-center text-white/70 text-lg pb-20">
          No blogs available right now.
        </p>
      ) : (
        <section className="container mx-auto px-4 pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((post, index) => (
            <motion.div
              key={post.id || index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.04 }}
              className="group"
            >
              <Card className="bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_0_25px_rgba(255,211,105,0.3)] transition-all duration-500 flex flex-col">
                <div className="overflow-hidden relative">
                  <ImageWithFallback
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <CardContent className="p-5 flex flex-col flex-1">
                  <p className="text-sm text-[#FFD369] mb-2 font-medium">
                    {new Date(post.createAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <h3 className="font-bold text-xl mb-2">{post.title}</h3>
                  <p className="text-white/70 text-sm flex-1 mb-4 line-clamp-3">
                    {post.description?.slice(0, 120)}...
                  </p>
                  <Button
                    variant="ghost"
                    className="text-[#FFD369] hover:text-white hover:bg-[#FFD369]/10 w-fit"
                    onClick={() => setSelectedPost(post)}
                  >
                    Read More <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>
      )}

      {/* Blog Modal */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden bg-[#1E1432] text-white border border-[#FFD369]/20 rounded-2xl p-0 flex flex-col">
          <DialogHeader className="p-6 pb-3 border-b border-[#FFD369]/20">
            <DialogTitle className="text-2xl font-bold text-[#FFD369]">
              {selectedPost?.title}
            </DialogTitle>
          </DialogHeader>

          <div className="relative flex-1 overflow-y-auto px-6 py-4 space-y-5 scrollable-blog-content">
            {selectedPost && (
              <>
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={selectedPost.imageUrl}
                    alt={selectedPost.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                <p className="text-white/80 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                  {selectedPost.description}
                </p>
              </>
            )}

            {/* Scroll Indicator */}
            <div
              id="scroll-indicator"
              className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[#FFD369]/70 transition-opacity duration-500 animate-bounce"
            >
              <ArrowRight className="w-6 h-6 rotate-90" strokeWidth={2.5} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
