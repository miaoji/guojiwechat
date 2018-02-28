<template>
  <div class="cargolist">
    <div class="cargolist-container">
      <div class="cargolist-container-tab">
        <tab active-color='#ffa414'>
          <tab-item :selected="show ==='all'" @on-item-click="changeShow('all')">
            <span class="tab-info">{{'cargo.list.all' | translate}}</span>
            <span class="tab-num">{{countList['all']}}</span>
          </tab-item>
          <tab-item :selected="show ==='waitcargo'" @on-item-click="changeShow('waitcargo')">
            <span class="tab-info">{{'cargo.list.waitcargo' | translate}}</span>
            <span class="tab-num">{{countList['waitcargo']}}</span>
          </tab-item>
          <tab-item :selected="show ==='waitpay'" @on-item-click="changeShow('waitpay')">
            <span class="tab-info">{{'cargo.list.waitpay' | translate}}</span>
            <span class="tab-num">{{countList['waitpay']}}</span>
          </tab-item>
          <tab-item :selected="show ==='waitdelivery'" @on-item-click="changeShow('waitdelivery')">
            <span class="tab-info">{{'cargo.list.waitdelivery' | translate}}</span>
            <span class="tab-num">{{countList['waitdelivery']}}</span>
          </tab-item>
          <tab-item :selected="show ==='done'" @on-item-click="changeShow('done')">
            <span class="tab-info">{{'cargo.list.done' | translate}}</span>
            <span class="tab-num">{{countList['done']}}</span>
          </tab-item>
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
          <div class="cargolist-cell-detail" v-for="item, index in cargolist" :key="index" v-show="isShow(item.status, item.parentId)">
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
import { mapGetters, mapActions } from 'vuex'
import { storage } from '@/utils'
import { count } from '@/services/orderInfo'
import ListItem from './components/ListItem'

export default {
  name: 'cargolist',
  async created () {
    window.scrollTo(0, 0)
    const { type } = this.$route.query
    const localtype = storage({
      key: 'cargo_switch_type'
    })
    this.show = type || localtype || 'all'
    this.getCount()
  },
  components: {
    ListItem
  },
  computed: {
    ...mapGetters({
      'cargolistData': 'getCargoList',
      userid: 'getUserId'
    }),
    cargolist () {
      return this.cargolistData.data || []
    },
    countList () {
      let list = {
        'all': this.cargolistData.total,
        'waitcargo': 0,
        'waitpay': 0,
        'waitdelivery': 0,
        'done': 0
      }
      const countData = this.countData
      for (let i = 0; i < countData.length; i++) {
        const item = countData[i]
        const status = Number(item.status)
        const parentCount = item.parentCount
        const childCount = item.childCount
        switch (status) {
          case 0:
            list.waitcargo += childCount
            break
          case 1:
            list.waitcargo += childCount
            list.waitpay += parentCount
            break
          case 2:
            list.waitdelivery += parentCount
            break
          case 3:
            list.waitdelivery += parentCount
            break
          case 4:
            list.waitcargo += childCount
            list.done += parentCount
            break
          case 5:
            list.waitcargo += childCount
            break
          case 7:
            list.waitcargo += childCount
            list.waitdelivery += parentCount
            break
          case 8:
            list.waitcargo += childCount
            break
          default:
            break
        }
      }
      return list
    }
  },
  data () {
    return {
      page: 1,
      rows: 50,
      showList: [],
      show: 'all',
      scrollerNoDataText: '没有更多数据啦~',
      countData: []
    }
  },
  methods: {
    ...mapActions([
      'setCargoList'
    ]),
    async getCount () {
      try {
        const res = await count({
          type: 1,
          wxUserId: this.userid
        })
        if (res.code === 200) {
          this.countData = res.obj
        }
      } catch (err) {
        console.error(err)
      }
    },
    async getList ({page, rows}) {
      try {
        this.setCargoList({
          page,
          rows
        })
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
        key: 'cargo_switch_type',
        val: type,
        type: 'set'
      })
      this.show = type
    },
    isShow (status = 1, parentId) {
      const showList = this.showList
      if (showList.length === 0) {
        return true
      }
      if (parentId === 0 && showList[0] === 'waitcargo') {
        return true
      } else if (parentId !== 0 && (showList.indexOf(Number(status)) !== -1)) {
        return true
      }
      return false
    },
    async cancle (item) {
      const _this = this
      this.$vux.confirm.show({
        title: _this.$i18n.translate('cargo.list.deletetips'),
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
      this.page = 1
      this.rows = 50
      const page = this.page
      const rows = this.rows
      setTimeout(async function () {
        _this.getList({
          page,
          rows
        })
        done(true)
      }, 1200)
    },
    infinite (done) {
      const _this = this
      this.rows = this.rows + 10
      const page = this.page
      const rows = this.rows
      setTimeout(async function () {
        _this.getList({
          page,
          rows
        })
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
        case 'waitcargo':
          storageVal = 7
          showList = ['waitcargo']
          break
        case 'waitpay':
          storageVal = 1
          showList = [1]
          break
        case 'waitdelivery':
          storageVal = 2
          showList = [2, 3, 7]
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
        key: 'cargo_type',
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
      .tab-info {
        font-size: @normal-size;
      }
      .tab-num {
        position:relative;
        font-size: @small-size;
      }
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
