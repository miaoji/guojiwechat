<template>
  <div class="send">
    <div class="send-container">
      <!-- 顶部寄件列表点击跳转 -->
      <div class="send-container-list">
        <img class="bor-top" src="../../assets/images/bor_top.png" alt="bor-top">
        <router-link to="/order/list">
          <div class="send-list">
            <div class="send-list--intro">
              <img slot="icon" class="order-icon" src="../../assets/images/send_list_icon.png" />
              <span>{{$t('send.title')}}</span>
            </div>
            <div class="send-icon">
              <img slot="icon" src="../../assets/images/sen_ico_lis.png" />
            </div>
          </div>
        </router-link>
        <div class="purple-border">
        </div>
      </div>
      <!-- 寄件地址选择 -->
      <router-link to="/address?type=send&pick=1&tabshow=0">
        <div class="send-container-address">
          <div class="common-padding">
            <div class="send-container-address__intro address-icon">
              <span class="bgblack">{{'sendS' | translate}}</span>
            </div>
            <div class="send-container-address__info">
              <div v-show="!sendAddress['name']" style="line-height: 3rem;">
                {{'business.selectaddress' | translate}}
              </div>
              <div v-show="sendAddress['name']" class="send-container-address__info--line">
                <div>
                  <span>
                    {{sendAddress['name']}}&nbsp;&nbsp;
                  </span>
                  <span class="address-info">
                    {{sendAddress['mobile']}}    
                  </span>
                </div>
              </div>
              <p class="address-detail-info">
               {{sendAddress['country']}}{{sendAddress['province']}}{{sendAddress['city']}}{{sendAddress['county']}}{{sendAddress['address']}}
              </p>
            </div>
            <div class="send-container-address__link">
                <img src="../../assets/images/sen_ico_com.png" alt="地址簿">
            </div>
          </div>
        </div>
      </router-link>
      <!-- 收件地址选择 -->
      <router-link to="/address?type=pickup&pick=1&tabshow=0">
        <div class="send-container-address">
          <div class="common-padding">
            <div class="send-container-address__intro  address-icon">
              <span class="bgred">{{'pickS' | translate}}</span>
            </div>
            <div class="send-container-address__info">
              <div v-show="!pickupAddress['name']" style="line-height: 3rem;">
                {{'business.selectaddress' | translate}}
              </div>
              <div v-show="pickupAddress['name']" class="send-container-address__info--line">
                <div>
                  <span>{{pickupAddress['name']}}&nbsp;&nbsp;</span>
                  <span class="address-info">
                    {{pickupAddress['mobile']}}
                  </span>
                </div>
              </div>
              <p class="address-detail-info">
                 {{pickupAddress['country']}}{{pickupAddress['province']}}{{pickupAddress['city']}}{{pickupAddress['county']}}{{pickupAddress['address']}}
              </p>
            </div>
            <div class="send-container-address__link">
              <img src="../../assets/images/sen_ico_com.png" alt="地址簿">
            </div>
          </div>
        </div>
      </router-link>
      <!-- 订单配置选择 -->
      <div class="send-container-select" >
        <group label-width="8rem" label-align="left">
          <!-- 包裹和产品类型选择，两者为级联关系 -->
          <package-product
            :title="'business.producttype' | translate"
            :placeholder="'business.selectproducttype' | translate"
            :countryId="pickupCountryId"
            :defaultSelect="packageProductCache"
            @listenValChange="onProductChange"
          >
          </package-product>
          <!-- 产品规格选择，点击后弹出模态框 -->
          <cell
            @click.native="dialogshow = true"
            :class="{'office': true, 'isFilled': orderOptions.weight}"
            type="number"
            :title="'business.productspecification' | translate"
            :value="showProductSpecs"
            is-link
          >
          </cell>
          <!-- 是否保价 -->
          <selector
            :title="'business.isoffer' | translate"
            :placeholder="'business.isoffer' | translate"
            direction="rtl"
            v-model="isOffer"
            name="isoffer"
            :options="isOfferOption"
            @on-change="isofferShowChange"
          >
          </selector>
          <!-- 保价提示信息 -->
          <div class="float-icon">
            <span class="float-icon-img" @click='isofferPromptInfoShow = true'>
              <img src="../../assets/images/question.png">
            </span>
          </div>
          <!-- 保费 -->
          <x-input
            :title="'business.offermoney' | translate"
            :placeholder="'business.offermoneytips' | translate"
            v-model="offer"
            v-show='isofferShow'
            :max="6"
            @on-change='offerChange'
          >
          </x-input>
          <!-- 优惠券 -->
          <selector
            title="优惠券"
            direction="rtl"
            v-model="coupon"
            name="coupon"
            :options="couponOption"
            @on-change="couponChange"
          >
          </selector>
          <x-textarea
            type="text"
            :title="$t('remark')"
            :placeholder="$t('business.remarktips')"
            :max="120"
            :show-counter="false"
            v-model="remark"
            :rows="1"
            :height="remark.length + 20"
            required
          >
          </x-textarea>
        </group>
      </div>
      <img class="bor-bottom" src="../../assets/images/bor_bot.png" alt="bor-bottom">
      <!-- 订单包裹展示 -->
      <div class="send-container-package">
        <img class="bor-top" src="../../assets/images/bor_top.png" alt="bor-top">
        <div class="container-padding">
          <div class="send-container-package__money">
            {{'send.prepay' | translate}}：￥ <span>{{advanceShow}}</span>
          </div>
          <!-- 提交按钮 -->
          <div class="submit-btn">
            <button class="normal" @click="submitOrderInfo">{{'submit' | translate}}</button>
          </div>
        </div>
      </div>
      <img class="bor-bottom" src="../../assets/images/bor_bot.png" alt="bor-bottom">
    </div>
    <!-- 产品重量体积弹出框 -->
    <div v-transfer-dom>
      <x-dialog v-model="dialogshow" class="send-weight-dialog">
        <div class="dialog-content">
          <div class="dialog-content--weight">
            {{'business.productweight' | translate}}(kg)
            <div class="dialog-close" @click="dialogshow = false">
              <span class="vux-close"></span>
            </div>
          </div>
          <div class="dialog-content--input send-weight-input">
            <group>
               <x-input 
                 title="" 
                 type="number" 
                 required 
                 v-model="weight" 
                 :placeholder="$t('business.productweighttips')"></x-input>
            </group>
          </div>
        </div>
        <div class="dialog-content">
          <div class="dialog-content--weight">
            {{'business.productvolumweight' | translate}}({{'selecttoput' | translate}})
          </div>
          <div class="dialog-content--input volume">
           <input 
             title="" 
             type="number" 
             v-model="length" 
             :placeholder="$t('length', {'unit': '/cm'})" />
           <span>x</span>
           <input 
             title=""
             type="number"
             show-clear="false" 
             required
             v-model="width" 
             :placeholder="$t('width', {'unit': '/cm'})" />
           <span>x</span>
           <input
             title="" 
             type="number" 
             required 
             v-model="height" 
             :placeholder="$t('height', {'unit': '/cm'})" />
           <span>=</span>
           <input 
             title="" 
             disabled 
             type="number" 
             required 
             v-model="volumeWeight" 
             placeholder="" />         
          </div>
        </div>
        <p class="dialog-tips">
          <tips :content="$t('business.productvolumweighttips')"></tips>
        </p>
        <div class="dialog-confirm-btn">
          <button type="" @click.stop="volumeConfirm">{{'confirm' | translate}}</button>
        </div>
      </x-dialog>
    </div>
    <!-- 包裹弹出框 添加 -->
    <div v-transfer-dom>
      <x-dialog v-model="packageShow" class="send-package-dialog">
        <h1>{{'send.addpackage' | translate}}</h1>
        <div class="package-close" @click="packageShow = false">
          <span class="vux-close"></span>
        </div>
        <div class="send-package-dialog-form">
          <group>
            <x-input :title="'business.chinesename' | translate" type="text" v-model="newPackage['nameCn']" required></x-input>
            <x-input :title="'business.productprice' | translate" lang="en" type="tel" name="tel" v-model="newPackage['unitPrice']" required></x-input>
            <x-input :title="'business.productnumber' | translate" type="number" v-model="newPackage['quantity']" required></x-input>
          </group>
          <div class="package-dialog-tips">
            <tips :content="$t('business.presentpackagenumber', {'num': packageTableLength})"></tips>
            <tips :content="'business.addpackagetips' | translate"></tips>
          </div>
          <div class="send-package-dialog-form__confrim">
            <button type="" class="send-package-dialog-form__confrim--sure" @click="addPackge(true)">{{'save' | translate}}</button>
            <button type="" class="send-package-dialog-form__confrim--cancle" @click="addPackge(false)">{{'add' | translate}}</button>
          </div>
        </div>
      </x-dialog>
    </div>
    <!-- 包裹弹框 修改 -->
    <div v-transfer-dom>
      <x-dialog v-model="packageShowEdit" class="pdialog">
        <h1>{{'business.editpackage' | translate}}</h1>
        <div class="package-close" @click="packageShowEdit = false">
          <span class="vux-close"></span>
        </div>
        <div class="pdialog-form">
          <group label-width="7rem" label-align="left">
            <x-input 
              :title="'business.chinesename' | translate" 
              type="text" 
              v-model="editPackage['nameCn']" 
              required>
            </x-input>
            <x-input 
              :title="'business.productprice' | translate" 
              type="tel" 
              lang="en" 
              name="tel" 
              v-model="editPackage['unitPrice']" 
              required></x-input>
            <x-input 
              :title="'business.productnumber' | translate" 
              type="number" 
              v-model="editPackage['quantity']" 
              required></x-input>
          </group>
          <div class="pdialog-form__confrim">
            <button type="" class="pdialog-form__confrim--sure" @click="editSave">{{'send.saveedit' | translate}}</button>
          </div>
        </div>
      </x-dialog>
    </div>
    <!-- 包裹报关提示信息弹出框 -->
    <div v-transfer-dom>
      <x-dialog v-model="packagePromptInfoShow" class="send-package-dialog" hide-on-blur>
        <h1>{{'business.packagedetail' | translate}}</h1>
        <div class="package-close" @click="packagePromptInfoShow = false">
          <span class="vux-close"></span>
        </div>
        <div class="package-prompt-info">
          {{'business.packagedetailexplain' | translate}}
        </div>
      </x-dialog>
    </div>
    <!-- 退件提示信息弹出框 -->
    <div v-transfer-dom>
      <x-dialog v-model="districtPromptInfoShow" class="send-package-dialog" hide-on-blur>
        <h1>{{'business.backexplain' | translate}}</h1>
        <div class="package-close" @click="districtPromptInfoShow = false">
          <span class="vux-close"></span>
        </div>
        <div class="package-prompt-info">
          {{'business.backexplaincontent' | translate}}
        </div>
      </x-dialog>
    </div>
    <!-- 保价提示信息弹出框 -->
    <div v-transfer-dom>
      <x-dialog v-model="isofferPromptInfoShow" class="send-package-dialog" hide-on-blur>
        <h1>{{'business.offerexplain' | translate}}</h1>
        <div class="package-close" @click="isofferPromptInfoShow = false">
          <span class="vux-close"></span>
        </div>
        <div class="package-prompt-info">
          {{'business.offerexplaincontent' | translate}}
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Selector, XInput, XTextarea, Spinner, XDialog, TransferDomDirective as TransferDom } from 'vux'
import PackageProduct from '@/components/PackageProduct'
import Tips from '@/components/Tips'
import * as mailingAddrService from '@/services/mailingAddr'
import * as receiveAddrService from '@/services/receiveAddr'
import * as priceService from '@/services/price'
import * as orderInfoService from '@/services/orderInfo'
import { storage, cache as cacheUtil, getAddress as getAddressUtil } from '@/utils'
import * as wxUtil from '@/utils/wx'
import { bindSwiper } from '@/utils/swiper'
import { getCouponByOpenId } from '@/services/coupon'

export default {
  name: 'send',
  directives: {
    TransferDom
  },
  components: {
    Selector,
    XInput,
    XTextarea,
    Spinner,
    XDialog,
    PackageProduct,
    Tips
  },
  data () {
    return {
      // 优惠券
      coupon: '',
      initCoupon: '',
      couponOption: [],
      loading: false,
      dialogshow: false,
      // 收件国家 id
      pickupCountryId: 0,
      // 订单重量体积的配置信息
      orderOptions: {
        weight: 0,
        width: null,
        length: null,
        height: null,
        volume: null
      },
      // 产品重量
      weight: null,
      width: null,
      length: null,
      height: null,
      volume: null,
      volumeWeight: null,
      minWeight: 0,
      maxWeight: 20,
      // 体积比
      volumeScale: 5000,
      // 备注
      remark: '',
      packageShow: false,
      packageShowEdit: false,
      dialogType: 'add',
      editPackage: {
        index: '',
        nameCn: '',
        quantity: '',
        unitPrice: ''
      },
      // 包裹报关提示信息
      packagePromptInfoShow: false,
      // 退件提示信息
      districtPromptInfoShow: false,
      // 保价提示信息
      isofferPromptInfoShow: false,
      // 保价金额输入框是否显示
      isofferShow: false,
      // 包裹产品类型选择原始val记录 like: ['{}', '{}']
      packageProductCache: [],
      // 包裹类型
      packageType: {
        packageId: 0,
        maxRange: 0,
        minRange: 0
      },
      // 产品类型
      productType: {
        productId: 0
      },
      // 保价
      // 0 不保价 1 保价
      isOffer: 0,
      // 保价信息
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
      // 1 不退件 2 退件
      isBack: 1,
      isBackOption: [{
        key: 1,
        value: '否'
      }, {
        key: 2,
        value: '是'
      }],
      newPackage: {
        nameCn: '',
        quantity: '',
        unitPrice: ''
      },
      // 包裹
      packageTable: [],
      priceId: 0,
      // 预付费用
      advance: 0,
      // 预付费用获取失败提示
      advanceStatus: {
        status: false,
        text: '请先选择收件地址'
      },
      sendAddress: {
        name: '',
        mobile: '',
        address: '',
        country: '',
        province: '',
        city: '',
        county: ''
      },
      pickupAddress: {
        name: '',
        mobile: '',
        address: '',
        country: '',
        province: '',
        city: '',
        county: ''
      },
      dataInCache: [
        {
          name: 'orderOptions',
          needJudge: 0
        }, {
          name: 'pickupCountryId',
          needJudge: 1
        }, {
          name: 'remark',
          needJudge: 0
        }, {
          name: 'packageTable',
          needJudge: 0
        }, {
          name: 'packageType',
          needJudge: 1
        }, {
          name: 'isBack',
          needJudge: 0
        }, {
          name: 'productType',
          needJudge: 1
        }, {
          name: 'packageProductCache',
          needJudge: 0
        }, {
          name: 'isOffer',
          needJudge: 0
        }, {
          name: 'offer',
          needJudge: 1
        }
      ]
    }
  },
  async created () {
    try {
      window.scrollTo(0, 0)
      this.$store.commit('SET_PAGE', {page: 'send'})
      this.$vux.loading.show()
      await this.getCouponOption()
      await wxUtil.init()
      await this.getAddressByType({type: 'send'})
      await this.getAddressByType({type: 'pickup'})
      const pickupCountryId = this.pickupAddress['countryId']
      this.pickupCountryId = pickupCountryId
      // 从localStorage中获取存储的用户习惯信息, 将可以直接赋值的赋值到this
      const dataInCache = this.dataInCache
      let sendInfo = cacheUtil.setCacheToData.apply(this, [dataInCache, 'send_info'])
      // 处理需要判断才能赋值的缓存
      if (sendInfo) {
        if (this.isOffer === 1) {
          this.offer = sendInfo['offer']
        }
        const oldpickupCountryId = sendInfo['pickupCountryId']
        if (oldpickupCountryId === pickupCountryId) {
          this.packageType = sendInfo['packageType']
          this.productType = sendInfo['productType']
        }
      }
      await this.getPrice()
      return
    } catch (e) {
      console.error(e)
      // throw new Error(e.message)
    } finally {
      this.$vux.loading.hide()
    }
  },
  mounted () {
    setTimeout(function () {
      bindSwiper('.package-table tr', 'swipeleft')
    }, 600)
  },
  computed: {
    ...mapGetters({
      sendadd: 'getSendAdd',
      userid: 'getUserId'
    }),
    showProductSpecs () {
      const options = this.orderOptions
      if (Number(options.weight) === 0 || !options.weight) {
        return this.$t('business.selectproductspecification')
      }
      let weight = options.weight
      let volumeWeight = options.volumeWeight
      const textWeight = this.$t('weightNounit')
      const textVolumeweight = this.$t('volumeweight')
      return `${textWeight}${weight}kg，${textVolumeweight}${volumeWeight}`
    },
    advanceShow () {
      let coupon = ''
      if (this.initCoupon !== '不使用' && this.initCoupon !== '') {
        coupon = JSON.parse(this.initCoupon).couponMoney
      }
      if (!this.advanceStatus['status']) {
        return this.advanceStatus['text']
      }
      const advance = Number(this.advance)
      // 将通过后台计算的价格加上本地的保价
      // 判断如果点击了保价，但是没有输入保价金额，默认保价金额为1元
      if (this.isOffer === 1 && this.insuredPrice < 1) {
        this.insuredPrice = 1
      } else if (this.isOffer === 0) {
        this.insuredPrice = 0
      }
      const insuredPrice = Number(this.insuredPrice)
      return (advance + insuredPrice - coupon).toFixed(2)
    },
    packageTableLength () {
      const len = this.packageTable.length
      return len || 0
    }
  },
  methods: {
    ...mapActions([
      'setOrderList'
    ]),
    couponChange (val) {
      let value = ''
      if (val !== '不使用' && val !== '') {
        value = JSON.parse(val)
      }
      console.log('123123123', this.coupon)
      console.log('444444', this.initCoupon)
      if (this.advanceShow < value.couponThreshold) {
        this.$vux.toast.show({
          type: 'warn',
          text: '该优惠券暂不满足使用条件',
          width: '15rem'
        })
        this.coupon = '不使用'
      }
      this.initCoupon = this.coupon
    },
    async getCouponOption () {
      const openId = storage({key: 'openid'})
      const data = await getCouponByOpenId({openId})
      if (data.code === 200) {
        const options = data.obj.map((item) => {
          return {
            value: `满${item.couponType.couponThreshold}减${item.couponType.couponMoney}元`,
            key: JSON.stringify(item.couponType)
          }
        })
        this.couponOption = [...options, {value: '不使用', key: '不使用'}]
      }
    },
    /**
     * [根据localStorage中数据，获取地址信息]
     * @param  {[type]} options.type [description]
     * @return {[type]}              [description]
     */
    async getAddressByType ({type = 'send'}) {
      try {
        const storageKey = type === 'send' ? 'send_sendaddress' : 'send_pickupaddress'
        const apiService = type === 'send' ? mailingAddrService.show : receiveAddrService.show
        const addressData = await getAddressUtil({type, storageKey, apiService, userid: this.userid})
        this[`${type}Address`] = addressData
      } catch (e) {
        console.error(e)
      }
    },
    /**
     * [产品类型改变时触发方法]
     */
    async onProductChange (val) {
      if (!val) return
      try {
        if (val.length < 2) return
        this.packageProductCache = val
        this.packageType = JSON.parse(val['0'])
        this.productType = JSON.parse(val['1'])
        await this.getPrice()
      } catch (e) {
        console.error(e)
      }
    },
    /**
     * [处理点击添加包裹按钮的方法]
     */
    handlePackageShow () {
      // 超出3个包裹，不允许再加
      if (this.packageTable.length >= 3) {
        this.$vux.toast.show({
          type: 'warn',
          text: '直邮最多添加三个包裹',
          width: '15rem'
        })
        this.packageShow = false
        return false
      }
      this.packageShow = true
      return true
    },
    /**
     * [添加包裹]
     */
    addPackge (isClose) {
      if (!this.handlePackageShow()) {
        return
      }
      const _this = this
      let complete = []
      Object.keys(_this.newPackage).forEach(function (key) {
        if (!_this.newPackage[key] && key !== 'cost') {
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
      // 价值不能低于0
      const unitPriceCheckNum = this.checkNum(this.newPackage['unitPrice'])
      if (unitPriceCheckNum['type'] === 'error') {
        this.$vux.toast.show({
          type: 'warn',
          text: unitPriceCheckNum['message'],
          width: '19rem'
        })
        this.newPackage['unitPrice'] = ''
        return
      } else {
        this.newPackage['unitPrice'] = unitPriceCheckNum['value']
      }
      // 数量不能低于0
      const quantityCheckNum = this.checkNum(this.newPackage['quantity'])
      if (quantityCheckNum['type'] === 'error') {
        this.$vux.toast.show({
          type: 'warn',
          text: quantityCheckNum['message'],
          width: '19rem'
        })
        this.newPackage['quantity'] = ''
        return
      } else {
        this.newPackage['quantity'] = quantityCheckNum['value']
      }
      this.newPackage['worth'] = this.newPackage['unitPrice'] * this.newPackage['quantity']
      this.packageTable.push(this.newPackage)
      this.newPackage = {
        nameCn: '',
        quantity: '',
        unitPrice: ''
      }
      this.packageShow = !isClose
      setTimeout(function () {
        bindSwiper('.package-table tr', 'swipeleft')
      }, 500)
    },
    delTableItem (index) {
      this.packageTable.splice(index, 1)
    },
    editTableItem (item, index) {
      this.editPackage = {...item, index}
      this.packageShowEdit = true
      this.dialogType = 'edit'
    },
    /**
     * [checkNum 数值检测 大于0的正整数]
     * @return {[type]} [description]
     */
    checkNum (num) {
      num = Number(num)
      if (isNaN(num) || num <= 0) {
        return {
          type: 'error',
          message: '请输入大于0的正整数',
          value: 0
        }
      } else {
        return {
          type: 'success',
          message: '正确',
          value: num
        }
      }
    },
    editSave () {
      const _this = this
      // 价值不能低于0
      const unitPriceCheckNum = this.checkNum(this.editPackage['unitPrice'])
      if (unitPriceCheckNum['type'] === 'error') {
        this.$vux.toast.show({
          type: 'warn',
          text: unitPriceCheckNum['message'],
          width: '19rem'
        })
        this.editPackage['unitPrice'] = ''
        return
      } else {
        this.editPackage['unitPrice'] = unitPriceCheckNum['value']
      }
      // 数量不能低于0
      const quantityCheckNum = this.checkNum(this.editPackage['quantity'])
      if (quantityCheckNum['type'] === 'error') {
        this.$vux.toast.show({
          type: 'warn',
          text: quantityCheckNum['message'],
          width: '19rem'
        })
        this.editPackage['quantity'] = ''
        return
      } else {
        this.editPackage['quantity'] = quantityCheckNum['value']
      }
      let complete = []
      Object.keys(_this.editPackage).forEach(function (key) {
        if (!_this.editPackage[key] && key !== 'worth' && key !== 'index') {
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
      this.editPackage['worth'] = this.editPackage['unitPrice'] * this.editPackage['quantity']
      const index = this.editPackage['index']
      delete this.editPackage['index']
      this.packageTable[index] = this.editPackage
      this.editPackage = {
        nameCn: '',
        quantity: '',
        unitPrice: '',
        index: ''
      }
      this.packageShowEdit = false
    },
    /**
     * [submitSend 创建订单，成功后调用微信支付接口]
     * @return {[type]} [description]
     */
    async submitOrderInfo () {
      try {
        if ((Number(this.offer) > 200000) && this.isOffer === 1) {
          this.$vux.toast.show({
            text: '保价金额不能大于20万元！',
            width: '18rem',
            type: 'warn'
          })
          return
        }
        if (this.offer === null && this.isOffer === 1 || this.offer === '0' && this.isOffer === 1) {
          this.$vux.toast.show({
            text: '请输入您的保价金额！',
            width: '18rem',
            type: 'warn'
          })
          return
        }
        if (this.loading) return
        // 包裹长度要小于等于3，可以为空
        if (!(this.packageTable.length <= 3)) {
          this.$vux.toast.show({
            text: '包裹最多3个',
            width: '18rem',
            type: 'warn'
          })
          return
        }
        if (!this.orderOptions.weight) {
          this.$vux.toast.show({
            text: '重量不能为空',
            width: '18rem',
            type: 'warn'
          })
          this.dialogshow = true
          return
        }
        if (!this.sendAddress['id']) {
          this.$vux.toast.show({
            text: '请选择寄件地址',
            width: '18rem',
            type: 'warn'
          })
          return
        }
        if (!this.pickupAddress['id']) {
          this.$vux.toast.show({
            text: '请选择收件地址',
            width: '18rem',
            type: 'warn'
          })
          return
        }
        const advance = Number(this.advance)
        if (!advance || advance < 0 || advance === 'NaN') {
          this.$vux.toast.show({
            text: '价格不能为空或0 !',
            width: '18rem',
            type: 'warn'
          })
          return
        }
        this.loading = true
        this.$vux.loading.show({
          text: '正在提交'
        })
        let packageTable = this.packageTable
        packageTable = await packageTable.map(function (elem) {
          return {
            ...elem,
            worth: elem.quantity * elem.unitPrice + ''
          }
        })
        const orderItems = JSON.stringify(packageTable)
        const orderOptions = this.orderOptions
        const result = await orderInfoService.save({
          ...orderOptions,
          wxUserId: this.userid,
          mailingAddrId: this.sendAddress['id'],
          receiveAddrId: this.pickupAddress['id'],
          returnGood: this.isBack,
          insured: Number(this.isOffer),
          insuredAmount: this.offer ? Number(this.offer) : 0,
          insuredPrice: Number(this.insuredPrice),
          priceId: this.priceId,
          totalFee: Number(this.advanceShow) * 100,
          remark: this.remark,
          // 寄件人地址
          senderCountry: this.sendAddress['country'],
          senderProv: this.sendAddress['province'],
          senderCity: this.sendAddress['city'],
          senderCounty: this.sendAddress['county'],
          // 收件人地址
          receiverCountry: this.pickupAddress['country'],
          receiverProv: this.pickupAddress['province'],
          receiverCity: this.pickupAddress['city'],
          receiverCounty: this.pickupAddress['county'],
          type: 0,
          orderType: 0,
          orderItems
        })
        this.$vux.loading.hide()
        this.loading = false
        if (result.success && result.code === 200) {
          // 订单创建成功后，所有信息需要清空
          this.setOrderList()
          this.wxPay({money: result.obj.totalFee, orderNo: result.obj.orderNo, orderId: result.obj.id})
          this.clearForm()
        } else {
          this.$vux.toast.show({
            text: result.msg || '创建订单失败',
            type: 'warn',
            width: '17rem'
          })
        }
      } catch (e) {
        console.error(e)
        this.$vux.loading.hide()
        this.$vux.toast.show({
          text: e.message || '创建订单失败',
          type: 'warn',
          width: '17rem'
        })
      }
    },
    /**
     * [提交订单后发起微信支付]
     * @param  {[type]} options.money        [description]
     * @param  {[type]} options.serialnumber [description]
     * @return {[type]}                      [description]
     */
    async wxPay ({money, orderNo, orderId}) {
      const total = money * 100
      let initParams = {
        openid: storage({key: 'openid'}),
        money: total,
        orderNo,
        body: '国际快递包裹',
        payType: 0,
        closingPriceId: 0
      }
      let successParams = {
        orderNo,
        total,
        paymentStatus: 1,
        payType: 0
      }
      const _this = this
      let payStatus = 'success'
      try {
        const wxPayRes = await wxUtil.pay({initParams, successParams})
        this.$vux.toast.show(wxPayRes)
      } catch (err) {
        console.error(err)
        payStatus = 'fail'
        this.$vux.toast.show(err)
      } finally {
        setTimeout(function () {
          _this.$router.push({
            path: '/payresult',
            query: {
              orderid: orderId,
              status: payStatus,
              orderno: orderNo,
              totalfee: money
            }
          })
        }, 700)
      }
    },
    /**
     * [下单成功后清空表单信息]
     * @return {[type]} [description]
     */
    clearForm () {
      this.packageTable = []
      this.remark = ''
      this.packageType = undefined
      this.productType = undefined
      this.packageProductCache = []
      this.pickupCountryId = 0
      this.orderOptions = {
        weight: null,
        width: null,
        length: null,
        height: null,
        volume: null
      }
      this.advance = null
      this.isBack = 1
      this.isOffer = 0
      this.offer = 0
      this.sendAddress = {
        name: '',
        mobile: '',
        address: '',
        country: '',
        province: '',
        city: '',
        county: ''
      }
      this.pickupAddress = {
        name: '',
        mobile: '',
        address: '',
        country: '',
        province: '',
        city: '',
        county: ''
      }
      storage({
        type: 'remove',
        key: ['send_pickupaddress', 'send_sendaddress']
      })
    },
    /**
     * [产品规格确定方法]
     * @return {[type]} [description]
     */
    async volumeConfirm () {
      if (Number(this.weight) > this.maxWeight || Number(this.weight) < this.minWeight || !this.weight) {
        this.$vux.toast.show({
          text: `重量不能大于${this.maxWeight}kg不能小于${this.minWeight}kg`,
          width: '18rem',
          type: 'warn'
        })
        return
      }
      this.weight = Number(this.weight)
      this.orderOptions = {
        weight: this.weight,
        width: this.width,
        length: this.length,
        height: this.height,
        volume: this.volume,
        volumeWeight: this.volumeWeight
      }
      this.weight = null
      this.width = null
      this.length = null
      this.height = null
      this.dialogshow = false
      await this.getPrice()
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
      }
    },
    // 在输入报价金额的时候查询订单金额
    offerChange (val) {
      if (Number(val) > 200000 || Number(val) === 200000) {
        this.offer = 200000
      }
      if (val === null) {
        this.insuredPrice = 0
      } else {
        this.insuredPrice = val * 0.005
      }
    },
    /**
     * [getPrice 获取预付费用]
     * @return {[type]} [description]
     */
    async getPrice () {
      this.advanceStatus['status'] = false
      try {
        if (!this.pickupCountryId) {
          this.advanceStatus['text'] = this.$i18n.translate('send.getprice.needaddress')
          return
        }
        if (!this.productType['productId']) {
          this.advanceStatus['text'] = this.$i18n.translate('send.getprice.needproducttype')
          return
        }
        const orderOptions = this.orderOptions
        let weight = orderOptions.volumeWeight > orderOptions.weight ? orderOptions.volumeWeight : orderOptions.weight
        if (!weight) {
          this.advanceStatus['text'] = this.$i18n.translate('send.getprice.needwight')
          return
        }
        const price = await priceService.showAdvanced({
          weight,
          countryId: this.pickupAddress['countryId'],
          productTypeId: this.productType['productId'],
          packageTypeId: this.packageType['packageId']
        })
        let data = price.obj
        this.priceId = data.priceId
        this.advanceStatus['status'] = true
        this.advanceStatus['text'] = this.$i18n.translate('send.getprice.needwight')
        this.advance = data.finalPrice
        return
      } catch (err) {
        console.error(err)
        this.advanceStatus['text'] = this.$i18n.translate('send.getprice.needwight')
      }
    }
  },
  watch: {
    length (val, oldval) {
      const _this = this
      if (val > 120) {
        _this.$vux.toast.show({
          text: '长度不能大于120cm',
          width: '18rem',
          type: 'warn'
        })
        _this.length = oldval
        return
      }
      this.volume = this.length * this.height * this.width
    },
    height (val, oldval) {
      const _this = this
      if (val > 120) {
        _this.$vux.toast.show({
          text: '高度不能大于120cm',
          width: '18rem',
          type: 'warn'
        })
        _this.height = oldval
        return
      }
      this.volume = this.length * this.height * this.width
    },
    width (val, oldval) {
      const _this = this
      if (val > 120) {
        _this.$vux.toast.show({
          text: '宽度不能大于120cm',
          width: '18rem',
          type: 'warn'
        })
        _this.width = oldval
        return
      }
      this.volume = this.length * this.height * this.width
    },
    volume () {
      this.volumeWeight = Number(this.volume / this.volumeScale)
    },
    async weight (val, oldval) {
      const _this = this
      if (!val) {
        return
      }
      if (Number(val) > this.maxWeight) {
        _this.$vux.toast.show({
          text: `重量不能大于${this.maxWeight}kg`,
          width: '18rem',
          type: 'warn'
        })
        return
      }
      if (Number(val) < this.minWeight) {
        _this.$vux.toast.show({
          text: `重量不能小于等于${this.minWeight}kg`,
          width: '19rem',
          type: 'warn'
        })
        return
      }
      this.getPrice()
    },
    async packageType (val, oldval) {
      if (!val) return
      try {
        this.minWeight = val['minRange'] || 0
        this.maxWeight = val['maxRange'] || 20
      } catch (e) {
        console.error(e)
      }
    }
  },
  beforeDestroy () {
    this.$vux.loading.hide()
    this.$vux.toast.hide()
    // 离开页面时在localStorage中保存产品规格，包裹信息和备注信息
    const dataInCache = this.dataInCache
    cacheUtil.setDataToCache.call(this, dataInCache, 'send_info')
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../assets/styles/colors.less';
@import '../../assets/styles/helpers.less';
@import '../../assets/styles/vars.less';
@import '~vux/src/styles/close';

.package-prompt-info {
  font-size: 1.5rem;
  color: #999;
  padding: 20px;
  text-align: left;
}

.send-icon {
  text-align: right;
  width: 3rem;
}

.address-detail-info {
  white-space: nowrap;
  max-width: 19rem;
  overflow: hidden;
  text-overflow: ellipsis;
  @media (max-width:320px) {
    width: 14rem;
  }
  @media (min-width:360px) {
    width: 20rem;
  }
  @media (min-width:400px) {
    width: 26rem;
  }
}

.common-padding {
  padding: 1rem 0;
  margin-left: 1rem;
}

.send {
  &-container {
    .purple-bg;
    padding: 10px;
    padding-top: 36px;
    padding-bottom: 9rem;
    overflow: hidden;
    &-list {
      background-color: #fff;
      .send-list {
        .flex;
        padding: 1rem 1rem;
        padding-top: 0;
        justify-content: space-between;
        &--intro {
          .flex;
          span {
            padding-left: 1rem;
            font-size: @normal-size;
            color: @m-yellow;
          }
          img {
            width: auto;
            height: 2.6rem;
          }
        }
        .send-icon {
          font-size: 0;
          img {
            width: auto;
            height: 2.6rem;
          }
        }
      }
      .purple-border {
        margin: 0 .5rem;
        height: 3px;
        background: url('../../assets/images/border.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
    a {
      .send-container-address {
        color: #333;
      }
    }
    &-address {
      .common-padding {
        .flex;
        justify-content: space-between;
        border-bottom: 1px solid #dedede;
      }
      font-size: @normal-size;
      background: white;
      &__intro {
        flex: 1;
        margin-right: 0.5rem;
      }
      &__info {
        padding-left: .8rem;
        flex: 9;
        text-align: left;
        min-height: 3rem;
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
        font-size: @normal-size;
        color: @grey-word;
      }
      &__money {
        text-align: center;
        color: @greyfont;
        padding-top: 10px;
        font-size: @normal-size;
        span {
          color: @m-yellow;
        }
      }
    }
  }
}
</style>
