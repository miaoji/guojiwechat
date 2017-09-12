<template>
  <div class="steplocationpicker" v-show="steppickerShow">
    <div class="steplocationpicker-edit">
      <div class="steplocationpicker-edit--left" @click="close">
        <span>取消</span>
      </div>
      <div class="steplocationpicker-edit--right" @click="confirm">
        <span>确定</span>
      </div>
    </div>
    <div class="steplocationpicker-step" v-show="step === 1">
      <p>选择国家</p>
      <picker :data='countryData' v-model='countryVal' :fixed-columns="1" :columns="1"></picker>
    </div>
  </div>
</template>

<script>
import { XInput, Picker } from 'vux'
import { geography as geographyApi } from '@/api'
import axios from 'axios'

let instance = axios.create({
  timeout: 3000
})

export default {
  name: 'steplocationpicker',
  props: {
    steppickerShow: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'send'
    }
  },
  components: {
    Picker,
    XInput
  },
  computed: {
  },
  data () {
    return {
      step: 1,
      countryData: [],
      countryVal: [],
      provinceData: []
    }
  },
  async created () {
    try {
      const res = await instance({
        method: 'post',
        url: geographyApi.showcountry,
        headers: {'token': window.localStorage.getItem('mj_token')}
      })
      if (res.status !== 200) {
        return this.$vux.toast.show({
          type: 'warn',
          text: '获取路由失败'
        })
      }
      const data = res.data
      if (data.code !== 200) {
        return this.$vux.toast.show({
          type: 'warn',
          text: data.mess
        })
      }
      let shift = 0
      if (data.obj.length < 1) {
        data.obj.push({'name': '暂无城市信息', 'id': '', countryid: ''})
      }
      this.countryData = data.obj.map(function (elem, index) {
        if (elem.name === '中国') {
          shift = index
        }
        return {
          name: elem.name,
          value: elem.id
        }
      })
      if (this.type === 'pickup') {
        this.countryData.shift(shift)
      }
    } catch (e) {
      console.error(e)
      return this.$vux.toast.show({
        type: 'warn',
        width: '18rem',
        text: '网络请求错误'
      })
    }
  },
  methods: {
    close () {
      this.step = 1
      this.$emit('listenClose', false)
    },
    getNameById (obj, id) {
      let newobj = ''
      Object.keys(obj).forEach((elem, index) => {
        if (obj[elem]['value'] === Number(id)) {
          newobj = obj[elem]
        }
      })
      return newobj['name']
    },
    async confirm () {
      const country = this.getNameById(this.countryData, this.countryVal)
      const location = {
        show: country,
        val: {
          nationid: Number(this.countryVal)
        }
      }
      this.$emit('listenConfrim', location)
      console.log('location', location)
      this.$emit('listenClose', false)
    }
  }
}

</script>

<style lang="less" scoped>
@import '../assets/styles/colors.less';
@import '../assets/styles/helpers.less';

.steplocationpicker {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 2;
  background: white;
  &-edit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 15px;
    padding-left: 25px;
    font-size: 1.5rem;
    margin-top: 1rem;
    background: white;
    &--left {
      flex: 1;
    }
    &--right {
      flex: 1;
      color: @red;
    }
  }
  &-step {
    p {
      text-align: left;
      background: white;
      padding: 10px;
      padding-left: 24px;
      font-size: 1.4rem;
    }
  }
}
</style>
