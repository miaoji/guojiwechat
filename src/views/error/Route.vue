<template>
  <div class="customservice">
    <div>
      <div class="customservice-title">
        <p>404</p>
      </div>
      <div class="customservice-num flex">
        <p>该页面不存在!</p>
      </div>
      <div class="customservice-num flex">
        <p>您可以从公众号重新点击进入或者拨打客服热线咨询</p>
      </div>
      <div class="customservice-num flex">
        <p>客服热线</p>
        <p>{{hotline}}</p>
      </div>
      <!-- 提交按钮 -->
      <div class="div-btn-sub">
        <router-link to="/send" class="btn-sub">
          返回首页
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
import {hotline} from '@/utils/config'

export default {
  name: 'errorroute',
  created () {
    this.hotline = hotline
  },
  mounted () {
    window.document.title = '404错误'
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../assets/styles/colors.less';
@import '../../assets/styles/helpers.less';
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
  .div-btn-sub {
    padding: 2rem 3rem;
    text-align: center;
    overflow: hidden;
    .btn-sub {
      display: inline-block;
      color: white;
      border: none;
      padding: 1rem 0;
      font-size: 1.6rem;
      width: 100%;
      background-color: @m-yellow;
      border: none;
      border-radius: 5px;
    }
  }
}
</style>
