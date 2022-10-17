import { axiosClient } from "./axiosClient";
import getData from "./getData";

export const makePaymentMomo = async (params) => {
  const res = await axiosClient.post("/payment/create-payment", params);
  return res.data;
};

export const getInfoWithBalance = async (user) => {
  const res = await axiosClient.post("/user/info-balance", {},{headers: { Authorization: `Bearer ${user.accessToken}` }} );
  return getData(res.data);
};
