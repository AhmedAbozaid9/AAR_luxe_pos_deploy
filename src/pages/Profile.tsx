import { motion } from "framer-motion";
import {
  Building,
  Calendar,
  DollarSign,
  LogOut,
  Mail,
  User,
} from "lucide-react";
import { useUserStore } from "../stores/userStore";

const Profile = () => {
  const { user, logout } = useUserStore();

  const handleLogout = () => {
    logout();
  };

  // Generate a random avatar color based on user's name
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-gradient-to-br from-blue-400 to-blue-600",
      "bg-gradient-to-br from-green-400 to-green-600",
      "bg-gradient-to-br from-purple-400 to-purple-600",
      "bg-gradient-to-br from-pink-400 to-pink-600",
      "bg-gradient-to-br from-indigo-400 to-indigo-600",
      "bg-gradient-to-br from-yellow-400 to-yellow-600",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-xl border border-green-100 overflow-hidden"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/5"></div>
            <div className="relative z-10 flex items-center space-x-6">
              {/* Avatar */}{" "}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className={`w-24 h-24 ${getAvatarColor(
                  user?.name.en ?? "User"
                )} rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-2xl`}
              >
                {getInitials(user?.name.en ?? "User")}
              </motion.div>
              {/* User Info */}
              <div>
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold mb-2"
                >
                  {user?.name.en}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-green-100 text-lg"
                >
                  Employee Profile
                </motion.p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="mr-2 text-green-600" size={20} />
                  Personal Information
                </h2>

                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Mail className="text-green-600 mr-3" size={18} />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-800">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Building className="text-green-600 mr-3" size={18} />
                    <div>
                      <p className="text-sm text-gray-600">Business ID</p>
                      <p className="font-medium text-gray-800">
                        {user?.business_id}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <DollarSign className="text-green-600 mr-3" size={18} />
                    <div>
                      <p className="text-sm text-gray-600">Salary</p>
                      <p className="font-medium text-gray-800">
                        {user?.salary} AED
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Work Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Calendar className="mr-2 text-green-600" size={20} />
                  Work Information
                </h2>

                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="text-green-600 mr-3" size={18} />
                    <div>
                      <p className="text-sm text-gray-600">Hire Date</p>
                      <p className="font-medium text-gray-800">
                        {user?.hire_date
                          ? new Date(user.hire_date).toLocaleDateString()
                          : "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="text-green-600 mr-3" size={18} />
                    <div>
                      <p className="text-sm text-gray-600">Account Created</p>{" "}
                      <p className="font-medium text-gray-800">
                        {new Date(user?.created_at ?? "").toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="text-green-600 mr-3" size={18} />
                    <div>
                      <p className="text-sm text-gray-600">Last Updated</p>{" "}
                      <p className="font-medium text-gray-800">
                        {new Date(user?.updated_at ?? "").toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Logout Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-8 pt-6 border-t border-gray-200 flex justify-center"
            >
              <motion.button
                onClick={handleLogout}
                className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
