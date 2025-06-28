import axios from "../lib/axios";
import type { Car, Customer } from "./getCustomers";

export interface CreateCustomerRequest {
  name: string;
  phone: string;
  phone_country: string;
}

export interface CreateCustomerResponse {
  data?: Customer;
  message?: string;
  // API might return customer directly or nested in data
  id?: number;
  business_id?: number;
  name?: string;
  email?: string;
  email_verified_at?: string | null;
  phone?: string;
  phone_country?: string;
  phone_normalized?: string;
  phone_national?: string;
  phone_e164?: string;
  phone_verified_at?: string | null;
  language?: string;
  created_at?: string;
  updated_at?: string;
  city_id?: number | null;
  cars?: Car[];
}

export const createCustomer = async (
  customerData: CreateCustomerRequest
): Promise<CreateCustomerResponse> => {
  const response = await axios.post("/pos/customers", customerData);
  return response.data;
};

import axios from "../lib/axios";
import type { Customer, Car } from "./getCustomers";

export interface CreateCustomerRequest {
  name: string;
  phone: string;
  phone_country: string;
}

export interface CreateCustomerResponse {
  data?: Customer;
  message?: string;
  // API might return customer directly or nested in data
  id?: number;
  business_id?: number;
  name?: string;
  email?: string;
  email_verified_at?: string | null;
  phone?: string;
  phone_country?: string;
  phone_normalized?: string;
  phone_national?: string;
  phone_e164?: string;
  phone_verified_at?: string | null;
  language?: string;
  created_at?: string;
  updated_at?: string;
  city_id?: number | null;
  cars?: Car[];
}

export const createCustomer = async (
  customerData: CreateCustomerRequest
): Promise<CreateCustomerResponse> => {
  const response = await axios.post("/pos/customers", customerData);
  return response.data;
};
