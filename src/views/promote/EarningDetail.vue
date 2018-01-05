<template>
  <div class="earings">
    <div class="earings-container">
      <group label-width="11rem" label-align="left">
        <cell
          title="下单人"
          :value="detail.nickName"
        ></cell>
        <cell
          title="订单类型"
          :value="detail.type"
        ></cell>
        <cell
          title="订单金额"
          :value="detail.cashFee"
        ></cell>
        <cell
          title="所得收益"
          :value="detail.income"
        ></cell>
        <cell
          title="下单时分润比例"
          :value="detail.incomeRatio"
        ></cell>
      </group>
    </div>
  </div>
</template>

<script>

export default {
  name: 'earingsdetail',
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
