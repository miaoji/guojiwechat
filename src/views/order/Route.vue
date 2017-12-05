<template>
  <div class="orderroute">
    <div v-show="!selectExpressShow">
      <div class="container">
        <jag-container>
          <div slot="content" class="content">
            <!-- 路由信息 -->
            <div class="express">
              <div class="express-info" v-show="orderInfo['type'] === 1">
                <p>批次号: {{orderInfo['batch']}}</p>
                <p v-show="orderInfo['parentId'] === 0">国内段单号: {{orderInfo['cnNo']}}</p>
              </div>
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
import ExpressRoute from '@/components/ExpressRoute'
import LoadToshow from '@/components/load/WithService'
import SelectBox from '@/components/SelectBox'
import { show, update } from '@/services/orderInfo'

export default {
  name: 'orderroute',
  components: {
    LoadMore,
    XDialog,
    XInput,
    JagContainer,
    ExpressRoute,
    LoadToshow,
    SelectBox
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
    totalFee () {
      let totalFee = Number(this.orderInfo.totalFee)
      if (totalFee === 0) {
        return '定价中'
      }
      totalFee = totalFee / 100
      return `￥${totalFee}`
    },
    onlycn () {
      return this.orderType === 1 ? (this.parentId === 0) : false
    },
    onlyintel () {
      return this.orderType === 1 ? (this.parentId !== 0) : false
    },
    parentId () {
      return Number(this.orderInfo.parentId)
    }
  },
  async created () {
    try {
      this.$vux.loading.show({text: ' '})
      let {id} = this.$route.query
      this.orderId = id
      await this.getOrderDetail(id)
      this.$vux.loading.hide()
    } catch (err) {
      console.error(err)
      this.$vux.loading.hide()
    }
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

.orderroute {
  .purple-bg;
  overflow-y: auto;
  min-height: 100vh;
  .container {
    margin: 20px 10px 0px 10px;
    .content {
      background: white;
    }
    .express {
      padding: .5rem 0;
      &-info {
        text-align: left;
        font-size: @normal-size;
        padding: 0 10px;
      }
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
