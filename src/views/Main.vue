<template>
  <div>
    <el-table
      :data="tableData.slice((page - 1) * limit, page * limit)"
      style="width: 100%"
      v-loading="isShow"
    >
      <el-table-column prop="name" label="名称" width="335"> </el-table-column>
      <el-table-column prop="address" label="地址" width="335">
      </el-table-column>
      <el-table-column prop="address_1" label="地址" width="335">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.tags" :key="item">
            {{ item }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="operation" label="操作" width="335">
        <template slot-scope="scope">
          <el-button @click="openDialog(scope.row)"> 操作 </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="position" label="关闭状态" width="335">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isClosed"
            @change="changeClose(scope.row)"
            active-color="#3c8984"
            inactive-color="#dcdfe6"
          >
          </el-switch>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      layout="prev, pager, next"
      :total="tableData.length"
      @current-change="changePage"
      :page-size="limit"
    >
    </el-pagination>
    <!-- 分页区结束 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
      <!-- 中英文切换 -->
      <div style="margin-top: 15px">
        <el-input
          placeholder="请输入内容"
          v-model="dialogData[language]"
          class="input-with-select"
        >
          <el-select v-model="language" slot="prepend" placeholder="请选择">
            <el-option label="中文" value="name"></el-option>
            <el-option label="英文" value="englishName"></el-option>
          </el-select>
        </el-input>
      </div>
      <!-- 中英文切换结束 -->
      <!-- 点击切换按钮 -->
      <div class="tag-container">
        <el-select v-model="tags" @change="addTag" placeholder="请选择">
          <el-option
            v-for="tag in tags_1"
            :key="tag"
            :label="tag"
            :value="tag"
          />
        </el-select>
        <!-- 标签内容开始部分 -->
        <el-tag
          v-for="item in dialogData.tags"
          :key="item"
          @close="removeTags(item)"
          closable
        >
          {{ item }}
        </el-tag>
        <!-- 标签结束部分 -->
      </div>
      <el-card>
        {{ time }}
      </el-card>


      <!-- 时间标签 -->
      <div v-for="(item, index) in dialogData.time" :key="week[index]">
        <span>{{ week[index] }}</span>
        <el-time-picker
          v-model="dialogData.time[index]"
          is-range
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
        />
      </div>
      <!-- 时间结束 -->



      
      <!-- 点击按钮结束 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = determine"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { restaurantGet, restaurantPost, getTags } from "@/api/restaurant/index";
import _ from "lodash";
import moment from "moment-timezone";
import moment_1 from 'moment'
export default {
  name: "Main",
  data() {
    return {
      //整理出来的数据
      tableData: [],
      //初始化数据
      limit: 10,
      page: 1,
      //初始化是关闭的
      isShow: false,
      //控制弹框的开关
      dialogVisible: false,

      dialogTitle: "",
      //初始化一个对象
      dialogData: {},
      //默认值是中文
      language: "name",
      //初始化绑定tag值是空的
      tags: "",
      //从后端获取的tags灌进去，准备一个空数组
      tags_1: [],
      //时间数据
      time: moment()
        .locale("zh-cn")
        .tz("America/New_York")
        .format("YYYY-MM-DD HH:mm:ss dddd"),
      //初始化一个时间值
      timer: null,
      //初始化一个整理出来的时间数组
      everyWeek_2: [],
      week: [
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
        "星期日",
      ],
    };
  },
  methods: {
    //checkClosed方法,检测是否开关门,用响应式设置
    checkClosed(item) {
      const closed = _.get(item, "closed", null);
      if (closed !== null) {
        return true;
      }
    },
    
    //定义设置时间函数，整理所需要的time时间
    settime(v){
        const array = []
        _.forEach(this.week,(weekDay,index)=>{
          const start = _.get(v, `hours[${index}].start`, 0);
          const end = _.get(v, `hours[${index}].end`, 0);

          const startDate = moment_1().startOf('day').add(start, 'minutes').toDate();
          // console.log('startDate: ', startDate);
          const endDate = moment_1().startOf('day').add(end, 'minutes').toDate();
          // console.log('endDate: ', endDate);
          array.push([startDate, endDate]);
        })
      return { time : array };
    },
    //改变页数
    changePage(v) {
      this.page = v;
    },
    //点击按钮将弹框显示
    openDialog(v) {
      //默认是关闭的，点击显示
      this.dialogVisible = true;
      //当点击按钮时接受到的值,将名字赋值给按钮
      this.dialogTitle = v.name;
      //剩余模式将重置的对象合并参数
      let obj_2 = Object.assign(v,this.settime(v))
      console.log('obj_2: ', obj_2);
      //调用lodash里面的深拷贝来进行赋值
      this.dialogData = _.cloneDeep(obj_2);
    },
    determine() {
      //当用户点击了确定按钮时候关闭弹框
      this.dialogVisible = false;
      //发请求更新数据
    },
    changeClose({ _id, isClosed }) {
      //当开关值改变向后端发送请求
      //初始化一个空对象
      let data = {};
      //判定开关的状态，并准备data数据
      if (isClosed) {
        data = { closed: { closed: true } };
      } else {
        data = { closed: null };
      }
      //准备好的数据准备发请求
      restaurantPost({ data: data, id: _id })
        .then(() => {
          //成功后将显示框打开
          this.isShow = true;
          //返回一个promise对象
          return restaurantGet();
        })
        .then((res) => {
          //重新更新页面开始
          //将后端返回来的请求数据灌进页面
          let oldObject = [];
          //循环遍历每个用户
          res.data.forEach((item) => {
            //准备一个空数组，将整理来的数据灌进去
            let obj = {};
            obj.name = item.name["zh-CN"];
            //存一份英文名字
            obj.englishName = item.name["en-US"];
            obj.address = item.address["formatted"];
            obj.tags = item.tags;
            //将用户的id传进去
            obj._id = item._id;
            //循环遍历每个函数，调用检查开关门函数
            obj.isClosed = this.checkClosed(item);
            oldObject.push(obj);
          });
          this.tableData = oldObject;
          //重新更新页面结束
          this.$message({
            message: "恭喜你,更新成功",
            type: "success",
          });
        })
        .catch((err) => {
          this.$message.error("更新失败");
        })
        .finally(() => {
          //然后将弹框取消
          this.isShow = false;
        });
    },
    //添加按钮
    addTag() {
      //判断数组是否有这个元素
      if (this.dialogData.tags.indexOf(this.tags) == -1) {
        //将只有不存在的元素添加到tags里面
        this.dialogData.tags.push(this.tags);
      }
    },
    //移除标签
    removeTags(item) {
      //接受到收到的item标签值
      let index = this.dialogData.tags.indexOf(item);
      this.dialogData.tags.splice(index, 1);
    },
    //定义一个秒钟走动函数
    startTime() {
      this.timer = setInterval(() => {
        this.time = moment()
          .locale("zh-cn")
          .tz("America/New_York")
          .format("YYYY-MM-DD HH:mm:ss dddd");
      }, 1000);
    },
  },
  created() {
    //组件刚挂载时候所发的请求
    restaurantGet()
      .then((res) => {
        //将后端返回来的请求数据灌进页面
        let oldObject = [];
        //循环遍历每个用户
        res.data.forEach((item) => {
          let obj = {};
          obj.name = item.name["zh-CN"];
          //存一份英文名字
          obj.englishName = item.name["en-US"];
          obj.address = item.address["formatted"];
          obj.tags = item.tags;
          //将时间灌进去
          obj.hours = item.hours;
          //将用户的id传进去
          obj._id = item._id;
          //循环遍历每个函数，调用检查开关门函数
          obj.isClosed = this.checkClosed(item);
          oldObject.push(obj);
        });
        this.tableData = oldObject;
      })
      .catch((err) => {
        console.log(err);
      });
    //发送请求获取tags内容
    getTags().then((res) => {
      //将数据灌进去
      this.tags_1 = res.data;
    });
    //调用时间函数，每隔一秒调用
    this.startTime();
  },
  //组件销毁之前销毁定时器
  beforeDestroy() {
    //清除定时器,如果有则清除
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
};
</script>

<style scoped>
.el-pagination {
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