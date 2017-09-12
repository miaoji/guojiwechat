<template>
  <div class="addaddress">
    <div class="addaddress-container">
      <group>
        <x-input type="text" title="联系人" v-model="linkman" :max="20" placeholder="请填写您的真实姓名" required></x-input>
        <x-input title="电话" v-model="iphone" type="text" placeholder="请输入手机号" required></x-input>
        <x-input @click.native="getPosition(1)" disabled title="国家" placeholder="请选择国家" type="text" required v-model="nationdataShow"></x-input>
        <x-input @click.native="getPosition(2)" disabled title="省份" placeholder="请选择省份" type="text" v-model="provincedataShow" ></x-input>
        <x-input @click.native="getPosition(3)" disabled title="市级" placeholder="请选择市级" type="text" v-model="citydataShow"></x-input>
        <x-input @click.native="getPosition(4)" disabled title="县区" placeholder="请选择县区" type="text" v-model="countydataShow"></x-input>
        <x-textarea type="text" title="地址" :max="60" placeholder="请详细到门牌号(限60字、必填)" :show-counter="false" v-model="detailedinformation" :rows="1" :height="detailedinformation.length + 22" required></x-textarea>
        <x-input type="text" title="邮编" required v-model="postcode" :max="20" placeholder="请填写邮编"></x-input>
        <x-textarea type="text" title="备注" :max="50" placeholder="请添加备注 (限50字)" :show-counter="false" v-model="remove" :rows="1" :height="22" required></x-textarea>
      </group>
      <group>
         <x-switch title="设为默认地址" class="mj-switch" v-model="defaultLocation"></x-switch>
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
         <p class="addaddress-container-add--btn" @click.stop="saveAddress">创建</p>
        </div>
    </div>
  </div>
</template>
<script>
import { XInput, XSwitch, XTextarea, XAddress, Picker, Radio } from 'vux'
import { mapActions } from 'vuex'
import { reg as regUtil, storage } from '../utils'

export default {
  name: 'addaddress',
  components: {
    XInput,
    XSwitch,
    XAddress,
    Radio,
    XTextarea,
    Picker
  },
  mounted () {
    const type = this.type === 1 ? '寄件地址' : '收件地址'
    window.document.title = `添加${type}`
  },
  created () {
    const query = this.$route.query
    const type = query.type
    this.typecn = type
    this.type = type === 'send' ? 1 : 2
    let localData = storage({
      key: `add_address_${type}_prop`
    })
    localData = JSON.parse(localData)
    if (localData) {
      this.linkman = localData.linkman || ''
      this.iphone = localData.iphone || ''
      this.postcode = localData.postcode || ''
      this.detailedinformation = localData.detailedinformation || ''
      this.remove = localData.remove || ''
      this.defaultLocation = localData.defaultLocation || false
    }
  },
  data () {
    return {
      positionType: 1,
      type: 2,
      picker: false,
      pagetype: 'add',
      idnumber: '1',
      query: {},
      linkman: '',
      company: '',
      postcode: '',
      iphone: '',
      detailedinformation: '',
      remove: '',
      // defaultLocation: false,
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
      countyId: 0
    }
  },
  methods: {
    ...mapActions([
      'addAddress',
      'eidtAddress'
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
            this.citydataShow = ''
            this.countydataShow = ''
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
            this.countydataShow = ''
          }
          break
        case 3: // 获取市级信息
          let oldCitydataShow = this.citydataShow
          this.citydataShow = val.show
          if (this.citydataShow !== oldCitydataShow) {
            this.cityId = val.val.positionId
            this.countydataShow = ''
          }
          break
        case 4: // 获取县级信息
          this.countydataShow = val.show
          this.countyId = val.val.positionId
          break
      }
    },
    async saveAddress () {
      if (!this.linkman || !this.iphone || !this.detailedinformation || !this.nationdataShow) {
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
          width: '18rem'
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
      const locationId = this.locationid
      const start = this.defaultLocation ? 3 : 1
      const res = await this.addAddress({
        ...locationId,
        detailedinformation: this.detailedinformation,
        postcode: this.postcode,
        iphone: this.iphone,
        nationid: this.nationId,
        provinnce: this.provinceId,
        city: this.cityId,
        county: this.countyId,
        linkman: this.linkman,
        company: this.company,
        remove: this.remove,
        type: this.type,
        idnumber: this.idnumber,
        start
      })
      this.ajaxasync = false
      if (res.type !== 'success') {
        this.createRes = false
        return this.$vux.toast.show(res)
      }
      this.$vux.toast.show(res)
      this.createRes = true
      this.$router.go(-1)
    }
  },
  beforeDestroy () {
    // 如果未新建，保存已设置的值
    if (!this.createRes) {
      const type = this.typecn
      const addressInfo = {
        linkman: this.linkman,
        iphone: this.iphone,
        postcode: this.postcode,
        detailedinformation: this.detailedinformation,
        remove: this.remove,
        defaultLocation: this.defaultLocation
      }
      storage({
        key: `add_address_${type}_prop`,
        val: JSON.stringify(addressInfo),
        type: 'set'
      })
    }
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
