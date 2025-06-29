import axios from "../lib/axios";

// Types
export interface PackageImage {
  id: number;
  uuid: string;
  url: string;
  responsive_urls: string[];
}

export interface PackagePrice {
  id: number;
  business_id: number;
  type: string | null;
  group_type_car_id: number;
  price: number;
  model_type: string;
  model_id: number;
  created_at: string;
  updated_at: string;
}

export interface Package {
  id: number;
  business_id: number;
  name: {
    ar: string;
    en: string;
  };
  included: Array<{
    ar: string;
    en: string;
  }>;
  is_active: number;
  order_column: number;
  duration: number;
  created_at: string;
  updated_at: string;
  duration_followup: number;
  prices_min_price: number | null;
  reviews_avg_rating: number | null;
  orders_count: number | null;
  is_favourite: boolean | null;
  image: PackageImage | null;
  prices: PackagePrice[];
}

export interface PackagesResponse {
  current_page: number;
  data: Package[];
}

// API functions
export const getPackages = async (
  searchQuery?: string
): Promise<PackagesResponse> => {
  const params = searchQuery ? { q: searchQuery } : {};
  const response = await axios.get("/packages", { params });
  return response.data;
};
