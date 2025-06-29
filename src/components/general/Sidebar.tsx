import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getCustomers, type Car, type Customer } from "../../api/getCustomers";
import { submitCart } from "../../api/submitCart";
import { useCartStore, type CartItem } from "../../stores/cartStore";
import { useCustomerStore } from "../../stores/customerStore";
import { useToastStore } from "../../stores/toastStore";
import { useUserStore } from "../../stores/userStore";
import { AddCustomerDialog } from "./AddCustomerDialog";
import { AddVehicleDialog } from "./AddVehicleDialog";

const Sidebar = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [error, setError] = useState<string>("");
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [carSearchQuery, setCarSearchQuery] = useState("");
  const [isCustomerListOpen, setIsCustomerListOpen] = useState(true);
  const [isCarListOpen, setIsCarListOpen] = useState(true);
  const {
    selectedCustomer,
    selectedCar,
    setSelectedCustomer,
    setSelectedCar,
    clearSelection,
  } = useCustomerStore();

  // Cart and user stores
  const { user } = useUserStore();
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getCartRequest,
  } = useCartStore();
  const { addToast } = useToastStore(); // State for checkout
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Store previous customer and car IDs to detect changes
  const [prevCustomerId, setPrevCustomerId] = useState<number | null>(null);
  const [prevCarId, setPrevCarId] = useState<number | null>(null);

  // Debounced search for customers
  const debounceSearch = useCallback((searchQuery: string) => {
    const timeoutId = setTimeout(() => {
      fetchCustomers(searchQuery);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, []);

  // Fetch customers function with optional search
  const fetchCustomers = async (searchQuery?: string) => {
    setIsLoadingCustomers(true);
    setError("");
    try {
      const response = await getCustomers(searchQuery);
      setCustomers(response.data);
    } catch (err) {
      setError("Failed to load customers");
      console.error("Error fetching customers:", err);
    } finally {
      setIsLoadingCustomers(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Handle customer search
  useEffect(() => {
    if (customerSearchQuery.trim()) {
      const cleanup = debounceSearch(customerSearchQuery);
      return cleanup;
    } else {
      fetchCustomers();
    }
  }, [customerSearchQuery, debounceSearch]);

  // Clear cart when customer or car selection changes
  useEffect(() => {
    const currentCustomerId = selectedCustomer?.id || null;
    const currentCarId = selectedCar?.id || null;

    // Check if customer changed
    if (
      prevCustomerId !== null &&
      prevCustomerId !== currentCustomerId &&
      items.length > 0
    ) {
      clearCart();
      addToast({
        message: "Cart cleared due to customer change",
        type: "info",
      });
    }

    // Check if car changed (only if we have a customer selected)
    if (
      selectedCustomer &&
      prevCarId !== null &&
      prevCarId !== currentCarId &&
      items.length > 0
    ) {
      clearCart();
      addToast({
        message: "Cart cleared due to vehicle change",
        type: "info",
      });
    }

    // Update previous IDs
    setPrevCustomerId(currentCustomerId);
    setPrevCarId(currentCarId);
  }, [
    selectedCustomer?.id,
    selectedCar?.id,
    items.length,
    clearCart,
    addToast,
    prevCustomerId,
    prevCarId,
    selectedCustomer,
  ]);

  // Filter cars based on search query
  const filteredCars =
    selectedCustomer?.cars.filter((car) =>
      `${car.year} ${car.color_name} ${car.code} ${car.numbers} ${car.city.name.en}`
        .toLowerCase()
        .includes(carSearchQuery.toLowerCase())
    ) || [];
  const handleCustomerSelect = (customer: Customer) => {
    if (selectedCustomer?.id === customer.id) {
      // If clicking the same customer, deselect it
      clearSelection();
    } else {
      // Select the new customer
      setSelectedCustomer(customer);
      setIsCarListOpen(true); // Open car list when customer is selected
    }
  };
  const handleCarSelect = (car: Car) => {
    if (selectedCar?.id === car.id) {
      // If clicking the same car, deselect it
      setSelectedCar(null);
    } else {
      // Select the new car
      setSelectedCar(car);
    }
  };

  const handleCustomerAdded = (newCustomer: Customer) => {
    console.log("Adding new customer:", newCustomer);
    if (newCustomer?.id) {
      setCustomers((prev) => [...prev, newCustomer]);
      setSelectedCustomer(newCustomer);
    } else {
      console.error("Invalid customer data:", newCustomer);
    }
  };

  const handleVehicleAdded = (newVehicle: Car) => {
    if (selectedCustomer) {
      const updatedCustomer = {
        ...selectedCustomer,
        cars: [...selectedCustomer.cars, newVehicle],
      };
      setSelectedCustomer(updatedCustomer);
      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === selectedCustomer.id ? updatedCustomer : customer
        )
      );
      setSelectedCar(newVehicle);
    }
  };

  // Helper functions to handle type-safe comparisons
  const isCustomerSelected = (customer: Customer): boolean => {
    return selectedCustomer !== null && selectedCustomer.id === customer.id;
  };
  const isCarSelected = (car: Car): boolean => {
    return selectedCar !== null && selectedCar.id === car.id;
  };
  // Cart helper functions
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  // Calculate total price with dynamic pricing
  const calculateCartTotal = () => {
    return items.reduce((total, item) => {
      return total + getItemPrice(item) * item.quantity;
    }, 0);
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} AED`;
  };

  const getItemImage = (item: CartItem) => {
    return item.image ?? "/placeholder-image.png";
  };

  const getItemDisplayName = (item: CartItem) => {
    let displayName = item.name;
    if (item.options && item.options.length > 0) {
      const optionNames = item.options.map((opt) => opt.name).join(", ");
      displayName += ` (${optionNames})`;
    }
    return displayName;
  };
  const getItemPrice = (item: CartItem) => {
    let basePrice = item.price;

    // Apply car-specific pricing adjustments if a car is selected
    if (selectedCar) {
      basePrice = calculateDynamicPrice(item, selectedCar);
    }

    const optionsPrice =
      item.options?.reduce((sum, option) => sum + option.price, 0) ?? 0;
    return basePrice + optionsPrice;
  };

  // Dynamic pricing calculation based on car characteristics
  const calculateDynamicPrice = (item: CartItem, car: Car) => {
    let adjustedPrice = item.price;

    // Car type-based pricing adjustments
    if (car.car_type_id) {
      switch (car.car_type_id) {
        case 1: // Small car - 10% discount
          adjustedPrice *= 0.9;
          break;
        case 2: // Medium car - standard price
          adjustedPrice *= 1.0;
          break;
        case 3: // Large car - 15% increase
          adjustedPrice *= 1.15;
          break;
        case 4: // Luxury car - 25% increase
          adjustedPrice *= 1.25;
          break;
        default:
          adjustedPrice *= 1.0;
      }
    }

    // Car group-based adjustments (if applicable)
    if (car.car_group_id) {
      switch (car.car_group_id) {
        case 1: // Economy group - additional 5% discount
          adjustedPrice *= 0.95;
          break;
        case 2: // Premium group - additional 10% increase
          adjustedPrice *= 1.1;
          break;
        default:
          break;
      }
    }

    // Round to 2 decimal places
    return Math.round(adjustedPrice * 100) / 100;
  };

  const handleCheckout = async () => {
    if (!selectedCar || !user) {
      addToast({
        message: "Please select a customer and vehicle before checkout",
        type: "error",
      });
      return;
    }

    if (items.length === 0) {
      addToast({
        message: "Your cart is empty",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const cartData = getCartRequest(selectedCar.id, user.id);
      const response = await submitCart(cartData);

      if (response.success) {
        addToast({
          message: response.message || "Order submitted successfully!",
          type: "success",
        });
        clearCart();
      } else {
        addToast({
          message: response.message || "Failed to submit order",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Checkout error:", error);
      addToast({
        message: "An error occurred during checkout",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full bg-white/5 backdrop-blur-xl border-r border-green-500/20 p-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6 h-full flex flex-col"
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">
            Customer Selection
          </h2>
          <p className="text-green-300/80 text-sm">
            Choose a customer and their vehicle
          </p>
        </div>
        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm"
          >
            {error}
          </motion.div>
        )}{" "}
        {/* Customer Section */}
        <div className="space-y-3">
          {!selectedCustomer ? (
            <>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setIsCustomerListOpen(!isCustomerListOpen)}
                  className="flex items-center space-x-2 text-green-300 hover:text-white transition-colors"
                >
                  {isCustomerListOpen ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                  <span className="font-medium">Customers</span>
                  <span className="text-xs bg-green-500/20 px-2 py-1 rounded">
                    {customers.length}
                  </span>
                </button>{" "}
                <AddCustomerDialog onCustomerAdded={handleCustomerAdded} />
              </div>

              {isCustomerListOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  {/* Customer Search */}
                  <div className="relative">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-300/60"
                    />
                    <input
                      type="text"
                      placeholder="Search customers..."
                      value={customerSearchQuery}
                      onChange={(e) => setCustomerSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-8 py-2 bg-white/10 border border-green-500/20 rounded-lg text-white placeholder-green-300/60 text-sm focus:outline-none focus:border-green-500/40"
                    />
                    {customerSearchQuery && (
                      <button
                        onClick={() => setCustomerSearchQuery("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-300/60 hover:text-white"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>{" "}
                  {/* Customer List */}
                  <div className="max-h-48 overflow-y-auto overflow-x-hidden space-y-1 scrollbar-thin scrollbar-thumb-green-500/20">
                    {isLoadingCustomers && (
                      <div className="text-center py-4 text-green-300/60 text-sm">
                        Loading customers...
                      </div>
                    )}
                    {!isLoadingCustomers && customers.length === 0 && (
                      <div className="text-center py-4 text-green-300/60 text-sm">
                        No customers found
                      </div>
                    )}{" "}
                    {!isLoadingCustomers &&
                      customers.length > 0 &&
                      customers.map((customer) => (
                        <motion.button
                          key={customer.id}
                          onClick={() => handleCustomerSelect(customer)}
                          className={`w-full text-left p-2 rounded-lg transition-all text-sm min-w-0 ${
                            isCustomerSelected(customer)
                              ? "bg-green-500/20 border border-green-500/40 text-white"
                              : "bg-white/5 hover:bg-white/10 text-green-300 border border-transparent"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="font-medium truncate">
                            {customer.name}
                          </div>{" "}
                          <div className="text-xs opacity-80 truncate">
                            {customer.email}
                          </div>
                        </motion.button>
                      ))}
                  </div>
                </motion.div>
              )}
            </>
          ) : (
            /* Selected Customer Display */
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-green-300 font-medium text-sm">
                  Selected Customer
                </span>
                <AddCustomerDialog onCustomerAdded={handleCustomerAdded} />
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-green-500/20 border border-green-500/40 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-white truncate">
                      {selectedCustomer.name}
                    </div>
                    <div className="text-xs text-green-300/80 truncate">
                      {selectedCustomer.email}
                    </div>
                  </div>
                  <button
                    onClick={() => clearSelection()}
                    className="ml-2 p-1 hover:bg-red-500/20 rounded text-red-300 hover:text-red-200 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>{" "}
        {/* Vehicle Section */}
        {selectedCustomer && (
          <div className="space-y-3">
            {!selectedCar ? (
              <>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setIsCarListOpen(!isCarListOpen)}
                    className="flex items-center space-x-2 text-green-300 hover:text-white transition-colors"
                  >
                    {isCarListOpen ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                    <span className="font-medium">Vehicles</span>
                    <span className="text-xs bg-green-500/20 px-2 py-1 rounded">
                      {selectedCustomer.cars.length}
                    </span>
                  </button>{" "}
                  <AddVehicleDialog
                    customerId={selectedCustomer.id}
                    onVehicleAdded={handleVehicleAdded}
                  />
                </div>

                {isCarListOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    {/* Car Search */}
                    {selectedCustomer.cars.length > 0 && (
                      <div className="relative">
                        <Search
                          size={14}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-300/60"
                        />
                        <input
                          type="text"
                          placeholder="Search vehicles..."
                          value={carSearchQuery}
                          onChange={(e) => setCarSearchQuery(e.target.value)}
                          className="w-full pl-8 pr-8 py-2 bg-white/10 border border-green-500/20 rounded-lg text-white placeholder-green-300/60 text-sm focus:outline-none focus:border-green-500/40"
                        />
                        {carSearchQuery && (
                          <button
                            onClick={() => setCarSearchQuery("")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-300/60 hover:text-white"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    )}{" "}
                    {/* Car List */}
                    <div className="max-h-48 overflow-y-auto overflow-x-hidden space-y-1 scrollbar-thin scrollbar-thumb-green-500/20">
                      {selectedCustomer.cars.length === 0 && (
                        <div className="text-center py-4 text-green-300/60 text-sm">
                          No vehicles available
                        </div>
                      )}
                      {selectedCustomer.cars.length > 0 &&
                        filteredCars.length === 0 && (
                          <div className="text-center py-4 text-green-300/60 text-sm">
                            No vehicles match your search
                          </div>
                        )}
                      {filteredCars.length > 0 &&
                        filteredCars.map((car) => (
                          <motion.button
                            key={car.id}
                            onClick={() => handleCarSelect(car)}
                            className={`w-full text-left p-2 rounded-lg transition-all text-sm min-w-0 ${
                              isCarSelected(car)
                                ? "bg-green-500/20 border border-green-500/40 text-white"
                                : "bg-white/5 hover:bg-white/10 text-green-300 border border-transparent"
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="font-medium truncate">
                              {car.year} {car.color_name}
                            </div>
                            <div className="text-xs opacity-80 truncate">
                              {car.code} {car.numbers} • {car.city.name.en}{" "}
                            </div>
                          </motion.button>
                        ))}
                    </div>
                  </motion.div>
                )}
              </>
            ) : (
              /* Selected Car Display */
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-green-300 font-medium text-sm">
                    Selected Vehicle
                  </span>
                  <AddVehicleDialog
                    customerId={selectedCustomer.id}
                    onVehicleAdded={handleVehicleAdded}
                  />
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 bg-green-500/20 border border-green-500/40 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-white truncate">
                        {selectedCar.year} {selectedCar.color_name}
                      </div>
                      <div className="text-xs text-green-300/80 truncate">
                        {selectedCar.code} {selectedCar.numbers} •{" "}
                        {selectedCar.city.name.en}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedCar(null)}
                      className="ml-2 p-1 hover:bg-red-500/20 rounded text-red-300 hover:text-red-200 transition-colors"
                    >
                      <X size={14} />
                    </button>{" "}
                  </div>
                </motion.div>
              </div>
            )}

            {/* Cart Section - Only show if user exists and cart has items */}
            {user && items.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 space-y-4"
              >
                {/* Cart Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="text-green-300" size={16} />
                    <span className="text-green-300 font-medium text-sm">
                      Cart ({getTotalItems()})
                    </span>
                  </div>
                  <button
                    onClick={clearCart}
                    className="text-xs text-red-300 hover:text-red-200 transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                {/* Cart Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-white/5 rounded-lg p-3 border border-green-500/20"
                    >
                      <div className="flex items-start space-x-3">
                        {/* Item Image */}
                        <div className="w-10 h-10 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={getItemImage(item)}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/placeholder-image.png";
                            }}
                          />
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white text-xs line-clamp-2">
                            {getItemDisplayName(item)}
                          </h4>
                          <p className="text-xs text-green-300/60 capitalize mb-1">
                            {item.purchasable_type}
                          </p>

                          {/* Price */}
                          <p className="text-green-300 font-semibold text-xs">
                            {formatPrice(getItemPrice(item))}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                                className="p-1 hover:bg-white/10 rounded text-green-300 transition-colors"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="font-medium text-xs text-white w-6 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                                className="p-1 hover:bg-white/10 rounded text-green-300 transition-colors"
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-1 hover:bg-red-500/20 text-red-300 rounded transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Cart Total and Checkout */}
                <div className="pt-3 border-t border-green-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-white">
                      Total:
                    </span>
                    <span className="text-lg font-bold text-green-300">
                      {formatPrice(calculateCartTotal())}
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    disabled={
                      isSubmitting || items.length === 0 || !selectedCar
                    }
                    className={`w-full py-2 rounded-lg font-medium text-sm transition-colors ${
                      isSubmitting || items.length === 0 || !selectedCar
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {isSubmitting ? "Processing..." : "Checkout"}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Sidebar;
