<template>
  <div class="withdraw">
    <div class="withdraw-container">
      <group label-width="11rem" label-align="left">
        <cell
          title="真实姓名"
          :value="detail.trueName"
        ></cell>
        <cell
          title="手机号码"
          :value="detail.mobile"
        ></cell>
        <cell
          title="提现方式"
          :value="detail.type | withdrawtype"
        ></cell>
        <cell
          title="提现账号"
          :value="detail.accountNumber"
        ></cell>
        <cell
          title="提现金额"
          :value="detail.cash"
        ></cell>
        <cell
          title="提现状态"
          :value="detail.status | withdrawstatus"
        ></cell>
        <cell
          v-show="detail.status === 2"
          title="拒绝原因"
          :value="detail.reason"
        ></cell>
        <cell
          title="发起时间"
          :value="detail.createTime | formatedatestamp"
        ></cell>
      </group>
    </div>
  </div>
</template>

<script>

export default {
  name: 'withdrawdetail',
  data () {
    return {
      detail: {}
    }
  },
  created () {
    this.detail = this.$route.query
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>

</style>
