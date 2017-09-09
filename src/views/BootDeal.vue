<template>
  <div class="sendqr">
    <div class="container">
      <div class="sendqr-detail">
        <div class="sendqr-detail-box">
          <span class="sendqr-detail-box__title">订单号</span>
          <span class="sendqr-detail-box__yin">:</span>
          <span class="sendqr-detail-box__content">{{serialnumber}}</span>
        </div>
        <div class="sendqr-detail-box">
          <span class="sendqr-detail-box__title">补价金额</span>
          <span class="sendqr-detail-box__yin">:</span>
          <span class="sendqr-detail-box__content">{{boot / 100}}元</span>
        </div>
        <div class="sendqr-detail-box">
          <span class="sendqr-detail-box__title">补价原因</span>
          <span class="sendqr-detail-box__yin">:</span>
          <span class="sendqr-detail-box__content">{{reason}}</span>
        </div>
        <div class="sendqr-detail-box">
          <span class="sendqr-detail-box__title">创建时间</span>
          <span class="sendqr-detail-box__yin">:</span>
          <span class="sendqr-detail-box__content">{{createtime | formatedatestamp}}</span>
        </div>
        <div class="sendqr-detail-box">
          <span class="sendqr-detail-box__title">补价状态</span>
          <span class="sendqr-detail-box__yin">:</span>
          <span class="sendqr-detail-box__content">{{status | bootstatus}}</span>
        </div>
      </div>
      <div class="pay-btn" v-show="status !== 2"> 
        <button class="btn-sub" @click="submitBoot">提交付款</button>
      </div>
      <div class="pay-btn linkto" v-show="status === 2">
        <h1>
          <router-link to="usercenter">前往主页</router-link>
        </h1>
      </div>
    </div>
  </div>
</template>
<script>
import { storage } from '../utils'
import request from '../utils/request'
import * as wxUtil from '@/utils/wx'
import { boot as bootApi } from '@/api'

export default {
  name: 'bootdetail',
  data () {
    return {
      loading: false,
      id: null,
      boot: '',
      serialnumber: '',
      reason: '',
      createtime: '',
      status: 1
    }
  },
  async created () {
    let query = this.$route.query
    const id = query.id
    if (!id) {
      this.$vux.toast.show({
        type: 'warn',
        text: '参数缺失!',
        width: '16rem',
        time: '1000'
      })
    }
    this.id = id
    let bootData = await request({
      url: bootApi.detail,
      method: 'post',
      auth: true,
      params: {
        id
      }
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
    this.boot = bootData.boot || 0
    this.serialnumber = bootData.serialNumber || ''
    this.reason = bootData.reason || ''
    this.createtime = bootData.createTime || ''
    this.status = bootData.status || ''
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
      const money = this.boot
      const serialnumber = this.serialnumber
      let intParams = {
        openid: storage({key: 'openid'}),
        money,
        serialnumber,
        body: '国际快递包裹',
        payType: 0
      }
      let successParams = {
        serialnumber,
        bootId: this.id,
        isPay: 1,
        payType: 1
      }
      try {
        const wxPayRes = await wxUtil.pay({intParams, successParams})
        this.$vux.toast.show(wxPayRes)
        if (wxPayRes.type === 'success') {
          this.status = 2
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
.sendqr {
  .container {
  }
  &-img {
    .btg;
    background: white;
    padding: 1rem;
    padding-bottom: 2.5rem;
    &--wait {
      img {
        width: 15rem;
      }
      p {
        font-size: 1.4rem;
        color: @greyfont;
      }
    }
    &--sign {
      img {
        padding: 2.5rem;
        padding-bottom: 0.8rem;
        width: 6rem;
        height: auto;
      }
      p {
        font-size: 1.8rem;
        color: @dark-yellow;
      }
    }
    button {
      text-align: center;
      border: none;
      background: @dark-yellow;
      padding: 0 0.3rem;
      color: white;
      border-radius: 5px;
      margin-left: 6px;
    }
  }
  &-detail {
    .btopg;
    margin-top: 1.17647059em;
    box-sizing: border-box;
    &-box {
      .flex;
      .btg;
      background: white;
      padding: 1rem 2rem;
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
        font-size: 1.6rem;
        width: 7rem;
        text-align: left;
      }
      &__yin {
        font-size: 1.6rem;
      }
      &__content {
        font-size: 1.6rem;
        color: @red;
        margin-left: 1rem;
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
    font-size: 1.8rem;
    width: 92%;
    background-color: @red;
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
