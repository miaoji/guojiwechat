<template>
  <div class="handlewithdraw">
    <div class="container">
      <group
        label-width="10rem"
        label-align="left"
      >
        <x-input
          :title="$t('promoteHW.name')"
          type="text"
          v-model="name"
          :max="20"
          :placeholder="$t('promoteHW.fillInName')"
          text-align="right"
          required
        ></x-input>
        <x-input
          :title="$t('promoteHW.mobile')"
          type="text"
          v-model="mobile"
          :max="20"
          :placeholder="$t('promoteHW.fillInMobile')"
          textAlign="right"
          required
          :isType="checkMobileForVux"
          shouldToasterror
        ></x-input>
        <x-input
          :title="$t('promoteHW.money')"
          type="text"
          v-model="money"
          
          :placeholder="$t('promoteHW.fillInMoney', {'num': netIncome})"
          text-align="right"
          required
        >
        </x-input>
        <div class="tips-container">
          <tips :content="$t('promoteHW.mixMoney')"></tips>
        </div>
        <selector 
          :title="$t('promoteHW.withdrawType')" 
          v-model="withdrawType" 
          :options="withdrawTypeOption"
          direction="rtl">
        </selector>
        <x-input
          :title="accountTitle"
          type="text"
          v-show="withdrawType"
          v-model="accountNumber"
          :placeholder="$t('promoteHW.pleaseFill') + accountTitle" 
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
            {{'promoteHW.send' | translate}}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { XInput, Selector } from 'vux'
import { mapGetters } from 'vuex'
/* eslint-disable no-unused-vars */
import { checkMobile } from '@/utils/reg'
import Tips from '@/components/Tips'
import { getUserinfo, createWithdraw } from '@/services/promote'

export default {
  name: 'handlewithdraw',
  data () {
    return {
      spreadUserId: 0,
      netIncome: 0,
      name: '',
      mobile: '',
      money: null,
      withdrawType: null,
      withdrawTypeOption: [{
        key: 'wx',
        value: this.$t('promoteHW.weChat')
      }, {
        key: 'alipay',
        value: this.$t('promoteHW.aliPay')
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
    ...mapGetters({
      userid: 'getUserId'
    }),
    accountTitle () {
      const withdrawType = this.withdrawType
      return withdrawType === 'wx' ? this.$t('promoteHW.weChatNo') : this.$t('promoteHW.aliPayNo')
    },
    canSubmit () {
      if (this.money < 100) {
        return {
          res: false,
          msg: this.$t('promoteHW.mixMoney')
        }
      }
      if (!checkMobile(this.mobile)) {
        return {
          res: false,
          msg: this.$t('promoteHW.mobileError')
        }
      }
      if (!this.accountNumber) {
        return {
          res: false,
          msg: this.$t('promoteHW.pleaseFillNo')
        }
      }
      return {
        res: true,
        msg: this.$t('promoteHW.sendSuccess')
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
        const wxUserId = this.userid
        const res = await getUserinfo({wxUserId})
        if (res.success && res.code === 200) {
          const userData = res.obj
          this.spreadUserId = userData.spreadUserId
          this.netIncome = userData.netIncome ? Number(userData.netIncome) : 0
          this.netIncome = Number(this.netIncome / 100).toFixed(2)
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
        msg: valid ? this.$t('promoteHW.yes') : this.$t('promoteHW.pleaseFillMobile')
      }
    },
    async submit () {
      if (this.inLoading) {
        this.$vux.toast.show({
          text: this.$t('promoteHW.sending'),
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
            text: "'promoteHW.Submission' | translate",
            width: '18rem',
            type: 'success'
          })
          this.$router.push({
            path: '/promote/withdraw',
            query: {
              spreadUserId: this.spreadUserId
            }
          })
          return
        } else {
          this.$vux.toast.show({
            text: res.msg || "'promoteHW.sendError' | translate",
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
