import { User } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useUserStore } from "../../stores/userStore";

const Header = () => {
  const location = useLocation();
  const { user } = useUserStore();
  const navItems = [
    { path: "/services", name: "Services" },
    { path: "/packages", name: "Packages" },
    { path: "/products", name: "Products" },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-lg border-b border-gray-200/50 px-8 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between w-full">
        <nav className="flex items-center space-x-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <div key={item.path} className="relative">
                <Link
                  to={item.path}
                  className={`relative px-6 py-3 text-base font-semibold rounded-xl transition-all duration-300 ease-out block ${
                    isActive
                      ? "text-white bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:shadow-md border border-transparent hover:border-gray-200/50"
                  }`}
                >
                  {item.name}
                </Link>
              </div>
            );
          })}
        </nav>{" "}
        {/* Right side - Avatar and Dashboard */}
        <div className="flex items-center space-x-4">
          {/* User Avatar */}
          <div className="flex items-center">
            <Link to="/profile" className="flex items-center">
              <div className="relative group flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm font-semibold shadow-lg border-2 border-gray-200 group-hover:border-gray-300 group-hover:shadow-xl transition-all duration-300">
                  {user?.name?.en ? (
                    <span>
                      {user.name.en
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  ) : (
                    <User size={18} />
                  )}
                </div>
              </div>
            </Link>
          </div>

          {/* Dashboard button */}
          <div className="flex items-center">
            <Link
              to="https://cp.aarluxe.ae/admin/login"
              target="_blank"
              className="px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
