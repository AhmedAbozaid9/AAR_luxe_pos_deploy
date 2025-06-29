import axios from "../lib/axios";

// Types
export interface Car {
  id: number;
  business_id: number;
  user_id: number;
  city_id: number;
  car_brand_id: number;
  car_model_id: number;
  car_type_id: number | null;
  plate_type_id: string;
  color: string;
  color_name: string;
  year: string;
  code: string;
  numbers: string;
  created_at: string;
  updated_at: string;
  car_group_id: number;
  plate_img: string;
  image: string | null;
  car_type: unknown;
  plate_type: {
    id: string;
    name: {
      ar: string;
      en: string;
    };
  };
  city: {
    id: number;
    business_id: number;
    name: {
      en: string;
      ar: string;
      code: string;
    };
    code: string;
    is_active: number;
    order_column: number;
    created_at: string;
    updated_at: string;
  };
}

export interface Customer {
  id: number;
  business_id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  phone: string;
  phone_country: string;
  phone_normalized: string;
  phone_national: string;
  phone_e164: string;
  phone_verified_at: string | null;
  language: string;
  created_at: string;
  updated_at: string;
  city_id: number | null;
  cars: Car[];
}

export interface CustomersResponse {
  current_page: number;
  data: Customer[];
}

// API functions
export const getCustomers = async (
  searchQuery?: string
): Promise<CustomersResponse> => {
  const params = searchQuery ? { q: searchQuery } : {};
  const response = await axios.get("/pos/customers", { params });
  return response.data;
};
