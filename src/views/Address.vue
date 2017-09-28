<template>
  <div class="address">
    <div class="address-container">
      <div class="address-container-tab" v-show="tabshow === 1">
        <tab active-color='#ffa414'>
          <tab-item :selected="addressType === 'send'" @on-item-click="changeShow('send')">寄件地址</tab-item>
          <tab-item :selected="addressType === 'pickup'" @on-item-click="changeShow('pickup')">收件地址</tab-item>
        </tab>
      </div>
      <div class="address-container-list">
        <scroller 
          :on-refresh="refresh"
          :on-infinite="infinite"
          ref="my_scroller_address"
          :noDataText="scrollerNoDataText"
          :class="{'address-scroller': tabshow === 0, 'address-scroller--tabshow': tabshow === 1}">
          <mj-spinner type="line" slot="refresh-spinner"></mj-spinner>
          <div v-show="addressList[addressType] ? addressList[addressType].length === 0 : false">
            <h2 class="no-data">暂未添加地址</h2>
          </div>
          <div class="address-container-list__item" v-for="item in addressList[addressType]" :key="item.id" v-show="item.hidden_status === 1">
            <address-item
              :item="item"
              :pick="pick"
              :addressType="addressType"
            >
            </address-item>
          </div>
          <div class="scroller-fixed">
          </div>
        </scroller>
      </div>
    </div>
    <div class="address-add" @click="goPath('/address/handle', {type: addressType, pagetype: 'add'})">
      <div class="address-add-content">
        <img src="../assets/images/add_add.png" alt="新增地址">
        <span>新增地址</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { storage } from '../utils'
import AddressItem from '@/components/AddressItem.vue'

export default {
  name: 'address',
  components: {
    AddressItem
  },
  created () {
    window.scrollTo(0, 0)
    const {type, pick, tabshow} = this.$route.query
    const localtype = storage({key: 'address_page_switch_type'})
    this.addressType = type || localtype || 'send'
    this.pick = pick === '1'
    this.tabshow = Number(tabshow) === 0 ? 0 : 1
  },
  mounted () {
    let title = ''
    if (this.pick && this.addressType === 'send') {
      title = '选择寄件地址'
    } else if (this.pick && this.addressType === 'pickup') {
      title = '选择收件地址'
    } else {
      title = '地址管理'
    }
    window.document.title = title
  },
  data () {
    return {
      addressType: 'send',
      pick: false,
      tabshow: 1,
      scrollerNoDataText: ''
    }
  },
  computed: {
    ...mapGetters({
      userId: 'getUserId',
      addressList: 'getAddress'
    })
  },
  methods: {
    ...mapActions([
      'changeAddress'
    ]),
    changeShow (type) {
      window.localStorage.setItem('mj_address_page_switch_type', type)
      this.addressType = type
    },
    async refresh (done) {
      const _this = this
      setTimeout(async function () {
        const res = await _this.changeAddress()
        if (res.type !== 'success') {
          _this.$vux.toast.show(res)
        }
        done()
      }, 1200)
    },
    async infinite (done) {
      const res = await this.changeAddress()
      if (res.type !== 'success') {
        this.$vux.toast.show(res)
      }
      done(true)
    },
    goPath (path, query) {
      this.$router.push({path, query})
    }
  },
  beforeDestroy () {
    window.localStorage.setItem('mj_address_page_switch_type', this.addressType)
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../assets/styles/colors.less';
@import '../assets/styles/helpers.less';
.address {
  min-height: 100vh;
  background-color: @bg-grey;
  &-container {
    &-tab {
      position: fixed;
      width: 100%;
      z-index: 1000;
    }
    &-list {
      &__intro {
        padding: 1rem;
        padding-top: 0;
        font-size:1.4rem;
        text-align: left;
      }
      &__item {
        padding: 10px;
        padding-bottom: 0;
        background: transparent;
        text-align: justify;
      }
    }
  }
  &-add {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: white;
    &-content {
      border: none;
      padding: .8rem 0;
      .flex;
      justify-content: center;
      img {
        width: 3.3rem;
        height: auto;
      }
      span {
        padding-left: 1rem;
        font-size: 1.6rem;
        color: #666;
      }
    }
  }
  .scroller-commen {
    .purple-bg;
  }
  &-scroller {
    .scroller-commen;
    padding-top: 10px;
  }
  &-scroller--tabshow {
    .scroller-commen;
    padding-top: 52px;
  }
}
.scroller-fixed {
  height: 7rem;
}
.no-data {
  color: #fff;
}
</style>
