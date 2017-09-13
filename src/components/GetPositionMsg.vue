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
      <picker :data='cityDatas' v-model='cityVals' :fixed-columns="1" :columns="1"></picker>
    </div>
  </div>
</template>

<script>
import { XInput, Picker } from 'vux'
import { geography as geographyApi } from '@/api'
import request from '../utils/request'

export default {
  name: 'getpositioninfo',
  props: {
    nationId: {
      type: Number,
      default: 0
    },
    provinceId: {
      type: Number,
      default: 0
    },
    cityId: {
      type: Number,
      default: 0
    },
    countyId: {
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
      cityDatas: [],
      cityVals: []
    }
  },
  async created () {
    try {
      const res = await request({
        method: 'post',
        url: geographyApi.showcountry,
        headers: {'token': window.localStorage.getItem('mj_token')},
        auth: true
      })
      if (res.statusCode !== 200) {
        return this.$vux.toast.show({
          type: 'warn',
          text: '获取路由失败'
        })
      }
      const data = res
      if (data.code !== 200) {
        return this.$vux.toast.show({
          type: 'warn',
          text: data.mess
        })
      }
      let shift = 0
      this.cityDatas = data.obj.map(function (elem, index) {
        if (elem.name === '中国') {
          shift = index
        }
        return {
          name: elem.name,
          value: elem.id
        }
      })
      if (this.type === 'pickup') {
        this.cityDatas.shift(shift)
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
      const country = this.getNameById(this.cityDatas, this.cityVals)
      const location = {
        show: country,
        val: {
          positionId: Number(this.cityVals)
        },
        typePosition: this.typecn
      }
      this.step = 1
      this.$emit('listenPositionConfirm', location)
      this.$emit('listenPositionClose', false)
    }
  },
  watch: {
    async getpositionshow (val) {
      if (val) {
        let res = {}
        try {
          switch (this.typecn) {
            case 1:
              res = await request({
                method: 'post',
                url: geographyApi.showcountry,
                auth: true,
                headers: {'token': window.localStorage.getItem('mj_token')}
              })
              break
            case 2:
              res = await request({
                method: 'post',
                url: geographyApi.showprovince,
                params: {
                  countryid: Number(this.nationId)
                },
                auth: true,
                headers: {'token': window.localStorage.getItem('mj_token')}
              })
              break
            case 3:
              res = await request({
                method: 'post',
                url: geographyApi.showcity,
                params: {
                  provinceid: Number(this.provinceId)
                },
                auth: true,
                headers: {'token': window.localStorage.getItem('mj_token')}
              })
              break
            case 4:
              res = await request({
                method: 'post',
                url: geographyApi.showcounty,
                params: {
                  cityid: Number(this.cityId)
                },
                auth: true,
                headers: {'token': window.localStorage.getItem('mj_token')}
              })
              break
          }
          if (res.statusCode !== 200) {
            return this.$vux.toast.show({
              type: 'warn',
              text: '获取路由失败'
            })
          }
          const data = res
          if (data.code !== 200) {
            return this.$vux.toast.show({
              type: 'warn',
              text: data.mess
            })
          }
          if (data.obj.length < 1) {
            data.obj.push({'name': '暂无城市信息', 'id': '', countryid: ''})
          }
          this.cityDatas = data.obj.map(function (elem) {
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
