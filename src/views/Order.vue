<template>
  <div>
    <el-time-picker
      is-range
      v-model="value1"
      range-separator="至"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
      placeholder="选择时间范围"
    >
    </el-time-picker>
    <div ref="main" style="width: 600px; height: 400px"></div>
  </div>
</template>

<script>
//导入发请求数据模块
import {orderGet} from '@/api/order/index'
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
      value1: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
      }
    },
    methods:{
      //绘制图表方法
       drawChart(){
         //获取元素
        let myChart = this.$echarts.init(this.$refs.main);
        // 将数据放入容器内
        myChart.setOption(this.option);
       },
       //发请求模块
       getChart(){
        let start='2020-10-29T08:28:34.125Z'
        let end = '2020-11-05T08:28:34.125Z'
        //在创建时候发请求
        orderGet(start,end).then(res=>{
          console.log(res)
        }).catch(err=>{
          console.log(err)
        })
       }
    },
    mounted(){
      this.drawChart()
      this.getChart()
    },
}
</script>

<style scoped>
</style>

