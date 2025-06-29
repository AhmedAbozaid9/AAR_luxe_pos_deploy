import { motion } from "framer-motion";
import { Clock, Search, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { getPackages, type Package } from "../api/getPackages";
import ServiceHeader from "../components/general/ServiceHeader";
import { getMinPrice, getPriceForCarGroup } from "../lib/utils";
import { useCustomerStore } from "../stores/customerStore";

const Packages = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Get selected car from customer store for dynamic pricing
  const { selectedCar } = useCustomerStore();

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPackages(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const fetchPackages = async (query?: string) => {
    try {
      setLoading(true);
      const response = await getPackages(query);
      setPackages(response.data);
    } catch (err) {
      setError("Failed to load packages");
      console.error("Error fetching packages:", err);
    } finally {
      setLoading(false);
    }
  };
  const getDynamicPrice = (
    pkg: Package
  ): { price: number | null; showCarInfo: boolean } => {
    if (!pkg.prices || pkg.prices.length === 0) {
      return { price: null, showCarInfo: false };
    }

    // If a car is selected, get price for that car group
    if (selectedCar?.car_group_id) {
      const dynamicPrice = getPriceForCarGroup(
        pkg.prices,
        selectedCar.car_group_id
      );
      return { price: dynamicPrice, showCarInfo: true };
    }

    // Otherwise, show minimum price as fallback
    const minPrice = getMinPrice(pkg.prices);
    return { price: minPrice, showCarInfo: false };
  };

  // Get car size name based on car group ID
  const getCarSizeName = (carGroupId: number): string => {
    switch (carGroupId) {
      case 1:
        return "Small";
      case 2:
        return "Medium";
      case 3:
        return "Large";
      default:
        return "selected";
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <ServiceHeader title="Packages" /> {/* Search Bar */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative max-w-2xl mx-auto"
        >
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search packages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 text-lg bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-300 placeholder-gray-400"
          />
        </motion.div>

        {/* Pricing info banner */}
        {!selectedCar && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-center"
          >
            <p className="text-sm text-blue-700">
              💡 Select a customer and vehicle to see personalized pricing for
              your car size
            </p>
          </motion.div>
        )}
      </div>{" "}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
            <p className="text-gray-600 text-center">Loading packages...</p>
          </div>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
        >
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden border border-gray-100 flex flex-col h-full"
            >
              {/* Package Image */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex-shrink-0">
                {pkg.image?.url ? (
                  <img
                    src={pkg.image.url}
                    alt={pkg.name.en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📦</div>
                      <p className="text-sm">No Image</p>
                    </div>
                  </div>
                )}

                {/* Active Badge */}
                {pkg.is_active === 1 && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Active
                  </div>
                )}
              </div>

              {/* Package Info */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {pkg.name.en}
                </h3>
                {pkg.name.ar && (
                  <p className="text-sm text-gray-600 mb-4" dir="rtl">
                    {pkg.name.ar}
                  </p>
                )}
                {/* Package Stats */}
                <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock size={16} />
                    <span>{pkg.duration} days</span>
                  </div>
                  {pkg.reviews_avg_rating && (
                    <div className="flex items-center space-x-1">
                      <Star size={16} className="text-yellow-500" />
                      <span>{pkg.reviews_avg_rating.toFixed(1)}</span>
                    </div>
                  )}{" "}
                  <div className="text-green-600">
                    {pkg.orders_count ?? 0} orders
                  </div>
                </div>{" "}
                {/* Included Services */}
                {pkg.included && pkg.included.length > 0 && (
                  <div className="mb-4 flex-grow">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Included Services:
                    </h4>
                    <div className="space-y-1">
                      {pkg.included.slice(0, 3).map((item) => (
                        <div
                          key={`${pkg.id}-${item.en}`}
                          className="text-sm text-gray-600 flex items-start"
                        >
                          <span className="text-green-500 mr-2">•</span>
                          <span>{item.en}</span>
                        </div>
                      ))}
                      {pkg.included.length > 3 && (
                        <div className="text-sm text-gray-500 italic">
                          +{pkg.included.length - 3} more services
                        </div>
                      )}
                    </div>
                  </div>
                )}{" "}
                {/* Price and Action */}
                <div className="flex items-center justify-between mt-auto pt-4">
                  <div className="text-2xl font-bold text-green-600">
                    {(() => {
                      const { price, showCarInfo } = getDynamicPrice(pkg);
                      if (price === null) {
                        return "Price on request";
                      }
                      return (
                        <div>
                          <span>
                            {price.toLocaleString()}
                            <sub className="text-sm font-normal ml-1">AED</sub>
                          </span>
                          {showCarInfo && selectedCar && (
                            <div className="text-xs text-gray-500 font-normal mt-1">
                              For your{" "}
                              {getCarSizeName(selectedCar.car_group_id)} car
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
                  >
                    Select Package
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
      {packages.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No packages found
          </h3>
          <p className="text-gray-500">
            {searchQuery
              ? "Try adjusting your search criteria"
              : "No packages are currently available"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Packages;
