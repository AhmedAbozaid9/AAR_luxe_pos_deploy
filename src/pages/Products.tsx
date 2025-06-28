import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getProducts, type Product } from "../api/getProducts";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts();
        setProducts(response.data);
      } catch (err) {
        setError("Failed to load products");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Function to get the price display with discount
  const getPriceDisplay = (product: Product) => {
    const hasDiscount = product.before_discount_price > product.price;
    return {
      currentPrice: `AED ${product.price.toLocaleString()}`,
      originalPrice: hasDiscount
        ? `AED ${product.before_discount_price.toLocaleString()}`
        : null,
      discount: hasDiscount
        ? Math.round(
            ((product.before_discount_price - product.price) /
              product.before_discount_price) *
              100
          )
        : 0,
    };
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

  if (!loading && products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📦</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">
          No Products Available
        </h2>
        <p className="text-gray-500">
          We're currently updating our product catalog. Please check back later.
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
        Products
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {products.map((product, index) => {
          const priceInfo = getPriceDisplay(product);

          return (
            <motion.div
              key={product.id}
              variants={cardVariants}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.98 }}
              className="group bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-green-200 transition-all duration-300 flex flex-col h-full"
            >
              <motion.div
                className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                {product.image?.url ? (
                  <img
                    src={product.image.url}
                    alt={product.name.en}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <motion.span
                    className="text-4xl"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    📦
                  </motion.span>
                )}

                {/* Discount badge */}
                {priceInfo.discount > 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    -{priceInfo.discount}%
                  </div>
                )}
              </motion.div>

              <div className="flex-grow flex flex-col">
                <h3 className="text-lg font-bold mb-2 text-gray-800 group-hover:text-green-600 transition-colors duration-300">
                  {product.name.en}
                </h3>

                <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-grow">
                  {product.description || "No description available"}
                </p>

                {/* Category and metadata */}
                <div className="mb-4 space-y-2">
                  {product.category && (
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {product.category.name.en}
                    </span>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    {product.orders_count > 0 && (
                      <span>{product.orders_count} orders</span>
                    )}
                    {product.reviews_avg_rating && (
                      <span className="flex items-center">
                        ⭐ {product.reviews_avg_rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Price and button */}
                <div className="flex justify-between items-center mt-auto">
                  <div className="flex flex-col">
                    <motion.span
                      className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    >
                      {priceInfo.currentPrice}
                    </motion.span>
                    {priceInfo.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {priceInfo.originalPrice}
                      </span>
                    )}
                  </div>

                  <motion.button
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:from-green-700 hover:to-green-800"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default Products;
