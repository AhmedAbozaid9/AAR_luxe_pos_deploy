import { axios } from "../lib/axios";

// API interfaces
export interface CartItemRequest {
  purchasable_id: number;
  purchasable_type: "service" | "package" | "product";
  quantity: number;
  option_ids?: number[] | null;
}

export interface CartRequest {
  car_id: number;
  user_id: number;
  purchasables: CartItemRequest[];
}

export interface CartItemResponse {
  id: string;
  purchasable_id: number;
  purchasable_type: "service" | "package" | "product";
  quantity: number;
  option_ids?: number[] | null;
  name: string;
  price: number;
  discounted_price?: number;
  discount_percentage?: number;
  total_price: number;
  image?: string;
  options?: Array<{
    id: number;
    name: string;
    price: number;
  }>;
}

export interface CartResponse {
  success: boolean;
  message: string;
  cart: {
    id: string;
    car_id: number;
    user_id: number;
    items: CartItemResponse[];
    total_items: number;
    subtotal: number;
    discount_amount: number;
    total_price: number;
    created_at: string;
    updated_at: string;
  };
}

// Single API function - submit cart and get updated pricing
export const submitCartForPricing = async (
  data: CartRequest
): Promise<CartResponse> => {
  try {
    const response = await axios.post<CartResponse>("/pos/cart", data);
    return response.data;
  } catch (error) {
    console.error("Error submitting cart for pricing:", error);
    throw new Error("Failed to submit cart");
  }
};
