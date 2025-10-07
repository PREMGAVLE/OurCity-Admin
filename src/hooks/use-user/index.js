import { useQuery } from "@tanstack/react-query";
import axios from "../../axios";

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const { data } = await axios.get("me");
        console.log("Full /me API response:", data);
        console.log("Data structure:", JSON.stringify(data, null, 2));
        
        // Try different possible structures
        const userData = data?.result?.user || data?.result || data?.user || data;
        console.log("Extracted user data:", userData);
        
        return userData;
      } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
      }
    },
  });
};
