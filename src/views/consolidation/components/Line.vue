<template>
  <div class="line">
    <div class="purple-border">
    </div>
  </div>
</template>

<script>

export default {
  name: 'line',
  props: {
  }
}

</script>

<style lang="less" scoped>
.purple-border {
  margin: 0 .5rem;
  height: 3px;
  background: url('../../../assets/images/border.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>
