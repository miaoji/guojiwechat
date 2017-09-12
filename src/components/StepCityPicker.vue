<template>
  <div class="stepcitypicker" v-show="stepcityshow">
    <div class="stepcitypicker-edit">
      <div class="stepcitypicker-edit--left" @click="close">
        <span>取消</span>
      </div>
      <div class="stepcitypicker-edit--right" @click="confirm">
        <span>确定</span>
      </div>
    </div>
    <div class="stepcitypicker-step">
      <p>选择市</p>
      <picker :data='cityData' v-model='cityVal' :fixed-columns="1" :columns="1"></picker>
    </div>
  </div>
</template>

<script>
import { XInput, Picker } from 'vux'
import { geography as geographyApi } from '@/api'
import axios from 'axios'
let instance = axios.create({
  timeout: 5000
})
export default {
  name: 'stepcitypicker',
  props: {
    stepcityshow: {
      type: Boolean,
      default: false
    },
    provinceId: {
      type: Number,
      defult: 0
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
      cityData: [],
      cityVal: []
    }
  },
  methods: {
    async getcitydata () {
      try {
        const res = await instance({
          method: 'post',
          url: geographyApi.showcity,
          params: {
            provinceid: Number(this.provinceId)
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
        if (data.obj.length < 1) {
          data.obj.push({'name': '暂无城市信息', 'id': '', countryid: ''})
          // this.close()
        }
        this.cityData = data.obj.map(function (elem) {
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
      this.$emit('listenCityClose', false)
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
      const city = this.getNameById(this.cityData, this.cityVal)
      const citydata = {
        show: city,
        val: {
          city: Number(this.cityVal)
        }
      }
      this.step = 1
      console.log('zi loca', citydata)
      this.$emit('listenCityConfrim', citydata)
      this.$emit('listenCityClose', false)
    }
  },
  watch: {
    async stepcityshow (val) {
      if (val) {
        await this.getcitydata()
      }
    }
  }
}

</script>

<style lang="less" scoped>
@import '../assets/styles/colors.less';
@import '../assets/styles/helpers.less';

.stepcitypicker {
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
