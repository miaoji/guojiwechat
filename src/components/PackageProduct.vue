<template>
  <div class="packageproduct">
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
import * as packageTypeService from '@/services/packageType'

export default {
  name: 'packageproduct',
  props: {
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
      default: 2
    },
    countryId: {
      type: Number
    },
    refName: {
      type: String,
      default: 'packagePrductPicker'
    },
    defaultSelect: {
      type: Array,
      default: () => {
        return []
      }
    },
    showWarningText: {
      type: String,
      default: '请先选择收件地址'
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
  },
  methods: {
    onShow () {
      if (!this.countryId) {
        this.$refs.packagePrductPicker.onHide()
        this.$vux.toast.show({
          text: this.showWarningText,
          type: 'warn',
          width: '18rem'
        })
      }
    },
    /**
     * [根据国家id获取包裹类型 包含产品类型。二者级联关系]
     * @return {[type]} [description]
     */
    async getData ({countryId}) {
      try {
        const packageTypeRes = await packageTypeService.queryCascade({
          countryId
        })
        if (packageTypeRes.success && packageTypeRes.statusCode && packageTypeRes.obj) {
          const resData = packageTypeRes.obj
          let returnData = []
          for (let i = 0, len = resData.length; i < len; i++) {
            const packageData = resData[i]
            const parentVal = JSON.stringify({
              'packageId': packageData.id,
              'maxRange': packageData.maxRange,
              'minRange': packageData.minRange
            })
            const packageItem = {
              name: `${packageData.nameCn}[${packageData.minRange}~${packageData.maxRange}kg]`,
              value: parentVal,
              parent: 0
            }
            returnData.push(packageItem)
            const productList = packageData.productTypeList
            for (let j = 0, len = productList.length; j < len; j++) {
              let product = productList[j]
              let productItem = {
                name: product.productName,
                value: JSON.stringify({'productId': product.id}),
                parent: parentVal
              }
              returnData.push(productItem)
            }
          }
          return returnData
        } else {
          return []
        }
      } catch (e) {
        console.error(e)
        return []
      }
    },
    onChange (val) {
      this.$emit('listenValChange', val)
    }
  },
  watch: {
    // 监听coutryId的值，变化的时候相应的 pickerdata也要变化
    async countryId (val, oldval) {
      try {
        if (!val) {
          this.pickerVal = []
          this.pickerVal = []
          return
        }
        this.$vux.loading.show()
        const pickerData = await this.getData({countryId: val})
        this.pickerData = pickerData
        if (this.defaultSelect.length === 2) {
          const def = this.defaultSelect[0]
          const isIn = await pickerData.some(item => item['value'] === def)
          if (isIn) {
            this.pickerVal = this.defaultSelect
          }
          return
        }
        if (pickerData.length === 2) {
          this.pickerVal = [pickerData[0]['value'], pickerData[1]['value']]
          return
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.$vux.loading.hide()
      }
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import '../assets/styles/vars.less';
.packageproduct {
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
