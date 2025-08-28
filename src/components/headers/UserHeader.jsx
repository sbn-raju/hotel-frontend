import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";
import useAuth from "../../hooks/AuthHooks";

const LuxuryHeroHeaderUser = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { authState } = useAuth();

  const isRoomDetailsPage = location.pathname.startsWith("/rooms");
  const showHeader = !isRoomDetailsPage || isLoggedIn;

  const { scrollY } = useScroll();
  const backgroundOpacity = useTransform(scrollY, [0, 300], [0, 1]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMenuOpen]);

  if (!showHeader) return null;

  return (
    <motion.header
      style={{ backgroundColor: backgroundOpacity }}
      className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md shadow-md "
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.button
          className="text-2xl font-extrabold text-gray-900 tracking-tight hover:cursor-pointer"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onClick={()=> navigate("/")}
        >
          Mannars Lodge
        </motion.button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-10 items-center">
          
          {/* Conditional CTA or Avatar */}
          {authState?.user ? (
            <div className="flex items-center space-x-4">
              <motion.div
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500 cursor-pointer"
                onClick={() => navigate("/user/dashboard/past-trips")}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                {authState?.profile ? 
                <img
                  src={authState?.profile}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />: 
                <>
                {authState.name}
                </>} 
                
              </motion.div>
            </div>
          ) : (
            // <motion.button
            //   onClick={() => scrollToSection("contact")}
            //   className="relative px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium shadow-lg overflow-hidden"
            //   whileHover={{
            //     scale: 1.05,
            //     boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)",
            //   }}
            //   whileTap={{ scale: 0.95 }}
            //   transition={{ duration: 0.2 }}
            // >
            //   {/* <span className="relative z-10">Book Now</span> */}
            //   <motion.div
            //     className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500"
            //     initial={{ x: "100%" }}
            //     whileHover={{ x: 0 }}
            //     transition={{ duration: 0.3 }}
            //   />
            // </motion.button>
            null
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-800" />
            ) : (
              <Menu className="w-6 h-6 text-gray-800" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <motion.div
          className="md:hidden fixed inset-0 bg-white z-40 flex flex-col items-center justify-center space-y-6 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {[
            { id: "home", label: "Home" },
            { id: "properties", label: "Properties" },
            { id: "gallery", label: "Gallery" },
            { id: "testimonials", label: "Testimonials" },
            { id: "faq", label: "FAQ" },
          ].map((item, index) => (
            <motion.button
              key={item.id}
              onClick={() => {
                scrollToSection(item.id);
                setIsMenuOpen(false);
              }}
              className="text-xl text-gray-900 font-semibold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              {item.label}
            </motion.button>
          ))}

          <motion.button
            onClick={() => {
              if (isLoggedIn) {
                logout();
              } else {
                scrollToSection("contact");
              }
              setIsMenuOpen(false);
            }}
            className="w-full mt-6 px-4 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoggedIn ? "Logout" : "Book Now"}
          </motion.button>
        </motion.div>
      )}
    </motion.header>
  );
};

export default LuxuryHeroHeaderUser;
