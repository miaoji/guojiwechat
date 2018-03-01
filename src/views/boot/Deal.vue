<template>
  <div class="bootdetail">
    <div class="container">
      <div class="bootdetail-detail">
        <div class="bootdetail-detail-box">
          <span class="bootdetail-detail-box__title">{{$t('business.orderno')}}</span>
          <span class="bootdetail-detail-box__yin">:</span>
          <span class="bootdetail-detail-box__content">{{bootData.orderNo}}</span>
        </div>
        <div class="bootdetail-detail-box">
          <span class="bootdetail-detail-box__title">{{$t('boot.money')}}</span>
          <span class="bootdetail-detail-box__yin">:</span>
          <span class="bootdetail-detail-box__content">{{bootData.priceSpread / 100}}元</span>
        </div>
        <div class="bootdetail-detail-box">
          <span class="bootdetail-detail-box__title">{{$t('boot.reason')}}</span>
          <span class="bootdetail-detail-box__yin">:</span>
          <span class="bootdetail-detail-box__content">{{bootData.reason}}</span>
        </div>
        <div class="bootdetail-detail-box">
          <span class="bootdetail-detail-box__title">{{$t('createtime')}}</span>
          <span class="bootdetail-detail-box__yin">:</span>
          <span class="bootdetail-detail-box__content">{{bootData.createTime | formatedatestamp}}</span>
        </div>
        <div class="bootdetail-detail-box">
          <span class="bootdetail-detail-box__title">{{$t('boot.status')}}</span>
          <span class="bootdetail-detail-box__yin">:</span>
          <span class="bootdetail-detail-box__content">{{bootData.status | bootstatus}}</span>
        </div>
      </div>
      <div class="submit-btn" v-show="bootData.status !== 2"> 
        <button class="normal" @click="submitBoot">{{$t('business.submittopay')}}</button>
      </div>
      <div class="pay-btn linkto" v-show="bootData.status === 2">
        <h1>
          <router-link to="usercenter">{{$t('backhome')}}</router-link>
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
  methods: {
    async submitBoot () {
      const money = this.bootData.priceSpread
      const orderNo = this.bootData.orderNo
      let initParams = {
        openid: storage({key: 'openid'}),
        money,
        orderNo,
        body: '国际快递包裹',
        payType: 1,
        closingPriceId: this.id
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
@import '../../assets/styles/colors.less';
@import '../../assets/styles/helpers.less';
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
          font-size: @normal-size;
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
        font-size: @normal-size;
        width: 6rem;
        text-align: left;
      }
      &__yin {
        font-size: @normal-size;
      }
      &__content {
        flex: 2;
        text-align: right;
        font-size: @normal-size;
        color: @m-yellow;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
}

.linkto {
  a {
    font-size: 16px;
    padding: 6px 10px;
    border: 1px solid @red;
    border-radius: @radius-size;
    color: @red;
  }
}
</style>
