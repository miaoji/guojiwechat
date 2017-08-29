<template>
  <div class="addaddress">
    <div class="addaddress-container">
      <group>
        <x-input type="text" title="联系人" v-model="linkman" :max="20" placeholder="请填写您的真实姓名" required></x-input>
        <x-input type="text" title="邮编" v-model="postcode" :max="20" placeholder="请填写邮编"></x-input>
        <x-input title="电话" v-model="iphone" type="text" placeholder="请输入手机号" required></x-input>
        <x-input @click.native="steppickershow = !steppickershow" disabled title="地区" placeholder="请选择国家、省市区" type="text" required v-model="location"></x-input>
        <x-textarea type="text" title="地址" :max="60" placeholder="请详细到门牌号(限60字、必填)" :show-counter="false" v-model="detailedinformation" :rows="1" :height="detailedinformation.length + 22" required>
        </x-textarea>
        <x-textarea type="text" title="备注" :max="50" placeholder="请添加备注 (限50字)" :show-counter="false" v-model="remove" :rows="1" :height="22" required>
        </x-textarea>
       </group>
       <group>
         <x-switch title="设为默认地址" class="mj-switch" v-model="value"></x-switch>
       </group>
       <step-location :type="typecn" :steppickerShow="steppickershow" v-on:listenClose="closeStepLocation" v-on:listenConfrim="confirmStep">
       </step-location>
       <div class="addaddress-container-add">
         <p class="addaddress-container-add--btn" @click.stop="saveAddress">创建</p>
       </div>
    </div>
  </div>
</template>
<script>
import { XInput, XSwitch, XTextarea, XAddress, Picker, Radio } from 'vux'
import { mapActions } from 'vuex'
import { reg as regUtil } from '../utils'

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
    window.document.title = '添加地址'
  },
  created () {
    const query = this.$route.query
    this.pagetype = query.pagetype || 'add'
    const type = query.type
    this.typecn = type
    this.type = type === 'send' ? 1 : 2
    if (this.pagetype === 'edit') {
      this.id = query.id
      this.linkname = query.linkname
      this.iphone = query.iphone
      this.detailedinformation = query.detaliedinformation
    }
  },
  data () {
    return {
      type: 1,
      typecn: 1,
      steppickershow: false,
      picker: false,
      pagetype: 'add',
      idnumber: '1',
      query: {},
      linkman: '',
      company: '',
      postcode: '',
      iphone: '',
      location: '',
      locationid: {},
      detailedinformation: '',
      remove: '',
      value: false,
      addressVal: [],
      ajaxasync: false
    }
  },
  methods: {
    ...mapActions([
      'addAddress',
      'eidtAddress'
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
    async saveAddress () {
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
      const locationId = this.locationid
      const start = this.value ? 3 : 1
      const res = await this.addAddress({...locationId, detailedinformation: this.detailedinformation, postcode: this.postcode, iphone: this.iphone, linkman: this.linkman, company: this.company, remove: this.remove, type: this.type, idnumber: this.idnumber, start})
      this.ajaxasync = false
      if (res.type !== 'success') {
        return this.$vux.toast.show(res)
      }
      this.$vux.toast.show(res)
      this.$router.go(-1)
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
