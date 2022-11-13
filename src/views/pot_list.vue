<template>
  <div class="common-div">
    <div class="pot_list">
      <div
        v-for="(item, index) in pot_list"
        :key="index"
        class="pot_list_item"
        :class="{ active_item: activeIndex == index }"
        @click="gotoPotDeatil(item, index)"
      >
        <div class="pot_list_item_circle">
          <span>{{ index }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getChamberList } from '@/api/user'
export default {
  data() {
    return {
      fullscreenLoading: false,
      pot_list: [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ],
      activeIndex: 5
    }
  },
  created() {
    this.getChamberListFun()
  },
  methods: {
    gotoPotDeatil(item, index) {
      this.$router.push({
        path: '/potdetail'
      })
    },
    // 获取list
    getChamberListFun() {
      this.showFullScreenLoading()
      var params = {
        companyCode: '001',
        furncaeNum: '1'
      }
      getChamberList(params)
        .then(res => {
          console.log(res)
          this.closeFullScreenLoading()
          if (res['success']) {
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
  .pot_list {
    display: flex;
    flex-wrap: wrap;
    .pot_list_item {
      display: flex;
      margin-right: 18px;
      margin-bottom: 18px;
      width: 70px;
      height: 70px;
      background: #242424;
      border: 1px solid rgba(255, 255, 255, 0.05);
      opacity: 1;
      border-radius: 4px;
      &:nth-child(4n) {
        margin-right: 0px;
      }
      .pot_list_item_circle {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 17px auto;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #1c1c1c;
        span {
          font-size: 18px;
          color: #fff;
        }
      }
    }
  }
}
.active_item {
  border: 1px solid #f9433d !important;
  .pot_list_item_circle {
    background: #f9433d !important;
  }
}
</style>
