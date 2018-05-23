<template>
  <div class="detail">
    <div class="detail-container">
      <jag-container :top="false">
        <div slot="content" class="coupon">
          <div class="coupon-intro">
            <div class="coupon-intro-img">
              <img src="../../assets/images/coupon_logo.jpg" alt="卡券logo">
            </div>
            <p class="coupon-intro-name">{{queryData.couponCode}}</p>
            <p class="coupon-intro-func">
              满 {{queryData.couponThreshold}} 减 {{queryData.couponMoney}} 元
            </p>
            <!-- 立即使用 -->
            <div class="use-now"> 
              <button class="pay" @click="useNow">
                {{'coupon.detail.immediateuse' | translate}}
              </button>
            </div>
          </div>
          <div class="divider">
          </div>
          <div class="coupon-use">
            <cell 
              :title="'coupon.detail.effectivedate' | translate" 
              :value="validity"
            >
            </cell>
            <cell 
              :title="'coupon.detail.notes' | translate" 
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
          <h1>{{'coupon.detail.notes' | translate}}</h1>
          <div class="package-close" @click="useInfoShow = false">
            <span class="vux-close"></span>
          </div>
          <div class="package-info">
            <p>
              {{'coupon.detail.note1' | translate}}{{queryData.couponThreshold}}{{'coupon.detail.note2' | translate}}
            </p>
            <p>
              {{queryData.superposition === '0'?'每次下单限用一张，不可叠加':'可叠加'}}使用。寄件须知请参考：微信公众号->个人中心->新手指南，也可以直接下载
              <a href="http://www.mingz-tech.com/新手指南.png">
                {{'coupon.detail.note4' | translate}}
              </a>
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
    validity () {
      const beginTime = this.queryData.startTime
      const endTime = this.queryData.endTime
      return beginTime + '-' + endTime
    }
  },
  async created () {
    const {query} = this.$route
    console.log('quert', query)
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
