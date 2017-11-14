<template>
  <div class="assess">
    <div class="assess-container" v-show="mainContainerShow">
      <div class="assess-container-select" >
        <div class="assess-container-title">估价系统</div>
        <group label-width="8rem" label-align="left">
          <x-input 
            title="国家/地区" 
            @click.native="onClickCountry" 
            disabled 
            placeholder="请选择国家/地区" 
            type="text"
            required 
            v-model="country['name']" 
            text-align="right"
          ></x-input>
          <popup-picker
            class="popup_picker"
            :data="packagePrductList"
            v-model="packagePrductVal"
            show-name
            placeholder="请选择产品类型"
            :columns="2"
            :show="packageShow"
            @on-show="packageClick"
            @on-change="onChange"
            ref="packagePrductPicker"
          >
            <template slot="title">
              <span>
                <span style="vertical-align:middle;">产品类型</span>
              </span>
            </template>
          </popup-picker>
          <x-input
            title="包裹重量"
            type="number"
            v-model="weight"
            text-align='right'
            placeholder="请填写包裹重量"
          >
          </x-input>
          <selector 
            direction="rtl"
            v-model="isOffer"
            placeholder="是否保价"
            title="是否保价"
            name="isoffer"
            :options="isOfferOption"
            @on-change='isofferShowChange'
          >
          </selector>
          <div class="float-icon"><span class="float-icon-img" @click='isofferPromptInfoShow = true'><img src="../../assets/images/question.png"></span></div>
          <x-input
            title="保价金额"
            v-model="offer"
            v-show='isofferShow'
            :max="maxOffer"
            type="number"
            text-align='right'
            placeholder="请填写保价金额"
            @on-change='offerChange'
          >
          </x-input>
        </group>
      </div>
      <div class="div-btn-sub"> 
        <button class="btn-sub" @click="validateInfo">估算运费</button>
      </div>
      <div style="height:200px"></div>
    </div>
    <!-- 估价信息弹出框 -->
    <div v-transfer-dom>
      <x-dialog v-model="popupShow" class="send-package-dialog">
        <h1>估价结果</h1>
        <div class="package-close" @click="popupShow = false">
          <span class="vux-close"></span>
        </div>
        <br/>
        <div class="package-prompt-info">
          运费价格 : {{price}} 元
        </div>
        <div class="popup-btn-sub"> 
          <button class="btn-sub" @click="toSend">前往寄件</button>
        </div>
      </x-dialog>
    </div>
    <!-- 保价提示信息弹出框 -->
    <div v-transfer-dom>
      <x-dialog v-model="isofferPromptInfoShow" class="send-package-dialog">
        <h1>保价说明</h1>
        <div class="package-close" @click="isofferPromptInfoShow = false">
          <span class="vux-close"></span>
        </div>
        <div class="offer-prompt-info">
          此项服务以自愿为原则。寄件人选择此项服务时，应确定保价金额与每个邮件内件实际价值一致，每个邮件保价金额最高限额为二十万元人民币，保价费按申报的保价金额的0.5%收取，每件最低收取1.00元人民币。未按规定交纳保价费的快件，不属于保价快件。
        </div>
      </x-dialog>
    </div>
    <select-country
      :show="selectCountryShow"
      :type="typecn"
      :countryName="country['name']"
      @listenCountryClose="onCountryClose"
      @listenCountryConfirm="onCountryConfirm"
    >
    </select-country>
  </div>
</template>

<script>
import { XInput, Selector, PopupPicker, Toast, XDialog, TransferDomDirective as TransferDom } from 'vux'
import SelectCountry from '@/views/address/components/SelectCountry'
import * as priceService from '@/services/price'
import * as packageTypeService from '@/services/packageType'

export default {
  name: 'assess',
  directives: {
    TransferDom
  },
  components: {
    XInput,
    XDialog,
    Selector,
    Toast,
    PopupPicker,
    SelectCountry
  },
  data () {
    return {
      country: {
        id: 0,
        name: '',
        code: ''
      },
      packageShow: false,
      // 价格
      price: 0,
      // 保价信息弹出框
      popupShow: false,
      // 保价信息提示框
      isofferPromptInfoShow: false,
      typecn: 'pickup',
      // 重量
      weight: null,
      // 包裹类型
      packageType: null,
      packageTypeOption: [],
      // 产品类型
      productType: null,
      productTypeOption: [],
      // 当前页面的显示与隐藏
      mainContainerShow: true,
      // 国家选择页面的显示与隐藏
      selectCountryShow: false,
      // 控制保价金额的位数
      maxOffer: null,
      // 控制保价金额输入框的显示与隐藏
      isofferShow: false,
      // 保价
      // 0 不保价 1 保价
      isOffer: 0,
      // 报价信息
      offer: 0,
      // 保费
      insuredPrice: 0,
      // 0 不保价 1 保价
      isOfferOption: [{
        key: 0,
        value: '否'
      }, {
        key: 1,
        value: '是'
      }],
      // 订单配置 包裹类型&&产品类型
      packagePrductVal: [],
      packagePrductList: []
    }
  },
  computed: {
    packageTypeSelectContrl () {
      let placeholder = '选择包裹类型'
      if (!this.pickupAddress['countryId']) {
        placeholder = '请先选择收件地址'
      }
      return {
        placeholder
      }
    }
  },
  methods: {
    packageClick () {
      if (!this.country.id) {
        this.$refs.packagePrductPicker.onHide()
        this.$vux.toast.show({
          type: 'warn',
          text: '请选择国家',
          width: '15rem'
        })
        return
      }
    },
    onChange (val) {
      console.log('valaaa', val)
    },
    /**
     * [根据国家id获取包裹类型]
     * @return {[type]} [description]
     */
    async getPackageType ({countryId}) {
      try {
        const packageTypeRes = await packageTypeService.queryCascade({
          countryId
        })
        if (packageTypeRes.success && packageTypeRes.statusCode && packageTypeRes.obj) {
          const resData = packageTypeRes.obj
          let returnData = []
          for (let i = 0, len = resData.length; i < len; i++) {
            const packageData = resData[i]
            console.log('product', packageData)
            const parentVal = JSON.stringify({'package': packageData.id, 'minRange': packageData.minRange, 'maxRange': packageData.maxRange})
            const packageItem = {
              name: `${packageData.nameCn}[${packageData.minRange}~${packageData.maxRange}kg]`,
              value: parentVal,
              parent: 0
            }
            returnData.push(packageItem)
            const productList = packageData.productTypeList
            for (let j = 0, len = productList.length; j < len; j++) {
              let product = productList[j]
              let productItem = {
                name: product.productName,
                value: JSON.stringify({'product': product.id}),
                parent: parentVal
              }
              returnData.push(productItem)
            }
          }
          return returnData
        } else {
          return false
        }
      } catch (e) {
        console.error(e)
        return false
      }
    },
    onClickCountry () {
      this.mainContainerShow = false
      this.selectCountryShow = true
    },
    onCountryClose () {
      this.mainContainerShow = true
      this.selectCountryShow = false
    },
    onCountryConfirm (val) {
      const oldName = this.country['name']
      if (val['name'] !== oldName) {
        this.country = val
      }
    },
    onPackageTypeChange (val) {
      if (!val) return
    },
    onProduTypeChange (val) {
      if (!val) return
    },
    /**
     * [保价金额输入按钮显示触发方法]
     */
    isofferShowChange (val) {
      if (val === 1) {
        this.isofferShow = true
      } else {
        this.isofferShow = false
        this.offer = null
        this.maxOffer = null
      }
    },
    // 在输入报价金额的时候查询订单金额
    offerChange (val) {
      if (Number(val) > 200000 || Number(val) === 200000) {
        this.offer = 200000
        this.maxOffer = 6
      } else {
        this.maxOffer = null
      }
    },
    validateInfo () {
      // 检测是否选择了国家
      if (!this.country.id) {
        this.$vux.toast.show({
          type: 'warn',
          text: '请选择国家',
          width: '15rem'
        })
        return
      }
      // 检测是否填写产品的重量
      if (!(JSON.parse(this.packageType).maxRange >= this.weight && JSON.parse(this.packageType).minRange < this.weight)) {
        this.$vux.toast.show({
          type: 'warn',
          text: '请根据产品类型的范围填写重量',
          width: '15rem'
        })
        return
      }
      if (this.weight > 20) {
        this.$vux.toast.show({
          type: 'warn',
          text: '包裹不能超过20kg',
          width: '15rem'
        })
        return
      }
      if (this.isOffer === 1 && !(this.offer)) {
        this.$vux.toast.show({
          type: 'warn',
          text: '请填写保费',
          width: '15rem'
        })
        return
      }
      this.submitOrderInfo()
    },
    async submitOrderInfo () {
      this.$vux.loading.show()
      const data = await priceService.showAdvanced({
        countryId: this.country.id,
        packageTypeId: JSON.parse(this.packageType).package,
        productTypeId: JSON.parse(this.productType).product,
        weight: this.weight
      })
      if (data.code === 200 && data.obj) {
        this.$vux.loading.hide()
        if (this.isOffer === 1 && this.offer <= 200) {
          // 当保价金额等于或者小于200元,保费按标准1元收取
          this.price = data.obj.finalPrice + 1
        } else if (this.isOffer === 1 && this.offer > 200) {
          // 当保价金额大于200元时,保费按保价金额的0.5%收取
          this.price = data.obj.finalPrice + Math.round(Number(this.offer) * 0.005)
        } else {
          // 当用户没有选择保价的时候,没有保费
          this.price = data.obj.finalPrice
        }
        this.popupShow = true
      } else {
        this.$vux.loading.hide()
        this.$vux.toast.show({
          type: 'warn',
          text: '获取失败,请重试',
          width: '15rem'
        })
      }
    },
    toSend () {
      this.$router.push({ path: '/send' })
    }
  },
  watch: {
    packagePrductVal (val, oldVal) {
      if (!val) return
      console.log('JSON.parse(val)', JSON.parse(val[0]).package)
      console.log('JSON.parse(val)', JSON.parse(val[1]).product)
      this.packageType = val[0]
      this.productType = val[1]
    },
    // 监听国家的表单值,当国家的值发生改变的时候,获取包裹类型的值
    async country (val, oldVal) {
      if (!val) return
      const packagePrductList = await this.getPackageType({countryId: this.country.id})
      console.log('data1', packagePrductList)
      this.packagePrductList = packagePrductList || []
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../assets/styles/colors.less';
@import '../../assets/styles/helpers.less';
@import '~vux/src/styles/close';
.assess {
  .purple-bg;
  padding: 10px;
  min-height: 95vh;
  &-container {
    border-radius: 5px;
    background: white;
    padding: 10px;
    padding-top: 1px;
    .weui-cell__bd.weui-cell__primary {
      input {
        text-align: right;
      }
    }
    .quyu {
      font-size: 1.5rem;
      .weui-label {
        text-align: left;
        padding-left: .6rem;
      }
      .vux-popup-picker-select {
        color: #666;
        span {
          font-size: 1.5rem;
        }
      }
    }
    &-add {
      margin-top: 3rem;
      padding: 1rem 1rem;
      p {
        font-size: 1.6rem;
        padding: 1rem 0;
        width: 100%;
        color: white;
        background: @m-yellow;
        border-radius: 6px;
      }
    }
  }
}
.offer-prompt-info {
  font-size: 1.4rem;
  color: #666;
  padding: 2rem;
}
.package-prompt-info {
  padding: 1rem 0 2rem;
  font-size: 1.4rem;
}
.popup-btn-sub{
  button {
    width: 15rem;
    border-radius: 5px;
    border-width: 0;
    font-size: 1.6rem;
    background-color: #ffa414;
    color: #fff;
    margin:0 auto 3rem;
    height: 3.3rem;
    display: block;
  }
}
.float-icon{
  height: 0px;
  position: relative;
  &-img{
    position: absolute;
    width: 1.5rem;
    height: 1.5rem;
    top: -32px;
    left: 76px;
    img {
      width: inherit;
      height: inherit;
    }
  }
}
.popup_picker {
  font-size: 1.5rem;
  white-space:nowrap;
  text-overflow:ellipsis;
  -o-text-overflow:ellipsis;
  overflow:hidden;
}
.assess {
  &-container {
    .purple-bg;
    padding: 0px;
    padding-top: 39px;
    // padding-bottom: 9rem;
    overflow: hidden;
    a {
      .send-container-address {
        color: #333;
      }
    }
    &-title {
      color: #333;
      padding-top: 0.6rem;
      font-size: 2rem;
    }
    &-address {
      .common-padding {
        .flex;
        justify-content: space-between;
        border-bottom: 1px solid #dedede;
      }
      font-size: 1.4rem;
      background: white;
      &__intro {
        flex: 1;
        margin-right: 0.5rem;
        span {
          font-size: 1.5rem;
          width: 2.6rem;
          height: 2.6rem;
          line-height: 2.6rem;
          display: block;
          border-radius: 50%;
          color: white;
        }
      }
      &__info {
        padding-left: .8rem;
        flex: 9;
        text-align: left;
        &--line {
          div {
            display: flex;
            align-items: center;
          }
        }
      }
      &__link {
        flex: 1;
        padding: 0 0;
        padding-right: 1rem;
        font-size: 0;
        img {
          width: 2.6rem;
        }
      }
    }
    &-detail {
      margin-top: 1rem;
      font-size: 1.6rem;
      background: white;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      div {
        text-align: left;
        padding: 1rem;
        span {
          padding-right: .5rem;
        }
        input {
          width: 15rem;
          padding: 0.3rem;
        }
        textarea {
          width: 15rem;
          padding: 0.3rem;
        }
      }
    }
    &-select {
      background-color: #fff;
      border-radius: 0.5rem;
      padding: 1rem 1rem 3rem;
      label {
        text-align: left;
        padding-left: .1rem;
        color: @greyfont;
      }
    }
    &-package {
      margin-top: 20px;
      background: white;
      .container-padding {
        padding: 0 11px 10px 18px;
      }
      &__title {
        padding-bottom: 1rem;
        align-content: center;
        justify-content: space-between;
        display: flex;
        font-size: 1.5rem;
        color: @greyfont;
        div {
          .question_icon{
            width: 1.5rem;
            height: 1.5rem;
            position: relative;
            top: 4px;
            left: 4px;
            overflow: hidden; 
            img{
              width: 1.5rem;
              height: 1.5rem;
            }
          }
        }
        button {
          color: @m-yellow;
          border: 2px solid @m-yellow;
          border-radius: 5px;
          padding: .1rem .3rem;
          background: transparent;
          font-weight: 600;
        }
      }
      &__money {
        text-align: center;
        color: @greyfont;
        padding-top: 10px;
        font-size: 1.5rem;
        span {
          color: @m-yellow;
        }
      }
    }
    .div-btn-sub {
      padding: 1rem 0rem;
      margin-top: 1rem;
      text-align: center;
      overflow: hidden;
      .btn-sub {
        color: white;
        border: none;
        padding: 1rem 0;
        font-size: 1.6rem;
        width: 100%;
        background-color: @m-yellow;
        border: none;
        border-radius: 5px;
      }
    }
  }
}
</style>
