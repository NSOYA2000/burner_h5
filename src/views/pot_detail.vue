<template>
  <div class="common-div">
    <div class="btn_array">
      <div
        v-for="(item, index) in typeList"
        :key="index"
        class="btn"
        :class="{ active_btn: activeIndex == index }"
        @click="selectItem(item, index)"
      >
        {{ item.title }}
      </div>
    </div>
    <!-- 燃烧罐图表 -->
    <div id="pot_chart" class="pot_chart"></div>
    <div class="btn_array">
      <div
        v-for="(item, index) in dateLabelList"
        :key="index"
        class="btn"
        :class="{ active_btn: labelactiveIndex == index }"
        @click="selectLabelItem(item, index)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { getChartData } from '@/api/user'
export default {
  data() {
    return {
      activeIndex: 0,
      labelactiveIndex: 1,
      resizeTimer: null,
      myChart: null,
      typeList: [],
      type: null,
      dateLabelList: [
        {
          name: '1h',
          value: 'Recent1h'
        },
        {
          name: '12h',
          value: 'Recent12h'
        },
        {
          name: '24h',
          value: 'Recent24h'
        },
        {
          name: '1week',
          value: 'Recent1week'
        }
      ],
      dateLabel: 'Recent12h',
      params: {}
    }
  },
  created() {
    this.params = this.$route.params.params
    var valueList = this.params['valueList']
    for (var i = 0; i < valueList.length; i++) {
      this.typeList.push(valueList[i])
    }
    this.type = this.typeList[0]['type']
    this.getChartDataFun()
  },
  mounted() {
    // this.initBar()
    const _this = this
    window.addEventListener('resize', function() {
      if (_this.resizeTimer) clearTimeout(_this.resizeTimer)
      _this.resizeTimer = setTimeout(function() {
        _this.myChart.resize()
      }, 100)
    })
  },
  methods: {
    selectItem(item, index) {
      this.activeIndex = index
      this.type = item['type']
      this.getChartDataFun()
    },
    selectLabelItem(item, index) {
      this.labelactiveIndex = index
      this.dateLabel = item.value
      this.getChartDataFun()
    },
    // 初始化图表
    initBar(xData, ydata) {
      const myChart = echarts.init(document.getElementById('pot_chart'))
      this.myChart = myChart
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          position: function(pt) {
            return [pt[0], '10%']
          }
        },
        title: {
          left: 'center'
          // text: '历史数据'
        },
        // toolbox: {
        //   feature: {
        //     dataZoom: {
        //       yAxisIndex: 'none'
        //     },
        //     restore: {},
        //     saveAsImage: {}
        //   }
        // },
        xAxis: {
          type: 'time',
          boundaryGap: false
        },
        yAxis: {
          type: 'value'
          // boundaryGap: [0, '100%']
        },
        grid: {
          left: '50px'
          // right: '10%',
          // bottom: '10%',
          // top: '30px'
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 20
          },
          {
            start: 0,
            end: 20
          }
        ],
        series: [
          {
            name: this.type,
            type: 'line',
            smooth: true,
            symbol: 'none',
            areaStyle: {},
            data: ydata
          }
        ]
        // color: ['#1e71e3']
      })
    },
    // 获取list
    getChartDataFun() {
      this.showFullScreenLoading()
      var params = {
        companyCode: this.params.companyCode,
        furncaeNum: this.params.furncaeNum,
        chamberNum: this.params.explosionChamber,
        dateLabel: this.dateLabel,
        type: this.type
      }
      getChartData(params)
        .then(res => {
          this.closeFullScreenLoading()
          if (res['success']) {
            var xData = res['data']['xdata']
            var ydata = []
            for (var i = 0; i < res['data']['ydata'].length; i++) {
              // ydata.push(res['data']['ydata'][i]['value'])
              ydata.push([
                Date.parse(res['data']['ydata'][i]['dateTime']),
                res['data']['ydata'][i]['value']
              ])
            }
            this.initBar(xData, ydata)
          } else {
            this.$message.error(res['message'])
          }
        })
        .catch(() => {
          this.closeFullScreenLoading()
        })
    },
    // loading显示函数
    showFullScreenLoading(time = 10000) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.fullscreenLoading = loading
      setTimeout(() => {
        loading.close()
      }, time)
    },
    // loading关闭函数
    closeFullScreenLoading() {
      this.fullscreenLoading.close()
    }
  }
}
</script>

<style lang="scss" scoped>
.common-div {
  padding: 20px;
  .btn_array {
    margin: 27px auto;
    display: flex;
    justify-content: space-between;
    .btn {
      border: 1px solid #1e71e3;
      opacity: 1;
      border-radius: 4px;
      font-size: 14px;
      color: #1e71e3;
      padding: 10px 20px;
    }
    .active_btn {
      background: #1e71e3;
      color: #fff !important;
    }
  }
  .pot_chart {
    width: 100%;
    height: 300px;
    background: #353535;
  }
}
</style>
