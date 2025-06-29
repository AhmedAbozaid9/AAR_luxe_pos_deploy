import { axios } from "../lib/axios";

export interface ProductImage {
  id: number;
  uuid: string;
  url: string;
  responsive_urls: string[];
}

export interface ProductCategory {
  id: number;
  business_id: number;
  name: {
    ar: string;
    en: string;
  };
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  business_id: number;
  name: {
    en: string;
    ar: string;
  };
  price: number;
  before_discount_price: number;
  is_active: number;
  order_column: number;
  category_id: number;
  duration: number;
  created_at: string;
  updated_at: string;
  description: string;
  orders_count: number;
  reviews_avg_rating: number | null;
  is_favourite: boolean | null;
  image: ProductImage;
  images: ProductImage[];
  category: ProductCategory;
}

export interface ProductsResponse {
  current_page: number;
  data: Product[];
  // Add other pagination fields as needed
}

export const getProducts = async (q?: string): Promise<ProductsResponse> => {
  try {
    const params = q ? { q } : {};
    const response = await axios.get<ProductsResponse>("/products", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
