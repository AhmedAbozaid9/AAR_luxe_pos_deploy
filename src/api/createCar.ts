import axios from "../lib/axios";
import type { Car } from "./getCustomers";

export interface CreateCarRequest {
  city_id: number;
  car_brand_id: number;
  car_model_id?: number;
  plate_type_id: string;
  car_type_id: string;
  car_group_id: number;
  color: string;
  color_name: string;
  year: string;
  code: string;
  numbers: string;
  user_id: number;
}

export interface CreateCarResponse {
  data?: Car;
  message?: string;
  // API might return car directly or nested in data
  id?: number;
  business_id?: number;
  user_id?: number;
  city_id?: number;
  car_brand_id?: number;
  car_model_id?: number | null;
  car_type_id?: number | null;
  plate_type_id?: string;
  color?: string;
  color_name?: string;
  year?: string;
  code?: string;
  numbers?: string;
  created_at?: string;
  updated_at?: string;
  car_group_id?: number;
  plate_img?: string;
  image?: string | null;
}

export const createCar = async (
  carData: CreateCarRequest
): Promise<CreateCarResponse> => {
  const response = await axios.post("/pos/cars", carData);
  return response.data;
};
