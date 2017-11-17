<template>
  <div class="cargolist">
    <div class="cargolist-container">
      <div class="cargolist-container-tab">
        <tab active-color='#ffa414'>
          <tab-item :selected="show ==='all'" @on-item-click="changeShow('all')">全部</tab-item>
          <tab-item :selected="show ==='waitpay'" @on-item-click="changeShow('waitpay')">待付款</tab-item>
          <tab-item :selected="show ==='waitdelivery'" @on-item-click="changeShow('waitdelivery')">待收货</tab-item>
          <tab-item :selected="show ==='done'" @on-item-click="changeShow('done')">已完成</tab-item>
        </tab>
      </div>
      <div class="cargolist-cell">
        <scroller
          :on-refresh="refresh"
          :on-infinite="infinite"
          :noDataText="scrollerNoDataText"
          ref="my_scroller_cargolist"
          class="cargolist-scroller">
          <mj-spinner type="line" slot="refresh-spinner"></mj-spinner>
          <div class="cargolist-cell-detail" v-for="item in cargolist" :key="item.id" v-show="isShow(item.STATUS)">
            <list-item 
              :item="item"
            >
            </list-item>
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
import { storage } from '@/utils'
import { query } from '@/services/cargo'
import ListItem from './components/ListItem'

export default {
  name: 'cargolist',
  async created () {
    window.scrollTo(0, 0)
    const { type } = this.$route.query
    const localtype = storage({
      key: 'senddetail_switch_type'
    })
    this.show = type || localtype || 'all'
  },
  components: {
    ListItem
  },
  computed: {
  },
  data () {
    return {
      cargolist: [],
      showList: [],
      show: 'all',
      scrollerNoDataText: '没有更多数据啦~'
    }
  },
  methods: {
    async getOrderList () {
      try {
        const res = await query({
          wxUserId: storage({
            key: 'userId'
          })
        })
        console.log('res', res)
        if (res.code === 200 && res.success) {
          this.cargolist = res.obj
        }
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
      storage({
        key: 'senddetail_switch_type',
        val: type,
        type: 'set'
      })
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
          _this.$vux.loading.hide()
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
      let storageVal = ''
      let showList = []
      switch (val) {
        case 'all':
          storageVal = ''
          showList = []
          break
        case 'waitpay':
          storageVal = 1
          showList = [1]
          break
        case 'waitdelivery':
          storageVal = 2
          showList = [2, 3]
          break
        case 'done':
          storageVal = 4
          showList = [4]
          break
        case 'unusual':
          storageVal = 5
          showList = [5]
          break
        default:
          storageVal = ''
          showList = []
      }
      storage({
        key: 'order_type',
        val: storageVal,
        type: 'set'
      })
      this.showList = showList
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../assets/styles/colors.less';
@import '../../assets/styles/helpers.less';

.cargolist {
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
