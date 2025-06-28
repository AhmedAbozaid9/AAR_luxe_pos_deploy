import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";
import { Link, useLocation } from "react-router";

const Header = () => {
  const location = useLocation();
  const controls = useAnimationControls();

  const navItems = [
    { path: "/", name: "Services" },
    { path: "/products", name: "Products" },
  ];

  useEffect(() => {
    controls.start({
      scale: [1, 1.02, 1],
      transition: { duration: 0.3 },
    });
  }, [location.pathname, controls]);

  return (
    <motion.header
      className="bg-gradient-to-r from-green-50 via-white to-green-50 backdrop-blur-sm border-b border-green-200/30 px-8 py-4 shadow-sm"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="flex items-center justify-start">
        <motion.nav className="flex items-center space-x-2" animate={controls}>
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;

            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -30, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.15,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.path}
                  className={`relative px-8 py-4 text-sm font-bold rounded-2xl transition-all duration-500 ease-out block ${
                    isActive
                      ? "text-white bg-gradient-to-r from-green-500 to-green-600 shadow-2xl shadow-green-500/40 border border-green-400"
                      : "text-gray-700 hover:text-green-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:shadow-lg border border-transparent hover:border-green-200"
                  }`}
                >
                  <motion.span
                    className="relative z-20 block"
                    initial={{ y: 0 }}
                    whileHover={{
                      y: isActive ? 0 : -1,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ y: 1 }}
                  >
                    {item.name}
                  </motion.span>

                  {/* Active indicator with better animation */}
                  {isActive && (
                    <>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl"
                        layoutId="activeTab"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                          duration: 0.6,
                        }}
                      />
                      {/* Glow effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 rounded-2xl blur-sm"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.1, opacity: 0.6 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                          delay: 0.1,
                        }}
                      />
                    </>
                  )}

                  {/* Hover effect with ripple */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl opacity-0"
                    whileHover={{
                      opacity: isActive ? 0 : 1,
                      scale: isActive ? 1 : [1, 1.05, 1],
                      transition: { duration: 0.3 },
                    }}
                  />

                  {/* Subtle shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl opacity-0"
                    animate={{
                      x: isActive ? ["-100%", "100%"] : 0,
                      opacity: isActive ? [0, 1, 0] : 0,
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: "easeInOut",
                    }}
                  />
                </Link>
              </motion.div>
            );
          })}
        </motion.nav>
      </div>
    </motion.header>
  );
};

export default Header;
