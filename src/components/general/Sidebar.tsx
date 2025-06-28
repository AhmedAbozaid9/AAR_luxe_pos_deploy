import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getCustomers, type Customer } from "../../api/getCustomers";
import { useCustomerStore } from "../../stores/customerStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const Sidebar = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [error, setError] = useState<string>("");
  const { selectedCustomer, selectedCar, setSelectedCustomer, setSelectedCar } =
    useCustomerStore();

  // Helper function for car select placeholder
  const getCarSelectPlaceholder = () => {
    if (!selectedCustomer) {
      return "Select a customer first";
    }
    if (selectedCustomer.cars.length === 0) {
      return "No vehicles available";
    }
    return "Select a vehicle";
  };

  // Fetch customers on component mount
  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoadingCustomers(true);
      setError("");
      try {
        const response = await getCustomers();
        setCustomers(response.data);
      } catch (err) {
        setError("Failed to load customers");
        console.error("Error fetching customers:", err);
      } finally {
        setIsLoadingCustomers(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleCustomerChange = (customerId: string) => {
    if (customerId === "") {
      setSelectedCustomer(null);
      return;
    }

    const customer = customers.find((c) => c.id === parseInt(customerId));
    if (customer) {
      setSelectedCustomer(customer);
    }
  };

  const handleCarChange = (carId: string) => {
    if (carId === "" || !selectedCustomer) {
      setSelectedCar(null);
      return;
    }

    const car = selectedCustomer.cars.find((c) => c.id === parseInt(carId));
    if (car) {
      setSelectedCar(car);
    }
  };

  return (
    <div className="h-full  bg-white/5 backdrop-blur-xl border-r border-green-500/20 p-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
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
        )}        {/* Customer Select */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-green-300">Customer</div>
          <Select
            value={selectedCustomer?.id.toString() ?? ""}
            onValueChange={handleCustomerChange}
            disabled={isLoadingCustomers}
          >
            <motion.div
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    isLoadingCustomers
                      ? "Loading customers..."
                      : "Select a customer"
                  }
                />
              </SelectTrigger>
            </motion.div>
            <SelectContent>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id.toString()}>
                  {customer.name} ({customer.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>        {/* Car Select */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-green-300">Vehicle</div>
          <Select
            value={selectedCar?.id.toString() ?? ""}
            onValueChange={handleCarChange}
            disabled={!selectedCustomer || selectedCustomer.cars.length === 0}
          >
            <motion.div
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={getCarSelectPlaceholder()} />
              </SelectTrigger>
            </motion.div>
            <SelectContent>
              {selectedCustomer?.cars.map((car) => (
                <SelectItem key={car.id} value={car.id.toString()}>
                  {car.year} {car.color_name} - {car.code} {car.numbers} (
                  {car.city.name.en})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selected Info Display */}
        {selectedCustomer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg space-y-3"
          >
            <h3 className="text-white font-semibold text-sm">
              Selected Customer
            </h3>
            <div className="space-y-1 text-sm">
              <p className="text-green-300">
                <span className="text-green-200">Name:</span>{" "}
                {selectedCustomer.name}
              </p>
              <p className="text-green-300">
                <span className="text-green-200">Email:</span>{" "}
                {selectedCustomer.email}
              </p>
              <p className="text-green-300">
                <span className="text-green-200">Phone:</span>{" "}
                {selectedCustomer.phone_national}
              </p>
            </div>

            {selectedCar && (
              <div className="pt-3 border-t border-green-500/20">
                <h4 className="text-white font-semibold text-sm mb-2">
                  Selected Vehicle
                </h4>
                <div className="space-y-1 text-sm">
                  <p className="text-green-300">
                    <span className="text-green-200">Year:</span>{" "}
                    {selectedCar.year}
                  </p>
                  <p className="text-green-300">
                    <span className="text-green-200">Color:</span>{" "}
                    {selectedCar.color_name}
                  </p>
                  <p className="text-green-300">
                    <span className="text-green-200">Plate:</span>{" "}
                    {selectedCar.code} {selectedCar.numbers}
                  </p>
                  <p className="text-green-300">
                    <span className="text-green-200">City:</span>{" "}
                    {selectedCar.city.name.en}
                  </p>
                  <p className="text-green-300">
                    <span className="text-green-200">Type:</span>{" "}
                    {selectedCar.plate_type.name.en}
                  </p>
                </div>

                {/* Plate Image */}
                {selectedCar.plate_img && (
                  <div className="mt-3">
                    <img
                      src={selectedCar.plate_img}
                      alt="Vehicle Plate"
                      className="w-full max-w-[200px] rounded border border-green-500/30"
                    />
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Clear Selection Button */}
        {(selectedCustomer || selectedCar) && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => {
              setSelectedCustomer(null);
              setSelectedCar(null);
            }}
            className="w-full py-2 px-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 rounded-lg transition-all duration-300 text-sm font-medium"
          >
            Clear Selection
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default Sidebar;
