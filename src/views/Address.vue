<template>
  <div class="address">
    <div class="address-container">
      <div class="address-container-tab">
        <tab active-color='#eb1d21'>
          <tab-item :selected="addressType === 'send'" @on-item-click="changeShow('send')">寄件地址</tab-item>
          <tab-item :selected="addressType === 'pickup'" @on-item-click="changeShow('pickup')">收件地址</tab-item>
        </tab>
      </div>
      <p v-if="pick" style="text-align: left;font-size: 1.4rem;padding: 0.5rem;padding-bottom: 0;">点击手机号或姓名处选择地址</p>
      <div class="address-container-list">
        <scroller 
          :on-refresh="refresh"
          :on-infinite="infinite"
          ref="my_scroller_address"
          class="address-scroller">
          <mj-spinner type="line" slot="refresh-spinner"></mj-spinner>
          <div class="address-container-list__item" v-for="item in data[addressType]" :key="item.id" v-show="item.start !== 2&&item.start!==0">
              <div class="flex address-container-list__item--info" @click="selectAddress(item)">
                <div>
                  <p>{{item.linkman}}{{item.recipients}} {{item.iphone}}</p>
                  <p class="location"><span class="location-remark">{{item.remove}} {{item.remark}}</span> {{item.detailedinformation}} {{item.detaliedinformation}} </p>
                </div>
              </div>
              <div class="flex address-container-list__item--func flex">
                <span class="is-default" v-show="item.start == 3">
                  <img src="../assets/images/add_ico_che.png" alt="默认地址">
                  <span>默认地址</span>
                </span>
                <span class="not-default" v-show="item.start == 1" @click.stop="changeChecked(item.id, item.start, item.userid)">
                  <img src="../assets/images/add_ico_nor.png" alt="">
                  <span>设为默认</span>
                </span>
                <div>
                  <span class="edit" @click.stop="goPath('/address/edit', item, {type: addressType})">
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
    <div class="address-add" @click="goPath('/address/add', {type: addressType})">
      <p>新增地址</p>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'address',
  created () {
    window.scrollTo(0, 0)
    const {type, pick} = this.$route.query
    const localtype = window.localStorage.getItem('mj_address_page_switch_type')
    this.addressType = type || localtype || 'send'
    this.pick = pick === '1'
  },
  mounted () {
    window.document.title = '地址管理'
  },
  data () {
    return {
      addressType: 'send',
      pick: false
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
      'checkedAddress',
      'setSendAddress',
      'setPickupAddress',
      'setDefaultAddress'
    ]),
    deleteItem (id, addressType) {
      // 显示
      const _this = this // 需要注意 onCancel 和 onConfirm 的 this 指向
      this.$vux.confirm.show({
        // 组件除show外的属性
        title: '确定删除这一地址吗?',
        onCancel () {
        },
        onConfirm () {
          _this.$vux.loading.show({
            text: '正在提交'
          })
          _this.eidtAddress({id, type: addressType})
          _this.$vux.loading.hide()
          // 显示
          _this.$vux.toast.show({
            text: '删除成功',
            width: '18rem'
          })
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
        await _this.changeAddress()
        done()
      }, 1200)
    },
    async infinite (done) {
      await this.changeAddress()
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
    padding-top: 52px;
  }
}
</style>
