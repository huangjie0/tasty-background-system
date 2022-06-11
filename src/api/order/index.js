import instance from "@/api/common";
//封装order数据请求模块
export function orderGet(start,end){
    return instance.get(`/api/order?start=${start}&end=${end}`)
    }