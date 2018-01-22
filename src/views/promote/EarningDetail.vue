<template>
  <div class="earings">
    <div class="earings-container">
      <group v-show="type === 'order'" label-width="11rem" label-align="left">
        <cell
          title="收益类型"
          :value="detail.event"
        ></cell>
        <cell
          title="订单类型"
          :value="detail.orderInfoType | ordertype"
        ></cell>
        <cell
          title="订单编号"
          :value="detail.orderNo"
        ></cell>
        <cell
          title="订单金额"
          :value="detail.orderInfoCashFee | moneyshow"
        ></cell>
        <cell
          title="所得收益"
          :value="detail.income | moneyshow"
        ></cell>
        <cell
          title="下单时分润比例"
          :value="(detail.incomeRatio * 100) + '%'"
        ></cell>
        <cell
          title="下单时间"
          :value="detail.createTime | formatedatestamp"
        ></cell>
      </group>
      <group v-show="type === 'withdraw'" label-width="11rem" label-align="left">
        <cell
          title="收益类型"
          :value="detail.event"
        ></cell>
        <cell
          title="退回金额"
          :value="detail.income | moneyshow"
        ></cell>
        <cell
          title="退回时间"
          :value="detail.createTime | formatedatestamp"
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
    type () {
      let event = this.detail.event
      if (event.indexOf('提') !== -1) {
        return 'withdraw'
      } else {
        return 'order'
      }
    }
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>

</style>
