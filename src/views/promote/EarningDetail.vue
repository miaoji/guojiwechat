<template>
  <div class="earings">
    <div class="earings-container">
      <group v-show="type === 'order'" label-width="11rem" label-align="left">
        <cell
          :title="'promoteED.IncomeType' | translate"
          :value="detail.event"
        ></cell>
        <cell
          :title="'promoteED.orderType' | translate"
          :value="detail.orderInfoType | ordertype"
        ></cell>
        <cell
          :title="'promoteED.orderNo' | translate"
          :value="detail.orderNo"
        ></cell>
        <cell
          :title="'promoteED.orderAmount' | translate"
          :value="detail.orderInfoCashFee | moneyshow"
        ></cell>
        <cell
          :title="'promoteED.profit' | translate"
          :value="detail.income | moneyshow"
        ></cell>
        <cell
          :title="'promoteED.orderTimeProfitRatio' | translate"
          :value="(detail.incomeRatio * 100) + '%'"
        ></cell>
        <cell
          :title="'promoteED.orederTime' | translate"
          :value="detail.createTime | formatedatestamp"
        ></cell>
      </group>
      <group v-show="type === 'withdraw'" label-width="11rem" label-align="left">
        <cell
          :title="'promoteED.IncomeType' | translate"
          :value="detail.event"
        ></cell>
        <cell
          :title="'promoteED.returnAmount' | translate"
          :value="detail.income | moneyshow"
        ></cell>
        <cell
          :title="'promoteED.returnTime' | translate"
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
