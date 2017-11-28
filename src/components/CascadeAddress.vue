<template>
  <div class="cascadeaddress">
    <popup-picker
      v-model="pickerVal"
      show-name
      :data="pickerData"
      :placeholder="placeholder"
      :columns="columns"
      :ref="refName"
      @on-show="onShow"
      @on-change="onChange"
    >
      <template slot="title">
        <span>
          <span style="vertical-align:middle;">{{title}}</span>
        </span>
      </template>
    </popup-picker>
  </div>
</template>

<script>
import { PopupPicker } from 'vux'
import * as geographyService from '@/services/geography'

export default {
  name: 'cascadeaddress',
  props: {
    loadInCreate: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    columns: {
      type: Number,
      default: 3
    },
    refName: {
      type: String,
      default: 'cascadeAddressPicker'
    },
    defaultSelect: {
      type: Array,
      default: () => {
        return []
      }
    },
    showWarningText: {
      type: String,
      default: '请先选择国家'
    }
  },
  components: {
    PopupPicker
  },
  data () {
    return {
      // 包裹类型&&产品类型
      pickerVal: [],
      pickerData: []
    }
  },
  async created () {
    if (this.loadInCreate) {
      this.setPickerData()
    }
  },
  methods: {
    onShow () {
      if (this.pickerData.length === 0) {
        this.setPickerData()
      }
    },
    async setPickerData () {
      const pickerData = await this.getData()
      this.pickerData = pickerData
      if (this.defaultSelect.length === 3) {
        const def = this.defaultSelect[0]
        const isIn = await pickerData.some(item => item['value'] === def)
        if (isIn) {
          this.pickerVal = this.defaultSelect
        }
        return
      }
    },
    /**
     * [根据国家id获取包裹类型 包含产品类型。二者级联关系]
     * @return {[type]} [description]
     */
    async getData () {
      try {
        this.$vux.loading.show()
        const res = await geographyService.queryCascade()
        if (res.success && res.code === 200 && res.obj) {
          let resData = res.obj
          resData = resData[0]['provincesList']
          let returnData = []
          for (let i = 0, len = resData.length; i < len; i++) {
            const firstChild = resData[i]
            const name = firstChild['province']
            const firstParentVal = JSON.stringify({
              'provinceId': firstChild['id'],
              'provinceName': name
            })
            const item = {
              name,
              value: firstParentVal,
              parent: 0
            }
            returnData.push(item)
            const secondChildren = firstChild.citiesList
            if (secondChildren.length < 1) {
              const fakeSecondChild = {
                name: '',
                value: `city is None ${i}`,
                parent: firstParentVal
              }
              returnData.push(fakeSecondChild)
              returnData.push({
                name: '',
                value: `district is None ${i}`,
                parent: fakeSecondChild['value']
              })
              continue
            }
            for (let j = 0, len = secondChildren.length; j < len; j++) {
              const secondChild = secondChildren[j]
              const name = secondChild['city']
              const secondParentVal = JSON.stringify({
                'cityId': secondChild['id'],
                'cityName': name
              })
              const item = {
                name,
                value: secondParentVal,
                parent: firstParentVal
              }
              returnData.push(item)
              const thirdChildren = secondChild.districtsList
              for (let k = 0, len = thirdChildren.length; k < len; k++) {
                const thirdChild = thirdChildren[k]
                const name = thirdChild['district']
                const thirdParentVal = JSON.stringify({
                  'districtId': thirdChild['id'],
                  'districtName': name
                })
                const item = {
                  name,
                  value: thirdParentVal,
                  parent: secondParentVal
                }
                returnData.push(item)
              }
            }
          }
          return returnData
        } else {
          return []
        }
      } catch (e) {
        console.error(e)
        return []
      } finally {
        this.$vux.loading.hide()
      }
    },
    onChange (val) {
      this.$emit('listenValChange', val)
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import '../assets/styles/vars.less';
.cascadeaddress {
  :global {
    .vux-cell-box {
      .weui-cell__hd {
        font-size: @normal-size;
      }
      .vux-popup-picker-select {
        font-size: @normal-size;
      }
    }
  }
}
</style>
