import axios from "../lib/axios";
import type { User } from "../stores/userStore";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

// Fake user data for demonstration (since no endpoint is available)
const fakeUser: User = {
  id: 1,
  business_id: 12345,
  name: {
    en: "Ahmed Al-Rashid",
  },
  created_at: "2023-01-15T10:30:00Z",
  updated_at: "2024-12-20T14:45:00Z",
  hire_date: "2023-01-15",
  salary: "8500",
  email: "ahmed.rashid@aarluxe.ae",
  email_verified_at: "2023-01-15T11:00:00Z",
};

export const loginUser = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  // For demonstration, use fake data instead of real API call
  // Comment out the real API call and use fake data
  try {
    const response = await axios.post("/pos/login", credentials);
    return response.data;
  } catch {
    // If real API fails, return fake data for demonstration
    console.log("Using fake data for demonstration purposes");
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

    return {
      user: fakeUser,
      token: "fake_jwt_token_for_demo_purposes_12345",
    };
  }
};
