<template>
  <div class="withdraw">
    <div class="withdraw-container">
      <div class="list">
        <div class="tools">
          <section>
            筛选
          </section>
          <section @click.stop="handleDatePicker">
            <img class="datetimepicker" src="../../assets/images/promote/datetimepicker.png"></img>
          </section>
        </div>
        <div class="content" v-for="item in [1, 2, 3, 4, 5]">
          <p class="time">
            2017-0{{item}}
          </p>
          <group label-align="left">
            <cell
              title="转出到微信 1月30号"
              value="￥6.00"
              link="/promote/withdraw/12"
              is-link
            ></cell>
            <cell
              title="转出到支付宝 1月20号"
              value="￥1.60"
              link="/promote/withdraw/33"
              is-link
            ></cell>
          </group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'withdraw',
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
  },
  beforeDestroy () {
    this.$vux.datetime.hide()
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/styles/helpers.less';
@import '../../assets/styles/colors.less';

.withdraw {
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
