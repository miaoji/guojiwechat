<template>
  <div class="address">
    <div class="address-container">
      <div class="address-container-tab" v-show="tabshow === 1">
        <tab active-color='#eb1d21'>
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
          <div v-show="data[addressType] ? data[addressType].length === 0 : false">
            <h2>暂未添加地址</h2>
          </div>
          <div class="address-container-list__item" v-for="item in data[addressType]" :key="item.id" v-show="item.start !== 2&&item.start!==0">
              <div class="flex address-container-list__item--info" @click.stop="selectAddress(item)">
                <div>
                  <p>{{item.name}} {{item.mobile}}</p>
                  <p class="location"><span class="location-remark">{{item.remark}}</span> {{item.address}} </p>
                </div>
              </div>
              <div class="flex address-container-list__item--func flex">
                <span class="is-default" v-show="item.is_default === 1">
                  <img src="../assets/images/add_ico_che.png" alt="默认地址">
                  <span>默认地址</span>
                </span>
                <span class="not-default" v-show="item.is_default === 0 || !item.is_default" @click.stop="changeChecked(item.id, item.start, item.userid)">
                  <img src="../assets/images/add_ico_nor.png" alt="">
                  <span>设为默认</span>
                </span>
                <div>
                  <span class="edit" @click.stop="goPath('/address/handle', item, {type: addressType, pagetype: 'edit'})">
                    <img src="../assets/images/add_ico_cha.png" alt="">
                    <span>编辑</span>
                  </span>
                  <span class="edit" @click.stop="deleteItem(item.id, addressType)">
                    <img src="../assets/images/add_ico_del.png" alt="删除该地址">
                    <span>删除</span>
                  </span>
                </div>
              </div>
          </div>
        </scroller>
      </div>
    </div>
    <div class="address-add" @click="goPath('/address/handle', {type: addressType, pagetype: 'add'})">
      <p>新增地址</p>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { storage } from '../utils'

export default {
  name: 'address',
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
      data: 'getAddress',
      result: 'getAddressResult'
    })
  },
  methods: {
    goPath (path, query, plus) {
      if (plus) {
        Object.assign(query, plus)
      }
      this.$router.push({path, query})
    },
    showToast () {
      if (this.result['show'] === true) {
        this.$vux.toast.show({
          text: this.result['info'],
          type: this.result['type']
        })
      }
    },
    selectAddress (item) {
      if (!this.pick) {
        return
      }
      if (this.addressType === 'send') {
        window.localStorage.setItem('mj_send_sendaddress', JSON.stringify(item))
      } else {
        window.localStorage.setItem('mj_send_pickupaddress', JSON.stringify(item))
      }
      this.$router.go(-1)
    },
    changeShow (type) {
      window.localStorage.setItem('mj_address_page_switch_type', type)
      this.addressType = type
    },
    ...mapActions([
      'changeAddress',
      'eidtAddress',
      'delAddress',
      'checkedAddress',
      'setSendAddress',
      'setPickupAddress',
      'setDefaultAddress'
    ]),
    deleteItem (ids, addressType) {
      // 显示
      const _this = this // 需要注意 onCancel 和 onConfirm 的 this 指向
      this.$vux.confirm.show({
        // 组件除show外的属性
        title: '确定删除这一地址吗?',
        onCancel () {
        },
        async onConfirm () {
          _this.$vux.loading.show({
            text: '正在提交'
          })
          const delRes = await _this.delAddress({ids, type: addressType})
          _this.$vux.loading.hide()
          console.log('dsa', delRes)
          _this.$vux.toast.show(delRes)
        }
      })
    },
    changeChecked (id, checked, userid) {
      if (checked === 3) {
        return
      }
      const _this = this
      let type = 1
      if (this.addressType !== 'send') {
        type = 2
      }
      this.$vux.confirm.show({
        // 组件除show外的属性
        title: '确定将这一地址设置为默认地址吗?',
        onCancel () {
        },
        onConfirm () {
          _this.checkedAddress({id, status: 3, userid, addressType: type})
        }
      })
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
        margin-bottom: 12px;
        background: white;
        .padding {
          padding: 1rem;
        }
        &--info {
          justify-content: space-between;
          border-bottom: 1px solid #f1f1f1;
          .padding;
          .location {
            color: #999;
            font-size: 1.4rem;
            width: 21rem;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: left;
            white-space: nowrap;
            @media (max-width:320px) {
              width: 21rem;
            }
            @media (min-width:360px) {
              width: 25rem;
            }
            @media (min-width:400px) {
              width: 28rem;
            }
            &-remark {
              color: @red;
            }
          }
          p {
            text-align: left;
            font-size: 1.6rem;
          }
          img {
            width: 2rem;
          }
        }
        &--func {
          font-size: 1.2rem;
          justify-content: space-between;
          .padding;
          .edit {
            padding: .1rem 1rem;
            img {
              width: 1.2rem;
              vertical-align: middle;
            }
          }
          .is-default {
            color: #eb1d21;
            img {
              width: 1.2rem;
              vertical-align: text-top;
              *vertical-align: middle;
              font-size: 0;
            }
          }
          .not-default {
            color: #999;
            img {
              width: 1.2rem;
              vertical-align: text-top;
              *vertical-align: middle;
              font-size: 0;
            }
          }
        }
      }
    }
  }
  &-add {
    position: fixed;
    bottom: 0;
    padding: .6rem 1.5rem;
    padding-bottom: 1rem;
    width: 90.4%;
    p {
      font-size: 1.6rem;
      color: white;
      background: @red;
      border-radius: 5px;
      border: none;
      padding: 1.2rem 0;
    }
  }
  &-scroller {
    padding-top: 10px;
  }
  &-scroller--tabshow {
    padding-top: 52px;
  }
}
</style>
