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
          textAlign="right"
          required
          :isType="checkMobileForVux"
          shouldToasterror
        ></x-input>
        <x-input
          title="提现金额"
          type="text"
          v-model="money"
          :placeholder="`可提现金额${totalIncome}元`"
          text-align="right"
          required
        >
        </x-input>
        <div class="tips-container">
          <tips content="最低提现100元"></tips>
        </div>
        <selector 
          title="提现方式" 
          v-model="withdrawType" 
          :options="withdrawTypeOption"
          direction="rtl">
        </selector>
        <x-input
          :title="accountTitle"
          type="text"
          v-show="withdrawType"
          v-model="accountNumber"
          :placeholder="'请填写您的' + accountTitle" 
          text-align="right"
          required
        ></x-input>
      </group>
      <div class="submit">
        <div class="submit-btn">
          <button
            :class="{'normal': canSubmit['res'], 'disabled': !canSubmit['res']}"
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
import { storage } from '@/utils'
/* eslint-disable no-unused-vars */
import { checkMobile } from '@/utils/reg'
import Tips from '@/components/Tips'
import { getUserinfo, createWithdraw } from '@/services/promote'

export default {
  name: 'handlewithdraw',
  data () {
    return {
      spreadUserId: 0,
      totalIncome: 0,
      name: '',
      mobile: '',
      money: null,
      withdrawType: null,
      withdrawTypeOption: [{
        key: 'wx',
        value: '微信'
      }, {
        key: 'alipay',
        value: '支付宝'
      }],
      accountNumber: '',
      inLoading: false
    }
  },
  components: {
    XInput,
    Selector,
    Tips
  },
  async created () {
    await this.initData()
  },
  mounted () {
  },
  computed: {
    accountTitle () {
      const withdrawType = this.withdrawType
      return withdrawType === 'wx' ? '微信帐号' : '支付宝帐号'
    },
    canSubmit () {
      if (this.money < 100) {
        return {
          res: false,
          msg: '最低提现100元'
        }
      }
      if (!checkMobile(this.mobile)) {
        return {
          res: false,
          msg: '手机号码格式不对'
        }
      }
      if (!this.accountNumber) {
        return {
          res: false,
          msg: '请填写收款帐号'
        }
      }
      return {
        res: true,
        msg: '可以提交'
      }
    },
    postData () {
      return {
        spreadUserId: this.spreadUserId,
        trueName: this.name,
        cash: this.money * 100,
        mobile: this.mobile,
        type: this.withdrawType === 'wx' ? 0 : 1,
        accountNumber: this.accountNumber
      }
    }
  },
  methods: {
    async initData () {
      try {
        let wxUserId = storage({
          type: 'get',
          key: 'userId'
        })
        const res = await getUserinfo({wxUserId})
        if (res.success && res.code === 200) {
          const userData = res.obj
          this.spreadUserId = userData.spreadUserId
          this.totalIncome = userData.totalIncome ? Number(userData.totalIncome) : 0
        }
      } catch (err) {
        console.error(err)
      }
    },
    checkMobileForVux (str) {
      const regFor = /^\+?\d{1,6}-?\d{8,15}$/
      const regCN = /^1(3|4|5|6|7|8|9)\d{9}$/
      const valid = regFor.test(str) || regCN.test(str)
      return {
        valid,
        msg: valid ? '正确' : '请输入正确的手机号'
      }
    },
    async submit () {
      if (this.inLoading) {
        this.$vux.toast.show({
          text: '正在提交，请稍后再试',
          width: '18rem',
          type: 'warn'
        })
        return
      }
      if (!this.canSubmit['res']) {
        this.$vux.toast.show({
          text: this.canSubmit['msg'],
          width: '20rem',
          type: 'warn'
        })
        return
      }
      try {
        this.inLoading = true
        const postData = this.postData
        const res = await createWithdraw({
          ...postData
        })
        if (res.success && res.code === 200) {
          this.$vux.toast.show({
            text: '提现请求已提交',
            width: '18rem',
            type: 'success'
          })
          this.clearForm()
          return
        } else {
          this.$vux.toast.show({
            text: res.msg || '提交失败',
            width: '18rem',
            type: 'warn'
          })
          return
        }
      } catch (err) {
        console.error(err)
        this.$vux.toast.show({
          text: err.message || '提交失败',
          width: '18rem',
          type: 'warn'
        })
      } finally {
        this.inLoading = false
      }
    },
    clearForm () {
      this.name = ''
      this.mobile = ''
      this.money = 0
      this.withdrawType = null
      this.accountNumber = ''
    }
  },
  watch: {
    money (val, oldval) {
      // val = Number(val)
      // if (val > this.totalIncome) {
      //   this.$vux.toast.show({
      //     text: '提现金额超出最大值',
      //     width: '18rem',
      //     type: 'warn'
      //   })
      //   this.money = this.totalIncome
      //   return
      // }
    }
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
