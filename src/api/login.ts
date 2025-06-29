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

export const loginUser = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const response = await axios.post("/pos/login", credentials);
  return response.data;
};
