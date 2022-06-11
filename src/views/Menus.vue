<template>
  <div>
    <!-- 下来框开始 -->
    <el-select v-model="value" clearable placeholder="请选择" @change="loadFood" :filter-method="filterMethod">
      <el-option
        v-for="item in options"
        :key="item._id"
        :label="item.name['zh-CN']"
        :value="item._id"
      >
      </el-option>
    </el-select>
    <el-input v-model="keyword" @change="getKeywordData" placeholder="请输入内容" />
      <!-- 下来框结束 -->
    <el-table
      :data="foods"
      style="width: 100%; margin-top: 20px"
      v-loading="loading"
    >
      <el-table-column prop="name.zh-CN" label="名称" width="600"></el-table-column>
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
            active-color="#3c8984"
            inactive-color="#dcdfe6"
            >
          </el-switch>
        </template>
      </el-table-column>
    </el-table>
     <el-pagination
      :current-page="page"
      :page-sizes="[10, 50, 100]"
      :page-size="limit"
      layout=" prev, pager, next,sizes"
      :total="total"
      @current-change="changePage"
      @size-change="changeSize"
    />
  </div>
</template>

<script>
//导入餐馆get请求函数，进行获取数据
import { restaurantGet } from "@/api/restaurant/index";
import { restaurantPost, changeSwitch } from '@/api/menus/index'
import _ from 'lodash'
import PinyinMatch from 'pinyin-match'
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
      //表示当前页数
      page: 1,
      //每页显示的条数
      limit: 10,
      keyword: "",
      //初始化一个食物列表来渲染页面
      foods:[],
      //总页数
      total:''-0,
      //默认是打开弹框的
      loading: false,
      //拷贝一份，以供过滤数据用的
      copyoptions: [],
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
     //当开关发生改变的时候所调用的函数
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
        this.loading=true
        //发送请求
        changeSwitch(data).then(res=>{
          this.$message({
          showClose: true,
          message: '更新成功',
          type: 'success'
        });
        }).catch(err=>{
          this.$message({
          showClose: true,
          message: '更新失败',
          type: 'error'
        });
        }).finally(()=>{
          //最终刷新页面
          this.loadFood();
          //将弹框关闭
          this.loading=false
        })
     },
     //当页数发生改变时所调用的函数
     changePage(v){
      this.page=v
      this.loadFood()
     },
     //当更改每页多少条数据所调用的函数
     changeSize(v){
        this.page = 1;
        this.limit = v;
        this.loadFood();
     },
     //点击搜索按钮，进行筛选过滤
      getKeywordData(v){
        this.keyword = v
        this.page = 1;
        this.limit = 10;
        this.loadFood();
      },
      //过滤数据
      filterMethod(v) {
      if (!v) {
        this.options = this.copyoptions;
      } else {
        this.options = this.options.filter((item) =>
          PinyinMatch.match(item.name["zh-CN"], v)
        );
      }
    },
  }
};
</script>

<style scoped>
</style>