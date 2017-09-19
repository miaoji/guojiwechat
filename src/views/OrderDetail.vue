<template>
  <div class="orderdetail">
    <div class="container">
      <!-- 寄件收件地址 -->
      <div class="orderdetail-detail">
        <div class="orderdetail-detail-box">
          <div class="orderdetail-detail-box__icon">
            <span class="bgblack">寄</span>
          </div>
          <div class="orderdetail-detail-box__detail">
            <p>{{data.listMailingaddress ? data.listMailingaddress[0].linkman : ''}}&nbsp;{{data.listMailingaddress ? data.listMailingaddress[0].iphone : ''}}</p>
            <p>{{sendAddress['allName']}}&nbsp;{{data.listMailingaddress ? data.listMailingaddress[0].detailedinformation : ''}}</p>
          </div>
        </div>
        <div class="orderdetail-detail-box">
          <div class="orderdetail-detail-box__icon">
            <span class="bgred">收</span>
          </div>
          <div class="orderdetail-detail-box__detail">
            <p>{{data.listConsigneeaddress ? data.listConsigneeaddress[0].recipients : ''}}&nbsp;{{data.listConsigneeaddress ? data.listConsigneeaddress[0].iphone : ''}}</p>
            <p>{{pickupAddress['allName']}}&nbsp;{{data.listConsigneeaddress ? data.listConsigneeaddress[0].detaliedinformation : ''}}</p>
          </div>
        </div>
      </div>
      <!-- 订单状态等 -->
      <div class="orderdetail-detail">
        <div class="orderdetail-detail-box">
          <span class="orderdetail-detail-box__title">订单状态</span>
          <span class="orderdetail-detail-box__yin">:</span>
          <span class="orderdetail-detail-box__content">
            {{data.starte | orderstatus}}
            <button class="pay" @click.stop="wxpay" v-show="data.starte === 1">立即付款</button>
          </span>
        </div>
        <div class="orderdetail-detail-box">
          <span class="orderdetail-detail-box__title">预付金额</span>
          <span class="orderdetail-detail-box__yin">:</span>
          <span class="orderdetail-detail-box__content">{{data.totalFee/100}}元</span>
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
          <span class="orderdetail-detail-box__content">{{data.remove}}</span>
        </div>
      </div>
      <!-- 路由信息 -->
      <div class="orderdetail-detail">
        <div class="logisticsresult">
          <p class="logisticsresult-title">物流信息:</p>
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
    </div>
  </div>
</template>
<script>
import { LoadMore } from 'vux'
import { mapActions } from 'vuex'
import { order as orderApi } from '@/api'
import { storage } from '@/utils'
import request from '@/utils/request'
import * as wxUtil from '@/utils/wx'

export default {
  name: 'orderdetail',
  components: {
    LoadMore
  },
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
      let query = this.$route.query
      let serialnumber = query.serialnumber || 1
      this.serialnumber = serialnumber
      await this.getOrderDetail(serialnumber)
      this.$vux.loading.hide()
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
      this.getBootStatusDone = true
      // 根据中通单号获取路由信息
      const ZTONO = this.data.ZTONO
      if (!ZTONO) {
        this.getRouteDone = true
        this.route['msg'] = '暂未接入物流'
      } else {
        this.getZTORoute(ZTONO)
      }
      // 根据国际单号获取路由信息
      const FPXNO = this.data.FPXNO
      if (!FPXNO) {
        console.log('暂未到国外')
      } else {
        this.getInterRoute({
          company: this.data.nation_express_com,
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
    ...mapActions([
      'getGeography',
      'getBoot'
    ]),
    async getOrderDetail (serialnumber = 1) {
      try {
        const orderdetail = await request({
          method: 'post',
          auth: true,
          url: orderApi.detailbyserialnumber,
          params: {
            serialnumber
          }
        })
        if (orderdetail.code !== 200) {
          return this.$vux.toast.show({
            text: orderdetail.mess,
            type: 'warn',
            width: '18rem'
          })
        }
        let data = orderdetail.obj
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
      const serialnumber = this.serialnumber
      let intParams = {
        openid: storage({key: 'openid'}),
        money: (this.data.totalFee),
        serialnumber,
        body: '国际快递包裹',
        payType: 0
      }
      let successParams = {
        serialnumber,
        isPay: 1,
        payType: 0
      }
      const wxPayRes = await wxUtil.pay({intParams, successParams})
      this.showToast(wxPayRes)
      if (wxPayRes.type === 'success') {
        this.data.starte = 2
      } else {
        window.location.reload()
      }
    },
    goBootDetail ({id}) {
      this.$router.push({path: 'bootdeal', query: {id}})
      return
    },
    goBootList () {
      this.$router.push({path: 'bootlist', query: {serialnumber: this.serialnumber}})
      return
    },
    async getZTORoute (logisticsId) {
      try {
        const orderdetail = await request({
          method: 'post',
          url: orderApi.ztoinfo,
          auth: true,
          params: {
            logisticsId
          }
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
        const interTraces = await request({
          method: 'post',
          url: orderApi.kd100,
          auth: true,
          params: {
            company,
            num
          }
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
@grey: #efeff4;

.isfirstPart {
  color: @red;
  .line {
    &:before {
      background: @red!important;
    }
    &-div {
      background: @red!important;
    }
  }
}

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

.orderdetail {
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
        font-size: 1.4rem;
        width: 5.7rem;
        text-align: left;
      }
      &__yin {
        font-size: 1.4rem;
      }
      &__content {
        font-size: 1.4rem;
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
</style>
