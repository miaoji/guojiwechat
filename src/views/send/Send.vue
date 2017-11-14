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
              <span>寄件列表</span>
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
            <div class="send-container-address__intro">
              <span class="bgblack">寄</span>
            </div>
            <div class="send-container-address__info">
              <div class="send-container-address__info--line">
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
            <div class="send-container-address__intro">
              <span class="bgred">收</span>
            </div>
            <div class="send-container-address__info">
              <div class="send-container-address__info--line">
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
          <selector
            direction="rtl" 
            v-model="packageType" 
            :placeholder="packageTypeSelectContrl['placeholder']"
            title="包裹类型" 
            name="packageType"
            :options="packageTypeOption" 
            @on-change="onPackageTypeChange"
          >
          </selector>
          <selector 
            direction="rtl" 
            title="产品类型" 
            v-model="productType"
            placeholder="选择产品类型"   
            name="productionType"
            :options="productTypeOption" 
            @on-change="onProduTypeChange"
          >
          </selector>
          <cell 
            @click.native="dialogshow = true"
            :class="{'office': true, 'isFilled': orderOptions.weight}"
            type="number"
            title="产品规格"
            :value="showProductSpecs"
            is-link>
          </cell>
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
            :max="6"
            placeholder="请填写您的物品的保价金额"
            @on-change='offerChange'
          >
          </x-input>
          <selector 
            direction="rtl"
            v-model="isBack"
            placeholder="退件要承担逆向物流费用, 默认不选"
            title="是否退件"
            name="district"
            :options="isBackOption"
          >
          </selector>
          <div class="float-icon"><span class="float-icon-img" @click='districtPromptInfoShow = true'><img src="../../assets/images/question.png"></span></div>
          <x-textarea
            type="text"
            title="备注"
            :max="120"
            placeholder="请添加备注 (限120字)"
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
      <p  class="intro-p">包裹报关</p>
      <div class="send-container-package">
        <img class="bor-top" src="../../assets/images/bor_top.png" alt="bor-top">
        <div class="container-padding">
          <div class="send-container-package__title">
            <div> 包裹报关 <span class="question_icon" @click='packagePromptInfoShow = true'><img src="../../assets/images/question.png"></span></div>
            <div @click="packageShow = true">
              <button type="" >添加包裹</button>
            </div>
          </div>
          <div class="send-container-package__table">
            <table>
              <thead>
                <tr>
                  <th>中文品名</th>
                  <th>数量</th>
                  <th>单价/元</th>
                  <th>价值/元</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item, index in packageTable" @touchstart="longTap(index, $event)">
                  <td>
                    <input type="text" v-model="item['nameCn']">
                  </td>
                  <td>
                    <input type="number" v-model="item['quantity']">
                  </td>
                  <td>
                    <input type="number" v-model="item['unitPrice']">
                  </td>
                  <td>
                    <input type="text" v-model="item['worth']" disabled>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="send-container-package__money">
            预付运费：￥ <span>{{advance === 'NaN' ? '请先选择产品类型' : advance}}</span>
          </div>
          <!-- 提交按钮 -->
          <div class="div-btn-sub"> 
            <button class="btn-sub" @click="submitOrderInfo">提交</button>
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
            产品重量(kg)
            <div class="dialog-close" @click="dialogshow = false">
              <span class="vux-close"></span>
            </div>
          </div>
          <div class="dialog-content--input send-weight-input">
            <group>
               <x-input title="" type="number" required v-model="weight" placeholder="请填写您的物品的实际重量"></x-input>
            </group>
          </div>
        </div>
        <div class="dialog-content">
          <div class="dialog-content--weight">
            产品体积重
          </div>
          <div class="dialog-content--input volume">
           <input title="" type="number" v-model="length" placeholder="长度/cm"></input>
           <span>x</span>
           <input title="" type="number" show-clear="false" required v-model="width" placeholder="宽度/cm"></input>
           <span>x</span>
           <input title="" type="number" required v-model="height" placeholder="高度/cm"></input>
           <span>=</span>
           <input title="" disabled type="number" required v-model="volumeWeight" placeholder=""></input>            
          </div>
        </div>
        <p class="dialog-tips">
          请准确填写重量与体积，若复重出现差异，可能会发生补价差
        </p>
        <div class="dialog-confirm-btn">
          <button type="" @click.stop="volumeConfirm">确定</button>
        </div>
      </x-dialog>
    </div>
    <!-- 添加包裹弹出框 -->
    <div v-transfer-dom>
      <x-dialog v-model="packageShow" class="send-package-dialog">
        <h1>添加包裹</h1>
        <div class="package-close" @click="packageShow = false">
          <span class="vux-close"></span>
        </div>
        <div class="send-package-dialog-form">
          <group>
            <x-input title="中文品名" type="text" v-model="newPackage['nameCn']" required></x-input>
            <x-input title="产品单价" lang="en" type="tel" name="tel" v-model="newPackage['unitPrice']" required></x-input>
            <x-input title="产品数量" type="number" v-model="newPackage['quantity']" required></x-input>
          </group>
          <div class="send-package-dialog-form__confrim">
            <button type="" class="send-package-dialog-form__confrim--cancle" @click="packageShow = false">取消</button>
            <button type="" class="send-package-dialog-form__confrim--sure" @click="addPackge">完成</button>
          </div>
        </div>
        <div class="package-dialog-tips">
          注：单次寄件最多可包含三个包裹，超过三个请分批次寄件
        </div>
      </x-dialog>
    </div>
    <!-- 包裹报关提示信息弹出框 -->
    <div v-transfer-dom>
      <x-dialog v-model="packagePromptInfoShow" class="send-package-dialog">
        <h1>包裹报关</h1>
        <div class="package-close" @click="packagePromptInfoShow = false">
          <span class="vux-close"></span>
        </div>
        <div class="package-prompt-info">
          此栏内容用于清关使用，若不填，清关另需其他材料我们会电话联系您。
        </div>
      </x-dialog>
    </div>
    <!-- 退件提示信息弹出框 -->
    <div v-transfer-dom>
      <x-dialog v-model="districtPromptInfoShow" class="send-package-dialog">
        <h1>退件说明</h1>
        <div class="package-close" @click="districtPromptInfoShow = false">
          <span class="vux-close"></span>
        </div>
        <div class="package-prompt-info">
          若快递妥投出现问题，我们会逆向返还给寄件人，逆向物流费用将由寄件人承担。
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
        <div class="package-prompt-info">
          此项服务以自愿为原则。寄件人选择此项服务时，应确定保价金额与每个邮件内件实际价值一致，每个邮件保价金额最高限额为二十万元人民币，保价费按申报的保价金额的0.5%收取，每件最低收取1.00元人民币。未按规定交纳保价费的快件，不属于保价快件。
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Selector, XInput, XTextarea, Spinner, XDialog, TransferDomDirective as TransferDom, Cell } from 'vux'
import * as mailingAddrService from '@/services/mailingAddr'
import * as receiveAddrService from '@/services/receiveAddr'
import * as packageTypeService from '@/services/packageType'
import * as productTypeService from '@/services/productType'
import * as priceService from '@/services/price'
import * as orderInfoService from '@/services/orderInfo'
import { getDefaultAddr } from '@/services/user'
import { storage, cache as cacheUtil } from '@/utils'
import * as wxUtil from '@/utils/wx'

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
    Cell
  },
  data () {
    return {
      loading: false,
      dialogshow: false,
      // 订单重量体积的配置信息
      orderOptions: {
        weight: null,
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
      // 包裹报关提示信息
      packagePromptInfoShow: false,
      // 退件提示信息
      districtPromptInfoShow: false,
      // 保价提示信息
      isofferPromptInfoShow: false,
      // 保价金额输入框是否显示
      isofferShow: false,
      // 包裹类型
      packageType: undefined,
      packageTypeOption: [],
      // 产品类型
      productType: undefined,
      productTypeOption: [],
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
      isBack: 1,
      // 1 不退件 2 退件
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
    // 1. 创建时将SET_PAGE创建为send
    this.$store.commit('SET_PAGE', {page: 'send'})
    try {
      this.$vux.loading.show()
      // 2. 初始化wx jssdk
      await wxUtil.init()
      // 3. 获取地址
      const sendAddress = await this.getAddress({type: 'send'})
      if (sendAddress) {
        this.sendAddress = sendAddress
      }
      const pickupAddress = await this.getAddress({type: 'pickup'})
      if (pickupAddress) {
        this.pickupAddress = pickupAddress
      }
      // 4. 根据收件国家id获取包裹类型
      const pickupCountryId = this.pickupAddress['countryId']
      this.pickupCountryId = pickupCountryId
      if (pickupCountryId) {
        let packageTypeOption = await this.getPackageType({countryId: pickupCountryId})
        this.packageTypeOption = packageTypeOption || []
      }
      // 5. 从localStorage中获取存储的用户习惯信息, 将可以直接赋值的赋值到this
      const dataInCache = this.dataInCache
      let sendInfo = cacheUtil.setCacheToData.apply(this, [dataInCache, 'send_info'])
      // 6. 处理需要判断才能赋值的缓存
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
      return
    } catch (e) {
      console.error(e)
    } finally {
      this.$vux.loading.hide()
    }
  },
  computed: {
    ...mapGetters({
      sendadd: 'getSendAdd',
      user: 'getUserInfo',
      userid: 'getUserId'
    }),
    packageTypeSelectContrl () {
      let placeholder = '选择包裹类型'
      if (!this.pickupAddress['countryId']) {
        placeholder = '请先选择收件地址'
      }
      return {
        placeholder
      }
    },
    showProductSpecs () {
      const options = this.orderOptions
      if (Number(options.weight) === 0 || !options.weight || Number(options.volume) === 0 || !options.volume) {
        return '请填入重量和体积'
      }
      let weight = options.weight
      let volumeWeight = options.volumeWeight
      return `重量${weight}kg，体积重${volumeWeight}`
    }
  },
  methods: {
    ...mapActions([
      'setOrderList'
    ]),
    /**
     * [根据localStorage中数据，获取地址信息]
     * @param  {[type]} options.type [description]
     * @return {[type]}              [description]
     */
    async getAddress ({type = 'send'}) {
      try {
        const storageKey = type === 'send' ? 'send_sendaddress' : 'send_pickupaddress'
        const apiService = type === 'send' ? mailingAddrService.show : receiveAddrService.show
        const Local = JSON.parse(storage({key: storageKey}))
        let addrId = ''
        if (Local) {
          addrId = Local.id
        } else {
          // 如果local为空，则选择默认的地址
          const defaultAdrrRes = await getDefaultAddr({
            WxUserId: storage({
              key: 'userId'
            })
          })
          if (defaultAdrrRes.code === 200 && defaultAdrrRes.obj) {
            let defaultAdrr = defaultAdrrRes.obj
            const defaultAdrrType = type === 'send' ? 'mailingAddress' : 'receiveAddresses'
            if (defaultAdrr[defaultAdrrType] && defaultAdrr[defaultAdrrType].length > 0) {
              addrId = defaultAdrr[defaultAdrrType][0]['id']
            }
          }
        }
        const Address = await apiService({id: addrId})
        if (!Address.success || !Address.obj) return false
        const addressRes = Address.obj
        if (Number(addressRes.HIDDEN_STATUS) !== 1) return false
        return {
          id: addressRes.ID,
          name: addressRes.NAME,
          mobile: addressRes.MOBILE,
          address: addressRes.ADDRESS || '',
          country: addressRes.COUNTRY_CN || '',
          province: addressRes.PROVINCE || '',
          city: addressRes.cityName || '',
          county: addressRes.DISTRICT || '',
          countryId: addressRes.COUNTRY || ''
        }
      } catch (e) {
        console.error(e)
        return false
      }
    },
    /**
     * [根据国家id获取包裹类型]
     * @return {[type]} [description]
     */
    async getPackageType ({countryId}) {
      try {
        const packageTypeRes = await packageTypeService.showByCountry({
          countryId
        })
        if (!packageTypeRes.success) return false
        if (packageTypeRes.statusCode !== 200) return false
        if (!packageTypeRes.obj) return false
        return packageTypeRes.obj.map(function (elem, index) {
          let item = {
            key: JSON.stringify(elem),
            value: `名称: ${elem.name_cn}，重量范围: ${elem.min_range}~${elem.max_range}kg`
          }
          return item
        })
      } catch (e) {
        console.error(e)
        return false
      }
    },
    /**
     * [长按删除]
     * @param  {[type]} index  [description]
     * @param  {[type]} $event [description]
     * @return {[type]}        [description]
     */
    longTap (index, $event) {
      const _this = this
      function longPress () {
        _this.$vux.confirm.show({
          title: '确定删除这一行数据吗?',
          onCancel () {
          },
          onConfirm () {
            _this.packageTable.splice(index, 1)
          }
        })
      }
      const longTimer = setTimeout(longPress, 800)
      $event.target.ontouchend = () => {
        clearTimeout(longTimer)
      }
    },
    /**
     * [添加包裹]
     */
    addPackge () {
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
      this.newPackage['worth'] = this.newPackage['unitPrice'] * this.newPackage['quantity']
      // 超出3个包裹，不允许再加
      if (this.packageTable.length >= 3) {
        this.$vux.toast.show({
          type: 'warn',
          text: '最多添加三个包裹',
          width: '15rem'
        })
        this.packageShow = false
        return
      }
      this.packageTable.push(this.newPackage)
      this.newPackage = {
        nameCn: '',
        quantity: '',
        unitPrice: ''
      }
      this.packageShow = false
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
        // 包裹长度要在小于3，可以为空
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
        const orderItems = JSON.stringify(this.packageTable)
        const orderOptions = this.orderOptions
        const result = await orderInfoService.save({
          ...orderOptions,
          wxUserId: storage({key: 'userId'}),
          mailingAddrId: this.sendAddress['id'],
          receiveAddrId: this.pickupAddress['id'],
          returnGood: this.isBack,
          insured: Number(this.isOffer),
          insuredAmount: this.offer ? Number(this.offer) : 0,
          insuredPrice: Number(this.insuredPrice),
          priceId: this.priceId,
          totalFee: advance * 100,
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
          orderItems
        })
        this.$vux.loading.hide()
        this.loading = false
        if (result.success && result.code === 200) {
          // 订单创建成功后，所有信息需要清空
          this.setOrderList()
          this.wxPay({money: advance, orderNo: result.obj.orderNo, orderId: result.obj.id})
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
        console.log('微信支付报错---')
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
        }, 800)
      }
    },
    /**
     * [下单成功后清空表单信息]
     * @return {[type]} [description]
     */
    clearForm () {
      this.packageTable = []
      this.remark = ''
      this.packageTypeOption = []
      this.packageType = undefined
      this.productType = undefined
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
    volumeConfirm () {
      if (Number(this.weight) > this.maxWeight || Number(this.weight) < this.minWeight || !this.weight) {
        this.$vux.toast.show({
          text: `重量不能大于${this.maxWeight}kg不能小于${this.minWeight}kg`,
          width: '18rem',
          type: 'warn'
        })
        return
      }
      if (Number(this.volume) <= 0 || !this.volume) {
        this.$vux.toast.show({
          text: '体积不能小于0',
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
      this.getPrice()
    },
    /**
     * [包裹类型改变时触发方法]
     * @param  {[type]} val [description]
     * @return {[type]}     [description]
     */
    onPackageTypeChange (val) {
      if (!val) return
    },
    /**
     * [产品类型改变时触发方法]
     */
    onProduTypeChange (val) {
      if (!val) return
      this.getPrice()
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
      this.getPrice()
    },
    // 在输入报价金额的时候查询订单金额
    offerChange (val) {
      if (Number(val) > 200000 || Number(val) === 200000) {
        this.offer = 200000
      }
      this.getPrice()
    },
    /**
     * [getPrice 获取预付费用]
     * @return {[type]} [description]
     */
    async getPrice () {
      try {
        if (!this.pickupAddress['countryId']) {
          this.advance = '请先选择收件地址'
          return
        }
        if (!this.packageType) {
          this.advance = '请先选择包裹类型'
          return
        }
        if (!this.productType) {
          this.advance = '请先选择产品'
          return
        }
        const orderOptions = this.orderOptions
        let weight = orderOptions.volumeWeight > orderOptions.weight ? orderOptions.volumeWeight : orderOptions.weight
        if (!weight) {
          this.advance = '请先输入重量'
          return
        }
        const price = await priceService.showAdvanced({
          weight,
          countryId: this.pickupAddress['countryId'],
          productTypeId: JSON.parse(this.productType)['id'],
          packageTypeId: JSON.parse(this.packageType)['id']
        })
        this.advance = '获取费用失败'
        if (!price.success) return
        if (price.code !== 200) return
        let data = price.obj
        this.priceId = data.priceId
        // console.log('data.finalPrice', data.finalPrice)
        // 将通过后台计算的价格加上本地的保价
        // 判断如果点击了保价，但是没有输入保价金额，默认保价金额为1元
        if (this.isOffer === 1 && this.insuredPrice < 1) {
          this.insuredPrice = 1
        } else if (this.isOffer === 0) {
          this.insuredPrice = 0
        }
        data.finalPrice = Number(data.finalPrice) + Number(this.insuredPrice)
        this.advance = Number(data.finalPrice).toFixed(2)
        return
      } catch (err) {
        console.error(err)
        this.advance = '获取费用失败'
      }
    }
  },
  watch: {
    offer (val, oldval) {
      if (val === null) {
        this.insuredPrice = 0
      } else {
        this.insuredPrice = val * 0.005
      }
    },
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
        let packageType = JSON.parse(val)
        this.minWeight = packageType['min_range'] || 0
        this.maxWeight = packageType['max_range'] || 20
        const proRes = await productTypeService.showByPackage({
          packageTypeId: packageType['id']
        })
        if (proRes.success && proRes.code === 200 && proRes.obj) {
          this.productTypeOption = proRes.obj.map(function (elem) {
            let item = {
              key: JSON.stringify(elem),
              value: elem.product_name
            }
            return item
          })
        } else {
          this.productTypeOption = []
        }
      } catch (e) {
        console.error(e)
      }
    },
    async productTypeOption (val, oldval) {
      if (Array.isArray(val) && val.length === 1) {
        this.productType = val[0]['key']
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
@import '~vux/src/styles/close';

.bgblack {
  background-color: #333;
}

.bgred {
  background-color: @red;
}

.package-prompt-info {
  font-size: 1.5rem;
  color: #999;
  padding: 20px;
  text-align: left;
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
.send-icon {
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
            font-size: 1.5rem;
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
        color: #2c3e50;
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
      &__table {
        padding: .5rem 0;
        border: 1px solid #dedede;
        border-left-width: 0;
        border-right-width: 0;
        table {
          font-size: 1.5rem;
          width: 100%;
          thead {
            color: @greyfont;
            th {
              font-weight: 100;
            }
          }
          tr {
            td {
              padding: .3rem 0;
              line-height: 2rem;
              font-size: 1.2rem;
              overflow: hidden;
              max-width: 4rem;
              white-space: nowrap;
              text-overflow: ellipsis;
              input {
                width: 3.9rem;
                text-align: center;
                border: none;
                background: transparent;
              }
            }
          }
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
