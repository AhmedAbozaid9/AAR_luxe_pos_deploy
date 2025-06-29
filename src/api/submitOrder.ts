import { axios } from "../lib/axios";

// Order interfaces
export interface OrderItemRequest {
  purchasable_id: number;
  purchasable_type: "service" | "package" | "product";
  quantity: number;
  option_ids?: number[] | null;
}

export interface OrderRequest {
  car_id: number;
  user_id: number;
  purchasables: OrderItemRequest[];
}

export interface OrderResponse {
  success: boolean;
  message: string;
  order?: {
    id: number;
    car_id: number;
    user_id: number;
    total_price: number;
    status: string;
    created_at: string;
    updated_at: string;
  };
}

// Submit order to the server
export const submitOrder = async (
  data: OrderRequest
): Promise<OrderResponse> => {
  try {
    const response = await axios.post<OrderResponse>("/pos/order", data);
    return response.data;
  } catch (error) {
    console.error("Error submitting order:", error);
    throw new Error("Failed to submit order");
  }
};
