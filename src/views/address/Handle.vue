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
        <cascade-address
          v-show="typecn==='send'&&country['name']==='中国'"
          title="地区选择"
          placeholder="请选择地区"
          :defaultSelect="cascaAddrData"
          @listenValChange="onCasAddrChange"
        >
        </cascade-address>
        <x-textarea 
          title="地址"
          type="text"
          :max="800"
          placeholder="         请详细到门牌号(必填)" 
          :show-counter="false"
          v-model="address"
          :height="address.length + 22"
          :rows="1"
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
          placeholder="         请添加备注 (限50字)" 
          :show-counter="false" 
          v-model="remark" 
          :rows="1"
          :height="remark.length + 22"
          required
        ></x-textarea>
        <x-switch
          title="设为默认地址"
          class="mj-switch"
          v-model="isDefault"
        ></x-switch>
      </group>
      <div class="addaddress-container-add">
        <div class="submit-btn">
          <button class="normal" @click.stop="handleAddress">
            {{pagetype === 'add' ? '创建' : '确认修改'}}
          </button>
        </div>
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
import * as redisService from '@/services/redis'
import { selectProvCityCounty } from '@/services/geography'
import { reg as regUtil, storage } from '@/utils'
import SelectCountry from './components/SelectCountry'
import CascadeAddress from '@/components/CascadeAddress'
import * as map from '@/utils/map'

export default {
  name: 'handleaddress',
  components: {
    XInput,
    XSwitch,
    XAddress,
    Radio,
    XTextarea,
    Picker,
    SelectCountry,
    CascadeAddress
  },
  data () {
    return {
      type: 2,
      typecn: 'send',
      pagetype: '',
      query: {},
      userId: '',
      name: '',
      postcode: '',
      mobile: '',
      address: '',
      remark: '',
      isDefault: false,
      ajaxasync: false,
      createRes: false,
      country: {
        id: 0,
        name: '',
        code: ''
      },
      cascaAddrData: [],
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
      localData = JSON.parse(localData) || {
        country: {
          name: ''
        }
      }
      this.name = localData.name || ''
      this.mobile = localData.mobile || ''
      this.postcode = localData.postcode || ''
      this.address = localData.address || ''
      this.remark = localData.remark || ''
      this.isDefault = localData.isDefault || false
      this.country = localData.country || {
        id: 0,
        name: '',
        code: ''
      }
      this.cascaAddrData = localData.cascaAddrData
      if ((!this.country['name'] || this.country['name'] === '中国') && !this.cascaAddrData && type === 'send') {
        try {
          this.$vux.loading.show()
          const openid = storage({key: 'openid'})
          const lng = await redisService.query({
            key: openid
          })
          if (lng.code === 200 && lng.obj) {
            let lnglatXY = []
            lnglatXY[0] = Number(lng.obj.longitude)
            lnglatXY[1] = Number(lng.obj.latitude)
            // lnglatXY = [116.30621, 39.976121]
            const address = await map.reGeocoder(lnglatXY)
            const countyCode = address.regeocode.addressComponent.adcode
            const resG = await selectProvCityCounty({
              countyCode
            })
            const addressList = resG['0']
            const township = address.regeocode.addressComponent.township || ''
            const street = address.regeocode.addressComponent.street || ''
            const streetNumber = address.regeocode.addressComponent.streetNumber || ''
            if (!this.address) {
              this.address = township + street + streetNumber
            }
            this.country = {
              id: addressList['countryId'],
              name: addressList['COUNTRY_CN'],
              code: 'CN'
            }
            const province = {
              provinceId: addressList['pid'],
              provinceName: addressList['PROVINCE']
            }
            const city = {
              cityId: addressList['cid'],
              cityName: addressList['CITY']
            }
            const district = {
              districtId: addressList['did'],
              districtName: addressList['DISTRICT']
            }
            this.cascaAddrData = [JSON.stringify(province), JSON.stringify(city), JSON.stringify(district)]
            return
          }
        } catch (err) {
          console.error(err)
        } finally {
          this.$vux.loading.hide()
        }
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
      this.country = {
        id: Number(addrRes.COUNTRY) || 0,
        name: addrRes.COUNTRY_CN || '',
        code: addrRes.COUNTRY_CODE || ''
      }
      const province = {
        provinceId: addrRes['PROV'],
        provinceName: addrRes['PROVINCE']
      }
      const city = {
        cityId: addrRes['CITY'],
        cityName: addrRes['cityName']
      }
      const district = {
        districtId: addrRes['COUNTY'],
        districtName: addrRes['DISTRICT']
      }
      this.cascaAddrData = [JSON.stringify(province), JSON.stringify(city), JSON.stringify(district)]
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
  computed: {
    region () {
      // 地区数据，包含省市区，目前只有在国家是中国的情况下才选择
      const cascaAddrData = this.cascaAddrData
      try {
        const provinceId = JSON.parse(cascaAddrData[0])['provinceId']
        const cityId = JSON.parse(cascaAddrData[1])['cityId']
        const countyId = JSON.parse(cascaAddrData[2])['districtId']
        return {
          prov: provinceId,
          city: cityId,
          county: countyId
        }
      } catch (e) {
        console.error(e)
        return {
          prov: 0,
          city: 0,
          county: 0
        }
      }
    }
  },
  methods: {
    ...mapActions([
      'addAddress',
      'updateAddress'
    ]),
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
    onCasAddrChange (val) {
      this.cascaAddrData = val
    },
    checkBeforeSubmit () {
      if (!this.name || !this.mobile || !this.address || !this.country['name']) {
        this.$vux.toast.show({
          text: '请将信息填写完整',
          type: 'warn',
          width: '18rem'
        })
        return false
      }
      const region = this.region
      if (this.country['name'] === '中国' && (!region['prov'] || !region['city'] || !region['county'])) {
        this.$vux.toast.show({
          text: '当国家为中国时，省市区为必填',
          type: 'warn',
          width: '21rem'
        })
        return false
      }
      if (!regUtil.checkPostcode(this.postcode)) {
        this.$vux.toast.show({
          text: '邮编格式不对，请重新填写',
          type: 'warn',
          width: '18rem'
        })
        return false
      }
      if (!regUtil.checkMobile(this.mobile)) {
        this.$vux.toast.show({
          text: '手机号格式不对，请重新填写',
          type: 'warn',
          width: '19rem'
        })
        return false
      }
      return true
    },
    async handleAddress () {
      if (!this.checkBeforeSubmit()) {
        return
      }
      const region = this.region
      if (this.ajaxasync) return
      this.ajaxasync = true
      let data = {
        ...region,
        country: this.country['id'],
        name: this.name,
        postcode: this.postcode,
        mobile: this.mobile,
        address: this.address,
        isDefault: this.isDefault ? 1 : 0,
        remark: this.remark
      }
      let res = ''
      const pagetype = this.pagetype
      try {
        if (pagetype === 'add') {
          res = await this.addAddress({
            data,
            type: this.type
          })
        } else {
          data.id = this.addressId
          res = await this.updateAddress({
            data,
            type: this.type
          })
        }
        this.ajaxasync = false
        this.$vux.toast.show(res)
        if (res.type !== 'success' && pagetype === 'add') {
          this.createRes = false
          this.$vux.toast.show(res)
          // 创建成功，则清空缓存中以往新增地址记录
          const typecn = this.typecn
          storage({
            key: `handle_address_${typecn}_prop`,
            type: 'remove'
          })
          return
        }
        if (res.type === 'success' && pagetype === 'add') {
          this.createRes = true
          const type = this.typecn
          storage({
            type: 'remove',
            key: `handle_address_${type}_prop`
          })
        }
        this.$router.go(-1)
      } catch (e) {
        console.error(e)
        this.$vux.toast.show({
          text: e.message || '网络出错',
          width: '16rem',
          type: 'warn'
        })
      } finally {
        this.$vux.loading.hide()
      }
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
      cascaAddrData: this.cascaAddrData
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
@import '../../assets/styles/colors.less';
@import '../../assets/styles/helpers.less';

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
    }
  }
}

</style>
