<template>
  <div class="bootdetail">
    <div class="container">
      <div class="bootdetail-detail">
        <div class="bootdetail-detail-box">
          <span class="bootdetail-detail-box__title">订单号</span>
          <span class="bootdetail-detail-box__yin">:</span>
          <span class="bootdetail-detail-box__content">{{bootData.orderNo}}</span>
        </div>
        <div class="bootdetail-detail-box">
          <span class="bootdetail-detail-box__title">补价金额</span>
          <span class="bootdetail-detail-box__yin">:</span>
          <span class="bootdetail-detail-box__content">{{bootData.priceSpread / 100}}元</span>
        </div>
        <div class="bootdetail-detail-box">
          <span class="bootdetail-detail-box__title">补价原因</span>
          <span class="bootdetail-detail-box__yin">:</span>
          <span class="bootdetail-detail-box__content">{{bootData.reason}}</span>
        </div>
        <div class="bootdetail-detail-box">
          <span class="bootdetail-detail-box__title">创建时间</span>
          <span class="bootdetail-detail-box__yin">:</span>
          <span class="bootdetail-detail-box__content">{{bootData.createTime | formatedatestamp}}</span>
        </div>
        <div class="bootdetail-detail-box">
          <span class="bootdetail-detail-box__title">补价状态</span>
          <span class="bootdetail-detail-box__yin">:</span>
          <span class="bootdetail-detail-box__content">{{bootData.status | bootstatus}}</span>
        </div>
      </div>
      <div class="pay-btn" v-show="bootData.status !== 2"> 
        <button class="btn-sub" @click="submitBoot">提交付款</button>
      </div>
      <div class="pay-btn linkto" v-show="bootData.status === 2">
        <h1>
          <router-link to="usercenter">前往主页</router-link>
        </h1>
      </div>
    </div>
  </div>
</template>
<script>
import {storage} from '@/utils'
import * as wxUtil from '@/utils/wx'
import { show } from '@/services/boot'

export default {
  name: 'bootdetail',
  data () {
    return {
      loading: false,
      id: null,
      bootData: {
        createTime: '',
        hiddenStatus: '',
        orderNo: '',
        priceSpread: '',
        reason: '',
        remark: '',
        status: 0
      }
    }
  },
  async created () {
    const {id} = this.$route.query
    if (!id) {
      this.$vux.toast.show({
        type: 'warn',
        text: '参数缺失!',
        width: '16rem',
        time: '1000'
      })
    }
    this.id = id
    let bootData = await show({
      id
    })
    if (bootData.code !== 200) {
      this.$vux.toast.show({
        type: 'warn',
        text: bootData.mess,
        width: '16rem',
        time: '1000'
      })
      return
    }
    bootData = bootData.obj
    this.bootData = bootData
    // 初始化wx jssdk
    try {
      const wxIntRes = await wxUtil.init()
      console.log('wxIntRes', wxIntRes)
    } catch (e) {
      console.err(e)
    }
  },
  mounted () {
    window.document.title = '补价详情'
  },
  methods: {
    async submitBoot () {
      const money = this.bootData.priceSpread
      const orderNo = this.bootData.orderNo
      let initParams = {
        openid: storage({key: 'openid'}),
        money,
        orderNo,
        body: '国际快递包裹',
        payType: 1
      }
      let successParams = {
        orderNo,
        total: money,
        closingPriceId: this.id,
        paymentStatus: 1,
        payType: 1
      }
      try {
        const wxPayRes = await wxUtil.pay({initParams, successParams})
        this.$vux.toast.show(wxPayRes)
        if (wxPayRes.type === 'success') {
          this.bootData.status = 2
        }
      } catch (err) {
        console.error(err)
        this.$vux.toast.show(err)
      }
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../assets/styles/colors.less';
@import '../assets/styles/helpers.less';
.bgblue {
  background-color: @light-blue;
}
.bgyellow {
  background-color: @red;
}
.darkyellow {
  color: @red;
}

.lightyellow {
  color: @red!important;
}
.bootdetail {
  .purple-bg;
  overflow-y: hidden;
  padding-top: 10px;
  min-height: 100vh;
  .container {
    border-radius: 5px;
    background: white;
    margin: 20px 10px;
    padding: 10px;
    padding-top: 0;
  }
  &-detail {
    box-sizing: border-box;
    &-box {
      .flex;
      .btg;
      background: white;
      padding: 1rem;
      &__detail {
        flex: 4;
        text-align: left;
        p {
          font-size: 1.4rem;
          width: 20rem;
          overflow: hidden;
          white-space: pre-line;
          text-overflow: ellipsis;
          @media (max-width:320px) {
            width: 16rem;
          }
          @media (min-width:400px) {
            width: 25rem;
          }
        }
      }
      &__title {
        font-size: 1.4rem;
        width: 6rem;
        text-align: left;
      }
      &__yin {
        font-size: 1.4rem;
      }
      &__content {
        flex: 2;
        text-align: right;
        font-size: 1.4rem;
        color: @m-yellow;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
}
.pay-btn {
  padding: 2rem 0rem;
  text-align: center;
  overflow: hidden;
  .btn-sub {
    color: white;
    border: none;
    padding: 1rem 0;
    font-size: 1.6rem;
    width: 92%;
    background-color: @m-yellow;
    border: none;
    border-radius: 5px;
  }
}

.linkto {
  a {
    font-size: 16px;
    padding: 6px 10px;
    border: 1px solid @red;
    border-radius: 5px;
    color: @red;
  }
}
</style>
