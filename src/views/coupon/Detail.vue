<template>
  <div class="detail">
    <div class="detail-container">
      <jag-container :top="false">
        <div slot="content" class="coupon">
          <div class="coupon-intro">
            <div class="coupon-intro-img">
              <img src="../../assets/images/coupon_logo.png" alt="卡券logo">
            </div>
            <p class="coupon-intro-name">国际快递</p>
            <p class="coupon-intro-func">10元代金券</p>
            <!-- 立即使用 -->
            <div class="div-btn-sub"> 
              <button class="btn-sub" @click="useNow">立即使用</button>
            </div>
          </div>
          <div class="divider">
          </div>
          <div class="coupon-use">
            <cell title="有效日期" value="2017.11.01-2017.11.20">
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
            <p>每人限领一张</p>
            <p>消费满10元使用</p>
          </div>
        </x-dialog>
      </div>
    </div>
  </div>
</template>

<script>
// import { storage } from '@/utils'
// import request from '@/utils/request'
import JagContainer from './components/JagContainer'
import Cell from './components/Cell'
import { XDialog, TransferDomDirective as TransferDom } from 'vux'

export default {
  name: 'detail',
  mounted () {
    window.document.title = '卡券详细'
  },
  data () {
    return {
      useInfoShow: false
    }
  },
  directives: {
    TransferDom
  },
  created () {
  },
  components: {
    Cell,
    JagContainer,
    XDialog
  },
  computed: {
  },
  methods: {
    useNow () {
      this.$router.push({path: '/send'})
    }
  },
  watch: {
  },
  beforeDestroy () {
    this.$vux.loading.hide()
    this.$vux.toast.hide()
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
    background: @m-yellow;
    padding: 1rem;
    padding-top: 4rem;
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
          font-size: 1.2rem;
          color: #666;
        }
        &-func {
          font-size: 2.4rem;
        }
        .div-btn-sub {
          padding: 1rem 0rem;
          text-align: center;
          overflow: hidden;
          .btn-sub {
            color: white;
            border: none;
            padding: .5rem 0;
            font-size: 1.4rem;
            width: 42%;
            background-color: @m-yellow;
            border: none;
            border-radius: 5px;
          }
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
      text-align: left;
    }
  }
}
</style>
