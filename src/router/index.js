import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter)
export default new VueRouter({
    mode:'history',
    routes:[
        {
            path:'/',
            redirect:'/common/restaurant'
        },
        {
            path:'/common',
            component:()=>import('@/components/Common.vue'),
            name:'common',
            children:[
                {
                    path:'/common/restaurant',
                    name:'restaurant',
                    component:()=>import('@/views/Main.vue'),
                },
                {
                    path:'/common/menus',
                    name:'menus',
                    component:()=>import('@/views/Menus.vue'),
                },
                {
                    path:'/common/order',
                    name:'order',
                    component:()=>import('@/views/Order.vue'),
                }
            ]
        }
    ]
})