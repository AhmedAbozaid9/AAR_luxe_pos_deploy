import { motion } from "framer-motion";
import { Search, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { getProducts, type Product } from "../api/getProducts";
import ServiceHeader from "../components/general/ServiceHeader";
import { useCartStore } from "../stores/cartStore";
import { useToastStore } from "../stores/toastStore";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); // Cart and customer stores
  const { addItem } = useCartStore();
  const { addToast } = useToastStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const fetchProducts = async (query?: string) => {
    try {
      setLoading(true);
      const response = await getProducts(query);
      setProducts(response.data);
    } catch (err) {
      setError("Failed to load products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }; // Function to get the price display with discount
  const getPriceDisplay = (product: Product) => {
    const hasDiscount = product.before_discount_price > product.price;
    return {
      currentPrice: product.price.toLocaleString(),
      originalPrice: hasDiscount
        ? product.before_discount_price.toLocaleString()
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
  // Function to add product to cart
  const addToCart = (product: Product) => {
    addItem({
      purchasable_id: product.id,
      purchasable_type: "product",
      quantity: 1,
      name: product.name.en,
      price: product.price,
      image: product.image?.url,
    });

    addToast({
      message: `${product.name.en} added to cart!`,
      type: "success",
    });
  };
  if (loading) {
    return (
      <div className="h-full">
        <ServiceHeader title="Products" />
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
            <p className="text-gray-600 text-center">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="h-full">
        <ServiceHeader title="Products" />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-2 text-center">⚠️</div>
            <p className="text-gray-600 mb-4 text-center">{error}</p>
            <button
              onClick={() => fetchProducts()}
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
      <ServiceHeader title="Products" />
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
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 text-lg bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-300 placeholder-gray-400"
          />
        </motion.div>
      </div>{" "}
      {products.length === 0 && !loading ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 text-center">📦</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2 text-center">
            No products found
          </h3>
          <p className="text-gray-500 text-center">
            {searchQuery
              ? "Try adjusting your search criteria"
              : "No products are currently available"}
          </p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
        >
          {products.map((product, index) => {
            const priceInfo = getPriceDisplay(product);
            return (
              <motion.div
                key={product.id}
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
                className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 h-[520px] flex flex-col"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                  {product.image?.url ? (
                    <img
                      src={product.image.url}
                      alt={product.name.en}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📦</div>
                        <p className="text-sm font-medium">No Image</p>
                      </div>
                    </div>
                  )}

                  {/* Discount Badge */}
                  {priceInfo.discount > 0 && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm bg-opacity-90">
                      -{priceInfo.discount}%
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {product.name.en}
                    </h3>
                    {product.name.ar && (
                      <p
                        className="text-sm text-gray-500 mb-4 line-clamp-1"
                        dir="rtl"
                      >
                        {product.name.ar}
                      </p>
                    )}

                    {product.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {product.description}
                      </p>
                    )}

                    {/* Product Stats */}
                    {(product.reviews_avg_rating ||
                      product.orders_count > 0) && (
                      <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          {product.reviews_avg_rating && (
                            <div className="flex items-center space-x-1">
                              <Star
                                size={16}
                                className="text-yellow-500 fill-current"
                              />
                              <span className="font-medium">
                                {product.reviews_avg_rating.toFixed(1)}
                              </span>
                            </div>
                          )}
                          {product.orders_count > 0 && (
                            <div className="text-green-600 font-medium">
                              {product.orders_count} orders
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>{" "}
                  {/* Price and Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex flex-col">
                      <div className="text-2xl font-bold text-green-600">
                        {priceInfo.currentPrice}
                        <sub className="text-sm font-normal ml-1">AED</sub>
                      </div>
                      {priceInfo.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">
                          {priceInfo.originalPrice}
                          <sub className="text-xs font-normal ml-1">AED</sub>
                        </div>
                      )}
                    </div>{" "}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addToCart(product)}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl transition-colors duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
                    >
                      Add to Cart
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default Products;
