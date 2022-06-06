//工具类封装从本地存和取
export function getloacalStore(k){
    const v = localStorage.getItem(k);
    try {
      return JSON.parse(v);
    } catch (error) {
      return v;
    }
}
export function setloacalStore(k,v){
    const v_1 = JSON.stringify(v)
    window.localStorage.setItem(k,v_1)
}
export function removelocalStore(k){
    window.localStorage.removeItem(k)
}