<template>
  <div class="addaddress">
    <div class="addaddress-container" v-show="mainContainerShow">
      <group 
        label-width="10rem"
        label-align="left"
      >
        <x-input
          title="联系人"
          type="text"
          v-model="name"
          :max="20"
          placeholder="请填写您的真实姓名" 
          text-align="right"
          required
        ></x-input>
        <x-input 
          title="电话" 
          v-model="mobile"
          type="text" 
          placeholder="请输入手机号" 
          required 
          text-align="right"
        ></x-input>
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
        <x-input 
          title="省份" 
          v-show="type === 1" 
          v-if="country['name']==='中国'?true:false"
          @click.native="getPosition(2)"
          disabled
          placeholder="请选择省份" 
          type="text"
          v-model="province['name']"
          text-align="right"
        ></x-input>
        <x-input 
          title="市级" 
          v-show="type === 1" 
          v-if="country['name']==='中国'?true:false"
          @click.native="getPosition(3)" 
          disabled 
          placeholder="请选择市级" 
          type="text" 
          v-model="city['name']"
          text-align="right"
        ></x-input>
        <x-input 
          title="县区" 
          v-show="type === 1" 
          v-if="country['name']==='中国'?true:false"
          @click.native="getPosition(4)" 
          disabled 
          placeholder="请选择县区" 
          type="text" 
          v-model="county['name']"
          text-align="right"
        ></x-input>
        <x-textarea 
          title="地址"
          type="text" 
          :max="500"
          placeholder="请详细到门牌号(必填)" 
          :show-counter="false" 
          v-model="address" 
          :rows="1" 
          :height="address.length + 22"
          required
          text-align="right"
        ></x-textarea>
        <x-input 
          title="邮编"
          type="text"
          required
          v-model="postcode"
          :max="20"
          placeholder="请填写邮编" 
          text-align="right"
        ></x-input>
        <x-textarea 
          title="备注"
          type="text"
          :max="50"
          placeholder="请添加备注 (限50字)" 
          :show-counter="false" 
          v-model="remark" 
          :rows="1" 
          :height="22" 
          required
        ></x-textarea>
        <x-switch 
          title="设为默认地址" 
          class="mj-switch" 
          v-model="isDefault"
        ></x-switch>
      </group>
      <get-position
        :type='positionType'
        :getpositionshow="getpositionshow" 
        :countryCode="country['code']"
        :provinceCode="province['code']"
        :cityCode="city['code']"
        :countyCode="county['code']"
        @listenPositionClose="toPositionClose" 
        @listenPositionConfirm="toPositionConfirm"
      >
      </get-position>
      <div class="addaddress-container-add">
        <p class="addaddress-container-add--btn" @click.stop="saveAddress" v-show="pagetype === 'add'">创建</p>
        <p class="addaddress-container-add--btn" @click.stop="editAddress" v-show="pagetype === 'edit'">确认修改</p>
      </div>
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
import { XInput, XSwitch, XTextarea, XAddress, Picker, Radio } from 'vux'
import { mapActions } from 'vuex'
import * as mailingAddrService from '@/services/mailingAddr'
import * as receiveAddrService from '@/services/receiveAddr'
import { reg as regUtil, storage } from '../utils'

export default {
  name: 'handleaddress',
  components: {
    XInput,
    XSwitch,
    XAddress,
    Radio,
    XTextarea,
    Picker
  },
  data () {
    return {
      userId: '',
      positionType: 1,
      type: 2,
      typecn: 'send',
      picker: false,
      pagetype: '',
      query: {},
      name: '',
      company: '',
      postcode: '',
      mobile: '',
      address: '',
      remark: '',
      isDefault: false,
      ajaxasync: false,
      createRes: false,
      // 信息
      getpositionshow: false,
      country: {
        id: 0,
        name: '',
        code: ''
      },
      province: {
        id: 0,
        name: '',
        code: ''
      },
      city: {
        id: 0,
        name: '',
        code: ''
      },
      county: {
        id: 0,
        name: '',
        code: ''
      },
      mainContainerShow: true,
      selectCountryShow: false
    }
  },
  async created () {
    const query = this.$route.query
    const {type, pagetype} = query
    this.typecn = type
    this.pagetype = pagetype
    this.type = type === 'send' ? 1 : 2
    // 添加地址时，从localStorage中获取用户之前未保存的数据
    if (pagetype === 'add') {
      let localData = storage({
        key: `handle_address_${type}_prop`
      })
      if (!localData) return
      localData = JSON.parse(localData)
      this.name = localData.name || ''
      this.mobile = localData.mobile || ''
      this.postcode = localData.postcode || ''
      this.address = localData.address || ''
      this.remark = localData.remark || ''
      this.isDefault = localData.isDefault || false
      // 定义国家省市区 id 和展示的名称
      this.country = localData.country || {
        id: 0,
        name: '',
        code: ''
      }
      this.province = localData.province || {
        id: 0,
        name: '',
        code: ''
      }
      this.city = localData.city || {
        id: 0,
        name: '',
        code: ''
      }
      this.county = localData.county || {
        id: 0,
        name: '',
        code: ''
      }
      return
    }
    // 编辑地址时，从url参数中获取所有信息
    if (pagetype === 'edit') {
      const addrFunc = type === 'send' ? mailingAddrService.show : receiveAddrService.show
      this.name = query.name
      this.$vux.loading.show()
      const resquestRes = await addrFunc({
        id: query.id
      })
      this.$vux.loading.hide()
      if (resquestRes.code === '200') {
        this.$vux.toast.show({
          type: 'warn',
          text: resquestRes.mess || '获取地址失败',
          width: '18rem'
        })
        return
      }
      const addrRes = resquestRes.obj
      this.addressId = query.id
      this.userId = addrRes.WX_USER_ID
      this.name = addrRes.NAME
      this.mobile = addrRes.MOBILE
      this.postcode = addrRes.POSTCODE
      this.address = addrRes.ADDRESS
      this.remark = addrRes.REMARK
      this.isDefault = addrRes.IS_DEFAULT === 1
      // 定义国家省市区id、code和name
      this.country = {
        id: Number(addrRes.COUNTRY) || 0,
        name: addrRes.COUNTRY_CN || '',
        code: addrRes.COUNTRY_CODE || ''
      }
      this.province = {
        id: Number(addrRes.PROV) || 0,
        name: addrRes.PROVINCE || '',
        code: addrRes.PROVINCE_CODE || ''
      }
      this.city = {
        id: Number(addrRes.CITY) || 0,
        name: addrRes.cityName || '',
        code: addrRes.city_code || ''
      }
      this.county = {
        id: Number(addrRes.COUNTY) || 0,
        name: addrRes.DISTRICT || '',
        code: addrRes.DISTRICT_CODE || ''
      }
    }
  },
  mounted () {
    let title = ''
    if (this.typecn === 'send') {
      if (this.pagetype === 'add') {
        title = '添加寄件地址'
      } else if (this.pagetype === 'edit') {
        title = '编辑寄件地址'
      }
    } else if (this.typecn === 'pickup') {
      if (this.pagetype === 'add') {
        title = '添加收件地址'
      } else if (this.pagetype === 'edit') {
        title = '编辑收件地址'
      }
    }
    window.document.title = title
  },
  methods: {
    ...mapActions([
      'addAddress',
      'updateAddress',
      'getGeography'
    ]),
    getPosition (val) {
      switch (val) {
        case 1:
          this.getpositionshow = !this.getpositionshow
          this.positionType = 1
          break
        case 2:
          this.getpositionshow = !this.getpositionshow && this.country['name'] !== ''
          this.positionType = 2
          break
        case 3:
          this.getpositionshow = !this.getpositionshow && this.province['name'] !== ''
          this.positionType = 3
          break
        case 4:
          this.getpositionshow = !this.getpositionshow && this.city['name'] !== ''
          this.positionType = 4
          break
      }
    },
    toPositionClose (val) {
      this.getpositionshow = val
    },
    toPositionConfirm (val) {
      if (!val) return
      console.log('val', val)
      let oldName = ''
      switch (val.typePosition) {
        case 1: // 获取国家信息
          oldName = this.country['name']
          this.country = val
          if (val['name'] !== oldName) {
            this.province = {
              id: 0,
              name: '',
              code: ''
            }
            this.city = {
              id: 0,
              name: '',
              code: ''
            }
            this.county = {
              id: 0,
              name: '',
              code: ''
            }
          }
          break
        case 2: // 获取省份信息
          oldName = this.province['name']
          if (val.name) {
            this.province = val
          }
          if (val['name'] !== oldName) {
            this.city = {
              id: 0,
              name: '',
              code: ''
            }
            this.county = {
              id: 0,
              name: '',
              code: ''
            }
          }
          break
        case 3: // 获取市级信息
          oldName = this.city['name']
          if (val.name) {
            this.city = val
          }
          if (oldName !== val['name']) {
            this.county = {
              id: 0,
              name: '',
              code: ''
            }
          }
          break
        case 4: // 获取县级信息
          if (val.name) {
            this.county = val
          }
          break
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
      console.log('valwinnder', val)
      // 之前的版本
      // let oldName = this.country['name']
      // if (val['name'] !== oldName) {
      //   this.country = val
      //   this.provincedataShow = ''
      //   this.provinceId = 0
      //   this.citydataShow = ''
      //   this.cityId = 0
      //   this.countydataShow = ''
      //   this.countyId = 0
      // }
      // 修改后的版本
      const oldName = this.country['name']
      if (val['name'] !== oldName) {
        this.country = val
        this.province = {
          id: 0,
          name: '',
          code: ''
        }
        this.city = {
          id: 0,
          name: '',
          code: ''
        }
        this.county = {
          id: 0,
          name: '',
          code: ''
        }
      }
    },
    async saveAddress () {
      if (!this.name || !this.mobile || !this.address || !this.country['name']) {
        this.$vux.toast.show({
          text: '请将信息填写完整',
          type: 'warn',
          width: '18rem'
        })
        return
      }
      if (this.country['name'] === '中国' && (!this.province['name'] || !this.city['name'] || !this.county['name'])) {
        this.$vux.toast.show({
          text: '当国家为中国时，省市区为必填',
          type: 'warn',
          width: '21rem'
        })
        return
      }
      if (!regUtil.checkPostcode(this.postcode)) {
        this.$vux.toast.show({
          text: '邮编格式不对，请重新填写',
          type: 'warn',
          width: '18rem'
        })
        return
      }
      if (!regUtil.checkMobile(this.mobile)) {
        this.$vux.toast.show({
          text: '手机号格式不对，请重新填写',
          type: 'warn',
          width: '19rem'
        })
        return
      }
      if (this.ajaxasync) return
      this.ajaxasync = true
      let data = {
        name: this.name,
        postcode: this.postcode,
        mobile: this.mobile,
        country: this.country['id'],
        prov: this.province['id'],
        city: this.city['id'],
        county: this.county['id'],
        address: this.address,
        isDefault: this.isDefault ? 1 : 0,
        remark: this.remark
      }
      const res = await this.addAddress({
        data,
        type: this.type
      })
      this.ajaxasync = false
      if (res.type !== 'success') {
        this.createRes = false
        return this.$vux.toast.show(res)
      }
      this.$vux.toast.show(res)
      // 创建成功，则清空缓存中以往新增地址记录
      const typecn = this.typecn
      storage({
        key: `handle_address_${typecn}_prop`,
        type: 'remove'
      })
      this.createRes = true
      this.$router.go(-1)
    },
    async editAddress () {
      if (!this.name || !this.mobile || !this.address || !this.country['name']) {
        this.$vux.toast.show({
          text: '请将信息填写完整',
          type: 'warn',
          width: '18rem'
        })
        return
      }
      if (this.country['name'] === '中国' && (!this.province['name'] || !this.city['name'] || !this.county['name'])) {
        this.$vux.toast.show({
          text: '当国家为中国时，省市区为必填',
          type: 'warn',
          width: '21rem'
        })
        return
      }
      if (!regUtil.checkPostcode(this.postcode)) {
        this.$vux.toast.show({
          text: '邮编格式不对，请重新填写',
          type: 'warn',
          width: '18rem'
        })
        return
      }
      if (!regUtil.checkMobile(this.mobile)) {
        this.$vux.toast.show({
          text: '手机号格式不对，请重新填写',
          type: 'warn',
          width: '18rem'
        })
        return
      }
      if (this.ajaxasync) return
      this.ajaxasync = true
      this.$vux.loading.show({
        text: '正在提交'
      })
      let data = {
        id: this.addressId,
        wx_user_id: this.userId,
        name: this.name,
        postcode: this.postcode,
        mobile: this.mobile,
        country: this.country['id'],
        prov: this.province['id'],
        city: this.city['id'],
        county: this.county['id'],
        address: this.address,
        isDefault: this.isDefault ? 1 : 0,
        remark: this.remark
      }
      const type = this.type
      const res = await this.updateAddress({
        data,
        type
      })
      this.ajaxasync = false
      this.$vux.loading.hide()
      this.$vux.toast.show(res)
      if (res.type !== 'success') return
      this.$router.go(-1)
    }
  },
  beforeDestroy () {
    this.$vux.loading.hide()
    // 页面为新增时, 如果未新建，保存已设置的值
    if (this.createRes || this.pagetype !== 'add') return
    const type = this.typecn
    const addressInfo = {
      name: this.name,
      mobile: this.mobile,
      postcode: this.postcode,
      address: this.address,
      remark: this.remark,
      isDefault: this.isDefault,
      country: this.country,
      province: this.province,
      city: this.city,
      county: this.county
    }
    storage({
      key: `handle_address_${type}_prop`,
      val: JSON.stringify(addressInfo),
      type: 'set'
    })
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../assets/styles/colors.less';
@import '../assets/styles/helpers.less';
.addaddress {
  .purple-bg;
  padding: 10px;
  padding-top: 20px;
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

</style>
