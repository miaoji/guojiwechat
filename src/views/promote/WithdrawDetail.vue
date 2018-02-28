<template>
  <div class="withdraw">
    <div class="withdraw-container">
      <group label-width="11rem" label-align="left">
        <cell
          :title="$t('promoteWD.trueName')"
          :value="detail.trueName"
        ></cell>
        <cell
          :title="$t('promoteWD.mobile')"
          :value="detail.mobile"
        ></cell>
        <cell
          :title="$t('promoteWD.withdrawType')"
          :value="detail.type | withdrawtype"
        ></cell>
        <cell
          :title="$t('promoteWD.accountNumber')"
          :value="detail.accountNumber"
        ></cell>
        <cell
          :title="$t('promoteWD.cash')"
          :value="detail.cash"
        ></cell>
        <cell
          :title="$t('promoteWD.status')"
          :value="detail.status | withdrawstatus"
        ></cell>
        <cell
          v-show="detail.status === 2"
          :title="$t('promoteWD.reason')"
          :value="detail.reason"
        ></cell>
        <cell
          :title="$t('promoteWD.createTime')"
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
