<template>
  <div>
    <el-select v-model="value" clearable placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.name"
        :value="item.value">
      </el-option>
  </el-select>
  </div>
</template>

<script>
//导入餐馆get请求函数，进行获取数据
import {restaurantGet} from '@/api/restaurant/index'
import _ from 'lodash'
export default {
    name:'Menus',
    data() {
      return {
        options:[],
        value: ''
      }
    },
    created(){
      //发送请求获取数据
      restaurantGet().then(res=>{
        //定义一个空的数组
        let obj=[]
        //遍历数组中每一个对象
        res.data.forEach(item => {
          if(item.name)
        })
      }).catch(err=>{
        console.log(err)
      })
    }
}
</script>

<style scoped>
</style>