<template>
  <div class="colon">
    <div class="colon-container" :style="colonStyle">
      <div class="title">
        <slot name="title">
          <span>{{title}}</span>
        </slot>
        <slot name="colon">
          <span>:</span>
        </slot>
      </div>
      <slot name="content">
        <div>
          {{value}}
        </div>
      </slot>
    </div>
  </div>
</template>

<script>

export default {
  name: 'footer',
  props: {
    title: {
      type: String,
      default: '',
      required: true
    },
    fontSize: {
      type: String,
      default: '1.4rem'
    },
    value: {
      default: ''
    }
  },
  data () {
    return {
    }
  },
  computed: {
    colonStyle () {
      return 'fontSize:' + this.fontSize
    }
  }
}

</script>

<style lang="less" scoped>
@import '../assets/styles/colors.less';
@import '../assets/styles/vars.less';
@import '../assets/styles/helpers.less';

.colon {
  &-container {
    .flex;
    justify-content: space-between;
    white-space: nowrap;
  }
}

</style>
