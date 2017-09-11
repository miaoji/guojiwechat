<template>
  <div class="editaddress">
    <div class="editaddress-container">
      <group>
        <x-input type="text" title="联系人" v-model="linkman" :max="20" placeholder="请填写您的真实姓名" required></x-input>
        <x-input type="text" title="邮编" v-model="postcode" :max="20" placeholder="请填写邮编"></x-input>
        <x-input title="电话" type="text" :max="20" v-model="iphone" placeholder="请输入手机号" required></x-input>
        <x-input @click.native="steppickershow = !steppickershow" disabled title="国家" placeholder="请选择国家" type="text" required v-model="location"></x-input>
        <x-input @click.native="stepprovinceshow = !stepprovinceshow && location" disabled title="省份" placeholder="请选择省份" type="text" v-model="provincedataShow" ></x-input>
        <x-input @click.native="stepcityshow = !stepcityshow && provincedataShow" disabled title="市级" placeholder="请选择市级" type="text" v-model="citydataShow"></x-input>
        <x-input @click.native="stepcountyshow = !stepcountyshow && citydataShow" disabled title="县区" placeholder="请选择县区" type="text" v-model="countydataShow"></x-input>
        <x-textarea type="text" title="地址" :max="60" placeholder="请详细到门牌号 (限60字、必填)" :show-counter="false" v-model="detailedinformation" :rows="1" :height="detailedinformation.length + 22" required>
        </x-textarea>
        <x-textarea type="text" title="备注" :max="50" placeholder="请添加备注 (限50字)" :show-counter="false" v-model="remove" :rows="1" :height="22">
        </x-textarea>
      </group>
      <group>
       <x-switch title="设为默认地址" class="mj-switch" v-model="value"></x-switch>
      </group>
      <step-location :type="typecn" :steppickerShow="steppickershow" @listenClose="closeStepLocation" @listenConfrim="confirmStep"></step-location>
      <step-province :type="typecn" :stepprovinceshow="stepprovinceshow" :nationId="nationId" @listenProvinceClose="closeStepProvince" @listenProvinceConfrim="confirmStepProvince"></step-province>
      <step-city :type="typecn" :stepcityshow="stepcityshow" :provinceId="provinceId" @listenCityClose="closeStepCity"  @listenCityConfrim="confirmStepCity"></step-city>
      <step-county :type="typecn" :stepcountyshow="stepcountyshow" :cityId="cityId" @listenCountyClose="closeStepCounty" @listenCountyConfrim="confirmStepCounty"></step-county>
      <div class="editaddress-container-add">
       <p class="editaddress-container-add--btn" @click.stop="editAddress">保存修改</p>
      </div>
    </div>
  </div>
</template>
<script>
import { XInput, XSwitch, XTextarea, XAddress, Picker, Radio } from 'vux'
import { mapActions } from 'vuex'
import { reg as regUtil } from '../utils'

export default {
  name: 'editaddress',
  components: {
    XInput,
    XSwitch,
    XAddress,
    Radio,
    XTextarea,
    Picker
  },
  async created () {
    const query = this.$route.query
    const type = query.type
    this.typecn = type
    this.$vux.loading.show()
    if (type === 'send') {
      this.type = 1
      this.addressid = query.id
      this.linkman = query.linkman
      this.company = query.company
      this.iphone = query.iphone
      this.postcode = query.postcode
      this.endtime = query.endtime
      this.detailedinformation = query.detailedinformation
      this.remove = query.remove
      // 定义国家省市区 id 和展示的名称
      this.nationid = Number(query.nationid)
      this.provinceId = Number(query.provinnce)
      this.cityId = Number(query.city)
      this.countyId = Number(query.county)
    } else if (type === 'pickup') {
      this.type = 2
      this.addressid = query.id
      this.linkman = query.recipients
      this.company = query.company
      this.iphone = query.iphone
      this.postcode = query.postcode
      this.endtime = query.endtime
      this.idnumber = query.idnumber
      this.detailedinformation = query.detaliedinformation
      this.remove = query.remark
      // 定义国家省市区 id 和展示的名称
      this.nationid = Number(query.nation)
      this.provinceId = Number(query.provinnce)
      this.cityId = Number(query.city)
      this.countyId = Number(query.county)
    }
    let location = await this.getGeography({countryid: this.nationid, provinceid: this.provinceId, cityid: this.cityId, countyid: this.countyId})
    this.$vux.loading.hide()
    if (location.type !== 'success') {
      this.$vux.toast.show(location)
      return
    }
    // 将获得的name分配给当前页面data
    const locationName = location.data
    this.location = locationName.countryName
    this.provincedataShow = locationName.provinceName
    this.citydataShow = locationName.cityName
    this.countydataShow = locationName.countyName
    this.value = query.start === 3
  },
  mounted () {
    window.document.title = '编辑地址'
  },
  data () {
    return {
      type: 1,
      typecn: 1,
      addressid: '',
      picker: false,
      pagetype: 'add',
      idnumber: '',
      query: {},
      linkman: '',
      company: '',
      postcode: '',
      iphone: '',
      detailedinformation: '',
      endtime: '',
      remove: '',
      value: false,
      addressVal: [],
      ajaxasync: false,
      steppickershow: false,
      stepcountyshow: false,
      stepprovinceshow: false,
      stepcityshow: false,
      location: '',
      locationid: {},
      nationId: 0,
      provincedata: [],
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
      'eidtAddress',
      'getGeography'
    ]),
    getProvincedata (val) {
      this.provincedata = val
    },
    pickerChange () {
    },
    closeStepLocation (val) {
      this.steppickershow = val
    },
    closeStepProvince (val) {
      this.stepprovinceshow = val
    },
    closeStepCity (val) {
      this.stepcityshow = val
    },
    closeStepCounty (val) {
      this.stepcountyshow = val
    },
    confirmStep (val) {
      let oldlocation = this.location
      this.location = val.show
      this.nationId = val.val.nationid
      if (this.location !== oldlocation) {
        this.provincedataShow = ''
        this.citydataShow = ''
        this.countydataShow = ''
      }
    },
    confirmStepProvince (val) {
      let oldProvincedataShow = this.provincedataShow
      this.provincedataShow = val.show
      this.provinceId = val.val.provinceId
      if (this.provincedataShow !== oldProvincedataShow) {
        this.citydataShow = ''
        this.countydataShow = ''
      }
    },
    confirmStepCity (val) {
      let oldCitydataShow = this.citydataShow
      this.citydataShow = val.show
      if (this.citydataShow !== oldCitydataShow) {
        this.cityId = val.val.city
        this.countydataShow = ''
      }
    },
    confirmStepCounty (val) {
      this.countydataShow = val.show
      this.countyId = val.val.county
    },
    async editAddress () {
      if (!this.linkman || !this.iphone || !this.detailedinformation || !this.location) {
        this.$vux.toast.show({
          text: '请将信息填写完整',
          type: 'warn',
          width: '18rem'
        })
        return
      }
      if (this.location === '中国' && (!this.provincedataShow || !this.provincedataShow || !this.countydataShow)) {
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
      this.$vux.loading.show({
        text: '正在提交'
      })
      const editres = await this.eidtAddress({id: this.addressid, type: this.typecn})
      if (editres.type !== 'success') {
        this.$vux.toast.show(res)
        this.$vux.loading.hide()
        return
      }
      const start = this.value ? 3 : 1
      const res = await this.addAddress({
        nationid: this.nationId,
        provinnce: this.provinceId,
        city: this.cityId,
        county: this.countyId,
        start,
        detailedinformation: this.detailedinformation,
        postcode: this.postcode,
        iphone: this.iphone,
        linkman: this.linkman,
        company: this.company,
        remove: this.remove,
        type: this.type,
        idnumber: this.idnumber
      })
      this.ajaxasync = false
      if (res.type !== 'success') {
        this.$vux.loading.hide()
        return this.$vux.toast.show(res)
      }
      this.$vux.toast.show(res)
      this.$vux.loading.hide()
      this.$router.go(-1)
    }
  },
  beforeDestroy () {
    this.$vux.loading.hide()
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../assets/styles/colors.less';
@import '../assets/styles/helpers.less';
.editaddress {
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
