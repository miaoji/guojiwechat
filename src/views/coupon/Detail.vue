<template>
  <div class="detail">
    <div class="detail-container">
      <jag-container :top="false">
        <div slot="content" class="coupon">
          <div class="coupon-intro">
            <div class="coupon-intro-img">
              <img src="../../assets/images/coupon_logo.jpg" alt="卡券logo">
            </div>
            <p class="coupon-intro-name">{{detailData.coupon_name}}</p>
            <p class="coupon-intro-func">{{detailData.coupon_value / 100}}元代金券</p>
            <!-- 立即使用 -->
            <div class="use-now"> 
              <button class="pay" @click="useNow">立即使用</button>
            </div>
          </div>
          <div class="divider">
          </div>
          <div class="coupon-use">
            <cell title="有效日期" :value="validity">
            </cell>
            <cell 
              title="使用须知" 
              isLink
              @click.native="useInfoShow = true"
            >
            </cell>
          </div>
        </div>
      </jag-container>
      <!-- 使用须知信息弹出框 -->
      <div v-transfer-dom>
        <x-dialog v-model="useInfoShow" class="detail-package-dialog">
          <h1>使用须知</h1>
          <div class="package-close" @click="useInfoShow = false">
            <span class="vux-close"></span>
          </div>
          <div class="package-info">
            <p>本券可用于冲抵直邮或集运运费，消费满{{detailData.coupon_minimum / 100 || 17}}元即可使用。</p>
            <p>每次下单限用一张，不可叠加使用。寄件须知请参考：微信公众号->个人中心->新手指南，也可以直接下载
              <a href="http://www.mingz-tech.com/新手指南.png">新手指南.png</a>
            </p>
          </div>
        </x-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import JagContainer from '../../components/JagContainer'
import Cell from './components/Cell'
import { XDialog, TransferDomDirective as TransferDom } from 'vux'
import { time } from '@/utils'
import { query } from '@/services/coupon'

export default {
  name: 'detail',
  directives: {
    TransferDom
  },
  data () {
    return {
      useInfoShow: false,
      queryData: {},
      coupon: {}
    }
  },
  computed: {
    detailData () {
      let res
      const withData = Number(this.queryData.with_data) || 0
      switch (withData) {
        case 1:
          res = this.queryData
          break
        case 0:
          res = this.coupon
          break
        default:
          res = {
            coupon_name: '',
            coupon_value: 0
          }
      }
      return res
    },
    validity () {
      const couponData = this.detailData
      let beginTime = couponData.begin_time + '000'
      beginTime = new Date(Number(beginTime))
      let endTime = couponData.end_time + '000'
      endTime = new Date(Number(endTime))
      beginTime = time.format('yyyy.MM.dd', beginTime)
      endTime = time.format('yyyy.MM.dd', endTime)
      return beginTime + '-' + endTime
    }
  },
  async created () {
    const {query} = this.$route
    this.queryData = query
    if (Number(query.with_data) !== 1) {
      const coupon = await this.getCoupon()
      this.coupon = coupon
    }
  },
  components: {
    Cell,
    JagContainer,
    XDialog
  },
  methods: {
    useNow () {
      this.$router.push({path: '/send'})
    },
    async getCoupon () {
      let res = {
        coupon_name: '',
        coupon_value: 0
      }
      this.$vux.loading.show()
      const openid = this.queryData['openid']
      const couponId = this.queryData['coupon_id']
      try {
        const couponRes = await query({
          openid
        })
        if (couponRes.code === 200) {
          const couponList = couponRes.obj
          for (let i = 0, len = couponList.length; i < len; i++) {
            const item = couponList[i]
            if (item.couponId === couponId) {
              res = item['resultMap']
            }
          }
        }
        return res
      } catch (e) {
        console.error(e)
        return res
      } finally {
        this.$vux.loading.hide()
      }
    }
  },
  watch: {
  },
  beforeDestroy () {
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import '../../assets/styles/colors.less';
@import '../../assets/styles/helpers.less';
@import '~vux/src/styles/close';

.detail {
  &-container {
    min-height: 96vh;
    overflow-x: hidden;
    padding: 1rem;
    padding-top: 4rem;
    .purple-bg;
    .coupon {
      padding: 0 1rem;
      background: white;
      &-intro {
        padding-top: 3rem;
        text-align: center;
        &-img {
          position: absolute;
          top: 1.7rem;
          left: 42.8%;
          background: white;
          border-radius: 47%;
          img {
            height: 4.5rem;
          }
        }
        &-name {
          font-size: @small-size;
          color: #666;
        }
        &-func {
          font-size: @big-size;
        }
        .use-now {
          padding: 1rem 0rem;
          text-align: center;
          overflow: hidden;
        }
      }
      .divider {
        width: 100%;
        height: 1px;
        border-top: 1px dashed #666;
        margin: 0 auto;
      }
      &-use {
        .cell {
          &:last-child {
            &:after {
              display: none;
            }
          }
        }
      }
    }
  }
  &-package-dialog {
    .package-close {
      position: absolute;
      top: 15px;
      right: 8px;
      background: white;
    }
    .weui-dialog{
      padding: 1rem 1rem 8px 1rem;
      border-radius: 8px;
    }
    .package-info {
      padding-top: 1rem;
      font-size: @normal-size;
      text-align: left;
    }
  }
}
</style>
