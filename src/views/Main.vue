<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="name" label="名称" width="335"> </el-table-column>
    <el-table-column prop="address" label="地址" width="335"> </el-table-column>
    <el-table-column prop="address_1" label="地址" width="335">
      <template slot-scope="scope">
        <el-tag v-for="item in scope.row.tags" :key="item">
          {{ item }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="operation" label="操作" width="335">
      <template>
        <el-button>
          操作
        </el-button>
      </template>
    </el-table-column>
    <el-table-column prop="position" label="关闭状态" width="335">
      <template slot-scope="scope">
        <el-switch
        v-model="scope.row.suspended"
        active-color="#3c8984"
        inactive-color="#dcdfe6">
      </el-switch>
      </template>
     
    </el-table-column>
  </el-table>
</template>

<script>
import { restaurantGet } from "@/api/restaurant/index";
export default {
  name: "Main",
  data() {
    return {
      tableData: [],
    };
  },
  mounted() {
    restaurantGet()
      .then((res) => {
        //将后端返回来的请求数据灌进页面
        let oldObject = [];
        //循环遍历每个用户
        res.data.forEach((item) => {
          let obj = {};
          obj.name = item.name["zh-CN"];
          obj.address = item.address["formatted"];
          obj.tags = item.tags;
          obj.canDeliver = item.canDeliver
          oldObject.push(obj);
        });
        this.tableData = oldObject;
        console.log(this.tableData)
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>


<style scoped>
.el-tag {
  color: #3c8984;
}
.el-table {
  font-size: 15px;
}
</style>