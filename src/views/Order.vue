<template>
  <div>
    <el-date-picker
      v-model="value1"
      type="datetimerange"
      align="right"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :default-time="['12:00:00', '08:00:00']">
    </el-date-picker>
    <div ref="main" style="width: 600px; height: 400px"></div>
    <div ref="main_1" style="width: 600px; height: 400px"></div>
  </div>
</template>

<script>
//导入发请求数据模块
import {orderGet} from '@/api/order/index'
import moment from 'moment'
export default {
    name:'Order',
    data() {
      return {
      //报表的数据准备
      option : {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      },
       option_1 : {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      },
      //定义开始时间
      start:"",
      //定义结束时间
      end:"",
      value1:'',
      }
    },
    methods:{
      //绘制图表方法
       drawChart(){
         //获取元素
        let myChart = this.$echarts.init(this.$refs.main);
        let myChart_1 = this.$echarts.init(this.$refs.main_1);
        // 将数据放入容器内
        myChart.setOption(this.option);
        myChart_1.setOption(this.option_1);
       },
       //发请求模块
       getChart(start,end){
        //在创建时候发请求
        orderGet(start,end).then(res=>{
          console.log(res)
        }).catch(err=>{
          console.log(err)
        })
       }
    },
    mounted(){
      //当组件挂载时候执行的函数
      this.drawChart()
    },
    updated(){
      //当页面数据发生改变所获取最新的数据来供发请求
      this.start =moment(this.value1[0]).toISOString();
      this.end = moment(this.value1[1]).toISOString() 
      this.getChart(this.start,this.end)
    }
}
</script>

<style scoped>
</style>

