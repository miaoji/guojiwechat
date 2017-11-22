<template>
  <div class="bootlist">
    <div class="container">
      <img class="bor-top" src="../../assets/images/bor_top.png" alt="bor-top">
      <div v-if="error" class="error">
        <div class="error-item">{{error}}</div>
        <button class="pay" @click.stop="goBack">点击返回</button>
      </div>
      <div v-else>
        <div v-for="item, index in data"class="list-main" >
          <div class="box-title"><span>|</span>记录 {{index+1}}</div>
          <div class="box-item">
            <span class="list-box-left">订单号</span>
            <span class="list-box-ico">:</span>
            <span class="list-box-right">{{orderNo}}</span>
          </div>
          <div class="box-item">
            <span class="list-box-left">补价金额</span>
            <span class="list-box-ico">:</span>
            <span class="list-box-right">¥{{item.priceSpread / 100}}</span>
          </div>
          <div class="box-item">
            <span class="list-box-left">补价原因</span>
            <span class="list-box-ico">:</span>
            <span class="list-box-right">{{item.reason}}</span>
          </div>
          <div class="box-item">
            <span class="list-box-left">订单状态</span>
            <span class="list-box-ico">:</span>
            <span class="list-box-right">{{item.status | bootstatus}}</span>
          </div>
          <div class="box-item">
            <span class="list-box-left">创建时间</span>
            <span class="list-box-ico">:</span>
            <span class="list-box-right">{{item.createTime | formatedatestamp}}</span>
          </div>
          <div class="purple-border">
          </div>
        </div>
      </div>
      <img class="bor-bottom" src="../../assets/images/bor_bot.png" alt="bor-bottom">
    </div>
  </div>
</template>
<script>
import { getByOrderNo as getBootByOrderNo } from '@/services/boot'

export default {
  name: 'bootlist',
  data () {
    return {
      data: {},
      error: null,
      orderNo: ''
    }
  },
  async created () {
    let {orderNo} = this.$route.query
    this.orderNo = orderNo
    const res = await getBootByOrderNo({
      orderNo
    })
    if (res.code === 200 && res.obj) {
      this.data = res.obj
    } else if (res.code === 200 && !res.obj) {
      this.error = '暂无改价记录'
      return
    } else if (res.code !== 200) {
      this.error = '网络错误'
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../assets/styles/colors.less';
@import '../../assets/styles/helpers.less';

.bootlist{
  .purple-bg;
  overflow-y: auto;
  padding-top: 10px;
  min-height: 99vh;
  text-align: left;
  .container {
    background: white;
    margin: 20px 10px;
    .bor-bottom {
      margin-bottom: -20px;
    }
  }
  .list-main{
    color: @text-color;
    padding: 0 .6rem;
    .box-title{
      span {
        color: @m-yellow;
        vertical-align: text-bottom;
        padding-right: 3px;
      }
      font-size: @normal-size;
      font-weight: bold;
      padding: 0.5rem 1rem;
    }
    .purple-border {
      margin: 0;
      margin-top: 15px;
      height: 3px;
      background: url('../../assets/images/border.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
    .box-item{
      font-size: @normal-size;
      padding: 0.1rem 1rem;
      &:last-child {
        padding-bottom: 10px;
      }
      .list-box-left{
        display: inline-block;
        width: 5.7rem;
        text-align: left;
      }
      .list-box-ico {
        padding: 0 .1rem;
      }
      .list-box-right{
        color: @m-yellow;
        padding-left: 0.5rem;
      }
    }
  }
  .list-main:last-child{
    border-bottom: none;
  }
}

.error{
  margin-top: 1.17647059em;
  padding: 8rem 2rem;
  text-align: center;
  font-size: @middle-size;
  .error-item {
    margin-bottom: 2rem;
  }
}
</style>
