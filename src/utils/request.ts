import Axios, { AxiosRequestConfig } from 'axios';

const request = Axios.create({
  baseURL: '',
  timeout: 5000,
});

request.interceptors.request.use((config: AxiosRequestConfig):
  | AxiosRequestConfig
  | Promise<AxiosRequestConfig> => {
  return config;
});

export default request;