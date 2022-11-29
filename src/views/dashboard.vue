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
      width: 50%;
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
