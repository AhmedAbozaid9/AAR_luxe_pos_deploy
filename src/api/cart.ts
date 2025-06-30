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
    services: Array<{
      cart: {
        purchasable_id: number;
        purchasable_type: "service";
        quantity: number;
        option_ids?: number[] | null;
        purchasable: {
          id: number;
          business_id: number;
          name: { ar: string; en: string };
          price: number;
          before_discount_price: number;
          is_active: number;
          order_column: number;
          category_id: number;
          duration: number;
          created_at: string;
          updated_at: string;
          description: string;
          is_favourite: boolean | null;
          icon?: {
            url: string;
          };
        };
      };
      payload: {
        status: string;
        conflicts: unknown[];
        price: number;
      };
    }>;
    products: Array<{
      cart: {
        purchasable_id: number;
        purchasable_type: "product";
        quantity: number;
        option_ids?: number[] | null;
        purchasable: {
          id: number;
          business_id: number;
          name: { ar: string; en: string };
          price: number;
          before_discount_price: number;
          is_active: number;
          order_column: number;
          category_id: number;
          duration: number;
          created_at: string;
          updated_at: string;
          description: string;
          is_favourite: boolean | null;
          icon?: {
            url: string;
          };
        };
      };
      payload: {
        status: string;
        conflicts: unknown[];
        price: number;
      };
    }>;
    shipping_price: number;
    subtotal_price: number;
    service_percentage: number;
    min_order_percentage: number;
    service_price: number;
    is_valid_coupon: {
      value: boolean;
      reasons: string;
    };
    discount_price: number;
    total_price: number;
    quantity: number;
    count: number;
    min_payment_price: number;
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
