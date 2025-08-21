import { useQuery } from "@tanstack/react-query";
import axios1 from "../../adminaxios";

export const useWebsiteContent = () => {
  return useQuery(["websiteContent"], async () => {
    const { data } = await axios1.get("getWebsiteContent");
    return data?.content;
  });
};
