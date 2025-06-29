import { axios } from "../lib/axios";
import type { CartRequest } from "../stores/cartStore";

export interface CartSubmissionResponse {
  success: boolean;
  message: string;
  order_id?: number;
}

export const submitCart = async (
  cartData: CartRequest
): Promise<CartSubmissionResponse> => {
  try {
    const response = await axios.post<CartSubmissionResponse>(
      "/cart/submit",
      cartData
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting cart:", error);
    throw new Error("Failed to submit cart");
  }
};
