/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export const StorageKeys = {
  ACCESS_TOKEN: "ACCESS_TOKEN",
  REFRESH_TOKEN: "REFRESH_TOKEN",
  EXPIRES_IN: "EXPIRES_IN"
}

const axiosClient = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  headers: {
    'content-type': 'application/json',
  },
  paramsSerializer: (params) => encodeURIComponent(JSON.stringify(params)),
});

axiosClient.interceptors.request.use(async (config) => {
  const customHeaders: any = {};

  const accessToken = localStorage.getItem(StorageKeys.ACCESS_TOKEN);
  if (accessToken) {
    customHeaders.Authorization = `Bearer ${accessToken}`;
  }

  return {
    ...config,
    headers: {
      ...customHeaders,  // auto attach token
      ...config.headers, // but you can override for some requests
    }
  };
});

export default axiosClient;
