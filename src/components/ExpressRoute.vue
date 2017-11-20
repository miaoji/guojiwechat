<template>
  <div class="expressroute">
    <div class="container">
      <div class="expressroute-load">
        <load-toshow 
          :state="state" 
          :msg="msg" 
          @listenReload="getRoute"
          :isShowSuccess="false"
        >
        </load-toshow>
      </div>
      <!-- 国际路由信息 -->
      <div v-for="part, index in intelTraces" class="expressroute-content" :class="{'is-first': index === 0}">
        <div class="line expressroute-content--part">
          <div class="line-div">
          </div>
        </div>
        <div class="expressroute-content--part">
          <p>{{part.context}}</p>
          <p>{{part.time}}</p>
        </div>
      </div>
      <!-- 国内路由信息 -->
      <div v-for="part, index in cnTraces" class="expressroute-content" :class="{'is-first': index === 0 && intelTraces.length === 0}">
        <div class="line expressroute-content--part">
          <div class="line-div">
          </div>
        </div>
        <div class="expressroute-content--part">
          <p >{{part.context}}</p>
          <p>{{part.time}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getKD100 } from '@/services/expressRoute'
import LoadToshow from '@/components/load/WithoutService'

export default {
  name: 'expressroute',
  props: {
    title: {
      type: String,
      default: ''
    },
    cnNo: {
      type: String,
      default: ''
    },
    cnCompany: {
      type: String,
      default: ''
    },
    intelNo: {
      type: String,
      default: ''
    },
    intelCompany: {
      type: String,
      default: ''
    },
    onlycn: {
      type: Boolean,
      default: false
    },
    onlyintel: {
      type: Boolean,
      default: false
    }
  },
  components: {
    LoadToshow
  },
  data () {
    return {
      intelTraces: [],
      cnTraces: [],
      // 0 loading, 1 load success 2 load fail
      state: 0,
      msg: ''
    }
  },
  created () {
    this.getRoute()
  },
  methods: {
    async getRoute () {
      this.state = 0
      if (this.onlycn) {
        this.handelCnRoute()
        return
      }
      if (this.onlyintel) {
        this.handelIntelRoute()
        return
      }
      if (!this.onlycn && !this.onlyintel) {
        this.handelAllRoute()
        return
      }
    },
    async handelAllRoute () {
      try {
        const cnRoute = await this.getCnRoute({
          company: this.cnCompany,
          num: this.cnNo
        })
        const intelRoute = await this.getIntelRoute({
          company: this.intelCompany,
          num: this.intelNo
        })
        if (cnRoute.success && intelRoute.success) {
          this.state = 1
          this.cnTraces = cnRoute.traces
          this.intelTraces = intelRoute.traces
        } else {
          this.state = 2
        }
        this.msg = intelRoute.msg
      } catch (e) {
        this.state = 2
        this.msg = e.message
      }
    },
    async handelCnRoute () {
      try {
        const cnRoute = await this.getCnRoute({
          company: this.cnCompany,
          num: this.cnNo
        })
        if (cnRoute.success) {
          this.state = 1
          this.cnTraces = cnRoute.traces
        } else {
          this.state = 2
        }
        this.msg = cnRoute.msg
      } catch (e) {
        this.state = 2
        this.msg = e.message
      }
    },
    async getCnRoute ({company, num}) {
      let res = {
        success: false,
        traces: [],
        msg: '网络错误'
      }
      if (!company || !num) {
        res['msg'] = '国内段单号为空'
        return res
      }
      try {
        const Routes = await getKD100({
          company,
          num,
          source: 'php'
        })
        if (Routes.code === 200) {
          let traces = Routes.obj.data
          if (Routes.obj.state === '3') {
            const changePart = traces[0]
            traces[0] = {
              context: '[上海市] [上海]快递已抵达上海中转站',
              time: changePart['time']
            }
          }
          res['success'] = true
          res['traces'] = traces
        } else {
          res['success'] = false
        }
        res['msg'] = Routes.msg || '网络错误'
      } catch (e) {
        res['success'] = false
        res['msg'] = e.message || '网络错误'
      }
      return res
    },
    async handelIntelRoute () {
      try {
        const intelRoute = this.getIntelRoute({
          company: this.intelCompany,
          num: this.intelNo
        })
        if (intelRoute.success) {
          this.state = 1
          this.intelTraces = intelRoute.traces
        } else {
          this.state = 2
        }
        this.msg = intelRoute.msg
      } catch (e) {
        this.state = 2
        this.msg = e.message
      }
    },
    async getIntelRoute ({company, num}) {
      let res = {
        success: false,
        traces: [],
        msg: '网络错误'
      }
      if (!company || !num) {
        res['msg'] = '暂未接入国际物流'
        return res
      }
      try {
        const Routes = await getKD100({
          company,
          num,
          source: 'php'
        })
        if (Routes.code === 200) {
          res['success'] = true
          res['traces'] = Routes.obj.data
        } else {
          res['success'] = false
        }
        res['msg'] = Routes.msg || '网络错误'
      } catch (e) {
        res['success'] = false
        res['msg'] = e.message || '网络错误'
      }
      return res
    }
  },
  watch: {
    cnNo (val, oldval) {
      this.getRoute()
    },
    intelNo (val) {
      this.getRoute()
    }
  }
}

</script>

<style lang="less" scoped>
@import '../assets/styles/colors.less';
@import '../assets/styles/vars.less';

.expressroute {
  .container {
  }
  &-load {
    text-align: center;
  }
  &-content {
    display: flex;
    &:first-child {
      p {
        color: @dark-yellow;
      }
    }
    .date-intro {
      max-width: 8rem;
    }
    &--part {
      text-align: justify;
      padding: 0 1rem;
      p {
        font-size: 1.4rem;
      }
      p.minute {
        text-align: center;
        font-size: 1.4rem;
        max-height: 1.4rem;
        // overflow: hidden;
        white-space: nowrap;
      }
      p.date {
        text-align: center;
        font-size: 1.3rem;
        max-height: 1.3rem;
        // overflow: hidden;
        white-space: nowrap;
      }
    }
    div.line {
      width: 1rem;
      &:before {
        content: ' ';
        display: inline-block;
        width: 12px;
        height: 12px;
        background: #999;
        border-radius: 50%;
      }
      &-div {
        height: 6rem;
        width: 2px;
        margin-left: 38%;
        background: #999;
      }
    }
  }
  .is-first {
    color: @m-yellow;
    .line {
      &:before {
        background: @m-yellow!important;
      }
      &-div {
        background: @m-yellow!important;
      }
    }
  }
}
</style>
