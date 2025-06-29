import { motion } from "framer-motion";
import { Outlet, useLocation } from "react-router";
import Sidebar from "../general/Sidebar";
import Header from "./Header";

const Layout = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {" "}
      {/* Sidebar */}
      <motion.div
        className="w-90 bg-gradient-to-b from-slate-900 via-gray-900 to-black text-white shadow-2xl border-r border-green-500/20"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Sidebar />
      </motion.div>
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {" "}
        {/* Header */}
        <Header />
        {/* Main content */}
        <motion.main
          className="flex-1 p-8 bg-gradient-to-br from-gray-50 to-white overflow-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
};

export default Layout;
