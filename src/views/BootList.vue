<template>
  <div class="bootlist-main">
    <div class="header">补价纪录明细</div>
    <div v-if="error" class="error">
      <div class="error-item">{{error}}</div>
      <button class="pay" @click.stop="goBack">点击返回</button>
    </div>
    <div v-else>
      <div v-for="item in data"class="list-main" >
        <div class="box-title">第 {{item.index+1}} 条记录</div>
          <div class="box-item">
            <span class="list-box-left">补价金额</span>
            <span class="list-box-ico">:</span>
            <span class="list-box-right">¥{{item.boot/100}}</span>
          </div>
          <div class="box-item">
            <span class="list-box-left">创建时间</span>
            <span class="list-box-ico">:</span>
            <span class="list-box-right">{{item.createTime | formatedatestamp}}</span>
          </div>
          <div class="box-item">
            <span class="list-box-left">补价原因</span>
            <span class="list-box-ico">:</span>
            <span class="list-box-right">{{item.reason}}</span>
          </div>
          <div class="box-item">
            <span class="list-box-left">订单号</span>
            <span class="list-box-ico">:</span>
            <span class="list-box-right">{{item.serialNumber}}</span>
          </div>
          <div class="box-item">
            <span class="list-box-left">订单状态</span>
            <span class="list-box-ico">:</span>
            <span class="list-box-right">{{item.status | bootstatus}}</span>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
import { boot as bootApi } from '@/api'
import request from '@/utils/request'
const localStorage = window.localStorage
export default {
  name: 'bootlist',
  data () {
    return {
      data: {},
      error: null,
      index: 0,
      serialnumber: ''
    }
  },
  async created () {
    let query = this.$route.query
    console.log('query', this)
    let serialnumber = query.serialnumber || 1
    this.serialnumber = serialnumber
    const res = await request({
      url: bootApi.query,
      method: 'post',
      params: { serialnumber },
      headers: {'token': localStorage.getItem('mj_token')},
      auth: true
    })
    if (res.code === 200 && res.obj.length > 0) {
      this.data = res.obj
      for (let i = 0; i < this.data.length; i++) {
        this.data[i].index = i
      }
    } else if (res.code === 200 && res.obj.length <= 0) {
      this.error = '暂无改价记录'
      return
    } else if (res.code !== 200) {
      this.error = '网络错误'
    }
  },
  mounted () {
    window.document.title = '补价记录'
  },
  methods: {
    goBack () {
      window.history.back()
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../assets/styles/colors.less';
@import '../assets/styles/helpers.less';
.header{
  padding: 0.8rem 2rem;
  font-size: 1.6rem;
  color: @light-yellow;
}
.bootlist-main{
  margin-top: 1.17647059em;
  text-align: left;
  padding: 2rem 0;
  background-color: #fff;
  .list-main{
    color: @text-color;
    padding: 0.5rem 0;
    border-bottom: 1px solid #dedede;
    .box-title{
      font-size: 1.4rem;
      font-weight: bold;
      padding: 0.5rem 2rem;
    }
    .box-item{
      font-size: 1.4rem;
      padding: 0.1rem 2rem;
      .list-box-left{
        display: inline-block;
        width:6rem;
        text-align: left;
      }
      .list-box-ico {
        padding: 0 .1rem;
      }
      .list-box-right{
        color: @red;
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
  font-size: 1.6rem;
  .error-item{
    margin-bottom: 2rem;
  }
  button.pay {
    background: transparent;
    font-size: 13px;
    padding: 2px 5px;
    border: 1px solid @red;
    border-radius: 3px;
    color: @red;
  }
}
</style>
