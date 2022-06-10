import instance from "@/api/common";
import crypto from 'crypto';

/* 加密用户名，密码 */
export function encode (str){
    const cipher = crypto.createCipher('aes192', 'deliveryIsen');
    var crypted = cipher.update(str, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

//封装获取饭店数据请求
export function  restaurantPost(id,page,limit,keyword){
    //向后端发送更改数据请求
    return instance.get(`/api/food?restaurantId=${id}&page=${page}&limit=${limit}&keyword=${keyword}`)
}

//封装开关按钮改变时的请求
export function changeSwitch(data){
    return instance.post('/api/food',data)
}