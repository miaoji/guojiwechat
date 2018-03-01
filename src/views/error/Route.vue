<template>
  <div class="customservice">
    <div>
      <div class="customservice-title">
        <p>404</p>
      </div>
      <div class="customservice-num flex">
        <p>{{$t('error.notfound')}}!</p>
      </div>
      <div class="customservice-num flex">
        <p>{{$t('error.tips')}}</p>
      </div>
      <div class="customservice-num flex">
        <p>{{$t('error.hotline')}}</p>
        <p>{{hotline}}</p>
      </div>
      <!-- 提交按钮 -->
      <div class="submit-btn">
        <router-link to="/send" class="normal">
          {{$t('backhome')}}
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
      font-size: @big-size;
      color: @red;
    }
  }
  &-num {
    .btopg;
    text-align: left;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 3rem;
    font-size: @normal-size;
    &:last-child {
      .btg;
    }
  }
}
</style>
