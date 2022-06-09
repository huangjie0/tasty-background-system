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
        <el-tag v-for="item in dialogData.tags" :key="item" @close="removeTags(item)" closable>
          {{item}}
        </el-tag>
        <!-- 标签结束部分 -->
      </div>
      <el-card>
        {{time}}
      </el-card>
      <!-- 时间标签 -->
      <div v-for="item in weeks" :key="item.weekDay">
        {{item.weekDay}}
        <el-time-picker
        is-range
        v-model="item.value1"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        placeholder="选择时间范围"
        arrow-control
        >
        </el-time-picker>
      </div>
      <!-- 时间结束 -->
      <!-- 点击按钮结束 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = determine"
          >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { restaurantGet, restaurantPost, getTags } from "@/api/restaurant/index";
import _ from "lodash";
import moment from 'moment-timezone';
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
      tags_1:[],
      //时间数据
      time:moment().locale('zh-cn').tz('America/New_York').format('YYYY-MM-DD HH:mm:ss dddd'),
      //初始化一个时间值
      timer: null,
      //初始化钟表时间值
      weeks:[{
        weekDay:'星期一',
         //初始化一个时间值
        value1: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
      },
        {
          weekDay:'星期二',
         //初始化一个时间值
          value1: [new Date(2015, 9, 10, 8, 40), new Date(2015, 9, 10, 9, 40)],
        },{
          weekDay:'星期三',
         //初始化一个时间值
          value1: [new Date(2017, 9, 10, 8, 40), new Date(2017, 9, 10, 9, 40)],
        },
        {
           weekDay:'星期四',
         //初始化一个时间值
          value1: [new Date(2018, 9, 10, 8, 40), new Date(2018, 9, 10, 9, 40)],
        },
        {
           weekDay:'星期五',
         //初始化一个时间值
          value1: [new Date(2019, 9, 10, 8, 40), new Date(2019, 9, 10, 9, 40)],
        },
        {
           weekDay:'星期六',
         //初始化一个时间值
          value1: [new Date(2012, 9, 10, 8, 40), new Date(2012, 9, 10, 9, 40)],
        },
        {
          weekDay:'星期日',
         //初始化一个时间值
          value1: [new Date(2011, 9, 10, 8, 40), new Date(2011, 9, 10, 9, 40)],
        }
      ],
      //默认星期
      defaultWeek: [new Date(0, 0, 0, 0, 0), new Date(0, 0, 0, 0, 0)]
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
    //改变页数
    changePage(v) {
      this.page = v;
    },
    //点击按钮将弹框显示
    openDialog(v) {
      console.log(v)
      // ------------------------重组数据开始----------------------------
       //获取当前时间
      // const m = moment.tz("America/New_York");

      // console.log(m)
      //获取纽约时间的分钟数
      // const mins = m.hours() * 60 + m.minute();

      // console.log(mins)
       //获取当前是周几
      // const dayOfWeek = m.isoWeekday() - 1;

      //准备空数组，专门接受所遍历的开始和结束的值和所需要时间值
      let everyWeek = []
 
      if(v.hours){
        v.hours.forEach(item=>{
          //准备一个空对象，收集好遍历每一个元素集合--------------------------------------
          let everyWeek = {}
          //收集每一个开始时间
          if(item.start){
            //如果有往里面灌数据
            everyWeek.start = item.start
          }else{
            //如果没有则使用默认值为0
            everyWeek.start = 0
          }
           //准备一个空对象，收集好遍历每一个元素集合--------------------------------------

           //收集好每一个结束时间-----------------------------------------
           if(item.end){
             everyWeek.end = item.end
           }else{
             everyWeek.end = 0
           }
           //收集好每一个结束时间-----------------------------------------
          if(item.dayOfWeek){
            everyWeek.dayOfWeek = item.dayOfWeek
          }else{
            // everyWeek.dayOfWeek = 
          }

          //收集好每一个支付方式---------------------------------------------
          if(item.type){
            everyWeek.type = item.type
          }else{
            //默认的是支付宝形式
            everyWeek.type='delivery'
          }
          //将收集好的集合灌到准备好的everyWeek数据中
          this.everyWeek.push(everyWeek)
        })
      }

      


      //默认是关闭的，点击显示
      this.dialogVisible = true;
      //当点击按钮时接受到的值,将名字赋值给按钮
      this.dialogTitle = v.name;
      //调用lodash里面的深拷贝来进行赋值
      this.dialogData = _.cloneDeep(v);
    },
    determine(){
      //当用户点击了确定按钮时候关闭弹框
      this.dialogVisible=false;

    },
    changeClose({_id,isClosed }){
      //当开关值改变向后端发送请求
      //初始化一个空对象
      let data = {};
      //判定开关的状态，并准备data数据
      if(isClosed) {
        data = {closed:{closed:true}};
      } else {
        data = {closed:null};
      }
      //准备好的数据准备发请求
      restaurantPost({ data: data, id: _id})
        .then(() => {
          //成功后将显示框打开
          this.isShow = true;
          //返回一个promise对象
          return restaurantGet()
        }).then(res=>{
          //重新更新页面开始
            //将后端返回来的请求数据灌进页面
            let oldObject = [];
            //循环遍历每个用户
            res.data.forEach((item) => {
              //准备一个空数组，将整理来的数据灌进去
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
            //重新更新页面结束
            this.$message({
              message: "恭喜你,更新成功",
              type: "success",
            })
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
    addTag(){
      //判断数组是否有这个元素
      if (this.dialogData.tags.indexOf(this.tags) == -1) {
        //将只有不存在的元素添加到tags里面
        this.dialogData.tags.push(this.tags)
      }
    },
    //移除标签
    removeTags(item){
      //接受到收到的item标签值
      let index = this.dialogData.tags.indexOf(item)
      this.dialogData.tags.splice(index, 1);
    },
    //定义一个秒钟走动函数
    startTime() {
    this.timer = setInterval(() => {
      this.time = moment().locale('zh-cn').tz('America/New_York').format('YYYY-MM-DD HH:mm:ss dddd');
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
          obj.hours = item.hours
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
      this.tags_1=res.data
    });
    //调用时间函数，每隔一秒调用
    this.startTime()
  },
  //组件销毁之前销毁定时器
  beforeDestroy(){
    //清除定时器,如果有则清除
    if(this.timer){
      clearInterval(this.timer)
    }
  }
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