import { motion } from "framer-motion";
import { Car, Mail, Phone, User } from "lucide-react";
import { useCustomerStore } from "../../stores/customerStore";

interface ServiceHeaderProps {
  title: string;
}

const ServiceHeader = ({ title }: ServiceHeaderProps) => {
  const { selectedCustomer, selectedCar } = useCustomerStore();

  if (!selectedCustomer) {
    return (
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-500">Please select a customer to continue</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{title}</h1>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Customer Info */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                <User size={18} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {selectedCustomer.name}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Mail size={14} />
                    <span>{selectedCustomer.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Phone size={14} />
                    <span>{selectedCustomer.phone_national}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Info */}
            {selectedCar && (
              <>
                <div className="w-px h-12 bg-gray-200"></div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                    <Car size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {selectedCar.year} {selectedCar.color_name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {selectedCar.code} {selectedCar.numbers}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-600">Active</span>
          </div>
        </div>
      </motion.div>{" "}
    </div>
  );
};

export default ServiceHeader;
