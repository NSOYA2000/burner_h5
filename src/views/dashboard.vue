<template>
  <div class="dashboard">
    <el-row :gutter="50">
      <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8" class="dashboard-item">
        <p class="title">总览</p>
        <div class="furncae-data">
          <div
            v-for="(item, index) in furncaeData"
            :key="index"
            class="furncae-data-item"
          >
            <span class="furncae-title">{{ item["title"] }}:</span>
            <span
              class="furncae-value"
              :class="[item['warningFlag'] ? 'warn' : 'normal']"
            >{{ item["value"] }} {{ item["unit"] }}</span>
          </div>
        </div></el-col>
      <el-col
        v-for="(item, index) in bigArray"
        :key="index"
        :xs="24"
        :sm="12"
        :md="12"
        :lg="8"
        :xl="8"
        class="dashboard-item"
      >
        <p class="title">第{{ index + 1 }}组</p>
        <DashboardTable
          :table-data="item"
        /></el-col>
    </el-row>
  </div>
</template>

<script>
import { getChamberList } from '@/api/user'
import DashboardTable from './dashboard_table.vue'

export default {
  components: {
    DashboardTable
  },
  data() {
    return {
      // originData 为后端原始正常的数据, 此数据按正常表格展示 一行一行的数据
      // 保证数组里每一个对象中的字段顺序, 从上到下 一次对应显示表格中的从左到右
      originData: [
        {
          type: '1001',
          num: '1307',
          average: '1154'
        },
        {
          type: '填空题',
          num: '5题',
          average: '3分/题'
        },
        {
          type: '选择题',
          num: '2题',
          average: '10分/题'
        }
      ],
      originTitle: ['二层温度', '二层负压', '八层温度'], // originTitle 该标题为 正常显示的标题, 数组中的顺序就是上面数据源对象中的字段标题对应的顺序
      transTitle: ['', '锅炉1', '学生2', '学生3'], // transTitle 该标题为转化后的标题, 注意多一列,  因为原来的标题变成了竖着显示了, 所以多一列标题, 第一个为空即可
      transData: [],
      fullscreenLoading: false,
      bigArray: [],
      furncaeData: []
    }
  },
  created() {
    this.getChamberListFun()
  },
  methods: {
    // 获取list
    getChamberListFun() {
      this.bigArray = []
      this.showFullScreenLoading()
      var params = {
        companyCode: this.$route.query.companyCode,
        furncaeNum: this.$route.query.furncaeNum,
        showFurncaeData: true
      }
      getChamberList(params)
        .then(res => {
          this.closeFullScreenLoading()
          if (res['success']) {
            // console.error(res)
            var data = res['data']
            this.furncaeData = data['furncaeData']['valueList']
            var fengeArray = this.fenge(data['dataList'], 4)
            console.log(fengeArray)
            for (var i = 0; i < fengeArray.length; i++) {
              this.bigArray.push({
                headers: res['data']['headers'],
                dataList: fengeArray[i]
              })
            }
            console.error(this.bigArray)
          } else {
            this.$message.error(res['message'])
          }
        })
        .catch(() => {
          this.closeFullScreenLoading()
        })
    },

    // 分割数组
    fenge(arr, N) {
      var result = []
      for (var i = 0; i < arr.length; i += N) {
        result.push(arr.slice(i, i + N))
      }
      return result
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
.dashboard {
  padding: 0 20px;
  .dashboard-item {
    // border: 1px solid #fff;
    .title {
      font-size: 20px;
      text-align: center;
      font-weight: bold;
      color: #fff;
    }
  }
  .el-row {
    margin: 0 !important;
  }
}
.furncae-data {
  height: 268px;
  background: #fff;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  .furncae-data-item {
    display: flex;
    width: 50%;
    font-size: 14px;
    color: #333;
    .furncae-title {
      display: block;
      width: 45%;
    }
  }
}
.normal {
  color: rgba(18, 207, 120, 1);
}
.warn {
  color: #fa4338;
}
@media screen and (max-width: 768px) {
  .dashboard {
    padding: 0 0;
    .dashboard-item {
      padding: 0 !important;
      margin-bottom: 20px;
    }
  }
}
</style>
