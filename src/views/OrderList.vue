<template>
  <div class="senddetail">
    <div class="senddetail-container">
      <div class="senddetail-container-tab">
        <tab active-color='#eb1d21'>
          <tab-item :selected="show ==='all'" @on-item-click="changeShow('all')">全部</tab-item>
          <tab-item :selected="show ==='waitpay'" @on-item-click="changeShow('waitpay')">待付款</tab-item>
          <tab-item :selected="show ==='waitdelivery '" @on-item-click="changeShow('waitdelivery')">待收货</tab-item>
          <tab-item :selected="show ==='done'" @on-item-click="changeShow('done')">已完成</tab-item>
          <tab-item :selected="show ==='cancle'" @on-item-click="changeShow('cancle')">已取消</tab-item>
          <tab-item :selected="show ==='unusual'" @on-item-click="changeShow('unusual')">异常</tab-item>
        </tab>
      </div>
      <div class="senddetail-cell">
        <scroller 
          :on-refresh="refresh"
          :on-infinite="infinite"
          ref="my_scroller_senddetail"
          class="senddetail-scroller">
          <mj-spinner type="line" slot="refresh-spinner"></mj-spinner>
          <div class="senddetail-cell-detail" v-for="item in data" :key="item.id">
            <mj-orderitem :item="item"></mj-orderitem>
          </div>
          <mj-spinner type="circle" slot="infinite-spinner"></mj-spinner>
        </scroller>
      </div>
    </div>
  </div>
</template>
<script>
import { order as orderApi } from '@/api'
import request from '../utils/request'

const localStorage = window.localStorage

export default {
  name: 'senddetail',
  async created () {
    window.scrollTo(0, 0)
    const {type} = this.$route.query
    const localtype = localStorage.getItem('mj_senddetail_switch_type')
    this.show = type || localtype || 'all'
  },
  mounted () {
    window.document.title = '寄件列表'
  },
  data () {
    return {
      data: [],
      show: 'waitpay'
    }
  },
  methods: {
    async getOrderList (starte = 1) {
      try {
        const orderlist = await request({
          method: 'post',
          url: orderApi.list,
          params: {
            userid: localStorage.getItem('mj_userId'),
            starte
          },
          auth: true
        })
        if (orderlist.code !== 200) {
          return this.$vux.toast.show({
            text: orderlist.mess || '获取寄件列表失败',
            type: 'warn',
            width: '18rem'
          })
        }
        let data = orderlist.obj
        if (Number(starte) === 2) {
          // starte为2时要查询order为0（fx完成）0和3 中通完成
          try {
            const ZTOList = await request({
              method: 'post',
              url: orderApi.list,
              params: {
                userid: localStorage.getItem('mj_userId'),
                starte: 3
              },
              auth: true
            })
            const FXList = await request({
              method: 'post',
              url: orderApi.list,
              params: {
                userid: localStorage.getItem('mj_userId'),
                starte: 0
              },
              auth: true
            })
            let dataMerge = ZTOList.obj.concat(FXList.obj)
            data = data.concat(dataMerge)
          } catch (e) {
            console.error(e)
          }
        }
        if (data.length > 0) {
          data.sort(function (a, b) {
            return a.id < b.id
          })
        }
        this.data = data
        return
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
    showToast (data) {
      this.$vux.toast.show({
        text: data.text || '出错啦',
        type: data.type || 'warn',
        width: '20rem'
      })
    },
    goPath (item, type) {
      this.$router.push({path: 'qr', query: item})
    },
    async cancle (item) {
      const _this = this // 需要注意 onCancel 和 onConfirm 的 this 指向
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
          _this.showToast(res)
        }
      })
    },
    showOffice ({province = '', city = '', district = '', descript = ''}) {
      const content = province + city + district + descript
      this.showToast({
        text: content,
        type: 'text'
      })
    },
    refresh (done) {
      const _this = this
      const starte = localStorage.getItem('mj_order_type') || 6
      setTimeout(async function () {
        _this.getOrderList(starte)
        done(true)
      }, 1200)
    },
    infinite (done) {
      const _this = this
      const starte = localStorage.getItem('mj_order_type') || 6
      setTimeout(async function () {
        _this.getOrderList(starte)
        done(true)
      }, 1500)
    }
  },
  watch: {
    show (val, oldval) {
      switch (val) {
        case 'all':
          localStorage.setItem('mj_order_type', 6)
          this.getOrderList(6)
          break
        case 'waitpay':
          localStorage.setItem('mj_order_type', 1)
          this.getOrderList(1)
          break
        case 'waitdelivery':
          localStorage.setItem('mj_order_type', 2)
          this.getOrderList(2)
          break
        case 'done':
          localStorage.setItem('mj_order_type', 0)
          this.getOrderList(0)
          break
        case 'cancle':
          localStorage.setItem('mj_order_type', 5)
          this.getOrderList(5)
          break
        case 'unusual':
          localStorage.setItem('mj_order_type', 4)
          this.getOrderList(4)
          break
        default:
          localStorage.setItem('mj_order_type', 6)
          this.getOrderList(6)
      }
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../assets/styles/colors.less';
@import '../assets/styles/helpers.less';
.scroll-container {
  padding: 0 1rem;
}

.office-info {
  font-size: 1.5rem;
  width: 15rem;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: bottom;
}

.border-bottom-grey {
  border-bottom: 1px solid @borderbt;
}
.send-icon {
  border-radius: 50%;
  background: #BEB9B9;
  color: white;
  margin-right: 1rem;
  width: 3rem;
  height: 3rem;
  font-size: 1.3rem;
  line-height: 3rem;
  text-align: center;
}

.sum-money {
 font-size: 1.4rem;
 color: @dark-yellow;
}

.normal-btn {
  width: 6.6rem;
  font-size: 1.4rem;
  text-align: center;
  padding: .5rem .4rem;
  border-radius: 5px;
  box-sizing: border-box;
  white-space: nowrap;
}

.cancle-btn {
  .normal-btn;
  color: #999;
  margin-right: .3rem;
  border: 1px solid #999;
  background: transparent;
}

.gosend-btn {
  .normal-btn;
  color: white;
  border: none;
  background: @dark-yellow;
  border: 1px solid @dark-yellow;
}

.senddetail {
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
      background: white;
      text-align: justify;
      padding: 0 15px;
      margin: 1rem 0;
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
    padding-top: 44px;
  }
}
</style>
