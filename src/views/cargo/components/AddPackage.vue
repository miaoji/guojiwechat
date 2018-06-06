<template>
  <div class="addPackage">
    <div class="cargo-item-add-package">添加包裹</div>
  </div>
</template>

<script>
export default {
  name: 'addPackage',
  props: {
  }
}
</script>

<style lang="less" scoped>
@btn: #ffa414;

.addPackage {
  width: 8rem;
  height: 3rem;
  background-color: @btn;
  border-radius: 3px;
  line-height: 3rem;
  color: #fff;
  margin: auto;
  padding: 0 3rem;
}
</style>
