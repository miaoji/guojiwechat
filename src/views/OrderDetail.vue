<template>
  <div class="orderdetail">
    <div class="container">
      <img class="bor-top" src="../assets/images/bor_top.png" alt="bor-top">
      <!-- 寄件收件地址 -->
      <div class="orderdetail-detail">
        <div class="orderdetail-detail-box">
          <div class="orderdetail-detail-box__icon">
            <span class="bgblack">寄</span>
          </div>
          <div class="orderdetail-detail-box__detail">
            <p>{{orderInfo.senderName}}&nbsp;{{orderInfo.senderMobile}}</p>
            <p>{{orderInfo.senderCountry}}{{orderInfo.senderProv}}{{orderInfo.senderCity}}{{orderInfo.senderCounty}}&nbsp;{{orderInfo.senderAddress}}</p>
          </div>
        </div>
        <div class="orderdetail-detail-box" style="border-bottom-width: 0;">
          <div class="orderdetail-detail-box__icon">
            <span class="bgred">收</span>
          </div>
          <div class="orderdetail-detail-box__detail">
            <p>{{orderInfo.receiverName}}&nbsp;{{orderInfo.receiverMobile}}</p>
            <p>{{orderInfo.receiverCountry}}{{orderInfo.receiverProv}}{{orderInfo.receiverCity}}{{orderInfo.receiverCounty}}&nbsp;{{orderInfo.receiverAddress}}</p>
          </div>
        </div>
        <div class="purple-border">
        </div>
      </div>
      <!-- 订单状态等 -->
      <div class="orderdetail-detail">
        <div class="orderdetail-detail-box">
          <span class="orderdetail-detail-box__title">单号</span>
          <span class="orderdetail-detail-box__yin">:</span>
          <span class="orderdetail-detail-box__content">
            {{orderInfo.orderNo}}
          </span>
        </div>
        <div class="orderdetail-detail-box">
          <span class="orderdetail-detail-box__title">订单状态</span>
          <span class="orderdetail-detail-box__yin">:</span>
          <span class="orderdetail-detail-box__content">
            {{orderInfo.status | orderstatus}}
            <button class="pay" @click.stop="wxPay" v-show="orderInfo.status === 1">立即付款</button>
          </span>
        </div>
        <div class="orderdetail-detail-box">
          <span class="orderdetail-detail-box__title">预付金额</span>
          <span class="orderdetail-detail-box__yin">:</span>
          <span class="orderdetail-detail-box__content">
            <span class="money">{{orderInfo.totalFee/100}}</span>元
          </span>
        </div>
        <div class="orderdetail-detail-box">
          <span class="orderdetail-detail-box__title">待补价</span>
          <span class="orderdetail-detail-box__yin">:</span>
          <span class="orderdetail-detail-box__content">
            <load-more v-show="!getBootStatusDone" :show-loading="!getBootStatusDone"></load-more>
            <div v-show="getBootStatusDone">
              {{bootStatus['val'] === 0 ? '无' : '有'}}
              <button class="pay" @click.stop="goBootDetail({id: bootStatus['id']})" v-show="bootStatus['val'] === 1">立即补价</button>
            </div>
          </span>
        </div>
        <div class="orderdetail-detail-box">
          <span class="orderdetail-detail-box__title">补价记录</span>
          <span class="orderdetail-detail-box__yin">:</span>
          <span class="orderdetail-detail-box__content">
            <button class="pay" @click.stop="goBootList">点击查看</button>
          </span>
        </div>
        <div class="orderdetail-detail-box">
          <span class="orderdetail-detail-box__title">备注</span>
          <span class="orderdetail-detail-box__yin">:</span>
          <span class="orderdetail-detail-box__content">{{orderInfo.remark || '备注为空'}}</span>
        </div>
      </div>
      <img class="bor-bottom" src="../assets/images/bor_bot.png" alt="bor-bottom">
    </div>
    <p class="intro-p">物流信息</p>
    <div class="express-container">
      <img class="bor-top" src="../assets/images/bor_top.png" alt="bor-top">
      <!-- 路由信息 -->
      <div class="orderdetail-detail">
        <div class="logisticsresult">
          <load-more v-show="!getRouteDone" :show-loading="!getRouteDone"></load-more>
          <h2 v-show="!route.status">{{route.msg}}</h2>
          <!-- 国际路由信息 -->
          <div v-for="part, index in interTraces" class="logisticsresult-content" :class="{isfirstPart: index === 0}">
            <div class="line logisticsresult-content--part">
              <div class="line-div">
              </div>
            </div>
            <div class="logisticsresult-content--part">
              <p>{{part.context}}
              </p>
              <p>{{part.time}}</p>
            </div>
          </div>
          <!-- 国内/中通路由信息 -->
          <div v-for="part, index in traces" class="logisticsresult-content">
            <div class="line logisticsresult-content--part">
              <div class="line-div">
              </div>
            </div>
            <div class="logisticsresult-content--part">
              <p v-show="Number(part.Status) === 720">
                {{'[' + part.OptCity + ']'}}快递已经抵达上海仓，正发往机场
              </p>
              <p  v-show="Number(part.Status) === 10">{{'[' + part.OptCity + ']'}}{{part.OptSiteName}}&nbsp;{{part.OptReason}}&nbsp;
              </p>
              <p>{{part.OptDate}}</p>
            </div>
          </div>
        </div>
      </div>
      <img class="bor-bottom" src="../assets/images/bor_bot.png" alt="bor-bottom">
    </div>
  </div>
</template>
<script>
import { LoadMore } from 'vux'
import { show } from '@/services/orderInfo'
import { getLast as getLastBootByOrderNo } from '@/services/boot'
import { getZTO, getKD100 } from '@/services/expressRoute'
import { storage } from '@/utils'
import * as wxUtil from '@/utils/wx'

export default {
  name: 'orderdetail',
  components: {
    LoadMore
  },
  data () {
    return {
      orderInfo: {},
      // 0表示不需要补价， 1相反
      bootStatus: {
        val: 0,
        id: 0
      },
      payloading: false,
      getBootStatusDone: false,
      getRouteDone: false,
      route: {},
      traces: {},
      interTracesRes: {},
      interTraces: []
    }
  },
  async created () {
    try {
      this.$vux.loading.show({text: ' '})
      // 初始化wxssdk
      await wxUtil.init()
      let {id} = this.$route.query
      await this.getOrderDetail(id)
      this.$vux.loading.hide()
      // 获取订单补价信息
      await this.getLastBoot({
        orderNo: this.orderInfo.orderNo
      })
      this.getBootStatusDone = true
      // 根据中通单号获取路由信息
      const ZTONO = this.orderInfo.ZTONO || ''
      if (!ZTONO) {
        this.getRouteDone = true
        this.route['msg'] = '暂未接入物流'
      } else {
        this.getZTORoute(ZTONO)
      }
      // 根据国际单号获取路由信息
      const FPXNO = this.orderInfo.FPXNO || ''
      if (!FPXNO) {
        console.log('暂未到国外')
      } else {
        this.getInterRoute({
          company: this.orderInfo.nation_express_com,
          num: FPXNO
        })
      }
    } catch (err) {
      console.error(err)
      this.$vux.loading.hide()
    }
  },
  mounted () {
    window.document.title = '寄件明细'
  },
  methods: {
    async getOrderDetail (id) {
      try {
        const res = await show({
          id
        })
        if (res.code !== 200) {
          return this.$vux.toast.show({
            text: res.mess,
            type: 'warn',
            width: '18rem'
          })
        }
        let orderInfo = res.obj
        this.orderInfo = orderInfo
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
    async wxPay () {
      const orderNo = this.orderInfo.orderNo
      let intParams = {
        openid: storage({key: 'openid'}),
        money: (this.orderInfo.totalFee),
        orderNo,
        body: '国际快递包裹',
        payType: 0
      }
      let successParams = {
        orderNo,
        isPay: 1,
        payType: 0
      }
      const wxPayRes = await wxUtil.pay({intParams, successParams})
      this.showToast(wxPayRes)
      if (wxPayRes.type === 'success') {
        window.location.reload()
      }
    },
    async getLastBoot ({orderNo = ''}) {
      if (!orderNo) return
      const boot = await getLastBootByOrderNo({ orderNo })
      if (boot.code !== 200) return
      if (!boot.obj) return
      this.bootStatus = {
        val: 1,
        id: boot.obj.ID
      }
    },
    goBootDetail ({id}) {
      this.$router.push({path: 'bootdeal', query: {id}})
      return
    },
    goBootList () {
      this.$router.push({path: 'bootlist', query: {orderNo: this.orderInfo.orderNo}})
      return
    },
    async getZTORoute (logisticsId) {
      try {
        const orderdetail = await getZTO({
          logisticsId
        })
        this.getRouteDone = true
        if (orderdetail.code !== 200) {
          return this.$vux.toast.show({
            text: orderdetail.mess,
            type: 'warn',
            width: '18rem'
          })
        }
        let data = orderdetail.obj
        this.route['status'] = data.status
        this.route['msg'] = data.msg
        let traces = data.data.traces.reverse()
        this.traces = []
        for (let i = 0, len = traces.length; i < len; i++) {
          if (Number(traces[i].Status) === 720 || Number(traces[i].Status) === 10) {
            this.traces.push(traces[i])
          }
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
    async getInterRoute ({company, num}) {
      try {
        const interTraces = await getKD100({
          company,
          num
        })
        this.interTracesRes = interTraces.obj.message
        this.interTraces = interTraces.obj.data
      } catch (e) {
        console.error(e)
        return this.$vux.toast.show({
          text: e.message,
          type: 'warn',
          width: '18rem'
        })
      }
    }
  },
  beforeDestroy () {
    this.$vux.loading.hide()
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../assets/styles/colors.less';
@import '../assets/styles/helpers.less';
.isfirstPart {
  color: @m-yellow;
  .line {
    &:before {
      background: @m-yellow!important;
    }
    &-div {
      background: @m-yellow!important;
    }
  }
}

.bgblack {
  background-color: black;
}

.bgred {
  background-color: @red;
}

.orderdetail {
  .purple-bg;
  overflow-y: auto;
  padding-top: 10px;
  min-height: 95vh;
  .container {
    background: white;
    margin: 20px 10px;
    .bor-bottom {
      margin-bottom: -20px;
    }
  }
  &-detail {
    padding: 0 10px;
    .purple-border {
      margin: 0;
      height: 3px;
      background: url('../assets/images/border.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
    &-box {
      .flex;
      .btg;
      box-sizing: border-box;
      background: white;
      padding: 1rem 5px;
      &:last-child {
        border-bottom-width: 0;
      }
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
        font-size: 1.4rem;
        width: 5.7rem;
        text-align: left;
        color: #999;
      }
      &__yin {
        font-size: 1.4rem;
      }
      &__content {
        flex: 3;
        text-align: right;
        font-size: 1.4rem;
        color: #333;
        white-space: nowrap;
        overflow: hidden;
        .money {
          color: @m-yellow;
        }
        a {
          font-size: 13px;
          padding: 2px 5px;
          border: 1px solid @m-yellow;
          border-radius: 3px;
          color: @m-yellow;
        }
        button.pay {
          background: transparent;
          font-size: 13px;
          padding: 2px 5px;
          border: 1px solid @m-yellow;
          border-radius: 3px;
          color: @m-yellow;
        }
      }
    }
  }
  .express-container {
    .container;
    .logisticsresult {
      background: white;
      padding-top: 1rem;
      padding-bottom: 1rem;
      &-title {
        padding-left: 2rem;
        font-size: 1.4rem;
        text-align: left;
      }
      &-content {
        display: flex;
        padding: 1rem;
        padding-bottom: 0;
        &:first-child {
          p {
            color: @dark-yellow;
          }
        }
        .date-intro {
          max-width: 8rem;
        }
        &--part {
          text-align: justify;
          padding: 0 1rem;
          // flex: 1;
          p {
            font-size: 1.4rem;
          }
          p.minute {
            text-align: center;
            font-size: 1.4rem;
            max-height: 1.4rem;
            // overflow: hidden;
            white-space: nowrap;
          }
          p.date {
            text-align: center;
            font-size: 1.3rem;
            max-height: 1.3rem;
            // overflow: hidden;
            white-space: nowrap;
          }
        }
        div.line {
          width: 1rem;
          &:before {
            content: ' ';
            display: inline-block;
            width: 12px;
            height: 12px;
            background: #999;
            border-radius: 50%;
          }
          &-div {
            height: 6rem;
            width: 2px;
            margin-left: 38%;
            background: #999;
          }
        }
      }
    }
  }
}

</style>
