import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getServices, type Service } from "../api/getServices";
import { useCustomerStore } from "../stores/customerStore";

const Services = () => {
  const { selectedCustomer, selectedCar } = useCustomerStore();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await getServices();
        setServices(response.data);
      } catch (err) {
        setError("Failed to load services");
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []); // Function to get the minimum price for a service
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 text-lg">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!loading && services.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔧</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">
          No Services Available
        </h2>
        <p className="text-gray-500">
          We're currently updating our services. Please check back later.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Services
      </motion.h1>

      {/* Customer Information */}
      {selectedCustomer && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl border border-green-200"
        >
          <h2 className="text-lg font-semibold text-green-800 mb-3">
            Service for: {selectedCustomer.name}
          </h2>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="text-green-700">📧 {selectedCustomer.email}</span>
            <span className="text-green-700">
              📱 {selectedCustomer.phone_national}
            </span>
            {selectedCar && (
              <span className="text-green-700">
                🚗 {selectedCar.year} {selectedCar.color_name} -{" "}
                {selectedCar.code} {selectedCar.numbers}
              </span>
            )}
          </div>
        </motion.div>
      )}

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            variants={cardVariants}
            whileHover={{
              y: -8,
              scale: 1.02,
              transition: { duration: 0.3 },
            }}
            whileTap={{ scale: 0.98 }}
            className="group bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-green-200 transition-all duration-300 cursor-pointer flex flex-col h-full"
          >
            {/* Header with icon and price */}
            <div className="flex items-center justify-between mb-6">
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
                      {service.included.slice(0, 3).map((item, idx) => (
                        <li
                          key={idx}
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
                  {service.duration && (
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
