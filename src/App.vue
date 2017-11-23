<template>
  <div id="app">
    <transition>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>

export default {
  name: 'app',
  created () {
  }
}
</script>

<style lang="less">
@import './assets/styles/colors.less';
@import './assets/styles/patch/index.less';
@import './assets/styles/reset.less';

#app {
	font-family: 'Microsoft YaHei', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: @grey-word;
}

.orderdetail {
  .orderdetail-detail-box__content {
    .weui-loadmore {
      margin: 0 auto;
    }
  }
}
</style>
