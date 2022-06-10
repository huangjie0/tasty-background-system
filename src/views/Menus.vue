<template>
  <div>
    <el-select v-model="value" clearable placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item._id"
        :label="item.name['zh-CN']"
        :value="item._id"
      >
      </el-option>
    </el-select>
    <el-table
      :data="tableData"
      border
      height="200"
      :summary-method="getSummaries"
      show-summary
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column prop="id" label="ID" width="180"> </el-table-column>
      <el-table-column prop="name" label="姓名"> </el-table-column>
      <el-table-column prop="amount1" label="数值 1（元）"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
//导入餐馆get请求函数，进行获取数据
import { restaurantGet } from "@/api/restaurant/index";
export default {
  name: "Menus",
  data() {
    return {
      options: [],
      value: "",
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
};
</script>

<style scoped>
</style>