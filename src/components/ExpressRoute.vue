<template>
  <div class="expressroute">
    <div class="container">
      <div class="expressroute-load">
        <load-toshow 
          :state="state" 
          :msg="msg" 
          @listenReload="getRoute"
        >
        </load-toshow>
      </div>
      <!-- 国际路由信息 -->
      <div v-for="part, index in intelTraces" class="expressroute-content" :class="{'is-first': index === 0}">
        <div class="timeline expressroute-content--part">
          <div class="timeline-icon">
          </div>
          <div class="timeline-line">
          </div>
        </div>
        <div class="expressroute-content--part">
          <p >{{part.context || part.route}}</p>
          <p>{{part.time || part.routeTime}}</p>
        </div>
      </div>
      <!-- 国内路由信息 -->
      <div v-for="part, index in cnTraces" class="expressroute-content" :class="{'is-first': index === 0 && intelTraces.length === 0}">
        <div class="timeline expressroute-content--part">
          <div class="timeline-icon">
          </div>
          <div class="timeline-line">
          </div>
        </div>
        <div class="expressroute-content--part">
          <p >{{part.context || part.route}}</p>
          <p>{{part.time || part.routeTime}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getKD100, getBengal } from '@/services/expressRoute'
import LoadToshow from '@/components/load/WithoutService'
import { formatdate } from '@/filters'
export default {
  name: 'expressroute',
  props: {
    title: {
      type: String,
      default: ''
    },
    bengalOrder: {
      type: Boolean,
      default: false
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
    if (this.bengalOrder) {
      console.log('这个订单是一个孟加拉订单')
    }
    this.getRoute()
  },
  methods: {
    async getRoute () {
      this.state = 0
      if (this.bengalOrder) {
        this.handleBengalOrder()
        return
      }
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
    async handleBengalOrder () {
      try {
        // 查询孟加拉信息
        const Routes = await getBengal({orderId: this.$route.query.id})
        if (Routes.code === 200 && Routes.obj && Routes.obj.length > 0) {
          const intelTraces = Routes.obj.map((item) => {
            item.routeTime = formatdate(item.routeTime)
            return item
          })
          this.state = 1
          this.intelTraces = intelTraces
          this.msg = '查询物流信息成功'
        } else {
          this.state = 2
          this.msg = '暂未接入国际物流'
        }
      } catch (e) {
        this.state = 2
        this.msg = e.message
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
        if (cnRoute.success || intelRoute.success) {
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
        console.error(e)
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
        const intelRoute = await this.getIntelRoute({
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
    bengalOrder (val, oldval) {
      this.getRoute()
    },
    onlycn (val, oldval) {
      this.getRoute()
    },
    intelNo (val) {
      this.getRoute()
    },
    onlyintel (val, oldval) {
      this.getRoute()
    }
  }
}

</script>

<style lang="less" scoped>
@import '../assets/styles/colors.less';
@import '../assets/styles/helpers.less';
@import '../assets/styles/vars.less';

.expressroute {
  &-load {
    text-align: center;
    padding: 10px;
  }

  &-content {
    display: flex;
    margin-bottom: 5px;
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
    .timeline {
      .flex;
      flex-direction: column;
      &-icon {
        margin-bottom: 1px;
        display: inline-block;
        width: 12px;
        height: 12px;
        background: #d9d9d9;
        border-radius: 50%;
      }
      &-line {
        height: 6rem;
        width: 2px;
        background: #d9d9d9;
      }
    }
  }
  .is-first {
    color: @m-yellow;
    .timeline {
      &-icon {
        background: @m-yellow!important;
      }
      &-line {
        background: @m-yellow!important;
      }
    }
  }
}
</style>
