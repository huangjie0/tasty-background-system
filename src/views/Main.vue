<template>
<div>
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
        v-model="scope.row.isClosed"
        active-color="#3c8984"
        inactive-color="#dcdfe6">
      </el-switch>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页区域 -->
   <el-pagination
    layout="prev, pager, next"
    :total="50"
    :page-size="10">
    </el-pagination>
  <!-- 分页区结束 -->
</div>

</template>

<script>
import { restaurantGet } from "@/api/restaurant/index";
import _ from 'lodash'
export default {
  name: "Main",
  data() {
    return {
      tableData: [],
      //初始化数据
      tablePage:{
        pageNum:1,
      }
    };
  },
  methods:{
    //checkClosed方法,检测是否开关门
    checkClosed(item) {
      const closed = _.get(item, "closed", null);
      if (closed !== null) {
        return true;
      }
    },
  },
  mounted() {
    //组件刚挂载时候所发的请求
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
          //循环遍历每个函数，调用检查开关门函数
          obj.isClosed=this.checkClosed(item)
          oldObject.push(obj);
        });
        this.tableData = oldObject;
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