<template>
  <div class="common-div">
    <div class="pot_list">
      <div v-for="(item, index) in pot_list" :key="index">
        <div class="pot_list_item" @click="collapse(item, index)">
          <div class="pot_list_item_left">
            <div class="pot_list_item_circle"></div>
            <div class="value">
              <span class="name">燃烧罐--{{ item["explosionChamber"] }}</span>
            </div>
          </div>
          <span class="move">
            <img v-if="item.iscollapse" src="@/assets/down.png" alt="" />
            <img v-else src="@/assets/right.png" alt="" />
          </span>
        </div>

        <Collapse>
          <div v-show="item.iscollapse" class="container">
            <div class="collapse-content">
              <div class="collapse-content-box">
                <div
                  v-for="(opt, idx) in item['valueList']"
                  :key="idx"
                  class="ct"
                >
                  <span class="title">{{ opt.title }}</span>
                  <span
                    class="value"
                    :class="[opt.warningFlag ? 'warn' : 'normal']"
                  >{{ opt.value }} {{ opt.unit }}</span>
                </div>
              </div>

              <el-button
                type="success"
                class="detail-btn"
                @click="gotoPotDeatil(item, index)"
              >查看历史记录</el-button>
            </div>
          </div>
        </Collapse>
      </div>
    </div>
  </div>
</template>

<script>
import { getChamberList } from '@/api/user'
import Collapse from '@/utils/collapse.js'
export default {
  components: {
    Collapse
  },
  data() {
    return {
      fullscreenLoading: false,
      pot_list: [],
      activeIndex: 5
    }
  },
  created() {
    this.getChamberListFun()
  },
  methods: {
    gotoPotDeatil(item, index) {
      this.$router.push({
        name: 'potdetail',
        params: {
          params: item
        }
      })
    },
    collapse(item, index) {
      if (item.iscollapse == true) {
        this.$set(item, 'iscollapse', false)
      } else {
        this.$set(item, 'iscollapse', true)
      }
    },
    // 获取list
    getChamberListFun() {
      this.showFullScreenLoading()
      var params = {
        companyCode: this.$route.query.companyCode,
        furncaeNum: this.$route.query.furncaeNum
      }
      getChamberList(params)
        .then(res => {
          this.closeFullScreenLoading()
          if (res['success']) {
            this.pot_list = res['data']['dataList']
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
.pot_list {
  padding: 20px;
  .pot_list_item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #242424;
    border: 1px solid rgba(255, 255, 255, 0.05);
    opacity: 1;
    border-radius: 4px;
    padding: 14px;
    margin-bottom: 14px;
    .pot_list_item_left {
      display: flex;
      align-items: center;
      .pot_list_item_circle {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0px 20px 0 0;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #f9433d;
        span {
          font-size: 18px;
          color: #fff;
        }
      }
      .fire {
        flex-grow: 0;
        width: 36px;
        margin-right: 10px;
        height: 36px;
        border-radius: 50%;
        background: rgba(28, 28, 28, 1);
        padding: 8px 10px;
        img {
          display: block;
          width: 100%;
        }
      }
      .value {
        .name {
          font-size: 16px;
          color: white;
        }
        .dec {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          margin: 5px 0;
          span {
            color: rgba(18, 207, 120, 1);
          }
        }
      }
    }

    .move {
      width: 24px;
      img {
        display: block;
        width: 100%;
      }
    }
  }
}
.active_item {
  border: 1px solid #fa4338 !important;
  .value {
    .dec {
      span {
        color: #fa4338 !important;
      }
    }
  }
}

.collapse-content {
  background: #333;
  min-height: 100px;
  margin-bottom: 5px;
  padding: 15px 0 15px 0;
  .collapse-content-box {
    display: flex;
    flex-wrap: wrap;
    .ct {
      display: flex;
      flex-direction: column;
      color: #fff;
      width: 32%;
      // background: orange;
      align-items: center;
      justify-content: center;
      margin-bottom: 30px;
      .title {
        font-size: 13px;
        margin-bottom: 10px;
      }
    }
  }
  .detail-btn {
    display: block;
    width: 90%;
    margin: 0 auto;
  }
}
.normal {
  color: rgba(18, 207, 120, 1);
}
.warn {
  color: #fa4338;
}
</style>
