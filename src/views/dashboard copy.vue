<template>
  <div>
    <!-- 转化后 -->
    <!-- <el-table border style="margin-top: 50px;" :data="transData">
      <el-table-column
        v-for="(item, index) in transTitle"
        :key="index"
        :label="item"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row[index] }}
        </template>
      </el-table-column>
    </el-table> -->
    <DashboardTable />
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
      fullscreenLoading: false
    }
  },
  created() {
    this.getChamberListFun()
  },
  methods: {
    // 获取list
    getChamberListFun() {
      this.transTitle = ['']
      this.originTitle = []
      // this.originData = []
      this.showFullScreenLoading()
      var params = {
        companyCode: this.$route.query.companyCode,
        furncaeNum: this.$route.query.furncaeNum
      }
      getChamberList(params)
        .then(res => {
          this.closeFullScreenLoading()
          if (res['success']) {
            console.error(res)
            var data = res['data']
            for (var key in data['headers']) {
              this.originTitle.push(key)
            }
            for (var i = 0; i < data['dataList'].length; i++) {
              this.transTitle.push(
                `燃烧罐-${data['dataList'][i]['explosionChamber']}`
              )
            }

            // 数组按矩阵思路, 变成转置矩阵
            const matrixData = this.originData.map((row, i) => {
              const arr = []
              for (const key in row) {
                arr.push(row[key])
              }
              return arr
            })
            // 加入标题拼接最终的数据
            this.transData = matrixData[0].map((col, i) => {
              return [
                this.originTitle[i],
                ...matrixData.map(row => {
                  return row[i]
                })
              ]
            })
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

<style></style>
