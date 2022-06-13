import Vue from 'vue'
import App from './App.vue'
import router from '@/router/index'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router'
Vue.use(ElementUI)
//改写vue底层代码防止路由重复跳转
//防止路由连续跳转的情况底层处理
const originalPush =VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch(err => err)
}

Vue.config.productionTip = false
//全局引入表报
import echarts from "echarts";
//挂载在原型对象上
Vue.prototype.$echarts = echarts;


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
