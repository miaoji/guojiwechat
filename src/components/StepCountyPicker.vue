<template>
  <div class="stepcountypicker" v-show="stepcountyshow">
    <div class="stepcountypicker-edit">
      <div class="stepcountypicker-edit--left" @click="close">
        <span>取消</span>
      </div>
      <div class="stepcountypicker-edit--right" @click="confirm">
        <span>确定</span>
      </div>
    </div>
    <div class="stepcountypicker-step">
      <p>选择区</p>
      <picker :data='countyData' v-model='countyVal' :fixed-columns="1" :columns="1"></picker>
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
  name: 'stepcountypicker',
  props: {
    stepcountyshow: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'send'
    },
    cityId: {
      type: Number,
      default: 0
    }
  },
  components: {
    Picker,
    XInput
  },
  data () {
    return {
      step: 1,
      countyData: [],
      countyVal: []
    }
  },
  methods: {
    async getcountydata () {
      try {
        const res = await instance({
          method: 'post',
          url: geographyApi.showcounty,
          params: {
            cityid: Number(this.cityId)
          },
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
        this.countyData = data.obj.map(function (elem) {
          return {
            name: elem.name,
            value: elem.id
          }
        })
      } catch (e) {
        console.error(e)
        return this.$vux.toast.show({
          type: 'warn',
          width: '18rem',
          text: '网络请求错误'
        })
      }
    },
    close () {
      this.$emit('listenCountyClose', false)
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
    confirm () {
      const county = this.getNameById(this.countyData, this.countyVal)
      const countydata = {
        show: county,
        val: {
          county: Number(this.countyVal)
        }
      }
      console.log('zi loca', countydata)
      this.$emit('listenCountyConfrim', countydata)
      this.$emit('listenCountyClose', false)
    }
  },
  watch: {
    async stepcountyshow (val) {
      if (val) {
        await this.getcountydata()
      }
    }
  }
}

</script>

<style lang="less" scoped>
@import '../assets/styles/colors.less';
@import '../assets/styles/helpers.less';

.stepcountypicker {
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
