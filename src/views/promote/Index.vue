<template>
  <div class="promote">
    <scroller
      :on-refresh="refresh"
      :on-infinite="infinite"
      noDataText=""
      ref="promote-scroller">
      <mj-spinner type="line" slot="refresh-spinner"></mj-spinner>
      <div class="promote-container">
        <div class="last-earnings">
          <group label-width="8rem" label-align="left">
            <cell
              title="昨日收益"
              value="￥666.66"
            >
            </cell>
          </group>
        </div>
        <div class="qr">
          <p class="qr-title">
            我的二维码
            <button class="promote-btn" @click.stop="handleShare">
              点击分享
            </button>
          </p>
          <img src="../../assets/images/wechat_qr.jpg" alt="推广二维码" @click.native="checkQrImg">
          <div class="withdraw-tips">
            可提现金额：
            <span class="money">
              ￥1666.63
            </span>
          </div>
          <div class="divide-tips">
            当前分润比例 
            <span class="scale">1%</span>
            ，团队还需消费
            <span class="money">888元</span>
            即可提升 
            <span class="divide-tips--link" @click.stop="promotionruleShow = true">查看规则</span>
          </div>
        </div>
        <div class="junior">
          <group label-width="8rem" label-align="left">
            <cell
              title="累计收益"
              value="￥6666.66"
              link="/promote/earnings"
              is-link
            >
            </cell>
            <cell
              title="用户管理"
              value=""
              link="/promote/users"
              is-link
            >
            </cell>
            <cell
              title="提现记录"
              value=""
              link="/promote/withdraw"
              is-link
            >
            </cell>
            <cell
              title="推广设置"
              value="推送时间"
              is-link
            >
            </cell>
          </group>
        </div>
      </div>
      <mj-spinner type="circle" slot="infinite-spinner"></mj-spinner>
    </scroller>
    <router-link to="/promote/handlewithdraw">
      <div class="withdraw">
        <span><img src="../../assets/images/promote/withdraw.png" alt="">申请提现</span>
      </div>
    </router-link>
    <!-- 分润比例规则说明 -->
    <x-dialog v-model="promotionruleShow" class="send-package-dialog" hide-on-blur>
      <h1>分润比例规则说明</h1>
      <div class="package-close" @click="promotionruleShow = false">
        <span class="vux-close"></span>
      </div>
      <div class="package-prompt-info">
        分润比例初始一般为1%，当团队累计消费金额达到一定额度便会提升，每次提升金额都会增加。最高不超过100%。
      </div>
    </x-dialog>
  </div>
</template>

<script>
import { init } from '@/utils/wx'
import { XDialog } from 'vux'
import Tips from '@/components/Tips'

export default {
  name: 'promote',
  data () {
    return {
      shareChooseShow: false,
      promotionruleShow: false
    }
  },
  components: {
    XDialog,
    Tips
  },
  async created () {
    await init()
  },
  mounted () {
  },
  computed: {
  },
  methods: {
    refresh (done) {
      this._self.$refs['promote-scroller'].finishInfinite(true)
      return done(true)
    },
    infinite (done) {
      this._self.$refs['promote-scroller'].finishInfinite()
      const _this = this
      setTimeout(function () {
        done(true)
        _this.$refs['promote-scroller'].scrollTo(0, 0)
      }, 600)
    },
    checkQrImg () {
      window.wx.previewImage({
        current: 'http://wx.qlogo.cn/mmopen/vi_32/UDZGqoED7TrhHdA34JSlmVdIcz2X30emabQGKekkAviadjJFu98dhadicT8ibY32aoYmEd2o2BwGedFAE7hG3ibYLA/0',
        urls: ['http://wx.qlogo.cn/mmopen/vi_32/UDZGqoED7TrhHdA34JSlmVdIcz2X30emabQGKekkAviadjJFu98dhadicT8ibY32aoYmEd2o2BwGedFAE7hG3ibYLA/0']
      })
    },
    handleShare () {
      this.$store.commit('SET_TIPSHOW', {tipshow: true})
      this.$router.push({
        path: '/promoteqr'
      })
    },
    wxShareAppMessage () {
      window.wx.ready(function () {
        let link = window.location.href
        link = link.replace('promote', 'promoteqr')
        console.log('link', link)
        window.wx.onMenuShareAppMessage({
          title: '推广二维码',
          desc: '我的二维码',
          link,
          imgUrl: 'http://wx.qlogo.cn/mmopen/vi_32/UDZGqoED7TrhHdA34JSlmVdIcz2X30emabQGKekkAviadjJFu98dhadicT8ibY32aoYmEd2o2BwGedFAE7hG3ibYLA/0',
          type: 'link',
          dataUrl: '',
          success: function () {
            alert('分享朋友成功!')
          },
          cancel: function () {
            console.log('已经取消')
          }
        })
      })
    },
    wxShareTimeline () {
      let link = window.location.href + '/qrimage'
      link = link.replace('promote', 'promoteqr')
      window.wx.ready(function () {
        window.wx.onMenuShareTimeline({
          title: '推广二维码',
          link,
          imgUrl: 'http://wx.qlogo.cn/mmopen/vi_32/UDZGqoED7TrhHdA34JSlmVdIcz2X30emabQGKekkAviadjJFu98dhadicT8ibY32aoYmEd2o2BwGedFAE7hG3ibYLA/0',
          success: function () {
            alert('分享朋友圈成功!')
          },
          cancel: function () {
            console.log('已经取消')
          }
        })
      })
    }
  },
  watch: {
  },
  beforeDestroy () {
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../assets/styles/colors.less';
@import '../../assets/styles/vars.less';
@import '../../assets/styles/helpers.less';
@import '~vux/src/styles/close';

.promote {
  &-container {
    .purple-bg;
    min-height: 100vh;
    overflow-x: hidden;
    .weui-cells{
      margin-top: 0;
      &:before {
        border-top-width: 0;
      }
      &:after {
        border-bottom-width: 0;
      }
    }
    .qr {
      padding: 1rem;
      background: white;
      border-bottom: 1px solid #D9D9D9;
      transform-origin: 0 100%;
      p {
        font-size: @normal-size;
        .line {
          font-size: @normal-size;
        }
      }
      &-title {
        button {
          position: absolute;
          margin-top: 3px;
          margin-left: 2px;
          text-align: left;
        }
      }
      img {
        width: 16rem;
      }
      .withdraw-tips {
        padding-top: .5rem;
        font-size: @small-size;
        .money {
          font-size: @normal-size;
          color: @m-yellow;
        }
      }
      .divide-tips {
        padding-top: .5rem;
        font-size: @small-size;
        .scale {
          font-size: @normal-size;
          color: @red;
        }
        .money {
          font-size: @normal-size;
          color: @m-yellow;
        }
        &--link {
          color: #999;
        }
      }
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
  .withdraw {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 10px 0;
    background: @m-yellow;
    color: white;
    font-size: @normal-size;
    img {
      width: @middle-size;
      vertical-align: middle;
      margin-right: .3rem;
    }
  }
}
</style>
