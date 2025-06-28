import axios from "../lib/axios";

// Add your customer-related API functions here
export const getCustomers = async () => {
  const response = await axios.get("/customers");
  return response.data;
};
