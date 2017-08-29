<template>
  <div class="editaddress">
    <div class="editaddress-container">
      <group>
        <x-input type="text" title="联系人" v-model="linkman" :max="20" placeholder="请填写您的真实姓名" required></x-input>
        <x-input type="text" title="邮编" v-model="postcode" :max="20" placeholder="请填写邮编"></x-input>
        <x-input v-show="type === 2" type="text" title="证件" v-model="idnumber" :max="50" placeholder="请填写身份证号/护照号" required></x-input>
        <x-input title="电话" type="text" :max="20" v-model="iphone" placeholder="请输入手机号" required></x-input>
        <x-input  @click.native="steppickershow = !steppickershow" disabled title="地区" placeholder="请选择国家、省市区" type="text" required v-model="location"></x-input>
        <x-textarea type="text" title="地址" :max="60" placeholder="请详细到门牌号 (限60字、必填)" :show-counter="false" v-model="detailedinformation" :rows="1" :height="detailedinformation.length + 22" required>
        </x-textarea>
        <x-textarea type="text" title="备注" :max="50" placeholder="请添加备注 (限50字)" :show-counter="false" v-model="remove" :rows="1" :height="22">
        </x-textarea>
       </group>
       <group>
         <x-switch title="设为默认地址" class="mj-switch" v-model="value"></x-switch>
       </group>
       <step-location :steppickerShow="steppickershow" :type="typecn" v-on:listenClose="closeStepLocation" v-on:listenConfrim="confirmStep">
       </step-location>
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
    let location
    this.typecn = type
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
      this.locationid = {
        nationid: Number(query.nationid),
        provinnce: Number(query.provinnce),
        city: Number(query.city),
        county: Number(query.county)
      }
      location = await this.getGeography({countryid: query.nationid, provinceid: query.provinnce, cityid: query.city, countyid: query.county})
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
      this.locationid = {
        nationid: Number(query.nation),
        provinnce: Number(query.provinnce),
        city: Number(query.city),
        county: Number(query.county)
      }
      location = await this.getGeography({countryid: query.nation, provinceid: query.provinnce, cityid: query.city, countyid: query.county})
    }
    if (location.type !== 'success') {
      this.$vux.toast.show(location)
      return
    }
    this.location = location.data
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
      steppickershow: false,
      picker: false,
      pagetype: 'add',
      idnumber: '',
      query: {},
      linkman: '',
      company: '',
      postcode: '',
      iphone: '',
      location: '',
      locationid: {},
      detailedinformation: '',
      endtime: '',
      remove: '',
      value: false,
      addressVal: [],
      ajaxasync: false
    }
  },
  methods: {
    ...mapActions([
      'addAddress',
      'eidtAddress',
      'getGeography'
    ]),
    closeStepLocation (val) {
      this.steppickershow = val
    },
    confirmStep (val) {
      this.location = val.show
      this.locationid = val.val
    },
    change (value) {
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
      const locationId = this.locationid
      const res = await this.addAddress({...locationId, start: start, detailedinformation: this.detailedinformation, postcode: this.postcode, iphone: this.iphone, linkman: this.linkman, company: this.company, remove: this.remove, type: this.type, idnumber: this.idnumber})
      this.ajaxasync = false
      if (res.type !== 'success') {
        this.$vux.loading.hide()
        return this.$vux.toast.show(res)
      }
      this.$vux.toast.show(res)
      this.$vux.loading.hide()
      this.$router.go(-1)
    }
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
      margin-top: 10rem;
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
