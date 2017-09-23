<template>
  <div class="send">
    <div class="send-container">
      <!-- 顶部寄件列表点击跳转 -->
      <div class="send-container-select go-sendlist">
        <group>
          <cell title="寄件列表" link="/order/list" is-link style="padding:1.2rem 11px;">
            <img slot="icon" class="send-icon" style="display:block;margin-right:.8rem;" src="../assets/images/nav_ivo_che.png" />
          </cell>
        </group>
      </div>
      <!-- 寄件地址选择 -->
      <router-link to="/address?type=send&pick=1&tabshow=0">
        <div class="send-container-address" style="border-bottom: 1px solid #dedede;">
          <div class="send-container-address__intro">
            <span class="bgblue">寄</span>
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
              地址簿
          </div>
        </div>
      </router-link>
      <!-- 收件地址选择 -->
      <router-link to="/address?type=pickup&pick=1&tabshow=0">
        <div class="send-container-address">
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
            地址簿
          </div>
        </div>
      </router-link>
      <!-- 订单配置选择 -->
      <div class="send-container-select" >
        <group label-width="6rem" label-align="left">
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
          <cell @click.native="dialogshow = true"  class="office" title="产品规格" is-link>{{showProductSpecs}}</cell>
          <selector direction="rtl" v-model="isBack" placeholder="退件要承担逆向物流费用, 默认不选"   title="是否退件" name="district" :options="isBackOption"></selector>
          <x-textarea type="text" title="备注" :max="50" placeholder="请添加备注 (限50字)" :show-counter="false" v-model="remark" :rows="1" :height="remark.length + 20" required>
          </x-textarea>
        </group>
      </div>
      <!-- 订单包裹展示 -->
      <div class="send-container-package">
        <div class="send-container-package__title">
          <div>
            包裹报关
          </div>
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
                  <input type="text" v-model="item['worth']">
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="send-container-package__money">
          预付运费：￥ <span>{{advance === 'NaN' ? '请先选择产品类型' : advance}}</span>
        </div>
      </div>
      <!-- 提交按钮 -->
      <div class="div-btn-sub"> 
        <button class="btn-sub" @click="submitOrderInfo">提交</button>
      </div>
    </div>
    <!-- 产品重量体积弹出框 -->
    <div v-transfer-dom>
      <x-dialog v-model="dialogshow" class="dialog-demo">
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
          请准确填写重量或体积，以免耽误货物妥投
        </p>
        <div class="dialog-confirm-btn">
          <button type="" @click.stop="volumeConfirm">确定</button>
        </div>
      </x-dialog>
    </div>
    <!-- 添加包裹弹出框 -->
    <div v-transfer-dom>
      <x-dialog v-model="packageShow" class="package-dialog">
        <h1>添加包裹</h1>
        <div class="package-close" @click="packageShow = false">
          <span class="vux-close"></span>
        </div>
        <div class="package-dialog-form">
          <group>
            <x-input title="中文品名" type="text" v-model="newPackage['nameCn']" required></x-input>
            <x-input title="产品单价" type="number" v-model="newPackage['unitPrice']" required></x-input>
            <x-input title="产品数量" type="number" v-model="newPackage['quantity']" required></x-input>
          </group>
          <div class="package-dialog-form__confrim">
            <button type="" class="package-dialog-form__confrim--cancle" @click="packageShow = false">取消</button>
            <button type="" class="package-dialog-form__confrim--sure" @click="addPackge">完成</button>
          </div>
        </div>
        <div class="package-dialog-tips">
          注：单次寄件最多可包含三个包裹，超过三个请分批次寄件
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import { Selector, XInput, XTextarea, Spinner, XDialog, TransferDomDirective as TransferDom, Cell } from 'vux'
import { mapGetters } from 'vuex'

import * as mailingAddrService from '@/services/mailingAddr'
import * as receiveAddrService from '@/services/receiveAddr'
import * as packageTypeService from '@/services/packageType'
import * as productTypeService from '@/services/productType'
import * as priceService from '@/services/price'
import * as orderInfoService from '@/services/orderInfo'

import { storage } from '../utils'
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
  async mounted () {
    window.document.title = '寄件'
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
      // 体积比
      volumeScale: 5000,
      // 备注
      remark: '',
      packageShow: false,
      // 包裹类型
      packageType: undefined,
      packageTypeOption: [],
      // 产品类型
      productType: undefined,
      productTypeOption: [],
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
      }
    }
  },
  async created () {
    // 1. 创建时将SET_PAGE创建为send
    this.$store.commit('SET_PAGE', {page: 'send'})
    // 2. 初始化wx jssdk
    try {
      const wxIntRes = await wxUtil.init()
      console.log('微信jssdk初始化', wxIntRes)
    } catch (e) {
      console.error(e)
    }
    // 3. 获取地址
    const sendAddress = await this.getAddress({type: 'send'})
    this.sendAddress = sendAddress || this.sendAddress
    const pickupAddress = await this.getAddress({type: 'pickup'})
    this.pickupAddress = pickupAddress || this.pickupAddress
    // 4. 从localStorage中获取存储的用户习惯信息
    let sendInfo = storage({
      key: 'send_info'
    })
    sendInfo = JSON.parse(sendInfo)
    Object.assign(this, sendInfo)
    // 5. 设置 serial number
    this.serialnumber = 'MZ' + new Date().getTime()
    // 6. 如果,目的地还未选择, 到此结束
    const pickupCountryId = this.pickupAddress['countryId']
    if (!pickupCountryId) return
    // 7. 根据国家id获取包裹类型
    const packageTypeOption = await this.getPackageType({countryId: pickupCountryId})
    this.packageTypeOption = packageTypeOption || []
  },
  computed: {
    ...mapGetters({
      sendadd: 'getSendAdd',
      user: 'getUserInfo',
      userid: 'getUserId'
    }),
    packageTypeSelectContrl () {
      let readonly = false
      let placeholder = '选择包裹类型'
      if (!this.pickupAddress['countryId']) {
        readonly = true
        placeholder = '请先选择收件地址'
      }
      return {
        readonly,
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
        if (!Local) return false
        const Address = await apiService({id: Local.id})
        if (!Address.success) return false
        if (!Address.obj) return false
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
     * [提交订单后发起微信支付]
     * @param  {[type]} options.money        [description]
     * @param  {[type]} options.serialnumber [description]
     * @return {[type]}                      [description]
     */
    async wxPay ({money, serialnumber}) {
      let intParams = {
        openid: storage({key: 'openid'}),
        money: (money * 100),
        serialnumber,
        body: '国际快递包裹',
        payType: 0
      }
      let successParams = {
        serialnumber,
        isPay: 1,
        payType: 0
      }
      const _this = this
      try {
        const wxPayRes = await wxUtil.pay({intParams, successParams})
        this.$vux.toast.show(wxPayRes)
        if (wxPayRes.type === 'success') {
          _this.$router.push({path: '/orderdetail', query: {serialnumber}})
        }
      } catch (err) {
        console.error(err)
        _this.$vux.toast.show(err)
      }
    },
    /**
     * [submitSend 创建订单，成功后调用微信支付接口]
     * @return {[type]} [description]
     */
    async submitOrderInfo () {
      try {
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
            text: '价格不能为空或0!',
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
          priceId: this.priceId,
          totalFee: advance * 100,
          remark: this.remark,
          orderItems
        })
        this.$vux.loading.hide()
        this.loading = false
        console.log('res', result)
        if (result.success && result.code === 200) {
          // 订单创建成功后，所有信息需要清空
          this.wxPay({money: this.advance, serialnumber: this.serialnumber})
          // this.clearForm()
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
     * [下单成功后清空表单信息]
     * @return {[type]} [description]
     */
    clearForm () {
      this.packageTable = []
      this.remark = ''
      this.productType = null
      this.orderOptions = {}
      this.isBack = false
    },
    /**
     * [产品规格确定方法]
     * @return {[type]} [description]
     */
    volumeConfirm () {
      if (Number(this.weight) > 20 || Number(this.weight) <= 0) {
        this.$vux.toast.show({
          text: '重量不能大于20kg不能为0',
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
        let weight = orderOptions.volume > orderOptions.weight ? orderOptions.volume : orderOptions.weight
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
        if (price.success) {
          let data = price.obj
          this.priceId = data.priceId
          this.advance = Number(data.finalPrice).toFixed(2)
          return
        }
        this.advance = '获取费用失败'
      } catch (err) {
        console.error(err)
        this.advance = '获取费用失败'
      }
    }
  },
  watch: {
    length (val, oldval) {
      const _this = this
      if (val > 120) {
        _this.$vux.toast.show({
          text: '长度不能大于1.2m',
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
          text: '高度不能大于1.2m',
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
          text: '宽度不能大于1.2m',
          width: '18rem',
          type: 'warn'
        })
        _this.width = oldval
        return
      }
      this.volume = this.length * this.height * this.width
    },
    volume () {
      this.volumeWeight = Number(this.volume / this.volumeScale).toFixed(5)
    },
    async weight (val, oldval) {
      const _this = this
      if (!val) {
        return
      }
      if (Number(val) > 20) {
        _this.$vux.toast.show({
          text: '重量不能大于20kg',
          width: '18rem',
          type: 'warn'
        })
        return
      }
      if (Number(val) <= 0) {
        _this.$vux.toast.show({
          text: '重量不能小于等于0kg',
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
        }
      } catch (e) {
        console.error(e)
      }
    }
  },
  beforeDestroy () {
    this.$vux.loading.hide()
    this.$vux.toast.hide()
    // 离开页面时在localStorage中保存产品规格，包裹信息和备注信息
    const sendInfo = {
      orderOptions: this.orderOptions,
      remark: this.remark,
      packageTable: this.packageTable,
      packageType: this.packageType,
      productType: this.productType,
      isBack: this.isBack
    }
    storage({
      key: 'send_info',
      val: JSON.stringify(sendInfo),
      type: 'set'
    })
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../assets/styles/colors.less';
@import '../assets/styles/helpers.less';
@import '~vux/src/styles/close';
.dialog-confirm-btn {
  button {
    color: white;
    padding: 0.3rem 0;
    margin: 1rem;
    font-size: 1.8rem;
    width: 30%;
    background-color: #eb1d21;
    border: none;
    border-radius: 5px;
  }
}

.dialog-demo {
  .weui-dialog{
    padding: 1rem 1rem 8px 1rem;
    border-radius: 8px;
  }
  .dialog-close {
    position: absolute;
    top: 4px;
    right: 8px;
    background: white;
  }
  .dialog-title {
    line-height: 30px;
    color: #666;
  }
  .send-weight-input {
    .weui-cells {
      &:before {
        border-top: 2px solid #666 !important;
      }
      &:after {
        border-top: 2px solid #666 !important;
      }
      .weui-cell {
        border-left: 1px solid #666;
        border-right: 1px solid #666;
      }
    }
  }
  .dialog-content {
    text-align: left;
    padding-bottom: 1rem;
    &--weight {
      color: #333;
      padding-bottom: 1rem;
      font-size: 1.5rem;
    }
    &--input {
      input {
        text-align: center;
      }
    }
    &--input.volume {
      padding-top: 1.17rem;
      display: flex;
      align-items: center;
      input {
        flex: 1;
        padding: .7rem .2rem;
        max-width: 50px;
        border: 1px solid #666;
      }
      span {
        flex: 1;
        font-size: 1.8rem;
        text-align: center;
      }
    }
  }
  p.dialog-tips {
    text-align: left;
    padding-top: 1rem;
    font-size: 1.2rem;
    color: #999;
  }
  .img-box {
    height: 350px;
    overflow: hidden;
  }
  .vux-close {
    margin-top: 8px;
    margin-bottom: 8px;
  }
}

.package-dialog {
  .package-close {
    position: absolute;
    top: 15px;
    right: 8px;
    background: white;
  }
  .weui-dialog{
    padding: 1rem 1rem 8px 1rem;
    border-radius: 8px;
  }
  h1 {
    color: #7f7f7f;
    font-size: 1.8rem;
    font-weight: 100;
  }
  &-form {
    &__confrim {
      padding: .8rem;
      button {
        width: 45%;
        padding: 0.6rem 0;
      }
      &--cancle {
        background: transparent;
        margin-right: 4%;
        color: @red;
        border: 1px solid @red;
        border-radius: 5px;
      }
      &--sure {
        background: @red;
        margin-right: 1rem;
        color: white;
        border: 1px solid @red;
        border-radius: 5px;
      }
    }
  }
  &-tips {
    padding: 0 .6rem;
    text-align: left;
    font-size: 1.2rem;
    color: #999;
  }
}

.bgblue {
  background-color: black;
}

.bgyellow {
  background-color: @dark-yellow;
}

.bgred {
  background-color: @red;
}
.weui-cells {
  margin-top: 12px!important;
}

.weui-cell {
  padding-left: 18px!important;
}

.weui-cell.office.weui-cell_access{
  div.weui-cell__ft {
    font-size: 1.5rem;
    width: 100%;
    color: #333;
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.go-sendlist {
  margin-bottom: 1.17647059em;
  .weui-cell {
    margin-top: 0!important;
  }
  .weui-cells {
    margin-top: 0!important;
  }
}

.send-icon {
  width: 3rem;
}

.weui-cell__bd {
  font-size: 1.5rem;
  textarea {
    text-align: right;
  }
  select {
    color: #333;
  }
}

label {
  font-size: 1.5rem;
}

.weui-cell:before {
  border-top: 1px solid @borderbt!important;
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

.send {
  &-container {
    padding-bottom: 6rem;
    overflow: hidden;
    a {
      .send-container-address {
        color: #333;
      }
    }
    &-address {
      .flex;
      font-size: 1.4rem;
      padding: .6rem 0;
      padding-left: 18px;
      justify-content: space-between;
      background: white;
      &:first-child {
        border-bottom: 1px solid @borderbt;
      }

      &__intro {
        flex: 1;
        margin-right: 0.5rem;
        span {
          font-size: 1.6rem;
          width: 3rem;
          height: 3rem;
          line-height: 3rem;
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
        white-space: nowrap;
        flex: 2;
        padding: 0 0;
        padding-right: 15px;
        text-align: right;
        height: 5rem;
        line-height: 5rem;
        color: @red;
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
      margin-top: 12px;
      background: white;
      padding: 10px 11px 10px 18px;
      &__title {
        padding-bottom: 1rem;
        align-content: center;
        justify-content: space-between;
        display: flex;
        font-size: 1.5rem;
        color: @greyfont;
        button {
          color: @red;
          border: 2px solid @red;
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
          color: @red;
        }
      }
    }

    &-hall {
      margin-top: 1rem;
      padding: 1rem 1rem;
      font-size: 1.4rem;
      background: white;
      justify-content: space-between;
      img {
        width: 3rem;
      }
    }
    .div-btn-sub {
      padding: 2rem 0rem;
      text-align: center;
      overflow: hidden;
      .btn-sub {
        color: white;
        border: none;
        padding: 1rem 0;
        font-size: 1.8rem;
        width: 92%;
        background-color: @red;
        border: none;
        border-radius: 5px;
      }
    }
  }
}
</style>
