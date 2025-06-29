import { motion } from "framer-motion";
import { useCustomerStore } from "../../stores/customerStore";

interface SelectedCustomerDisplayProps {
  className?: string;
}

const SelectedCustomerDisplay = ({
  className = "",
}: SelectedCustomerDisplayProps) => {
  const { selectedCustomer, selectedCar } = useCustomerStore();

  if (!selectedCustomer) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/90 backdrop-blur-sm border border-green-500/20 rounded-lg p-4 shadow-lg ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800">
          Selected Customer
        </h3>
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-600">Name:</span>
          <span className="font-medium text-gray-800">
            {selectedCustomer.name}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Email:</span>
          <span className="font-medium text-gray-800">
            {selectedCustomer.email}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Phone:</span>
          <span className="font-medium text-gray-800">
            {selectedCustomer.phone_national}
          </span>
        </div>
        {selectedCar && (
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-800">
                Vehicle
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Plate:</span>
                <span className="font-medium text-gray-800">
                  {selectedCar.code} {selectedCar.numbers}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Year:</span>
                <span className="font-medium text-gray-800">
                  {selectedCar.year}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Color:</span>
                <span className="font-medium text-gray-800">
                  {selectedCar.color_name}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SelectedCustomerDisplay;
