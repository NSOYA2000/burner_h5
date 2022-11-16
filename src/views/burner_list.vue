<template>
  <div class="common-div">
    <div class="burner_list">
      <div v-for="(item, index) in burner_list" :key="index">
        <div
          class="burner_list_item"
          :class="{ active_item: activeIndex == index }"
          @click="collapse(item, index)"
        >
          <div class="burner_list_item_left">
            <div class="fire">
              <template v-if="activeIndex == index">
                <img src="@/assets/fire_un.png" alt="" />
              </template>
              <template v-else>
                <img src="@/assets/fire.png" alt="" />
              </template>
            </div>
            <div class="value">
              <span class="name">燃烧炉--{{ item["furncaeNum"] }}</span>
              <!-- <p class="dec">
                均温: 1800℃
                <span>{{ activeIndex == index ? "异常" : "正常" }}</span>
              </p> -->
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
                @click="gotoPotList(item, index)"
              >查看详情</el-button>
            </div>
          </div>
        </Collapse>
      </div>
    </div>
  </div>
</template>

<script>
import { getFurncaeList } from '@/api/user'
import Collapse from '@/utils/collapse.js'
import { removeToken } from '@/utils/auth'
export default {
  components: {
    Collapse
  },
  data() {
    return {
      fullscreenLoading: false,
      burner_list: [],
      activeIndex: 3
    }
  },
  created() {
    this.getFurncaeListFun()
  },
  methods: {
    gotoPotList(item, index) {
      this.$router.push({
        path: '/potlist',
        query: {
          companyCode: this.$route.query.companyCode,
          furncaeNum: item['furncaeNum']
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
    // 获取燃烧炉list
    getFurncaeListFun() {
      this.showFullScreenLoading()
      var params = {
        companyCode: this.$route.query.companyCode
      }
      getFurncaeList(params)
        .then(res => {
          console.log(res)
          this.closeFullScreenLoading()
          if (res['success']) {
            this.burner_list = res['data']['dataList']
          } else {
            this.$message.error(res['message'])
          }
        })
        .catch(() => {
          this.closeFullScreenLoading()
          this.logout()
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
    },
    logout() {
      console.warn('注销')
      removeToken()
      setTimeout(() => {
        this.$router.push({
          path: '/login'
        })
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.burner_list {
  padding: 20px;
  .burner_list_item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #242424;
    border: 1px solid rgba(255, 255, 255, 0.05);
    opacity: 1;
    border-radius: 4px;
    padding: 14px;
    margin-bottom: 14px;
    .burner_list_item_left {
      display: flex;
      align-items: center;
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
  min-height: 300px;
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
