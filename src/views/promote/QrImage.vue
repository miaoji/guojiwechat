<template>
  <div class="qrimage">
    <div class="qrimage-container">
      <p>{{nickName}}{{$t('promoteQ.nameDetail')}}</p>
      <img :src="qrSrc" :alt="$t('promoteQ.qr')">
    </div>
    <!-- 分享选择 -->
    <div class="share-arrows" v-show="shareShow">
      <img src="../../assets/images/wx/share_arrows.png" alt="">
    </div>
    <x-dialog v-model="shareShow" hide-on-blur>
      <div class="share-modal">
        <div>
          {{$t('promoteQ.clickShare')}}
          <img src="../../assets/images/wx/icon64_appwx_logo.png">{{$t('promoteQ.friend')}}
          <img src="../../assets/images/wx/icon_res_download_moments.png" alt="">{{$t('promoteQ.friends')}}
        </div>
      </div>
    </x-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { XDialog } from 'vux'

export default {
  name: 'qrimage',
  data () {
    return {
      shareShow: false,
      nickName: '',
      qrTicket: ''
    }
  },
  components: {
    XDialog
  },
  created () {
    this.shareShow = this.show
    const {nickName, qrTicket} = this.$route.query
    this.nickName = nickName
    this.qrTicket = qrTicket
  },
  computed: {
    ...mapGetters({
      'show': 'getisTipShow'
    }),
    qrSrc () {
      const prefix = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket='
      return `${prefix}${this.qrTicket}`
    }
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/styles/colors.less';
@import '../../assets/styles/vars.less';
@import '../../assets/styles/helpers.less';
.qrimage {
  &-container {
    min-height: 100vh;
    overflow-x: hidden;
    padding: 2rem;
    p {
      font-size: @normal-size;
      color: #333;
      padding-bottom: 3rem;
    }
    img {
      width: 20rem;
      height: 20rem;
    }
  }
  .share-modal {
    div {
      font-size: @normal-size;
      padding: 1rem;
      text-align: left;
      img {
        width: 1.4rem;
        height: 1.4rem;
        vertical-align: middle;
        margin-right: .3rem;
      }
    }
  }
  .share-arrows {
    position: absolute;
    top: 1px;
    right: -25px;
    z-index: 6666;
  }
}
</style>
