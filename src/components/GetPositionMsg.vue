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
      <picker :data='geoData' v-model='geoVal' :fixed-columns="1" :columns="1"></picker>
    </div>
  </div>
</template>

<script>
import { XInput, Picker } from 'vux'
import * as geographyService from '@/services/geography'

export default {
  name: 'getpositioninfo',
  props: {
    countryCode: {
      type: String,
      default: ''
    },
    provinceCode: {
      type: String,
      default: ''
    },
    cityCode: {
      type: String,
      default: ''
    },
    getpositionshow: {
      type: Boolean,
      default: false
    },
    type: {
      type: Number,
      default: 0
    }
  },
  components: {
    Picker,
    XInput
  },
  computed: {
    typeList () {
      return {
        1: 'country',
        2: 'province',
        3: 'city',
        4: 'county'
      }
    },
    typeListCn () {
      return {
        1: '国家',
        2: '省份',
        3: '城市',
        4: '县/区'
      }
    }
  },
  data () {
    return {
      geoData: [],
      geoVal: []
    }
  },
  async created () {
  },
  methods: {
    change (value) {
    },
    close () {
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
      try {
        let val = JSON.parse(this.geoVal)
        const geo = {
          ...val,
          typePosition: this.type
        }
        this.$emit('listenPositionConfirm', geo)
        this.$emit('listenPositionClose', false)
      } catch (e) {
        this.$emit('listenPositionConfirm', null)
        this.$emit('listenPositionClose', false)
      }
    }
  },
  watch: {
    async getpositionshow (val) {
      if (val) {
        let res = {}
        try {
          switch (this.type) {
            case 1:
              res = await geographyService.queryCountry()
              break
            case 2:
              res = await geographyService.queryProvince({
                countryCode: this.countryCode
              })
              break
            case 3:
              res = await geographyService.queryCity({
                provinceCode: this.provinceCode
              })
              break
            case 4:
              res = await geographyService.queryCounty({
                cityCode: this.cityCode
              })
              break
          }
          if (res.statusCode !== 200) {
            return this.$vux.toast.show({
              type: 'warn',
              text: '获取路由失败'
            })
          }
          if (res.code !== 200) {
            return this.$vux.toast.show({
              type: 'warn',
              text: res.mess
            })
          }
          if (!res.obj) {
            let name = this.typeListCn[this.type]
            name = `暂无${name}信息`
            this.geoData = [{name, 'id': '', value: ''}]
            return
          }
          const type = this.type
          this.geoData = res.obj.map(function (elem) {
            let val, name
            switch (type) {
              case 1:
                name = elem.country_cn
                val = {
                  id: elem.id,
                  name: elem.country_cn,
                  code: elem.country_code
                }
                break
              case 2:
                name = elem.province
                val = {
                  id: elem.id,
                  name: elem.province,
                  code: elem.province_code
                }
                break
              case 3:
                name = elem.city
                val = {
                  id: elem.id,
                  name: elem.city,
                  code: elem.city_code
                }
                break
              case 4:
                name = elem.district
                val = {
                  id: elem.id,
                  name: elem.district,
                  code: elem.district_code
                }
                break
            }
            return {
              name,
              value: JSON.stringify(val)
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
  left: 0;
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
