import { motion } from "framer-motion";
import { ArrowLeft, Clock, Search, ShoppingCart, Star } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getServices,
  type Service,
  type ServiceOption,
} from "../api/getServices";
import ServiceHeader from "../components/general/ServiceHeader";
import { getMinPrice, getPriceForCarGroup } from "../lib/utils";
import { useCartStore } from "../stores/cartStore";
import { useCustomerStore } from "../stores/customerStore";
import { useToastStore } from "../stores/toastStore";

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set()); // Get selected car from customer store for dynamic pricing
  const { selectedCar } = useCustomerStore();
  const { addItem } = useCartStore();
  const { addToast } = useToastStore();

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
  const toggleCardFlip = (serviceId: number) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId);
      } else {
        newSet.add(serviceId);
      }
      return newSet;
    });
  };
  // Get dynamic price for service option based on selected car
  const getOptionPrice = (option: ServiceOption): number | null => {
    if (!option.prices || option.prices.length === 0) {
      return null;
    }

    // If a car is selected, get price for that car group
    if (selectedCar?.car_group_id) {
      return getPriceForCarGroup(option.prices, selectedCar.car_group_id);
    }

    // Otherwise, show minimum price as fallback
    return getMinPrice(option.prices);
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
  const addToCart = (option: ServiceOption, service: Service) => {
    if (!selectedCar) {
      addToast({
        message: "Please select a vehicle before adding services to cart",
        type: "error",
      });
      return;
    }

    const dynamicPrice = getOptionPrice(option);

    if (dynamicPrice === null) {
      // Handle case where price is not available
      console.warn("Price not available for option:", option.name.en);
      addToast({
        message: "Price not available for this service option",
        type: "error",
      });
      return;
    }

    // Find the parent service to include in cart item
    const optionPrices =
      option.prices?.map((p) => ({
        id: p.id,
        name: `${service.name.en} - ${option.name.en}`,
        price: p.price,
      })) ?? [];

    addItem({
      purchasable_id: service.id,
      purchasable_type: "service",
      quantity: 1,
      option_ids: [option.id],
      name: service.name.en,
      price: dynamicPrice,
      image: service.icon?.url,
      options: optionPrices.filter((p) =>
        selectedCar?.car_group_id
          ? p.id === selectedCar.car_group_id
          : p.price === dynamicPrice
      ),
    });

    addToast({
      message: `${option.name.en} added to cart!`,
      type: "success",
    });
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
      <ServiceHeader title="Services" /> {/* Search Bar */}
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
          {services.map((service, index) => {
            const isFlipped = flippedCards.has(service.id);

            return (
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
                className="relative h-[510px] perspective-1000"
              >
                {/* Card Container with Flip Animation */}
                <motion.div
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className=" relative w-full h-full transform-style-preserve-3d"
                >
                  {/* Front Side - Service Info */}
                  <div className="absolute w-full h-full backface-hidden bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 group">
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
                    </div>{" "}
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
                      )}

                      {/* What's included */}
                      <div className="flex-grow">
                        {service.included && service.included.length > 0 ? (
                          <div className="mb-4">
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
                                  <span className="line-clamp-1">
                                    {item.en}
                                  </span>
                                </li>
                              ))}
                              {service.included.length > 2 && (
                                <li className="text-xs text-gray-500 italic ml-4">
                                  +{service.included.length - 2} more
                                  services...
                                </li>
                              )}
                            </ul>
                          </div>
                        ) : (
                          <div className="mb-4">
                            <p className="text-sm text-gray-400 italic">
                              Contact us for service details
                            </p>
                          </div>
                        )}
                      </div>

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
                        onClick={() => toggleCardFlip(service.id)}
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl transition-colors duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
                      >
                        Show Options ({service.options?.length || 0})
                      </motion.button>
                    </div>
                  </div>

                  {/* Back Side - Service Options */}
                  <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100">
                    <div className="p-6 h-full flex flex-col">
                      {/* Header with back button */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                          {service.name.en} Options
                        </h3>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleCardFlip(service.id)}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <ArrowLeft size={20} />
                        </motion.button>
                      </div>

                      {/* Options List */}
                      <div className="flex-grow overflow-y-auto space-y-3">
                        {service.options && service.options.length > 0 ? (
                          service.options.map((option) => (
                            <div
                              key={option.id}
                              className="bg-gray-50 rounded-xl p-4 border hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-grow">
                                  <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">
                                    {option.name.en}
                                  </h4>
                                  {option.name.ar && (
                                    <p
                                      className="text-xs text-gray-500 line-clamp-1 mt-1"
                                      dir="rtl"
                                    >
                                      {option.name.ar}
                                    </p>
                                  )}
                                </div>
                                {option.is_exclusive === 1 && (
                                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                                    Exclusive
                                  </span>
                                )}
                              </div>{" "}
                              {/* Price Display */}
                              {(() => {
                                const dynamicPrice = getOptionPrice(option);
                                return (
                                  <div className="mb-3">
                                    <p className="text-green-600 font-bold text-sm">
                                      {dynamicPrice !== null
                                        ? `$${dynamicPrice.toLocaleString()}`
                                        : "Price on request"}
                                      {selectedCar && dynamicPrice !== null && (
                                        <span className="text-xs text-gray-500 block">
                                          For your{" "}
                                          {getCarSizeName(
                                            selectedCar.car_group_id
                                          )}{" "}
                                          car
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                );
                              })()}{" "}
                              {/* Add to Cart Button */}{" "}
                              <motion.button
                                whileHover={{ scale: selectedCar ? 1.02 : 1 }}
                                whileTap={{ scale: selectedCar ? 0.98 : 1 }}
                                onClick={() => addToCart(option, service)}
                                disabled={!selectedCar}
                                className={`w-full py-2 px-4 rounded-lg text-xs font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 ${
                                  selectedCar
                                    ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                              >
                                <ShoppingCart size={14} />
                                <span>
                                  {selectedCar
                                    ? "Add to Cart"
                                    : "Select Vehicle First"}
                                </span>
                              </motion.button>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-500 text-sm">
                              No options available for this service
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default Services;
