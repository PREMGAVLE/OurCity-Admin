import { useQuery } from "@tanstack/react-query";
import axios from "../../axios";

export const usePlans = () => {
  return useQuery(["plans"], async () => {
    const { data } = await axios.get("getActivePlans");
    return data?.plans;
  });
};
