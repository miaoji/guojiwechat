<template>
  <div class="getpositioninfo" v-show="getpositionshow">
    <div class="getpositioninfo-edit">
      <div class="getpositioninfo-edit--left" @click="close">
        <span>取消</span>
      </div>
      <div class="getpositioninfo-edit--right" @click="confirm">
        <span>确定</span>
      </div>
    </div>
    <div class="getpositioninfo-step">
      <p>选择</p>
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
  name: 'getpositioninfo',
  props: {
    nationId: {
      type: Number,
      default: 0
    },
    getpositionshow: {
      type: Boolean,
      default: false
    },
    typecn: {
      type: Number,
      default: 0
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
      countryData: [],
      countryVal: [],
      provinceData: [],
      provinceVal: [],
      cityData: [],
      cityVal: [],
      countyData: [],
      countyVal: []
    }
  },
  async created () {
    console.log('this.typepepep', this.typecn)
  },
  methods: {
    change (value) {
    },
    close () {
      this.step = 1
      this.$emit('listenPositionClose', false)
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
      const country = this.getNameById(this.countryData, this.countryVal)
      const location = {
        show: country,
        val: {
          nationid: Number(this.countryVal)
        },
        type: this.typecn
      }
      this.step = 1
      console.log('location', location)
      this.$emit('listenPositionConfrim', location)
      this.$emit('listenPositionClose', false)
    },
    callFather (data, val) {
      const country = this.getNameById(data, val)
      const location = {
        show: country,
        val: {
          nationid: Number(val)
        },
        typePosition: this.typecn
      }
      this.step = 1
      console.log('location', location)
      this.$emit('listenPositionConfrim', location)
      this.$emit('listenPositionClose', false)
    }
  },
  watch: {
    async getpositionshow () {
      console.log('this.typecn', this.typecn)
      switch (this.typecn) {
        case 1:
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
          break
        case 2:
          try {
            console.log('对对对', this.nationId)
            const res = await instance({
              method: 'post',
              url: geographyApi.showprovince,
              params: {
                countryid: Number(this.nationId)
              },
              headers: {'token': window.localStorage.getItem('mj_token')}
            })
            if (res.status !== 200) {
              return this.$vux.toast.show({
                type: 'warn',
                text: '获取路由失败'
              })
            }
            console.log('res', res)
            const data = res.data
            console.log('data', data)
            if (data.code !== 200) {
              return this.$vux.toast.show({
                type: 'warn',
                text: data.mess
              })
            }
            this.countryData = data.obj.map(function (elem) {
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
          break
        case 3:
          try {
            const res = await instance({
              method: 'post',
              url: geographyApi.showcity,
              params: {
                provinceid: Number(this.nationId)
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
            this.countryData = data.obj.map(function (elem) {
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
          break
        case 4:
          try {
            const res = await instance({
              method: 'post',
              url: geographyApi.showcounty,
              params: {
                cityid: Number(this.cityVal)
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
          break
        default:
          break
      }
    }
  }
}

</script>

<style lang="less" scoped>
@import '../assets/styles/colors.less';
@import '../assets/styles/helpers.less';

.getpositioninfo {
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
