<template>
  <div class="packageproduct">
    <group>
      <popup-picker
        :data="packagePrductList"
        v-model="packagePrductVal"
        show-name
        @on-change="onChange"
        placeholder="请选择产品类型"
        :columns="2" 
        ref="packagePrductPicker"
      >
        <template slot="title">
          <span>
            <span style="vertical-align:middle;">产品类型</span>
          </span>
        </template>
      </popup-picker>
    </group>
  </div>
</template>

<script>
import { PopupPicker } from 'vux'
import * as packageTypeService from '@/services/packageType'

export default {
  name: 'packageproduct',
  components: {
    PopupPicker
  },
  data () {
    return {
      pickupCountryId: null,
      // 订单配置 包裹类型&&产品类型
      packagePrductVal: [],
      packagePrductList: []
    }
  },
  async created () {
  },
  computed: {
  },
  methods: {
    /**
     * [根据国家id获取包裹类型]
     * @return {[type]} [description]
     */
    async getPackageType ({countryId}) {
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
      console.log('val change', val)
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>
