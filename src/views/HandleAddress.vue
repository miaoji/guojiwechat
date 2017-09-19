<template>
  <div class="addaddress">
    <div class="addaddress-container" v-show="mainContainerShow">
      <group label-width="8rem" label-align="left">
        <x-input type="text" title="联系人" v-model="name" :max="20" placeholder="请填写您的真实姓名" required></x-input>
        <x-input title="电话" v-model="mobile" type="text" placeholder="请输入手机号" required></x-input>
        <x-input @click.native="onClickCountry" disabled title="国家/地区" placeholder="请选择国家/地区" type="text" required v-model="nationdataShow"></x-input>
        <x-input v-show="type === 1" @click.native="getPosition(2)" disabled title="省份" placeholder="请选择省份" type="text" v-model="provincedataShow" ></x-input>
        <x-input v-show="type === 1" @click.native="getPosition(3)" disabled title="市级" placeholder="请选择市级" type="text" v-model="citydataShow"></x-input>
        <x-input v-show="type === 1" @click.native="getPosition(4)" disabled title="县区" placeholder="请选择县区" type="text" v-model="countydataShow"></x-input>
        <x-textarea type="text" title="地址" :max="200" placeholder="请详细到门牌号(限60字、必填)" :show-counter="false" v-model="address" :rows="1" :height="address.length + 22" required></x-textarea>
        <x-input type="text" title="邮编" required v-model="postcode" :max="20" placeholder="请填写邮编"></x-input>
        <x-textarea type="text" title="备注" :max="50" placeholder="请添加备注 (限50字)" :show-counter="false" v-model="remark" :rows="1" :height="22" required></x-textarea>
      </group>
      <group>
         <x-switch title="设为默认地址" class="mj-switch" v-model="isDefault"></x-switch>
      </group>
      <get-position 
        :typecn='positionType' 
        :getpositionshow="getpositionshow" 
        :nationId="nationId" 
        :provinceId="provinceId"
        :cityId="cityId"
        :countyId="countyId"
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
      :countryName="nationdataShow"
      @listenCountryClose="onCountryClose"
      @listenCountryConfirm="onCountryConfirm"
    >
    </select-country>
  </div>
</template>
<script>
import { XInput, XSwitch, XTextarea, XAddress, Picker, Radio } from 'vux'
import { mapActions } from 'vuex'
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
      this.nationId = Number(localData.nationId)
      this.provinceId = Number(localData.provinceId)
      this.cityId = Number(localData.cityId)
      this.countyId = Number(localData.countyId)
      this.nationdataShow = localData.nationdataShow
      this.provincedataShow = localData.provincedataShow
      this.citydataShow = localData.citydataShow
      this.countydataShow = localData.countydataShow
      return
    }
    // 编辑地址时，从url参数中获取所有信息
    if (pagetype === 'edit') {
      this.addressId = query.id
      this.name = query.name
      this.mobile = query.mobile
      this.postcode = query.postcode
      this.address = query.address
      this.remark = query.remark
      this.isDefault = query.is_default === 1
      // 定义国家省市区 id 和展示的名称
      this.nationId = Number(query.country)
      this.provinceId = Number(query.prov)
      this.cityId = Number(query.city)
      this.countyId = Number(query.county)
      this.$vux.loading.show()
      // 根据国家、省、市、区的id获取名称
      let location = await this.getGeography({countryId: this.nationId, provinceId: this.provinceId, cityId: this.cityId, countyId: this.countyId})
      this.$vux.loading.hide()
      if (location.type !== 'success') {
        this.$vux.toast.show(location)
        return
      }
      // 将获得的name分配给当前页面data
      const locationName = location.data
      this.nationdataShow = locationName.countryName
      this.provincedataShow = locationName.provinceName
      this.citydataShow = locationName.cityName
      this.countydataShow = locationName.countyName
    }
  },
  data () {
    return {
      positionType: 1,
      type: 2,
      typecn: 'send',
      picker: false,
      pagetype: '',
      idnumber: '1',
      query: {},
      name: '',
      company: '',
      postcode: '',
      mobile: '',
      address: '',
      remark: '',
      isDefault: false,
      addressVal: [],
      ajaxasync: false,
      createRes: false,
      locationid: {},
      provincedata: [],
      // 信息
      getpositionshow: false,
      nationdataShow: '',
      nationId: 0,
      provincedataShow: '',
      provinceId: 0,
      citydataShow: '',
      cityId: 0,
      countydataShow: '',
      countyId: 0,
      mainContainerShow: true,
      selectCountryShow: false
    }
  },
  methods: {
    ...mapActions([
      'addAddress',
      'eidtAddress',
      'getGeography'
    ]),
    getPosition (val) {
      switch (val) {
        case 1:
          this.getpositionshow = !this.getpositionshow
          this.positionType = 1
          break
        case 2:
          this.getpositionshow = !this.getpositionshow && this.nationdataShow !== ''
          this.positionType = 2
          break
        case 3:
          this.getpositionshow = !this.getpositionshow && this.provincedataShow !== ''
          this.positionType = 3
          break
        case 4:
          this.getpositionshow = !this.getpositionshow && this.citydataShow !== ''
          this.positionType = 4
          break
      }
    },
    toPositionClose (val) {
      this.getpositionshow = val
    },
    toPositionConfirm (val) {
      switch (val.typePosition) {
        case 1: // 获取国家信息
          let oldlocation = this.nationdataShow
          this.nationdataShow = val.show
          this.nationId = val.val.positionId
          if (this.nationdataShow !== oldlocation) {
            this.provincedataShow = ''
            this.provinceId = 0
            this.citydataShow = ''
            this.cityId = 0
            this.countydataShow = ''
            this.countyId = 0
          }
          break
        case 2: // 获取省份信息
          let oldProvincedataShow = this.provincedataShow
          if (val.show) {
            this.provincedataShow = val.show
            this.provinceId = val.val.positionId
          }
          if (this.provincedataShow !== oldProvincedataShow) {
            this.citydataShow = ''
            this.cityId = 0
            this.countydataShow = ''
            this.countyId = 0
          }
          break
        case 3: // 获取市级信息
          let oldCitydataShow = this.citydataShow
          if (val.show) {
            this.citydataShow = val.show
            this.cityId = val.val.positionId
          }
          if (this.citydataShow !== oldCitydataShow) {
            this.countydataShow = ''
            this.countyId = 0
          }
          break
        case 4: // 获取县级信息
          if (val.show) {
            this.countydataShow = val.show
            this.countyId = val.val.positionId
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
      let oldlocation = this.nationdataShow
      this.nationdataShow = val.show
      this.nationId = val.nationId
      if (this.nationdataShow !== oldlocation) {
        this.provincedataShow = ''
        this.provinceId = 0
        this.citydataShow = ''
        this.cityId = 0
        this.countydataShow = ''
        this.countyId = 0
      }
    },
    async saveAddress () {
      if (!this.name || !this.mobile || !this.address || !this.nationdataShow) {
        this.$vux.toast.show({
          text: '请将信息填写完整',
          type: 'warn',
          width: '18rem'
        })
        return
      }
      if (this.nationdataShow === '中国' && (!this.provincedataShow || !this.provincedataShow || !this.countydataShow)) {
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
        country: this.nationId,
        prov: this.provinceId,
        city: this.cityId,
        county: this.countyId,
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
      if (!this.name || !this.mobile || !this.detailedinformation || !this.nationdataShow) {
        this.$vux.toast.show({
          text: '请将信息填写完整',
          type: 'warn',
          width: '18rem'
        })
        return
      }
      if (this.nationdataShow === '中国' && (!this.provincedataShow || !this.provincedataShow || !this.countydataShow)) {
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
      if (!regUtil.checkMobile(this.iphone)) {
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
        name: this.name,
        postcode: this.postcode,
        mobile: this.mobile,
        country: this.nationId,
        prov: this.provinceId,
        city: this.cityId,
        county: this.countyId,
        address: this.address,
        isDefault: this.isDefault ? 1 : 0,
        remark: this.remark
      }
      const res = await this.editAddress({
        data,
        type: this.type
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
      nationId: this.nationId,
      provinceId: this.provinceId,
      cityId: this.cityId,
      countyId: this.countyId,
      nationdataShow: this.nationdataShow,
      provincedataShow: this.provincedataShow,
      citydataShow: this.citydataShow,
      countydataShow: this.countydataShow
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
  min-height: 100vh;
  background-color: @bg-grey;
  &-container {
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
      margin-top: 5rem;
      padding: 1rem 1rem;
      p {
        font-size: 1.8rem;
        padding: 1rem 0;
        width: 100%;
        color: white;
        background: @red;
        border-radius: 6px;
      }
    }
  }
}

</style>
