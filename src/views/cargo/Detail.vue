<template>
  <div class="cargodetail">
    <div class="container">
      <jag-container>
        <div slot="content" class="content">
          <!-- 收件地址 -->
          <div class="address">
            <div class="address-box">
              <div class="address-box__icon">
                <span class="bgblack">收</span>
              </div>
              <div class="address-box__detail">
                <p>{{orderInfo.receiverName}}&nbsp;{{orderInfo.receiverMobile}}</p>
                <p>{{orderInfo.receiverCountry}}{{orderInfo.receiverProv}}{{orderInfo.receiverCity}}{{orderInfo.receiverCounty}}&nbsp;{{orderInfo.receiverAddress}}</p>
              </div>
            </div>
            <div class="purple-border">
            </div>
          </div>
          <!-- 未合单的状态 -->
          <div class="detail" v-show="orderInfo.parentId === 0">
            <div class="detail-box">
              <colon-span title="订单编号">
                <template slot="content">
                  <div>
                    <span id="orderno">{{orderInfo.orderNo}}</span>
                    <button class="pay" id="copyBtn" data-clipboard-target="#orderno">复制</button>
                  </div>
                </template>
              </colon-span>
            </div>
            <div class="detail-box">
              <colon-span title="下单时间" :value="createTime"></colon-span>
            </div>
            <div class="detail-box">
              <colon-span title="订单状态" value="正在合单"></colon-span>
            </div>
            <div class="detail-box">
              <colon-span title="产品名称" :value="orderInfo.orderName"></colon-span>
            </div>
            <div class="detail-box">
              <colon-span title="产品价值">
                <template slot="content">
                  <div>
                    <span class="money">{{totalFee}}</span>元
                  </div>
                </template>
              </colon-span>
            </div>
          </div>
          <!-- 合单后的订单状态 -->
          <div class="detail" v-show="orderInfo.parentId !== 0">
            <div class="detail-box">
              <colon-span title="订单编号" :value="orderInfo.orderNo"></colon-span>
            </div>
            <div class="detail-box">
              <colon-span title="下单时间" :value="createTime"></colon-span>
            </div>
            <div class="detail-box">
              <colon-span title="订单状态">
                <template slot="content">
                  <div>
                    {{orderInfo.status | orderstatus}}
                    <button class="pay" @click.stop="wxPay" v-show="orderInfo.status === 1">立即付款</button>
                  </div>
                </template>
              </colon-span>
            </div>
            <div class="detail-box">
              <colon-span title="预付金额">
                <template slot="content">
                  <div>
                    <span class="money">{{totalFee}}</span>元
                  </div>
                </template>
              </colon-span>
            </div>
            <div class="detail-box" v-show='orderInfo.insuredAmount===0?false:true'>
              <colon-span title="保价金额">
                <template slot="content">
                  <div>
                    <span class="money">{{orderInfo.insuredAmount}}</span>元
                  </div>
                </template>
              </colon-span>
            </div>
            <div class="detail-box"  v-show='orderInfo.insuredAmount===0?false:true'>
              <colon-span title="保费">
                <template slot="content">
                  <div>
                    <span class="money">{{orderInfo.insuredPrice}}</span>元
                  </div>
                </template>
              </colon-span>
            </div>
            <div class="detail-box">
              <colon-span title="待补价">
                <template slot="content">
                  <load-more v-show="!getBootStatusDone" :show-loading="!getBootStatusDone"></load-more>
                  <div v-show="getBootStatusDone">
                    {{bootStatus['val'] === 0 ? '无' : '有'}}
                    <button class="pay" @click.stop="goBootDetail({id: bootStatus['id']})" v-show="bootStatus['val'] === 1">立即补价</button>
                  </div>
                </template>
              </colon-span>
            </div>
            <div class="detail-box">
              <colon-span title="补价记录">
                <template slot="content">
                  <button class="pay" @click.stop="goBootList">点击查看</button>
                </template>
              </colon-span>
            </div>
          </div>
        </div>
      </jag-container>
    </div>
    <p class="intro-p">物流信息</p>
    <div class="container">
      <jag-container>
        <div slot="content" class="content">
          <!-- 路由信息 -->
          <div class="express">
            <express-route
              :cnNo="cnNo"
              :cnCompany="cnCompany"
              :intelNo="intelNo"
              :intelCompany="intelCompany"
              :onlycn="parentId === 0"
              :onlyintel="parentId !== 0"
            >
            </express-route>
          </div>
        </div>
      </jag-container>
    </div>
  </div>
</template>
<script>
import { LoadMore } from 'vux'
import JagContainer from '@/components/JagContainer'
import ColonSpan from '@/components/ColonSpan'
import ExpressRoute from '@/components/ExpressRoute'
import { show } from '@/services/orderInfo'
import { getLast as getLastBootByOrderNo } from '@/services/boot'
import { storage, time } from '@/utils'
import * as wxUtil from '@/utils/wx'
import Clipboard from 'clipboard'

export default {
  name: 'cargodetail',
  components: {
    LoadMore,
    JagContainer,
    ColonSpan,
    ExpressRoute
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
      cnCompany: '',
      cnNo: '',
      intelNo: '',
      intelCompany: ''
    }
  },
  computed: {
    createTime () {
      try {
        const date = new Date(this.orderInfo.createTime)
        return time.format('yyyy-MM-dd hh:mm:ss', date)
      } catch (e) {
        console.error(e)
        return '000:000'
      }
    },
    totalFee () {
      return this.orderInfo.totalFee / 100
    },
    parentId () {
      return Number(this.orderInfo.parentId)
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
    } catch (err) {
      console.error(err)
      this.$vux.loading.hide()
    }
  },
  mounted () {
    /* eslint-disable no-new */
    new Clipboard('#copyBtn')
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
        this.cnNo = orderInfo.cnNo
        this.cnCompany = orderInfo.kdCompanyCodeCn
        this.intlNo = orderInfo.intlNo
        this.intelCompany = orderInfo.kdCompanyCode
        return
      } catch (e) {
        console.error(e)
        return this.$vux.toast.show({
          text: '网络错误',
          type: 'warn',
          width: '18rem'
        })
      }
    },
    async wxPay () {
      const orderNo = this.orderInfo.orderNo
      const money = this.orderInfo.totalFee
      let initParams = {
        openid: storage({key: 'openid'}),
        money,
        orderNo,
        body: '国际快递包裹',
        payType: 0,
        closingPriceId: 0
      }
      let successParams = {
        orderNo,
        total: money,
        isPay: 1,
        paymentStatus: 1,
        payType: 0
      }
      try {
        const wxPayRes = await wxUtil.pay({initParams, successParams})
        this.$vux.toast.show(wxPayRes)
        if (wxPayRes.type === 'success') {
          window.location.reload()
        }
      } catch (e) {
        console.error(e)
        this.$vux.toast.show(e)
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
    }
  },
  beforeDestroy () {
    this.$vux.loading.hide()
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../assets/styles/colors.less';
@import '../../assets/styles/helpers.less';
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

.cargodetail {
  .purple-bg;
  overflow-y: auto;
  min-height: 100vh;
  .container {
    margin: 20px 10px;
    .content {
      background: white;
    }
    .address {
      padding: 0 10px;
      .purple-border {
        margin: 0;
        height: 3px;
        background: url('../../assets/images/border.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
      &-box {
        .flex;
        padding: 1rem 5px;
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
            font-size: @normal-size;
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
      }
    }
    .detail {
      padding: 0 10px;
      &-box {
        .btg;
        box-sizing: border-box;
        background: white;
        padding: 1rem 5px;
        &:last-child {
          border-bottom-width: 0;
        }
      }
    }
    .express {
      padding: 1rem 10px;
    }
    button.pay {
      background: transparent;
      font-size: @normal-size;
      padding: 1px 5px;
      border: 1px solid @m-yellow;
      border-radius: @radius-size;
      color: @m-yellow;
    }
    .money {
      color: @m-yellow;
    }
  }
}

</style>
