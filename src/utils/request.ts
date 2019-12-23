import Axios, { AxiosRequestConfig } from 'axios';

const request = Axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 5000,
});

request.interceptors.request.use((config: AxiosRequestConfig):
  | AxiosRequestConfig
  | Promise<AxiosRequestConfig> => {
  return config;
});

export default request;