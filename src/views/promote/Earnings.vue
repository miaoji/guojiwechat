<template>
  <div class="earings">
    <div class="earings-container">
      <scroller
        :on-refresh="refresh"
        noDataText=""
        ref="earning-scroller">
        <mj-spinner type="line" slot="refresh-spinner"></mj-spinner>
        <div class="list">
          <div class="tools">
            <section>
              筛选
            </section>
            <section @click.stop="handleDatePicker">
              <img class="datetimepicker" src="../../assets/images/promote/datetimepicker.png"></img>
            </section>
          </div>
          <div class="content" v-for="(value, key, index) in incomeList">
            <p class="time">
              {{key}}
            </p>
            <group label-align="left">
              <cell
                v-for="(iitem, index) in value" :key="index"
                :title="iitem.nickName"
                :value="iitem.income"
                @click.native="goDetailPage(iitem)"
                link=""
                is-link
              >
                <template slot="title">
                  <div class="earningitem">
                    <span>{{iitem.type}}订单-by {{iitem.nickName}}</span>
                    <span class="time">{{iitem.day}}</span>
                  </div>
                </template>
              </cell>
            </group>
          </div>
        </div>
        <mj-spinner type="circle" slot="infinite-spinner"></mj-spinner>
      </scroller>
    </div>
  </div>
</template>

<script>
import { getIncome } from '@/services/promote'
import { format } from '@/utils/time'

export default {
  name: 'earings',
  data () {
    return {
      spreadUserId: 0,
      incomeList1: {
        '2018-01': [{
          createTime: 1514964214000,
          day: '01-03'
        }]
      },
      incomeList: null,
      testArr: {
        '2018-01': [{
          'data': '1'
        }]
      }
    }
  },
  async created () {
    // const {spreadUserId} = this.$route.query
    // this.spreadUserId = spreadUserId
    this.spreadUserId = 1
    await this.initData()
  },
  computed: {
  },
  methods: {
    async initData () {
      try {
        const res = await getIncome({
          startDate: '2017-01-01',
          endDate: '2018-01-31',
          page: 1,
          rows: 10,
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
        this.incomeList[yearMonth].push(this.dealEarningItem(item))
      }
    },
    dealEarningItem (item) {
      let res = {}
      res.day = item.day
      res.nickName = item.wxUser.nickName
      res.type = item.orderInfo.type === 0 ? '直邮' : '集运'
      res.income = `+￥${item.income / 100}`
      res.orderNo = item.orderNo
      res.cashFee = `￥${item.orderInfo.cashFee / 100}`
      res.incomeRatio = `${item.incomeRatio * 100}%`
      return res
    },
    async refresh (done) {
      this.incomeList = null
      await this.initData()
      return done(true)
    },
    goDetailPage (query) {
      this.$router.push({
        path: `/promote/earnings/${query.orderNo}`,
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

.earings {
  &-container {
    .list {
      .tools {
        .flex;
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
  }
}
</style>
