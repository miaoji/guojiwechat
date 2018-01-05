<template>
  <div class="setting">
    <div class="container">
      <group
        label-width="10rem"
        label-align="left"
      >
        <cell
          title="推送时间"
          value="9:00"
          is-link
          @click.native="handleDatePicker"
        >
          <template>
            <div slot="title">
             <span>推送时间</span>
             <img class="question-icon" src="../../assets/images/question.png" @click.stop="pushRulesShow = true">
            </div>
            <div slot="value">
            </div>
          </template>
        </cell>
      </group>
    </div>
    <!-- 推送时间规则说明 -->
    <x-dialog v-model="pushRulesShow" class="send-package-dialog" hide-on-blur>
      <h1>推送时间说明</h1>
      <div class="package-close" @click="pushRulesShow = false">
        <span class="vux-close"></span>
      </div>
      <div class="package-prompt-info">
        推送时间为每天推送用户昨日收益的时间，初始一般为每天上午9:00(中国北京时间)。可根据自身需求配置。
      </div>
    </x-dialog>
  </div>
</template>

<script>
import { XDialog } from 'vux'

export default {
  name: 'setting',
  data () {
    return {
      name: '',
      pushRulesShow: false
    }
  },
  components: {
    XDialog
  },
  created () {
  },
  mounted () {
  },
  computed: {
  },
  methods: {
    handleDatePicker () {
      this.$vux.datetime.show({
        cancelText: '取消',
        confirmText: '确定',
        format: 'HH:mm',
        value: '8:30',
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
  watch: {
  },
  beforeDestroy () {
    this.$vux.datetime.hide()
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../assets/styles/colors.less';
@import '../../assets/styles/helpers.less';
@import '~vux/src/styles/close';

.setting {
  &-container {
  }
  .question-icon {
    width: 1.4rem;
    height: 1.4rem;
    vertical-align: text-top;
  }
}
</style>
