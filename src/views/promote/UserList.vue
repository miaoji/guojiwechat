<template>
  <div class="userlist">
    <div class="userlist-container">
      <div class="list">
        <div class="tools">
          <section class="search">
            <input type="" name="" placeholder="根据微信名搜索">
            <span type="" class="search-icon">
              <img src="../../assets/images/search.png" alt="">
            </span>
          </section>
          <section @click.stop="handleDatePicker">
            <img class="datetimepicker" src="../../assets/images/promote/datetimepicker.png"></img>
          </section>
        </div>
        <scroller
          :on-refresh="refresh"
          :on-infinite="infinite"
          ref="userlist-scroller"
          :noDataText="'共'+total+'个用户'"
          class="userlist_scroller"
        >
          <mj-spinner type="line" slot="refresh-spinner"></mj-spinner>
          <div class="content" v-for="(value, key, index) in incomeList">
            <p class="time">
              {{key}}
            </p>
            <group label-width="11rem" label-align="left">
              <cell
                v-for="(items, index) in value" :key="index"
                :title="items.nickName"
                :value="'已产生收益￥' + items.totalAmount"
                @click.native="showUserDetail(items)"
                link=""
                is-link
              >
                <div slot="title" class="slot">
                    <span class="i1"><img :src='items.headimgurl'/></span>
                    <span class="i2">{{items.nickName}}</span>
                </div>
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
import {query} from '@/services/promoteUsers'
import { format } from '@/utils/time'
// link="/promote/users/12"

export default {
  name: 'userlist',
  data () {
    return {
      incomeList: null,
      page: 1,
      rows: 10,
      total: 0,
      spreadUserId: 0
    }
  },
  async created () {
    const {spreadUserId} = this.$route.query
    this.spreadUserId = spreadUserId
    await this.initData()
  },
  computed: {
  },
  methods: {
    showUserDetail (item) {
      this.$router.push({name: 'promoteuserdetail', query: {...item}})
      console.log('item', item)
    },
    async initData () {
      try {
        console.log('初始化数据')
        const data = await query({
          startDate: '2017-01-01',
          endDate: '2018-01-31',
          page: this.page,
          rows: this.rows,
          spreadUserId: this.spreadUserId
        })
        if (data.code === 200 && data.obj) {
          this.reduceData(data.obj)
          this.total = data.total
        } else {
          console.log('数据查询失败')
        }
      } catch (e) {
        console.log('错误信息', e)
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
        const date = new Date(item['subscribeTime'])
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
      let data = {}
      data.nickName = item.nickName
      data.totalAmount = item.totalAmount
      data.sex = item.sex
      data.subscribeTime = item.subscribeTime
      data.headimgurl = item.headimgurl
      return data
    },
    async refresh (done) {
      console.log('下拉')
      await this.initData()
      console.log('下拉111')
      setTimeout(() => {
        return done(true)
      }, 1000)
    },
    async infinite (done) {
      console.log('上拉')
      this.rows += 10
      await this.initData()
      if (this.total < this.rows) {
        return done(true)
      } else {
        return done(false)
      }
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
  beforeDestroy () {
    this.$vux.datetime.hide()
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/styles/helpers.less';
@import '../../assets/styles/colors.less';

.userlist {
  &-container {
    .list {
      .tools {
        .flex;
        position: relative;
        z-index:3;
        background: white;
        padding: 10px 15px;
        justify-content: space-between;
        section {
          font-size: @normal-size;
          img.datetimepicker {
            width: 2.1rem;
            vertical-align: middle;
          }
        }
        .search {
          input {
            padding: 6px 10px;
            font-size: @small-size;
            border: 1px solid #d9d9d9;
            border-radius: @radius-size;
            margin-right: .5rem;
          }
          &-icon {
            img {
              width: 1.6rem;
              vertical-align: middle;
            }
          }
        }
      }
      .userlist_scroller {
        padding-top: 48px!important;
        box-sizing: border-box;
        .content {
          p.time {
            text-align: left;
            padding: 10px 15px;
            font-size: @small-size;
          }
          .slot {
            .i1 {
              height: 1.8rem;
              width: 1.8rem;
              overflow: hidden;
              img {
                position: relative;
                top: 0.25rem;
                width:1.8rem;
                height:1.8rem;
              }
            }
            .i2 {
              position: relative;
              top: -0.2rem;
              padding-left: 5px;
              line-height: 1.8rem;
            }
          }
        }
      }
    }
  }
}
</style>
