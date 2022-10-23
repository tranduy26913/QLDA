import { axiosClientWithToken } from "./axiosClient";
import getData from "./getData";

export const makePaymentMomo = async (params) => {
  const res = await axiosClientWithToken.post("/payment/create-payment", params);
  return res.data;
};

export const getInfoWithBalance = async (user) => {
  const res = await axiosClientWithToken.post("/user/info-balance", {});
  return getData(res.data);
};
export const unlockChapter = async (user,params) => {
  const res = await axiosClientWithToken.post("/novels/chuong/unlock", params);
  return getData(res.data);
};
