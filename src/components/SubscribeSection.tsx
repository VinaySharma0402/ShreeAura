import { motion, useScroll, useTransform } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { useState, useRef } from "react";
import { toast } from "sonner";

export default function SubscribeSection() {
    const [email, setEmail] = useState("");
    const [agreed, setAgreed] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email address");
            return;
        }
        if (!agreed) {
            toast.error("Please accept the newsletter subscription");
            return;
        }
        toast.success("Thanks for subscribing! Your 20% off code is on the way.");
        setEmail("");
        setAgreed(false);
    };

    return (
        <section ref={sectionRef} className="relative w-full h-[500px] flex items-center justify-center overflow-hidden bg-[#2D0D28] -mb-1">

            {/* Background Image with Parallax */}
            <motion.div
                style={{ y }}
                className="absolute left-0 w-full z-0 h-[160%] -top-[30%]"
            >
                <ImageWithFallback
                    src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&q=80&w=2000" // Vegetables/Fruits overhead shot
                    alt="Fresh Produce Background"
                    className="w-full h-full object-cover block"
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
            </motion.div>

            <div className="relative z-10 max-w-4xl w-full px-6 text-white">

                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-start"
                >
                    <p className="text-xl font-bold mb-2 font-['Outfit'] tracking-wide">
                        Subscribe & Save
                    </p>

                    <div className="flex items-start mb-2">
                        <h2 className="text-8xl md:text-9xl font-bold font-['Outfit'] tracking-tighter leading-none">
                            20%
                        </h2>
                        <span className="text-3xl font-bold pt-4 pl-2 font-['Outfit']">off</span>
                    </div>

                    <h3 className="text-3xl font-bold font-['Outfit'] mb-8">
                        Your Next Order
                    </h3>
                </motion.div>

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    onSubmit={handleSubscribe}
                    className="w-full flex flex-col items-start"
                >
                    <label htmlFor="email" className="text-sm font-medium mb-2 pl-1">Email *</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/80 border border-white/30 text-white px-6 py-4 rounded-full text-lg placeholder-gray-400 focus:outline-none focus:border-white mb-6 backdrop-blur-sm transition-colors"
                        placeholder=""
                    />

                    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3 pl-1">
                            <input
                                type="checkbox"
                                id="newsletter"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 text-[#ED1C24] focus:ring-[#ED1C24] cursor-pointer bg-transparent"
                            />
                            <label htmlFor="newsletter" className="text-sm cursor-pointer select-none">
                                Yes, subscribe me to your newsletter. *
                            </label>
                        </div>

                        <Button
                            type="submit"
                            className="bg-[#ED1C24] hover:bg-red-700 text-white px-12 py-6 rounded-full font-bold text-lg shadow-lg font-['Outfit'] whitespace-nowrap"
                        >
                            Subscribe
                        </Button>
                    </div>

                </motion.form>

            </div>
        </section>
    );
}
