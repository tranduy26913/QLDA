import { axiosClient } from "./axiosClient";

export const makePaymentMomo = async (params) => {
  const res = await axiosClient.post("/payment/create-payment", params);
  return res.data;
};
