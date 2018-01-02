<template>
  <div class="subscribetool" v-show="isShow">
    <div class="subscribetool-container">
      <p>
        检测到您还未关注公众号，
        <button type="" class="text" @click="dialogshow = true">点击关注</button>
        <span class="close-icon" @click="isShow = false">
          X
        </span>
      </p>
    </div>
    <!-- 微信公众号关注 -->
    <div>
      <x-dialog v-model="dialogshow" class="subscribetool-dialog">
        <div class="title">
          长按识别
          <div class="close" @click="dialogshow = false">
            <span class="vux-close"></span>
          </div>
        </div>
        <div class="content">
          <img src="../assets/images/wechat_qr.jpg" alt="公众号二维码">
          <tips
            content="关注后会有微信模板消息通知，查看更便捷"
          ></tips>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { XDialog } from 'vux'
import Tips from '@/components/Tips'

export default {
  name: 'subscribetool',
  props: {
  },
  components: {
    XDialog,
    Tips
  },
  computed: {
    ...mapGetters({
      'userinfo': 'getUserInfo'
    }),
    issubscribe () {
      let {subscribe} = this.userinfo
      subscribe = Number(subscribe)
      return (subscribe === 1)
    }
  },
  data () {
    return {
      dialogshow: false,
      isShow: false
    }
  },
  created () {
    if (!this.issubscribe) {
      this.isShow = true
    }
  },
  methods: {
  }
}

</script>

<style lang="less" scoped>
@import '../assets/styles/colors.less';
@import '../assets/styles/vars.less';
@import '../assets/styles/helpers.less';
@import '~vux/src/styles/close';

.subscribetool {
  &-container {
    background: @m-yellow;
    transition: 1s all;
    padding: 1rem;
    p {
      text-align: left;
      font-size: 1.4rem;
      color: #333;
      button.text{
        background: transparent;
        border: none;
        text-decoration: underline;
      }
      .close-icon {
        float: right;
        &:after {
          content: '';
          clear: both;
        }
      }
    }
  }
  &-dialog {
    .title {
      padding: 1rem;
      font-size: 1.4rem;
      .close {
        float: right;
        .clearfixed;
      }
    }
    .content {
      padding: 1rem;
      img {
        width: 20rem;
        height: 20rem;
      }
    }
  }
}
</style>
