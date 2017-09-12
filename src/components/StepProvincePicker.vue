<template>
  <div class="stepprovincepicker" v-show="stepprovinceshow">
    <div class="stepprovincepicker-edit">
      <div class="stepprovincepicker-edit--left" @click="close">
        <span>取消</span>
      </div>
      <div class="stepprovincepicker-edit--right" @click="confirm">
        <span>确定</span>
      </div>
    </div>
    <div class="stepprovincepicker-step">
      <p>选择省</p>
      <picker :data='provinceData' v-model='provinceVal' :fixed-columns="1" :columns="1"></picker>
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
  name: 'stepprovincepicker',
  props: {
    stepprovinceshow: {
      type: Boolean,
      default: false
    },
    nationId: {
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
      provinceData: [],
      provinceVal: [],
      hide: true
    }
  },
  methods: {
    async getprovincedata () {
      try {
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
        const data = res.data
        if (data.code !== 200) {
          return this.$vux.toast.show({
            type: 'warn',
            text: data.mess
          })
        }
        if (data.obj.length < 1) {
          data.obj.push({'name': '暂无城市信息', 'id': '', countryid: ''})
        }
        this.provinceData = data.obj.map(function (elem) {
          return {
            name: elem.name,
            value: elem.id,
            id: elem.countryid
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
      this.$emit('listenProvinceClose', false)
    },
    open () {
      this.$emit('listenProvinceClose', true)
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
      const province = this.getNameById(this.provinceData, this.provinceVal)
      const provincedata = {
        show: province,
        val: {
          provinceId: Number(this.provinceVal)
        }
      }
      this.$emit('listenProvinceConfrim', provincedata)
      this.$emit('listenProvinceClose', false)
    }
  },
  watch: {
    async stepprovinceshow (val) {
      if (val) {
        await this.getprovincedata()
      }
    }
  }
}

</script>

<style lang="less" scoped>
@import '../assets/styles/colors.less';
@import '../assets/styles/helpers.less';
.hide {
  display: none;
}
.stepprovincepicker {
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
