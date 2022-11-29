<template>
  <div>
    <!-- 转化后 -->
    <el-table border class="new-table" :data="transData">
      <el-table-column
        v-for="(item, index) in transTitle"
        :key="index"
        :label="item"
        align="center"
      >
        <template slot-scope="scope">
          <p :class="filterClass(scope.row[index])">
            {{ filterValue(scope.row[index]) }}
          </p>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      // originData 为后端原始正常的数据, 此数据按正常表格展示 一行一行的数据
      // 保证数组里每一个对象中的字段顺序, 从上到下 一次对应显示表格中的从左到右
      fakeOriginData: [],
      originData: [],
      originTitle: [
        // '二层温度', '二层负压', '八层温度'
      ], // originTitle 该标题为 正常显示的标题, 数组中的顺序就是上面数据源对象中的字段标题对应的顺序
      transTitle: [
        // '', '燃烧炉1', '燃烧炉2', '燃烧炉3', '燃烧炉4'
      ], // transTitle 该标题为转化后的标题, 注意多一列,  因为原来的标题变成了竖着显示了, 所以多一列标题, 第一个为空即可
      transData: [],
      fullscreenLoading: false
    }
  },
  created() {
    this.originTitle = []
    this.transTitle = ['火道号']
    // console.log('MY:')
    // console.log(this.tableData)
    for (var key in this.tableData['headers']) {
      this.originTitle.push(key)
    }
    for (var j = 0; j < this.tableData['dataList'].length; j++) {
      this.transTitle.push(
        // `燃烧罐-${this.tableData['dataList'][j]['explosionChamber']}`
        `${this.tableData['dataList'][j]['explosionChamber']}`
      )
    }

    for (var x = 0; x < this.tableData['dataList'].length; x++) {
      this.fakeOriginData.push(this.tableData['dataList'][x])
    }

    for (var y = 0; y < this.fakeOriginData.length; y++) {
      this.originData[y] = []
      for (var w = 0; w < this.fakeOriginData[y]['valueList'].length; w++) {
        // this.originData[y][
        //   `value${w}`
        // ] = `${this.fakeOriginData[y]['valueList'][w]['value']} ${this.fakeOriginData[y]['valueList'][w]['unit']}`
        this.originData[y][`value${w}`] = this.fakeOriginData[y]['valueList'][
          w
        ]
      }
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
  },
  methods: {
    filterValue(item) {
      if (typeof item === 'object') {
        return `${item['value']} ${item['unit']}`
      } else {
        return item
      }
    },
    filterClass(item) {
      if (typeof item === 'object') {
        if (item['warningFlag']) {
          return 'warn'
        } else {
          return 'normal'
        }
      } else {
        return 'default'
      }
    }
  }
}
</script>

<style>
.new-table {
  border: 1px solid #fff;
  margin: 10px 0;
  /* width: 200px; */
  font-size: 12px;
}
.normal {
  color: rgba(18, 207, 120, 1);
}
.warn {
  color: #fa4338;
}
.default {
  color: #333;
}
</style>
