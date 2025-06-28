import axios from "../lib/axios";

// Meta data types
export interface City {
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
}

export interface CarBrand {
  id: number;
  business_id: number;
  name: {
    en: string;
    ar: string;
  };
  is_active: number;
  order_column: number;
  created_at: string;
  updated_at: string;
  logotype_uri: string;
  image: {
    id: number;
    uuid: string;
    url: string;
    responsive_urls: string[];
  };
}

export interface CarModel {
  id: number;
  business_id: number;
  car_brand_id: number;
  name: {
    en: string;
    ar: string;
  };
  is_active: number;
  order_column: number;
  created_at: string;
  updated_at: string;
}

export interface CarGroup {
  id: number;
  business_id: number;
  name: {
    ar: string;
    en: string;
  };
  ids: string[];
  created_at: string;
  updated_at: string;
  price_avg_price: string | null;
}

export interface CarType {
  id: string;
  numeric_id?: number; // In case the API provides both
  name: {
    ar: string;
    en: string;
  };
}

export interface PlateType {
  id: string;
  name: {
    ar: string;
    en: string;
  };
}

export interface PlateTypeForCity {
  id: string;
  name: {
    ar: string;
    en: string;
  };
}

export interface CityPlateLetter {
  id: string;
  letter: string;
  name?: {
    ar: string;
    en: string;
  };
}

export interface MetaDataResponse {
  cities: City[];
  car_brands: CarBrand[];
  car_groups: CarGroup[];
  car_types: CarType[];
  plate_types?: PlateType[];
}

export const getMetaData = async (): Promise<MetaDataResponse> => {
  const response = await axios.get("/meta/data");
  return response.data;
};

export const getCarModels = async (brandId: string): Promise<CarModel[]> => {
  const response = await axios.get(`/meta/car_models/${brandId}`);
  return response.data;
};

export const getPlateTypesForCity = async (
  cityId: string
): Promise<PlateTypeForCity[]> => {
  const response = await axios.get(`/meta/get_plate_types_for_city/${cityId}`);
  return response.data;
};

export const getCityPlateLetters = async (
  cityId: string,
  typeId: string
): Promise<string[]> => {
  const response = await axios.get(
    `/meta/city_plate_letters/${cityId}/${typeId}`
  );
  return response.data;
};
