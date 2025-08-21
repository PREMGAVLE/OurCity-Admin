import { useQuery } from "@tanstack/react-query";
import axios from "../../axios";

export const useGatway = () => {
  return useQuery(["user"], async () => {
    const { data } = await axios.get("me");
    return data;
  });
};

//"https://api.learn2ern.com/api/createOrderUPI?id=3&isOffer=1"

// const instance = axios.create({
//     baseURL: "https://api.learn2ern.com/api/",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
  