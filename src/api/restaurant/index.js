import instance from "@/api/common";
import crypto from 'crypto';

/* 加密用户名，密码 */
export function encode (str){
    const cipher = crypto.createCipher('aes192', 'deliveryIsen');
    var crypted = cipher.update(str, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

export function restaurantGet(){
    return instance.get('/api/restaurant/location/-74.0059413,40.7127837')
    }

export function  restaurantPost(data){
    //向后端发送更改数据请求
    return instance.post('/api/restaurant',data)
}
export function getTags(){
    //发送get请求，向后端要tags标签
    return instance.get('/api/tags')
}