<template>
  <div class="jag">
    <img v-show="top" class="jag-top" src="../assets/images/bor_top.png" alt="bor-top">
    <div class="jag-content">
      <slot name="content"></slot>
    </div>
    <img class="jag-bottom" src="../assets/images/bor_bot.png" alt="bor-bottom">
  </div>
</template>

<script>

export default {
  name: 'jagcontainer',
  props: {
    top: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
  },
  created () {
  },
  methods: {
  }
}

</script>

<style lang="less" scoped>

.jag {
  &-top {
    width: 100%;
    height: 22px;
  }
  &-bottom {
    width: 100%;
    height: 22px;
  }
  &-content {
    margin-top: -5px;
  }
}
</style>
