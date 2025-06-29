import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { getServices, type Service } from "../api/getServices";
import ServiceHeader from "../components/general/ServiceHeader";

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchServices(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const fetchServices = async (query?: string) => {
    try {
      setLoading(true);
      const response = await getServices(query);
      setServices(response.data);
    } catch (err) {
      setError("Failed to load services");
      console.error("Error fetching services:", err);
    } finally {
      setLoading(false);
    }
  }; // Function to get the minimum price for a service
  const getMinPrice = (service: Service) => {
    if (service.prices_min_price) {
      return `AED ${service.prices_min_price.toLocaleString()}`;
    }

    // Fallback: check service options for minimum price
    if (service.options && service.options.length > 0) {
      const allPrices = service.options.flatMap(
        (option) => option.prices?.map((price) => price.price) || []
      );
      if (allPrices.length > 0) {
        const minPrice = Math.min(...allPrices);
        return `From AED ${minPrice.toLocaleString()}`;
      }
    }
    return "Contact for pricing";
  };
  if (loading) {
    return (
      <div className="h-full">
        <ServiceHeader title="Services" />
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
            <p className="text-gray-600 text-center">Loading services...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full">
        <ServiceHeader title="Services" />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-2">⚠️</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => fetchServices()}
              className="px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (!loading && services.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <ServiceHeader title="Services" />

        {/* Search Bar */}
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
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 text-lg bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-300 placeholder-gray-400"
            />
          </motion.div>
        </div>

        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔧</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No services found
          </h3>
          <p className="text-gray-500">
            {searchQuery
              ? "Try adjusting your search criteria"
              : "No services are currently available"}
          </p>
        </div>
      </motion.div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <ServiceHeader title="Services" />
      {/* Search Bar */}
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
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 text-lg bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-300 placeholder-gray-400"
          />
        </motion.div>
      </div>{" "}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, staggerChildren: 0.1 }}
      >
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: "easeOut",
            }}
            whileHover={{
              y: -8,
              transition: { duration: 0.2 },
            }}
            className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 h-[500px] flex flex-col"
          >
            {/* Header with icon and price */}
            <div className="flex items-center justify-between mb-6 p-6 pb-0">
              <motion.div
                className="flex items-center justify-center w-12 h-12"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ duration: 0.3 }}
              >
                {service.icon?.url ? (
                  <img
                    src={service.icon.url}
                    alt={service.name.en}
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white text-lg font-bold">
                    {service.name.en.charAt(0)}
                  </div>
                )}
              </motion.div>
              <motion.div
                className="text-right"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
              >
                <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                  {getMinPrice(service)}
                </div>
                {service.orders_count > 0 && (
                  <div className="text-xs text-gray-500">
                    {service.orders_count} orders
                  </div>
                )}
              </motion.div>
            </div>

            {/* Service title */}
            <h3 className="text-xl font-bold mb-4 text-gray-800 group-hover:text-green-600 transition-colors duration-300">
              {service.name.en}
            </h3>

            {/* Content area - will grow to fill space */}
            <div className="flex-grow mb-6">
              {/* What's included section - fixed height area */}
              <div className="min-h-[120px]">
                {service.included && service.included.length > 0 ? (
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-700 text-sm">
                      What's included:
                    </p>
                    <ul className="space-y-1">
                      {" "}
                      {service.included.slice(0, 3).map((item) => (
                        <li
                          key={`${service.id}-${item.en}`}
                          className="text-sm text-gray-600 flex items-start"
                        >
                          <span className="text-green-600 mr-2 flex-shrink-0">
                            ✓
                          </span>
                          <span>{item.en}</span>
                        </li>
                      ))}
                      {service.included.length > 3 && (
                        <li className="text-sm text-gray-500 italic ml-4">
                          +{service.included.length - 3} more services...
                        </li>
                      )}
                    </ul>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400 text-sm italic">
                      Contact us for service details
                    </p>
                  </div>
                )}
              </div>

              {/* Service metadata */}
              <div className="flex items-center justify-between mt-4 text-sm text-gray-500 border-t pt-4">
                <div className="flex items-center space-x-4">
                  {Boolean(service.duration) && (
                    <span className="flex items-center">
                      <span className="mr-1">⏱️</span>
                      {service.duration} day{service.duration > 1 ? "s" : ""}
                    </span>
                  )}
                  {service.reviews_avg_rating && (
                    <span className="flex items-center">
                      <span className="mr-1">⭐</span>
                      {service.reviews_avg_rating.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Button - always at bottom */}
            <motion.button
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:from-green-700 hover:to-green-800 mt-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Book Now
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Services;
