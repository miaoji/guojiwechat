<template>
  <div class="cargodetail">
    <div v-show="!selectExpressShow">
      <div class="container">
        <jag-container>
          <div slot="content" class="content">
            <div class="address">
              <!-- 寄件地址 -->
              <div class="address-box btg"  v-show="orderType === 0">
                <div class="address-box__icon">
                  <span class="bgred">寄</span>
                </div>
                <div class="address-box__detail">
                  <p>{{orderInfo.senderName}}&nbsp;{{orderInfo.senderMobile}}</p>
                  <p>{{orderInfo.senderCountry}}{{orderInfo.senderProv}}{{orderInfo.senderCity}}{{orderInfo.senderCounty}}&nbsp;{{orderInfo.senderAddress}}</p>
                </div>
              </div>
              <!-- 收件地址 -->
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
            <!-- 直邮订单状态 -->
            <div class="detail" v-show="orderInfo['type'] === 0">
              <div class="detail-box">
                <colon-span title="订单编号">
                  <template slot="content">
                    <div>
                      <span id="orderno">{{orderInfo.orderNo}}</span>
                      <button class="pay" id="copyBtn1" data-clipboard-target="#orderno">复制</button>
                    </div>
                  </template>
                </colon-span>
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
                      <span class="money">{{totalFee}}</span>
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
                <colon-span title="是否补价">
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
              <div class="detail-box" v-show="orderInfo['remark']">
                <colon-span title="备注信息">
                  <template slot="content">
                    <div class="remark-info">
                      {{orderInfo['remark']}}
                    </div>
                  </template>
                </colon-span>
              </div>
            </div>
            <!-- 集运未合单的状态 -->
            <div class="detail" v-show="orderInfo['type'] === 1 && orderInfo.parentId === 0">
              <div class="detail-box">
                <colon-span title="国内单号">
                  <template slot="content">
                    <div>
                      <span id="cargoingCnNo">{{orderInfo.cnNo}}</span>
                      <button class="pay" id="copyBtn2" data-clipboard-target="#cargoingCnNo">复制</button>
                    </div>
                  </template>
                </colon-span>
              </div>
              <div class="detail-box">
                <colon-span title="批次单号" :value="orderInfo.batch"></colon-span>
              </div>
              <div class="detail-box">
                <colon-span title="下单时间" :value="createTime"></colon-span>
              </div>
              <div class="detail-box">
                <colon-span title="订单状态" value="待填写单号">
                  <template slot="content">
                    <div>
                      <span class="money">{{cargoStatus | cargostatus}}</span>
                    </div>
                  </template>
                </colon-span>
              </div>
              <div class="detail-box">
                <colon-span title="产品名称" :value="orderInfo.orderName"></colon-span>
              </div>
              <div class="detail-box">
                <colon-span title="产品价值">
                  <template slot="content">
                    <div>
                      <span class="money">{{totalFee}}</span>
                    </div>
                  </template>
                </colon-span>
              </div>
            </div>
            <!-- 集运合单后的订单状态 -->
            <div class="detail" v-show="orderInfo['type'] === 1 && orderInfo.parentId !== 0">
              <div class="detail-box">
                <colon-span title="订单编号">
                  <template slot="content">
                    <div>
                      <span id="cargoDoneOrderno">{{orderInfo.orderNo}}</span>
                      <button class="pay" id="copyBtn3" data-clipboard-target="#cargoDoneOrderno">复制</button>
                    </div>
                  </template>
                </colon-span>
              </div>
              <div class="detail-box">
                <colon-span title="批次单号" :value="orderInfo.batch"></colon-span>
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
                      <span class="money">{{totalFee}}</span>
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
                <colon-span title="是否补价">
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
              <div class="detail-box" v-show="orderInfo['remark']">
                <colon-span title="备注信息">
                  <template slot="content">
                    <div class="remark-info">
                      {{orderInfo['remark']}}
                    </div>
                  </template>
                </colon-span>
              </div>
              <div class="detail-box" v-show="WarehouseManagementExpenses > 0">
                <colon-span title="仓管费用">
                  <template slot="content">
                    <div>
                      <span class="money">{{WarehouseManagementExpenses}}</span>元
                    </div>
                  </template>
                </colon-span>
                <tips content="仓库管理费用，货物在仓库中超过21天时收取，每天1元"></tips>
              </div>
            </div>
          </div>
        </jag-container>
      </div>
      <div class="container" v-show="orderInfo['type'] === 1 && parentId !== 0">
        <p class="intro-p">包裹信息</p>
        <jag-container>
          <div slot="content" class="content">
            <!-- 包裹信息 -->
            <div class="package">
              <div class="packagelist">
                <div class="packagelist-item" v-for="item in batchList">
                  <img src="../../assets/images/package.png" alt="">
                  <div class="packagelist-item--intro">
                    <p>
                      {{item['orderName']}}, 价值:￥{{item['totalFee']/100}}
                    </p>
                    <p>
                      {{item['kdCompany'] ? ('物流公司:' + item['kdCompany']['companyName'] || '') : ''}}
                      国内段单号:{{item['cnNo']}}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </jag-container>
      </div>
      <div class="container">
        <p class="intro-p">物流信息</p>
        <jag-container>
          <div slot="content" class="content">
            <!-- 路由信息 -->
            <div class="express">
              <p class="add-cnno" v-show="orderInfo['type'] === 1 && parentId === 0" @click.stop="packageShow = true">
                <button class="">{{!cnNo ? '立即添加' : '点击修改'}}</button>
              </p>
              <express-route
                :cnNo="cnNo"
                :cnCompany="cnCompany || 'zhongtong'"
                :intelNo="intelNo"
                :intelCompany="intelCompany"
                :onlycn="onlycn"
                :onlyintel="onlyintel"
              >
              </express-route>
            </div>
          </div>
        </jag-container>
      </div>
    </div>
    <!-- 添加国内段单号 -->
    <div>
      <x-dialog v-model="packageShow" class="pdialog">
        <h1>添加国内段单号</h1>
        <div class="package-close" @click="packageShow = false">
          <span class="vux-close"></span>
        </div>
        <div class="pdialog-form">
          <group label-width="7rem" label-align="left">
            <x-input title="产品名称" type="text" v-model="orderInfo.orderName" disabled></x-input>
            <x-input title="产品价值" type="text" :value="totalFee" disabled></x-input>
            <x-input
              title="快递公司"
              placeholder="点击选择快递公司"
              v-model="newPackage['companyName']"
              @click.native="onClickExSelect"
            >
            </x-input>
            <x-input title="国内单号" type="text" v-model="newPackage['cnNo']"></x-input>
          </group>
          <div class="pdialog-form__confrim">
            <button type="" class="pdialog-form__confrim--cancle" @click="packageShow = false">取消</button>
            <button type="" class="pdialog-form__confrim--sure" @click="changeOrder">确定</button>
          </div>
        </div>
      </x-dialog>
    </div>
    <!-- 选择快递公司 -->
    <select-box
      :show="selectExpressShow"
      type="pickup"
      defaultName="顺丰"
      @listenBoxClose="onExpressClose"
      @listenBoxConfirm="onExpressConfirm"
    >
    </select-box>
  </div>
</template>
<script>
import { LoadMore, XDialog, XInput } from 'vux'
import JagContainer from '@/components/JagContainer'
import ColonSpan from '@/components/ColonSpan'
import ExpressRoute from '@/components/ExpressRoute'
import LoadToshow from '@/components/load/WithService'
import SelectBox from '@/components/SelectBox'
import Tips from '@/components/Tips'
import { show, update } from '@/services/orderInfo'
import { getLast as getLastBootByOrderNo } from '@/services/boot'
import { show as cargoShow } from '@/services/cargo'
import { storage, time } from '@/utils'
import * as wxUtil from '@/utils/wx'
import Clipboard from 'clipboard'

export default {
  name: 'cargodetail',
  components: {
    LoadMore,
    XDialog,
    XInput,
    JagContainer,
    ColonSpan,
    ExpressRoute,
    LoadToshow,
    SelectBox,
    Tips
  },
  data () {
    return {
      orderId: '',
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
      intelCompany: '',
      // 同一批次号订单集合
      batchList: [],
      packageShow: false,
      newPackage: {
        kdCompanyCodeCn: '',
        companyName: '',
        cnNo: ''
      },
      selectExpressShow: false,
      changeData: {}
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
      let totalFee = Number(this.orderInfo.totalFee)
      if (totalFee === 0) {
        return '定价中'
      }
      totalFee = totalFee / 100
      return `￥${totalFee}`
    },
    orderType () {
      // 0 直邮, 1 集运
      return this.orderInfo['type'] || 0
    },
    onlycn () {
      return this.orderType === 1 ? (this.parentId === 0) : false
    },
    onlyintel () {
      return this.orderType === 1 ? (this.parentId !== 0) : false
    },
    parentId () {
      return Number(this.orderInfo.parentId)
    },
    cargoStatus () {
      const cargoStatus = this.orderInfo.cargoStatus
      const cn = this.orderInfo.cnNo
      if (!cn && cargoStatus === 0) {
        return 0
      } else if (cn && cargoStatus === 0) {
        return 1
      } else if (cargoStatus === 1) {
        return 2
      }
    },
    WarehouseManagementExpenses () {
      const createTime = this.orderInfo.createTime
      const nowDay = new Date()
      const dayReduce = createTime - nowDay.getTime()
      const keepDays = Math.floor(dayReduce / (24 * 3600 * 1000)) - 21
      if (keepDays > 0) {
        return keepDays * 1
      }
      return 0
    }
  },
  async created () {
    try {
      this.$vux.loading.show({text: ' '})
      // 初始化wxssdk
      await wxUtil.init()
      let {id} = this.$route.query
      this.orderId = id
      await this.getOrderDetail(id)
      this.$vux.loading.hide()
      // 获取订单补价信息
      await this.getLastBoot({
        orderNo: this.orderInfo.orderNo
      })
      this.getBootStatusDone = true
      if (this.orderInfo['batch']) {
        await this.getBatchList()
      }
    } catch (err) {
      console.error(err)
      this.$vux.loading.hide()
    }
  },
  mounted () {
    /* eslint-disable no-new */
    new Clipboard('#copyBtn1')
    new Clipboard('#copyBtn2')
    new Clipboard('#copyBtn3')
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
        this.intelNo = orderInfo.intlNo
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
    async getBatchList (batch) {
      // 查询批次下订单
      try {
        const res = await cargoShow({
          wxUserId: storage({
            key: 'userId'
          }),
          batch: this.orderInfo.batch,
          id: this.orderInfo.id
        })
        if (res.success && res.code === 200) {
          this.batchList = res['obj'][0]['orderDetailList'] || []
        }
      } catch (e) {
        console.error(e)
      }
    },
    async wxPay () {
      const orderNo = this.orderInfo.orderNo
      const money = this.orderInfo.totalFee
      if (Number(money) === 0) {
        this.$vux.toast.show({
          text: '正在定价中，定价结束后会有微信模板消息通知',
          type: 'text',
          width: '22rem',
          time: 2500
        })
        return
      }
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
    },
    onClickExSelect () {
      this.selectExpressShow = true
      this.packageShow = false
    },
    onExpressClose () {
      this.selectExpressShow = false
      this.packageShow = true
    },
    onExpressConfirm (val) {
      this.newPackage['kdCompanyCodeCn'] = val['companyCode']
      this.newPackage['companyName'] = val['companyName']
    },
    async changeOrder () {
      const _this = this
      let complete = []
      Object.keys(_this.newPackage).forEach(function (key) {
        if (!_this.newPackage[key]) {
          complete.push(false)
        } else {
          complete.push(true)
        }
      })
      if (complete.includes(false)) {
        _this.$vux.toast.show({
          type: 'warn',
          text: '请将信息填写完整',
          width: '16rem',
          time: '600'
        })
        return
      }
      const changeData = {
        kdCompanyCodeCn: this.newPackage['kdCompanyCodeCn'],
        cnNo: this.newPackage['cnNo']
      }
      try {
        this.$vux.loading.show()
        const res = await update({
          id: this.orderInfo['id'],
          ...changeData
        })
        if (res.code === 200) {
          this.$vux.toast.show({
            text: res.msg || '修改成功',
            type: 'success',
            width: '16rem'
          })
          this.newPackage = {
            kdCompanyCodeCn: '',
            cnNo: ''
          }
          await this.getOrderDetail(this.orderId)
          this.packageShow = false
        } else {
          this.$vux.toast.show({
            text: res.msg || '修改失败',
            type: 'success',
            width: '18rem'
          })
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.$vux.loading.hide()
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
  .express-container {
    margin-top: 0;
  }
  .container {
    margin: 20px 10px 0px 10px;
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
        padding: 10px 0;
        &__icon {
          margin-right: 1rem;
          span {
            font-size: @normal-size;
            width: 3rem;
            height: 3rem;
            line-height: 3rem;
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
            width: 22rem;
            overflow: hidden;
            white-space: pre-line;
            text-overflow: ellipsis;
            @media (max-width:320px) {
              width: 18rem;
            }
            @media (min-width:375px) {
              width: 24rem;
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
        padding: 10px 0;
        &:last-child {
          border-bottom-width: 0;
        }
      }
    }
    .intro-p {
      color: #fff;
      text-align: center;
      font-size: @middle-size;
      padding-bottom: 20px;
    }
    .express {
      padding: .5rem 0;
      .add-cnno {
        position: absolute;
        margin-top: 10px;
        left: 45%;
        button {
          background: transparent;
          font-size: @small-size;
          padding: 1px 5px;
          border: 1px solid @m-yellow;
          border-radius: @radius-size;
          color: @m-yellow;
        }
      }
    }
    .money {
      color: @m-yellow;
    }
    .package {
      padding: 0 10px;
      padding-bottom: 2px;
    }
  }
  .remark-info {
    white-space: pre-line;
    text-align: justify;
  }
}

</style>
