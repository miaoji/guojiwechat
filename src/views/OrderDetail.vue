<template>
  <div class="sendqr">
    <div class="container">
      <div class="sendqr-detail">
        <div class="sendqr-detail-box">
          <div class="sendqr-detail-box__icon">
            <span class="bgblack">寄</span>
          </div>
          <div class="sendqr-detail-box__detail">
            <p>{{data.listMailingaddress[0].linkman + '   ' + data.listMailingaddress[0].iphone}}</p>
            <p>{{sendAddress}}</p>
            <p>{{ data.listMailingaddress[0].detailedinformation}}</p>
          </div>
        </div>
        <div class="sendqr-detail-box">
          <div class="sendqr-detail-box__icon">
            <span class="bgred">收</span>
          </div>
          <div class="sendqr-detail-box__detail">
            <p>{{data.listConsigneeaddress[0].recipients + '   ' + data.listConsigneeaddress[0].iphone}}</p>
            <p>{{pickupAddress}}</p>
            <p>{{data.listConsigneeaddress[0].detaliedinformation}}</p>
          </div>
        </div>
        <div class="sendqr-detail-box">
          <span class="sendqr-detail-box__title">订单状态</span>
          <span class="sendqr-detail-box__yin">:</span>
          <span class="sendqr-detail-box__content">
            {{data.starte | orderstatus}}
            <button class="pay" @click.stop="wxpay" v-show="data.starte === 1">立即付款</button>
          </span>
        </div>
        <div class="sendqr-detail-box">
          <span class="sendqr-detail-box__title">预付金额</span>
          <span class="sendqr-detail-box__yin">:</span>
          <span class="sendqr-detail-box__content">{{data.totalFee/100}}元</span>
        </div>
        <div class="sendqr-detail-box">
          <span class="sendqr-detail-box__title">待补价</span>
          <span class="sendqr-detail-box__yin">:</span>
          <span class="sendqr-detail-box__content">
            {{bootStatus['val'] === 0 ? '无' : '有'}}
            <button class="pay" @click.stop="goBootDetail({id: bootStatus['id']})" v-show="bootStatus['val'] === 1">立即补价</button>
          </span>
        </div>
        <div class="sendqr-detail-box">
          <span class="sendqr-detail-box__title">备注</span>
          <span class="sendqr-detail-box__yin">:</span>
          <span class="sendqr-detail-box__content">{{data.remove}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import axios from 'axios'
import { order as orderApi, wx as wxApi } from '@/api'

let instance = axios.create({
  timeout: 5000
})

const localStorage = window.localStorage

export default {
  name: 'orderdetail',
  data () {
    return {
      data: {},
      serialnumber: '',
      item: {},
      sendAddress: '',
      pickupAddress: '',
      bootStatus: {
        val: 0,
        id: 0
      },
      payloading: false
    }
  },
  async created () {
    // 初始化wxssdk
    const wxconfig = await instance({
      method: 'post',
      url: wxApi.jssdk,
      params: {
        url: 'http://guoji.didalive.net/wechat/'
      }
    })
    const jssdk = JSON.parse(wxconfig.data.obj)
    window.wx.config({
      debug: false,
      appId: 'wxddd3ecf13e8fca82',
      timestamp: jssdk.timestamp,
      nonceStr: jssdk.nonceStr,
      signature: jssdk.signature,
      jsApiList: [
        'chooseImage',
        'chooseWXPay'
      ]
    })
    window.wx.error(function (res) {
      console.log('wx error res', res)
    })
    let query = this.$route.query
    let serialnumber = query.serialnumber || 1
    this.serialnumber = serialnumber
    await this.getOrderDetail(serialnumber)
    const sendgeography = this.data['listMailingaddress'][0]
    const sendAddress = await this.getGeography({countryid: sendgeography.nationid, provinceid: sendgeography.provinnce, cityid: sendgeography.city, countyid: sendgeography.county})
    this.sendAddress = sendAddress.data
    const pickupgeography = this.data['listConsigneeaddress'][0]
    const pickupAddress = await this.getGeography({countryid: pickupgeography.nation, provinceid: pickupgeography.provinnce, cityid: pickupgeography.city, countyid: pickupgeography.county})
    this.pickupAddress = pickupAddress.data
    // 获取订单补价信息, 并从中筛选出最新的补价，判断是否有为 1 或 2 状态的boot，并保存他的id
    const boot = await this.getBoot({ serialnumber })
    if (boot.code === 200) {
      const bootData = boot.obj
      let bootStatus = {
        val: 0, // 0表示不需要补价， 1相反
        id: 0
      }
      for (let item in bootData) {
        let status = bootData[item].status
        if (status !== 2) {
          bootStatus = {
            val: 1,
            id: bootData[item].id
          }
          break
        }
      }
      this.bootStatus = bootStatus
    }
  },
  mounted () {
    window.document.title = '寄件明细'
  },
  methods: {
    ...mapActions([
      'getGeography',
      'getBoot'
    ]),
    async getOrderDetail (serialnumber = 1) {
      try {
        const orderdetail = await instance({
          method: 'post',
          url: orderApi.detailbyserialnumber,
          params: {
            serialnumber
          },
          headers: {'token': localStorage.getItem('mj_token')}
        })
        if (orderdetail.status !== 200) {
          return this.$vux.toast.show({
            text: '获取寄件详情失败',
            type: 'warn',
            width: '18rem'
          })
        }
        if (orderdetail.data.code !== 200) {
          return this.$vux.toast.show({
            text: orderdetail.data.mess,
            type: 'warn',
            width: '18rem'
          })
        }
        let data = orderdetail.data.obj
        if (data.length > 0) {
          data.sort(function (a, b) {
            return a.id < b.id
          })
        }
        this.data = data[0]
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
    async wxpay () {
      if (this.payloading) return
      this.payloading = true
      const wxpay = await instance({
        method: 'post',
        url: wxApi.wxpay,
        params: {
          openid: localStorage.getItem('mj_openid'),
          money: (this.data.totalFee),
          serialnumber: this.serialnumber,
          body: '国际快递包裹',
          payType: 0
        }
      })
      const wxpayCon = wxpay.data
      const _this = this
      const prepayId = wxpayCon.package.replace(/prepay_id=/, '')
      window.wx.ready(function () {
        console.log('wx jssdk 初始化成功')
        window.wx.chooseWXPay({
          'timestamp': wxpayCon.timeStamp,
          'nonceStr': wxpayCon.nonceStr,
          'package': wxpayCon.package,
          'signType': 'MD5',
          'paySign': wxpayCon.paySign,
          success: function (res) {
            instance({
              method: 'post',
              url: wxApi.update,
              params: {
                serialnumber: _this.serialnumber,
                prepayId,
                isPay: 1,
                payType: 0
              }
            })
            .then(orderres => {
              _this.showToast({text: '支付成功'})
              _this.data.starte = 2
            }).catch(err => {
              console.error(err)
            })
          },
          fail: function (res) {
          },
          cancle: function () {
          },
          complete: function () {
            this.payloading = false
          }
        })
      })
    },
    goBootDetail ({id}) {
      this.$router.push({path: 'bootdeal', query: {id}})
      return
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../assets/styles/colors.less';
@import '../assets/styles/helpers.less';
.bgblack {
  background-color: black;
}
.bgred {
  background-color: @red;
}
.darkyellow {
  color: @dark-yellow;
}

.lightyellow {
  color: @red!important;
}
.sendqr {
  .container {
  }
  &-img {
    .btg;
    background: white;
    padding: 1rem;
    padding-bottom: 2.5rem;
    &--wait {
      img {
        width: 15rem;
      }
      p {
        font-size: 1.4rem;
        color: @greyfont;
      }
    }
    &--sign {
      img {
        padding: 2.5rem;
        padding-bottom: 0.8rem;
        width: 6rem;
        height: auto;
      }
      p {
        font-size: 1.8rem;
        color: @dark-yellow;
      }
    }
    button {
      text-align: center;
      border: none;
      background: @dark-yellow;
      padding: 0 0.3rem;
      color: white;
      border-radius: 5px;
      margin-left: 6px;
    }
  }
  &-detail {
    .btopg;
    margin-top: 1.17647059em;
    box-sizing: border-box;
    &-box {
      .flex;
      .btg;
      background: white;
      padding: 1rem 2rem;
      &__icon {
        flex: 1;
        span {
          font-size: 1.8rem;
          width: 4rem;
          height: 4rem;
          line-height: 4rem;
          display: block;
          border-radius: 50%;
          color: white;
        }
      }
      &__detail {
        flex: 4;
        text-align: left;
        p {
          font-size: 1.4rem;
          width: 20rem;
          overflow: hidden;
          white-space: pre-line;
          text-overflow: ellipsis;
          @media (max-width:320px) {
            width: 16rem;
          }
          @media (min-width:400px) {
            width: 25rem;
          }
        }
      }
      &__title {
        font-size: 1.6rem;
        width: 7rem;
        text-align: left;
      }
      &__yin {
        font-size: 1.6rem;
      }
      &__content {
        font-size: 1.6rem;
        color: @red;
        margin-left: 1rem;
        white-space: nowrap;
        overflow: hidden;
        a {
          font-size: 13px;
          padding: 2px 5px;
          border: 1px solid @red;
          border-radius: 3px;
          color: @red;
        }
        button.pay {
          background: transparent;
          font-size: 13px;
          padding: 2px 5px;
          border: 1px solid @red;
          border-radius: 3px;
          color: @red;
        }
      }
    }
  }
}
</style>
