<template>
  <div class="tips">
    <p>
      <img src="../assets/images/tips.png" alt="tips">
      {{content}}
    </p>
  </div>
</template>

<script>

export default {
  name: 'tips',
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  created () {
  }
}

</script>

<style lang="less" scoped>
@import '../assets/styles/colors.less';

.tips {
  img {
    width: 1.2rem;
    vertical-align: text-bottom;
  }
  color: @m-yellow;
  font-size: 1.2rem;
}
</style>
