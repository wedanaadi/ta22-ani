import axios from "axios";
import { useToken } from "../hook/Token";
// const decodeToken = jwt_decode(token);

const currentDate = new Date();

export const globalToken = (token) => {
  const expired = typeof token === 'undefined' ? currentDate.getTime() : token *1000
  return expired * 1000
}

export const axiosInstance = axios.create();
axiosInstance.interceptors.request.use(async (config) => {
  if(globalToken() < currentDate.getTime()) {
    const {data: response} = await axios.get(`${import.meta.env.VITE_BASE_URL}/refresh`)
    config.headers.Authorization = `Bearer ${response.access_token}`;
    // setToken(response.access_token)
  }
  return config;
}, (error)=> {
  return Promise.reject(error)
});
