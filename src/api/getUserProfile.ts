import axios from "../lib/axios";

export interface UserProfileData {
  id: number;
  business_id: number;
  name: {
    en: string;
  };
  email: string;
  branch_id: number;
}

export const getUserProfile = async (): Promise<UserProfileData> => {
  const response = await axios.get("/pos/user");
  return response.data;
};
