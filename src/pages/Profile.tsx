import { Building, LogOut, Mail, User } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserProfile, type UserProfileData } from "../api/getUserProfile";
import { useUserStore } from "../stores/userStore";

const Profile = () => {
  const { logout } = useUserStore();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const data = await getUserProfile();
        setProfileData(data);
      } catch (err) {
        setError("Failed to load profile data");
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    logout();
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-green-100 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/5"></div>
            <div className="relative z-10 flex items-center space-x-6">
              {/* Avatar */}
              <div
                className={`w-24 h-24 ${getAvatarColor(
                  profileData?.name.en ?? "User"
                )} rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-2xl`}
              >
                {getInitials(profileData?.name.en ?? "User")}
              </div>

              {/* User Info */}
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {profileData?.name.en}
                </h1>
                <p className="text-green-100 text-lg">Employee Profile</p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="mr-2 text-green-600" size={20} />
                  Personal Information
                </h2>

                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Mail className="text-green-600 mr-3" size={18} />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-800">
                        {profileData?.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <User className="text-green-600 mr-3" size={18} />
                    <div>
                      <p className="text-sm text-gray-600">User ID</p>
                      <p className="font-medium text-gray-800">
                        {profileData?.id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Building className="mr-2 text-green-600" size={20} />
                  Work Information
                </h2>

                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Building className="text-green-600 mr-3" size={18} />
                    <div>
                      <p className="text-sm text-gray-600">Business ID</p>
                      <p className="font-medium text-gray-800">
                        {profileData?.business_id}
                      </p>
                    </div>
                  </div>

                  {profileData?.branch_id && (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Building className="text-green-600 mr-3" size={18} />
                      <div>
                        <p className="text-sm text-gray-600">Branch ID</p>
                        <p className="font-medium text-gray-800">
                          {profileData.branch_id}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-center">
              <button
                onClick={handleLogout}
                className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 flex items-center space-x-2 hover:from-red-600 hover:to-red-700"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
