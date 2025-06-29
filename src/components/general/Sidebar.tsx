import { motion } from "framer-motion";
import { ChevronDown, ChevronRight, Search, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getCustomers, type Car, type Customer } from "../../api/getCustomers";
import { useCustomerStore } from "../../stores/customerStore";
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

  // Filter cars based on search query
  const filteredCars =
    selectedCustomer?.cars.filter((car) =>
      `${car.year} ${car.color_name} ${car.code} ${car.numbers} ${car.city.name.en}`
        .toLowerCase()
        .includes(carSearchQuery.toLowerCase())
    ) || [];

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsCarListOpen(true); // Open car list when customer is selected
  };

  const handleCarSelect = (car: Car) => {
    setSelectedCar(car);
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
        )}

        {/* Customer Section */}
        <div className="space-y-3">
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
              </div>

              {/* Customer List */}
              <div className="max-h-48 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-green-500/20">
                {isLoadingCustomers && (
                  <div className="text-center py-4 text-green-300/60 text-sm">
                    Loading customers...
                  </div>
                )}
                {!isLoadingCustomers && customers.length === 0 && (
                  <div className="text-center py-4 text-green-300/60 text-sm">
                    No customers found
                  </div>
                )}
                {!isLoadingCustomers &&
                  customers.length > 0 &&
                  customers.map((customer) => (
                    <motion.button
                      key={customer.id}
                      onClick={() => handleCustomerSelect(customer)}
                      className={`w-full text-left p-2 rounded-lg transition-all text-sm ${
                        selectedCustomer?.id === customer.id
                          ? "bg-green-500/20 border border-green-500/40 text-white"
                          : "bg-white/5 hover:bg-white/10 text-green-300 border border-transparent"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-xs opacity-80">{customer.email}</div>
                    </motion.button>
                  ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Vehicle Section */}
        {selectedCustomer && (
          <div className="space-y-3">
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
                <div className="max-h-48 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-green-500/20">
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
                        className={`w-full text-left p-2 rounded-lg transition-all text-sm ${
                          selectedCar?.id === car.id
                            ? "bg-green-500/20 border border-green-500/40 text-white"
                            : "bg-white/5 hover:bg-white/10 text-green-300 border border-transparent"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="font-medium">
                          {car.year} {car.color_name}
                        </div>
                        <div className="text-xs opacity-80">
                          {car.code} {car.numbers} • {car.city.name.en}
                        </div>
                      </motion.button>
                    ))}
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Clear Selection Button - Compact */}
        {(selectedCustomer || selectedCar) && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={clearSelection}
            className="flex items-center justify-center space-x-2 w-full py-2 px-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 rounded-lg transition-all duration-300 text-xs font-medium"
          >
            <X size={14} />
            <span>Clear Selection</span>
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default Sidebar;
