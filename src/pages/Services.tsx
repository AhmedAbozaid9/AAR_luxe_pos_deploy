import { motion } from "framer-motion";
import { Clock, Search, Star } from "lucide-react";
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
            <div className="text-red-500 text-xl mb-2 text-center">⚠️</div>
            <p className="text-gray-600 mb-4 text-center">{error}</p>
            <button
              onClick={() => fetchServices()}
              className="px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium mx-auto block"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
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

      {services.length === 0 && !loading ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 text-center">🔧</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2 text-center">
            No services found
          </h3>
          <p className="text-gray-500 text-center">
            {searchQuery
              ? "Try adjusting your search criteria"
              : "No services are currently available"}
          </p>
        </div>
      ) : (
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
              className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 group"
            >
              {/* Service Icon */}
              <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex items-center justify-center">
                {service.icon?.url ? (
                  <img
                    src={service.icon.url}
                    alt={service.name.en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-2xl font-bold group-hover:scale-105 transition-transform duration-700">
                    {service.name.en.charAt(0)}
                  </div>
                )}
              </div>

              {/* Service Info */}
              <div className="p-6 flex flex-col h-80">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                  {service.name.en}
                </h3>
                {service.name.ar && (
                  <p
                    className="text-sm text-gray-500 mb-3 line-clamp-1"
                    dir="rtl"
                  >
                    {service.name.ar}
                  </p>
                )}{" "}
                {/* What's included */}
                {service.included && service.included.length > 0 ? (
                  <div className="mb-4 flex-grow">
                    <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                      What's included:
                    </p>
                    <ul className="space-y-1">
                      {service.included.slice(0, 2).map((item) => (
                        <li
                          key={`${service.id}-${item.en}`}
                          className="text-sm text-gray-600 flex items-start"
                        >
                          <span className="text-green-600 mr-2 flex-shrink-0">
                            ✓
                          </span>
                          <span className="line-clamp-1">{item.en}</span>
                        </li>
                      ))}
                      {service.included.length > 2 && (
                        <li className="text-xs text-gray-500 italic ml-4">
                          +{service.included.length - 2} more services...
                        </li>
                      )}
                    </ul>
                  </div>
                ) : (
                  <div className="mb-4 flex-grow">
                    <p className="text-sm text-gray-400 italic">
                      Contact us for service details
                    </p>
                  </div>
                )}
                {/* Service Stats */}
                {(Boolean(service.reviews_avg_rating) ||
                  Boolean(service.duration) ||
                  service.orders_count > 0) && (
                  <div className="flex items-center space-x-4 mb-6 text-sm text-gray-600">
                    {service.reviews_avg_rating && (
                      <div className="flex items-center space-x-1">
                        <Star
                          size={14}
                          className="text-yellow-500 fill-current"
                        />
                        <span className="font-medium">
                          {service.reviews_avg_rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                    {Boolean(service.duration) && (
                      <div className="flex items-center space-x-1">
                        <Clock size={14} className="text-gray-400" />
                        <span className="font-medium">
                          {service.duration} day
                          {service.duration > 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                    {service.orders_count > 0 && (
                      <div className="text-green-600 font-medium">
                        {service.orders_count} orders
                      </div>
                    )}
                  </div>
                )}
                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl transition-colors duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
                >
                  Show Options
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Services;
