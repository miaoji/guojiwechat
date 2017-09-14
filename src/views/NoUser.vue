<template>
  <div class="customservice">
    <div>
      <div class="customservice-title">
        <p>国际快递</p>
      </div>
      <div class="customservice-num flex">
        <p>登录失败!</p>
      </div>
      <div class="customservice-num flex">
        <p>您可以从公众号重新点击进入或者拨打客服热线咨询</p>
      </div>
      <div class="customservice-num flex">
        <p>客服热线</p>
        <p>{{hotline}}</p>
      </div>
    </div>
  </div>
</template>
<script>
import {hotline} from '../utils/config'

export default {
  name: 'customservice',
  created () {
    this.hotline = hotline
  },
  mounted () {
    window.document.title = '客服中心'
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../assets/styles/colors.less';
@import '../assets/styles/helpers.less';
.customservice {
  background: white;
  height: 100vh;
  &-title {
    padding: 5rem;
    p {
      font-size: 2.8rem;
      font-weight: 600;
      color: @red;
    }
  }
  &-num {
    .btopg;
    text-align: left;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 3rem;
    font-size: 1.5rem;
    &:last-child {
      .btg;
    }
  }
}
</style>
