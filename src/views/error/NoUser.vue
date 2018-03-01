<template>
  <div class="customservice">
    <div>
      <div class="customservice-title">
        <p>{{$t('comname')}}</p>
      </div>
      <div class="customservice-num flex">
        <p>{{$t('error.login')}}!</p>
      </div>
      <div class="customservice-num flex">
        <p>{{$t('error.tips')}}</p>
      </div>
      <div class="customservice-num flex">
        <p>{{$t('error.hotline')}}</p>
        <p>{{hotline}}</p>
      </div>
    </div>
  </div>
</template>
<script>
import {hotline} from '@/utils/config'

export default {
  name: 'customservice',
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
