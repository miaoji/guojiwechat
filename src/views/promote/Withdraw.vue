<template>
  <div class="withdraw">
    <div class="withdraw-container">
        <div class="list">
          <div class="tools">
            <section>
              筛选
            </section>
            <section @click.stop="handleDatePicker">
              <img class="datetimepicker" src="../../assets/images/promote/datetimepicker.png"></img>
            </section>
          </div>
          <div v-show="isNoData">
            <p class="no-data">
              暂未产生收益~
            </p>
          </div>
          <scroller
            :on-refresh="refresh"
            :on-infinite="infinite"
            noDataText=""
            ref="earning-scroller"
            class="earning-scroller">
            <mj-spinner type="line" slot="refresh-spinner"></mj-spinner>
            <div class="content" v-for="(value, key, index) in incomeList">
              <p class="time">
                {{key}}
              </p>
              <group label-align="left">
                <cell
                  v-for="(iitem, index) in value" :key="index"
                  title=""
                  :value="iitem.cash"
                  @click.native="goDetailPage(iitem)"
                  link=""
                  is-link
                >
                  <template slot="title">
                    <div class="earningitem">
                      <span>提现到{{iitem.type | withdrawtype}}-by {{iitem.trueName}}</span>
                      <span class="time">{{iitem.day}}</span>
                    </div>
                  </template>
                  <template slot="default">
                    <span>￥{{iitem.cash / 100}}</span>
                  </template>
                </cell>
              </group>
            </div>
            <mj-spinner type="circle" slot="infinite-spinner"></mj-spinner>
          </scroller>
        </div>
    </div>
  </div>
</template>

<script>
import { getWithdrawList } from '@/services/promote'
import { format } from '@/utils/time'

export default {
  name: 'withdraw',
  data () {
    return {
      spreadUserId: 0,
      incomeList: null,
      page: 1
    }
  },
  async created () {
    const {spreadUserId} = this.$route.query
    this.spreadUserId = spreadUserId
    await this.initData()
  },
  computed: {
    isNoData () {
      try {
        let len = 0
        Object.keys(this.incomeList).forEach(key => {
          len++
        })
        return (len === 0)
      } catch (e) {
        return true
      }
    }
  },
  methods: {
    initData () {
      this.page = 1
      this.setData({
        page: this.page,
        endDate: '2018-01-31'
      })
    },
    async setData ({page, rows = 15, startDate = '2017-01-01', endDate}) {
      try {
        const res = await getWithdrawList({
          startDate,
          endDate,
          page,
          rows,
          spreadUserId: this.spreadUserId
        })
        if (res.success && res.code === 200) {
          const data = res.obj
          this.reduceData(data)
        }
      } catch (err) {
        console.error(err)
      }
    },
    reduceData (data) {
      if (!Array.isArray(data)) {
        return
      }
      const len = data.length
      this.incomeList = {}
      for (let i = 0; i < len; i++) {
        let item = data[i]
        const date = new Date(item['createTime'])
        const yearMonth = format('yyyy-MM', date)
        const monthDay = format('MM-dd', date)
        if (!this.incomeList[yearMonth]) {
          this.incomeList[yearMonth] = []
        }
        item.day = monthDay
        this.incomeList[yearMonth].push(item)
      }
    },
    refresh (done) {
      this.incomeList = null
      this.initData()
      setTimeout(function () {
        done(true)
      }, 1000)
    },
    infinite (done) {
      this.page = this.page + 1
      this.setData({
        page: this.page,
        endDate: '2018-01-31'
      })
      setTimeout(function () {
        done(true)
      }, 1200)
    },
    goDetailPage (query) {
      this.$router.push({
        path: `/promote/withdraw/${query.id}`,
        query
      })
    },
    handleDatePicker () {
      this.$vux.datetime.show({
        cancelText: '取消',
        confirmText: '确定',
        format: 'YYYY-MM',
        value: '2017-12',
        minYear: 2017,
        maxYear: 2018,
        onConfirm (val) {
          console.log('plugin confirm', val)
        },
        onShow () {
          console.log('plugin show')
        },
        onHide () {
          console.log('plugin hide')
        }
      })
    }
  },
  watch: {
  },
  beforeDestroy () {
    this.$vux.datetime.hide()
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/styles/helpers.less';
@import '../../assets/styles/colors.less';

.withdraw {
  &-container {
    .list {
      .tools {
        .flex;
        position: relative;
        z-index: 3;
        background: white;
        padding: 10px 15px;
        justify-content: space-between;
        section {
          font-size: @normal-size;
          img.datetimepicker {
            width: 2.1rem;
          }
        }
      }
      .earning-scroller {
        padding-top: 48px!important;
        box-sizing: border-box;
      }
      .content {
        p.time {
          text-align: left;
          padding: 10px 15px;
          font-size: @small-size;
        }
        .earningitem {
          span.time {
            font-size: @small-size;
            color: #999;
          }
        }
      }
    }
    .no-data {
      text-align: center;
      padding: 1rem;
      font-size: @normal-size;
    }
  }
}
</style>
