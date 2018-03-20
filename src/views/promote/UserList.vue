<template>
  <div class="userlist">
    <div class="userlist-container">
      <div class="list">
        <div class="tools">
          <section class="search">
            <input type="" name="" v-model="nickNameV" :placeholder="$t('promoteUL.search')">
            <span type="" class="search-icon" @click.stop="searchNickname">
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
          :noDataText="$t('promoteUL.info', {'num': total})"
          class="userlist_scroller"
        >
          <mj-spinner type="line" slot="refresh-spinner"></mj-spinner>
          <div class="content">
            <group label-width="11rem" label-align="left">
              <cell
                v-for="(items, index) in incomeList" :key="index"
                :title="items.nickName"
                :value="$t('promoteUD.amount')+'￥' + items.totalAmount / 100"
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

export default {
  name: 'userlist',
  data () {
    return {
      nickNameV: '',
      nickName: '',
      incomeList: [],
      page: 1,
      rows: 20,
      total: 0,
      spreadUserId: 0,
      datePickerVal: '2017-02',
      startDate: '2017-01-01',
      endDate: '2018-12-31'
    }
  },
  async created () {
    const {spreadUserId} = this.$route.query
    this.spreadUserId = spreadUserId
    const dateN = new Date()
    this.endDate = format('yyyy-MM-dd', dateN)
    this.datePickerVal = format('yyyy-MM', dateN)
    await this.initData()
  },
  computed: {
  },
  methods: {
    searchNickname () {
      if (this.nickNameV) {
        this.nickName = this.nickNameV
        this.initData()
        this.nickName = ''
        this.nickNameV = ''
      }
    },
    showUserDetail (item) {
      this.$router.push({name: 'promoteuserdetail', query: {...item}})
    },
    initData () {
      this.page = 1
      this.startDate = '2017-01-01'
      this.endDate = format('yyyy-MM-dd', new Date())
      this.setData()
    },
    async setData () {
      try {
        const data = await query({
          startDate: this.startDate,
          endDate: this.endDate,
          page: this.page,
          rows: this.rows,
          spreadUserId: this.spreadUserId,
          nickName: this.nickName
        })
        if (data.code === 200) {
          const obj = data.obj
          if (obj) {
            this.reduceData(obj)
            const total = data.total
            if (!total && this.page === 1) {
              this.total = 0
            } else {
              this.total = total
            }
          } else {
            if (this.page === 1) {
              this.incomeList = []
              this.total = 0
            }
          }
        } else {
          console.log('数据查询失败')
        }
      } catch (e) {
        console.log('错误信息', e)
      }
    },
    reduceData (data) {
      if (!Array.isArray(data)) {
        if (this.page === 1) {
          this.incomeList = []
        }
        return
      }
      if (this.page === 1) {
        this.incomeList = data
        return
      }
      this.incomeList.push.apply(this.incomeList, data)
    },
    reduceDataOld (data) {
      if (!Array.isArray(data)) {
        if (this.page === 1) {
          this.incomeList = {}
        }
        return
      }
      if (this.page === 1) {
        this.incomeList = {}
      }
      let newList = {}
      const len = data.length
      for (let i = 0; i < len; i++) {
        let item = data[i]
        const date = new Date(item['subscribeTime'])
        const yearMonth = format('yyyy-MM', date)
        const monthDay = format('MM-dd', date)
        if (!newList.hasOwnProperty(yearMonth)) {
          newList[yearMonth] = []
        }
        item.day = monthDay
        newList[yearMonth].push(this.dealEarningItem(item))
      }
      this.incomeList = Object.assign({}, this.incomeList, newList)
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
      this.initData()
      setTimeout(() => {
        done(true)
      }, 1000)
    },
    async infinite (done) {
      this.page = this.page + 1
      this.setData()
      setTimeout(function () {
        done(true)
      }, 1200)
    },
    handleDatePicker () {
      const _this = this
      this.$vux.datetime.show({
        cancelText: this.$t('promoteS.cancel'),
        confirmText: this.$t('promoteS.confirm'),
        format: 'YYYY-MM',
        value: _this.datePickerVal,
        minYear: 2017,
        maxYear: 2018,
        onConfirm (val) {
          console.log('plugin confirm', val)
          _this.datePickerVal = val
          _this.page = 1
          _this.startDate = val + '-01'
          _this.endDate = val + '-31'
          _this.setData()
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
          padding-top: 10px;
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
