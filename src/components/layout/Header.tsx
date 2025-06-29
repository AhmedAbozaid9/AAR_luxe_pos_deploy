import { motion, useAnimationControls } from "framer-motion";
import { User } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router";
import { useUserStore } from "../../stores/userStore";

const Header = () => {
  const location = useLocation();
  const controls = useAnimationControls();
  const { user } = useUserStore();
  const navItems = [
    { path: "/services", name: "Services" },
    { path: "/packages", name: "Packages" },
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
      className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-3"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {" "}
      <div className="flex items-center justify-between w-full mx-auto">
        <motion.nav className="flex items-center space-x-1" animate={controls}>
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;

            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                }}
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
              >
                <Link
                  to={item.path}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "text-gray-900 bg-gray-100"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-1/2 w-1 h-1 bg-gray-900 rounded-full"
                      layoutId="activeIndicator"
                      initial={{ scale: 0, x: "-50%" }}
                      animate={{ scale: 1, x: "-50%" }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}{" "}
        </motion.nav>

        {/* Right side - Avatar and Dashboard */}
        <div className="flex items-center space-x-3">
          {/* User Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex items-center"
          >
            <Link to="/profile" className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group flex items-center justify-center"
              >
                <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm font-medium shadow-sm border border-gray-200 group-hover:border-gray-300 transition-all duration-200">
                  {user?.name?.en ? (
                    <span>
                      {user.name.en
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  ) : (
                    <User size={16} />
                  )}
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {/* Dashboard button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex items-center"
          >
            <Link
              to="https://beta.aarluxe.ae/admin/login"
              target="_blank"
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-sm flex items-center justify-center"
            >
              Dashboard
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
