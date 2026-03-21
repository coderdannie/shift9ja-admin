import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from "axios";
import { BASE_URL } from "./url";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json, text/plain, */*",
  },
});

export const uploadInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "application/json, text/plain, */*",
  },
});

const onRequest = (request: InternalAxiosRequestConfig) => {
  const user = JSON.parse(sessionStorage.getItem("user") || "null");
  
  if (user && user.accessToken) {
    request.headers.Authorization = `Bearer ${user.accessToken}`;
  }
  
  return request;
};

const onRequestError = (error: any) => {
  return Promise.reject(error);
};

const onResponse = (response: AxiosResponse) => {
  return response;
};

const onResponseError = (error: any) => {
  const statusCode = error?.response?.status;
  if (statusCode === 401) {
    sessionStorage.clear();
    setTimeout(() => {
      window.location.href = "/login";
    }, 500);
  }
  return Promise.reject(error);
};

axiosInstance.interceptors.request.use(onRequest, onRequestError);
axiosInstance.interceptors.response.use(onResponse, onResponseError);

uploadInstance.interceptors.request.use(onRequest, onRequestError);
uploadInstance.interceptors.response.use(onResponse, onResponseError);

export default axiosInstance;
