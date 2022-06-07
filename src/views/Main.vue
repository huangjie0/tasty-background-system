<template>
<div>
   <el-table :data="tableData.slice((page-1)*limit,page*limit)" style="width: 100%" v-loading="isShow">
      <el-table-column prop="name" label="名称" width="335"> </el-table-column>
      <el-table-column prop="address" label="地址" width="335"> </el-table-column>
      <el-table-column prop="address_1" label="地址" width="335">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.tags" :key="item">
            {{item}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="operation" label="操作" width="335">
        <template slot-scope="scope">
          <el-button @click="openDialog(scope.row)">
            操作
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="position" label="关闭状态" width="335">
        <template slot-scope="scope">
          <el-switch
          v-model="scope.row.isClosed"
          @change='changeClose(scope.row)'
          active-color="#3c8984"
          inactive-color="#dcdfe6">
        </el-switch>
        </template>
    </el-table-column>
  </el-table>
  <!-- 分页区域 -->
  <el-pagination
  layout="prev, pager, next"
  :total="tableData.length"
    @current-change="changePage"
  :page-size="limit">
  </el-pagination>
  <!-- 分页区结束 -->
  <el-dialog
  :title="dialogTitle"
  :visible.sync="dialogVisible"
  width="40%">

<!-- 中英文切换 -->

 <el-input placeholder="请输入内容"  v-model="dialogData.name" class="input-with-select">
    <el-select v-model="select" slot="prepend" placeholder="请选择">
      <el-option label="中文" value="1"></el-option>
      <el-option label="英文" value="2"></el-option>
    </el-select>
  </el-input>

<!-- 中英文切换结束 -->



  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
</div>

</template>

<script>
import { restaurantGet,restaurantPost } from "@/api/restaurant/index";
import _ from 'lodash'
export default {
  name: "Main",
  data() {
    return {
      //整理出来的数据
      tableData: [],
      //初始化数据
      limit:10,
      page:1,
      //初始化是关闭的
      isShow:false,
      //控制弹框的开关
      dialogVisible:false,
      dialogTitle:'',

      //初始化一个对象
      dialogData:{}
    };
  },
  methods:{
    //checkClosed方法,检测是否开关门,用响应式设置
    checkClosed(item) {
      const closed = _.get(item, "closed", null);
      if (closed !== null) {
        return true;
      }
    },
    //改变页数
   changePage(v){
     this.page=v
   },
   //点击按钮将弹框显示
   openDialog(v){
     //默认是关闭的，点击显示
     this.dialogVisible=true
     //当点击按钮时接受到的值,将名字赋值给按钮
    this.dialogTitle = v.name
    //调用lodash里面的深拷贝来进行赋值
    this.dialogData = _.cloneDeep(v);

   },
   changeClose({_id,isClosed}){
     //当开关值改变向后端发送请求
    //初始化一个空对象
    let data = {}
    //判定开关的状态，并准备data数据
    if(isClosed){
       data = { closed: { closed: true } };
    }else{
      data = { closed: { closed: null } };
    }
    //准备好的数据准备发请求
    restaurantPost({data:data,id:_id}).then(res=>{
      //成功后将显示框打开
        this.isShow=true
        this.$message({
            message: '恭喜你,更新成功',
            type: 'success'
          })
    }).catch(err=>{
         this.$message.error('更新失败');
         console.log(err)
    }).finally(()=>{
      //然后将弹框取消
      this.isShow=false
    })
   }
  },
   created() {
    //组件刚挂载时候所发的请求
    restaurantGet()
      .then((res) => {
        //将后端返回来的请求数据灌进页面
        let oldObject = [];
        //循环遍历每个用户
        res.data.forEach((item) => {
          console.log(item)
          let obj = {};
          obj.name = item.name["zh-CN"];
          //存一份英文名字
          obj.englishName = item.name['en-US']
          obj.address = item.address["formatted"];
          obj.tags = item.tags;
          //将用户的id传进去
          obj._id = item._id;
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
.el-pagination{
  display: flex;
  justify-content: right;
  align-items: center;
  height: 100px;
}
.el-tag {
  color: #3c8984;
}
.el-table {
  font-size: 15px;
}
</style>