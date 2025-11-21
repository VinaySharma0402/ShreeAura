import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,

  
  Linkedin,

} from "lucide-react";
import { motion } from "motion/react";


export default function Footer() {
  return (
    <footer className="relative overflow-hidden text-[#FFD369] bg-gradient-to-b from-[#300020] via-[#4B1C3F] to-[#300020]">
      {/* Soft Glow Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#FFD369]/20 blur-[150px] rounded-full opacity-30" />
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-14">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
        >
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white tracking-wide">
              Shree Aura
            </h3>
            <p className="text-sm text-[#FFD369]/80 leading-relaxed">
              Your destination for premium beauty and cosmetics. Discover luxury
              products that enhance your natural glow and confidence.
            </p>
            <div className="flex space-x-5 pt-3">
  {[
    { Icon: Instagram, url: "https://www.instagram.com/shreeaura.fashion" },
    { Icon: Facebook, url: "https://www.facebook.com/profile.php?id=61583263783646" },
    
    { Icon: Linkedin, url: "https://www.linkedin.com/jobs" },
  ].map(({ Icon, url }, i) => (
    <a
      key={i}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <motion.div
        whileHover={{ scale: 1.2, rotate: 5 }}
        className="bg-white/10 p-2 rounded-full hover:bg-[#FFD369]/30 transition-colors cursor-pointer"
      >
        <Icon className="w-5 h-5 text-[#FFD369]" />
      </motion.div>
    </a>
  ))}
</div>

          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-lg relative after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:w-10 after:h-[2px] after:bg-[#FFD369]">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
  {["combo", "rings", "Makeup+Essentials"].map((link, i) => (
    <motion.li
      key={i}
      whileHover={{ x: 6 }}
      className="transition-all duration-300"
    >
      <a
        href={`/search?category=${encodeURIComponent(link)}`}
        className="hover:text-white text-[#FFD369]/80 transition-colors"
      >
        {link}
      </a>
    </motion.li>
  ))}
</ul>

          </div>

          {/* Customer Care */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-lg relative after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:w-10 after:h-[2px] after:bg-[#FFD369]">
              Customer Care
            </h4>
            <ul className="space-y-2 text-sm">
  <motion.li whileHover={{ x: 6 }} className="transition-all duration-300">
    <a
      href="/contact.html"
      className="hover:text-white text-[#FFD369]/80 transition-colors"
    >
      Contact Us
    </a>
  </motion.li>

  <motion.li whileHover={{ x: 6 }} className="transition-all duration-300">
    <a
      href="/shipping.html"
      className="hover:text-white text-[#FFD369]/80 transition-colors"
    >
      Shipping Info
    </a>
  </motion.li>

  <motion.li whileHover={{ x: 6 }} className="transition-all duration-300">
    <a
      href="/refund.html"
      className="hover:text-white text-[#FFD369]/80 transition-colors"
    >
      Returns & Exchanges
    </a>
  </motion.li>

 
</ul>

          </div>

          
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-[#FFD369]/20 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm"
        >
          <div className="flex items-center space-x-2 justify-center md:justify-start">
            <Phone className="w-4 h-4 text-[#FFD369]" />
            <span>+91 85440 90329</span>
          </div>
          <div className="flex items-center space-x-2 justify-center md:justify-start">
            <Mail className="w-4 h-4 text-[#FFD369]" />
            <span>support@shreeaura.in</span>
          </div>
          <div className="flex items-center space-x-2 justify-center md:justify-start">
            <MapPin className="w-4 h-4 text-[#FFD369]" />
            <span>Maurya Lok Complex, Dak Bangla Chauraha</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="bg-[#2D0D28] border-t border-[#FFD369]/20"
      >
        <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between text-sm text-[#FFD369]/80 space-y-3 md:space-y-0">
          <div>© 2025 Shreeaura.in. All rights reserved.</div>
          <div className="flex space-x-5">
            <a
              href="team"
              className="hover:text-white transition-colors duration-300"
            >
              Team
            </a>
            <a
              href="/privacy.html"
              className="hover:text-white transition-colors duration-300"
            >
              Privacy Policy
            </a>
            <a
              href="/terms.html"
              className="hover:text-white transition-colors duration-300"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
