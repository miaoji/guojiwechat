<template>
  <div class="customservice">
    <div>
      <div class="customservice-title">
        <p>{{$t('comname')}}</p>
      </div>
      <div class="customservice-num flex">
        <p>{{$t('error.viewinwechat')}}!</p>
      </div>
      <div class="customservice-num flex">
        <p>{{$t('error.hotline')}}</p>
        <p>{{hotline}}</p>
      </div>
      <div class="customservice-num flex">
        <p>{{$t('error.publicwechatqrcode')}}</p>
        <p>
          <img src="../../assets/images/wechat_qr.jpg" alt="公众号二维码">
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import {hotline} from '@/utils/config'

export default {
  name: 'notwechat',
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
    img {
      width: 8rem;
      height: auto;
    }
  }
}
</style>
