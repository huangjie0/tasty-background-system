<template>
  <div>
    <el-date-picker
      v-model="value1"
      type="datetimerange"
      align="right"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
    >
    </el-date-picker>
    <div ref="main" style="width:900px; height: 400px"></div>
    <div ref="main_1" style="width: 600px; height: 400px"></div>
  </div>
</template>

<script>
//导入发请求数据模块
import { orderGet } from "@/api/order/index";
import Moment from "moment";
import { extendMoment } from 'moment-range'
import _ from 'lodash'
const moment = extendMoment(Moment)
export default {
  name: "Order",
  data() {
    return {
      //报表的数据准备
      //折现图实现
      option: {
        xAxis: {
            type: 'category',
            data: this.days_1,
        },
        yAxis: {
            type: 'value'
        },
        tooltip: {
            trigger: 'axis'
        },
        series: [
            {
                data: this.countArray_1,
                type: 'line'
            }
        ]
    },
      //饼状图实现
      option_1: {
        title: {
          text: "Referer of a Website",
          subtext: "Fake Data",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: "50%",
            data: [
              { value: 1048, name: "Search Engine" },
              { value: 735, name: "Direct" },
              { value: 580, name: "Email" },
              { value: 484, name: "Union Ads" },
              { value: 300, name: "Video Ads" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      },
      //定义开始时间
      start: "",
      //定义结束时间
      end: "",
      value1: "",
      days_1:[],
      countArray_1:[],
    };
  },
  methods: {
    //绘制图表方法
    drawChart() {
      //获取元素
      let myChart = this.$echarts.init(this.$refs.main);
      let myChart_1 = this.$echarts.init(this.$refs.main_1);
      // 将数据放入容器内
      myChart.setOption(this.option);
      myChart_1.setOption(this.option_1);
    },
    //发请求模块
    getChart(start, end) {
      //在创建时候发请求
      orderGet(start, end)
        .then((res) => {
        let startTime= moment(start).format('YYYY-MM-DD');
        let endTime= moment(end).format('YYYY-MM-DD');
        let range = moment.range(startTime,endTime);
        let days = Array.from(range.by('days'));
        days = days.map(m => m.format('YYYY-MM-DD'))

        this.days_1 = days
        //重组数据
        let result = _.map(res.data,(item)=>{
            item.time = moment(item.createdAt).format('YYYY-MM-DD');
            return item
        })
        result = _.groupBy(result,'time');
        let countArray = [];
        days.forEach((item)=>{
            //  如果有单，则放入几单
            if(result[item]){
                countArray.push(result[item].length)
            }else{
                //  如果没有，则是0
                countArray.push(0)
            }
        })
          this.countArray_1= countArray
         })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  updated() {
    //当页面数据发生改变所获取最新的数据来供发请求
    this.start = moment(this.value1[0]).toISOString();
    this.end = moment(this.value1[1]).toISOString();
    this.getChart(this.start, this.end);
    this.drawChart();
  },
};
</script>

<style scoped>
</style>

