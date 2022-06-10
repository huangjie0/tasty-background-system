<template>
  <div>
    <!-- 下来框开始 -->
    <el-select v-model="value" clearable placeholder="请选择" @change="loadFood">
      <el-option
        v-for="item in options"
        :key="item._id"
        :label="item.name['zh-CN']"
        :value="item._id"
      >
      </el-option>
    </el-select>
      <!-- 下来框结束 -->
    <el-table
      :data="foods"
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column prop="name.zh-CN" label="名称" width="600"> </el-table-column>
      <el-table-column label="价格" width="600">
         <template slot-scope="scope">
          {{ scope.row.price | USD }}
        </template>
      </el-table-column>
      <el-table-column  label="状态" width="600">
         <template slot-scope="scope">
           <el-switch
            v-model="scope.row.available"
            @change="changeSwitch(scope.row)"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
//导入餐馆get请求函数，进行获取数据
import { restaurantGet } from "@/api/restaurant/index";
import { restaurantPost, changeSwitch } from '@/api/menus/index'
import _ from 'lodash'
export default {
  name: "Menus",
   filters: {
    USD(v) {
      return `$${(v / 100).toFixed(2)}`;
    },
  },
  data() {
    return {
      options: [],
      value: "",
      page: 1,
      limit: 10,
      keyword: "",
      //初始化一个食物列表来渲染页面
      foods:[],
      //总页数
      total:''
    };
  },
  created() {
    //发送请求获取数据
    restaurantGet()
      .then((res) => {
        //使用get函数过滤出来
        this.options = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods:{
     //发送请求获得食物数据
     loadFood(){
      restaurantPost(this.value,this.page,this.limit,this.keyword).then(res=>{
        this.foods = res.data.list
        this.total = res.data.count
      }).catch(err=>{
        console.log(err)
      })
     },
     changeSwitch(v){
       //获取id
        let id = v._id;
        let data_1 = {
          ..._.omit(v,'_id')
        }
        //整理data数据
        let data={
          id:id,
          data:data_1
        }
        //发送请求
        changeSwitch(data).then(res=>{
          console.log(res)
        }).catch(err=>{
          console.log(err)
        })



     }
   
  }
};
</script>

<style scoped>
</style>