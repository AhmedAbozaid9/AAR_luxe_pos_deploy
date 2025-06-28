import { motion } from "framer-motion";

const Products = () => {
  const products = [
    {
      name: "Hair Shampoo",
      description: "Professional grade shampoo for all hair types",
      price: "$15.99",
      icon: "🧴",
    },
    {
      name: "Nail Polish",
      description: "Long-lasting nail polish in various colors",
      price: "$8.99",
      icon: "💅",
    },
    {
      name: "Face Moisturizer",
      description: "Hydrating moisturizer for daily skincare",
      price: "$24.99",
      icon: "🧴",
    },
    {
      name: "Hair Scissors",
      description: "Professional hairdressing scissors",
      price: "$89.99",
      icon: "✂️",
    },
  ];

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
        Products
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {products.map((product, index) => (
          <motion.div
            key={product.name}
            variants={cardVariants}
            whileHover={{
              y: -8,
              scale: 1.02,
              transition: { duration: 0.3 },
            }}
            whileTap={{ scale: 0.98 }}
            className="group bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-green-200 transition-all duration-300"
          >
            <motion.div
              className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-4 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <motion.span
                className="text-4xl"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ duration: 0.3 }}
              >
                {product.icon}
              </motion.span>
            </motion.div>

            <h3 className="text-lg font-bold mb-2 text-gray-800 group-hover:text-green-600 transition-colors duration-300">
              {product.name}
            </h3>

            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              {product.description}
            </p>

            <div className="flex justify-between items-center">
              <motion.span
                className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
              >
                {product.price}
              </motion.span>

              <motion.button
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:from-green-700 hover:to-green-800"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add to Cart
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Products;
