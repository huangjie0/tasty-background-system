import axios from "axios";
import { getloacalStore } from '@/common/until'
const instance = axios.create({
    timeout:'10000'
})
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  //在请求拦截器中配置token值
  const token = getloacalStore('token') 
  if(token){
      config.headers.Authorization=token   
  }
  return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });
  
// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });
  
export default instance