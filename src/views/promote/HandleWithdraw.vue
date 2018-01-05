<template>
  <div class="handlewithdraw">
    <div class="container">
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
          title="手机号"
          type="text"
          v-model="mobile"
          :max="20"
          placeholder="请填写手机号" 
          text-align="right"
          required
        ></x-input>
        <x-input
          title="提现金额"
          type="text"
          v-model="money"
          placeholder="请填写提现金额" 
          text-align="right"
          required
        ></x-input>
        <selector 
          title="提现方式" 
          v-model="withdrawType" 
          :options="withdrawTypeOption"
          direction="rtl">
        </selector>
      </group>
      <div class="submit">
        <div class="submit-btn">
          <button 
            :class="{'normal': rightData, 'disabled': !rightData}"
            @click.stop="submit"
          >
            提交
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { XInput, Selector } from 'vux'

export default {
  name: 'handlewithdraw',
  data () {
    return {
      name: '',
      mobile: '',
      money: 100,
      withdrawType: 'wx',
      withdrawTypeOption: [{
        key: 'wx',
        value: '微信'
      }, {
        key: 'alipay',
        value: '支付宝'
      }]
    }
  },
  components: {
    XInput,
    Selector
  },
  created () {
  },
  mounted () {
  },
  computed: {
    rightData () {
      if (this.money > 100) {
        return true
      }
      return false
    }
  },
  methods: {
    submit () {
      if (!this.rightData) {
        return
      }
      console.log('111')
    }
  },
  watch: {
  },
  beforeDestroy () {
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../assets/styles/colors.less';
@import '../../assets/styles/vars.less';
@import '../../assets/styles/helpers.less';
@import '~vux/src/styles/close';

.handlewithdraw {
  .container {
    .submit {
      padding: 1rem;
    }
  }
}
</style>
