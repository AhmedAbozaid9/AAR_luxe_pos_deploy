import { axios } from "../lib/axios";

export interface ServiceImage {
  id: number;
  uuid: string;
  url: string;
  responsive_urls: string[];
}

export interface ServiceOption {
  id: number;
  business_id: number;
  name: {
    ar: string;
    en: string;
  };
  service_id: number;
  is_exclusive: number;
  created_at: string;
  updated_at: string;
  description: {
    ar: string;
    en: string;
  };
  prices: Array<{
    id: number;
    business_id: number;
    type: string | null;
    group_type_car_id: number;
    price: number;
    model_type: string;
    model_id: number;
    created_at: string;
    updated_at: string;
  }>;
  image: ServiceImage;
}

export interface Service {
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
  prices_min_price: number;
  orders_count: number;
  reviews_avg_rating: number | null;
  is_favourite: boolean | null;
  icon: ServiceImage;
  image: ServiceImage;
  icon_dark: ServiceImage;
  options: ServiceOption[];
}

export interface ServicesResponse {
  current_page: number;
  data: Service[];
  // Add other pagination fields as needed
}

export const getServices = async (q?: string): Promise<ServicesResponse> => {
  try {
    const params = q ? { q } : {};
    const response = await axios.get<ServicesResponse>("/services", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};
