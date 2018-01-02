<template>
  <div class="cell">
    <div class="colon-container" :style="colonStyle">
      <div class="title">
        <span>{{title}}</span>
      </div>
      <div class="value">
        
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'cell',
  props: {
    title: {
      type: String,
      default: '',
      required: true
    },
    size: {
      type: String,
      default: 'normal'
    },
    value: {
      default: ''
    },
    islink: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  computed: {
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
