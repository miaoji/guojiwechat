<template>
  <div class="orderlist">
    <div class="orderlist-container">
      <div class="orderlist-container-tab">
        <tab active-color='#ffa414'>
          <tab-item :selected="show ==='all'" @on-item-click="changeShow('all')">全部</tab-item>
          <tab-item :selected="show ==='waitpay'" @on-item-click="changeShow('waitpay')">待付款</tab-item>
          <tab-item :selected="show ==='waitdelivery '" @on-item-click="changeShow('waitdelivery')">待收货</tab-item>
          <tab-item :selected="show ==='done'" @on-item-click="changeShow('done')">已完成</tab-item>
        </tab>
      </div>
      <div class="orderlist-cell">
        <scroller
          :on-refresh="refresh"
          :on-infinite="infinite"
          :noDataText="scrollerNoDataText"
          ref="my_scroller_orderlist"
          class="orderlist-scroller">
          <mj-spinner type="line" slot="refresh-spinner"></mj-spinner>
          <div class="orderlist-cell-detail" v-for="item in orderlist" :key="item.id" v-show="isShow(item.STATUS)">
            <mj-orderitem 
              :item="item"
            >
            </mj-orderitem>
          </div>
          <mj-spinner type="circle" slot="infinite-spinner"></mj-spinner>
          <div class="scroller-fixed">
          </div>
        </scroller>
      </div>
    </div>
  </div>
</template>
<script>
import { query } from '../services/orderInfo'
import { storage } from '../utils'

const localStorage = window.localStorage

export default {
  name: 'senddetail',
  async created () {
    window.scrollTo(0, 0)
    const { type } = this.$route.query
    const localtype = storage({
      key: 'senddetail_switch_type'
    })
    this.show = type || localtype || 'all'
  },
  mounted () {
    window.document.title = '寄件列表'
  },
  data () {
    return {
      orderlist: [],
      showList: [],
      show: 'all',
      scrollerNoDataText: '没有更多数据啦~'
    }
  },
  methods: {
    async getOrderList () {
      try {
        const orderlist = await query({
          wxUserId: storage({key: 'userId'})
        })
        if (orderlist.code !== 200) {
          return this.$vux.toast.show({
            text: orderlist.mess || '获取寄件列表失败',
            type: 'warn',
            width: '18rem'
          })
        }
        let data = orderlist.obj
        this.orderlist = data
      } catch (e) {
        console.error(e)
        return this.$vux.toast.show({
          text: e.message,
          type: 'warn',
          width: '18rem'
        })
      }
    },
    changeShow (type) {
      window.localStorage.setItem('mj_senddetail_switch_type', type)
      this.show = type
    },
    isShow (status = 1) {
      const showList = this.showList
      if (showList.length === 0) {
        return true
      }
      if (showList.indexOf(Number(status)) !== -1) {
        return true
      }
      return false
    },
    async cancle (item) {
      const _this = this
      this.$vux.confirm.show({
        title: '确定取消这一订单吗?',
        onCancel () {
        },
        async onConfirm () {
          this.$vux.loading.show({
            text: '正在取消'
          })
          const res = await _this.cancleSend({
            brand: item.brand,
            describe: item.describe,
            note: item.note,
            office: item.officeId,
            order: item.order,
            receiptAddressId: item.receiptAddressId,
            sendAddressId: item.sendAddressId,
            sum: item.sum,
            type: 5})
          _this.$vux.loading.hide()
          _this.$vux.toast.show(res)
        }
      })
    },
    refresh (done) {
      const _this = this
      setTimeout(async function () {
        _this.getOrderList()
        done(true)
      }, 1200)
    },
    infinite (done) {
      const _this = this
      setTimeout(async function () {
        _this.getOrderList()
        done(true)
      }, 1500)
    }
  },
  watch: {
    show (val, oldval) {
      switch (val) {
        case 'all':
          localStorage.setItem('mj_order_type', '')
          this.showList = []
          break
        case 'waitpay':
          localStorage.setItem('mj_order_type', 1)
          this.showList = [1]
          break
        case 'waitdelivery':
          localStorage.setItem('mj_order_type', 2)
          this.showList = [2, 3]
          break
        case 'done':
          localStorage.setItem('mj_order_type', 4)
          this.showList = [4]
          break
        case 'unusual':
          localStorage.setItem('mj_order_type', 5)
          this.getOrderList(5)
          break
        default:
          localStorage.setItem('mj_order_type', '')
          this.showList = []
      }
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../assets/styles/colors.less';
@import '../assets/styles/helpers.less';

.orderlist {
  &-container {
    &-tab {
      position: fixed;
      width: 100%;
      z-index: 1000;
    }
  }
  &-cell {
    &-status {
      font-size: 1.6rem;
      text-align: left;
      padding: 1rem;
      padding-bottom: 0;
    }
    &-detail {
      background: transparent;
      text-align: justify;
      padding: 10px;
      padding-bottom: 0;
      &--box {
        padding: .5rem 0;
      }
      &__title {
        font-size: 1.6rem;
        img {
          width: auto;
          height: 2rem;
          vertical-align: top;
        }
      }
      p {
        font-size: 1.4rem;
        padding: .2rem 0;
      }
      .middle-box {
        color: #999;
      }
      .wait-senddetail {
        float: right;
        color: @dark-yellow;
        padding-top: .3rem;
      }
      .already-senddetail {
        float: right;
        color: #999;
        padding-top: .3rem;
      }
      .time {
        font-size: 1.2rem;
        color: #333;
      }
    }
  }
  &-scroller {
    .purple-bg;
    padding: 0 0;
    padding-top: 44px;
  }
}
.scroller-fixed {
  height: 3rem;
}
</style>
