<template>
  <div class="earings">
    <div class="earings-container">
      <group label-width="11rem" label-align="left">
        <cell
          title="下单人"
          value="林克"
        ></cell>
        <cell
          title="订单类型"
          value="集运订单"
        ></cell>
        <cell
          title="订单金额"
          value="￥666.36"
        ></cell>
        <cell
          title="所得收益"
          value="￥6.66"
        ></cell>
        <cell
          title="下单时分润比例"
          value="1.00%"
        ></cell>
        <cell
          title="当前分润比例"
          value="3.00%"
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
    }
  },
  created () {
  },
  computed: {
  },
  methods: {
    handleDatePicker () {
      this.$vux.datetime.show({
        cancelText: '取消',
        confirmText: '确定',
        format: 'YYYY-MM',
        value: '2017-12',
        minYear: 2017,
        maxYear: 2018,
        onConfirm (val) {
          console.log('plugin confirm', val)
        },
        onShow () {
          console.log('plugin show')
        },
        onHide () {
          console.log('plugin hide')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/styles/helpers.less';
@import '../../assets/styles/colors.less';

.earings {
  &-container {
    .list {
      .tools {
        .flex;
        background: white;
        padding: 10px 15px;
        justify-content: space-between;
        section {
          font-size: @normal-size;
          img.datetimepicker {
            width: 2.1rem;
          }
        }
      }
      .content {
        p.time {
          text-align: left;
          padding: 10px 15px;
          font-size: @small-size;
        }
      }
    }
  }
}
</style>
