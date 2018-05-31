<template>
  <!-- <div class="cargolistitem"> -->
  <div
    :class="{
      'cargolistitem': true,
      'cargolistitem-active': isChange && getCargoBuildList[data.id]
    }"
  >
    <!-- 未合单 -->
    <div @click="onItemClick" v-if="!data.orderDetailList || data.orderDetailList.length===0">
      <div class="cargolistitem-title">
        <div class="cargolistitem-title-left">{{data.cnNo}}</div>
        <div class="cargolistitem-title-right">{{data.createTime | formatedatestamp}}</div>
      </div>
      <div class="cargolistitem-container">
        <div class="cargolistitem-container-item1">{{data.kdCompany.companyName}}</div>
        <div class="cargolistitem-container-item2">特货</div>
        <div class="cargolistitem-container-item3">5.7KG</div>
        <div class="cargolistitem-container-item4">待合单</div>
      </div>
    </div>

    <!-- 已合单 -->
    <div v-if="data.orderDetailList && data.orderDetailList.length>0 ">
      <div class="cargolistitem-title">
        <div class="cargolistitem-title-left">{{data.orderNo}}</div>
        <div class="cargolistitem-title-right">{{data.createTime | formatedatestamp}}</div>
      </div>
      <div class="cargolistitem-container">
        <div class="cargolistitem-container-item1">目的地:{{data.receiverCountry}}</div>
        <div class="cargolistitem-container-item2">特货</div>
        <div class="cargolistitem-container-item3">5.7KG</div>
        <div class="cargolistitem-container-item4">已合单</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
export default {
  name: 'cargolistitem',
  data () {
    return {
      isChange: false
    }
  },
  created () {
    console.log('data', this.data)
  },
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  computed: {
    ...mapGetters([
      'getCargoBuildList'
    ])
  },
  methods: {
    ...mapMutations([
      'SET_CAEGO_BUILD_LIST'
    ]),
    onItemClick () {
      this.isChange = !this.isChange
      if (this.isChange) {
        this.SET_CAEGO_BUILD_LIST({
          cargoBuildList: {
            ...this.getCargoBuildList,
            [this.data.id]: this.data
          }
        })
      } else {
        delete this.getCargoBuildList[this.data.id]
        this.SET_CAEGO_BUILD_LIST({
          cargoBuildList: {
            ...this.getCargoBuildList
          }
        })
      }
    }
  }
}

</script>

<style lang="less" scoped>
.cargolistitem-active {
  border: 2px solid #ffa414!important;
}
.cargolistitem {
  color: #000;
  margin: 0.8rem;
  padding: 0.8rem 0.8rem 0.8rem 4rem;
  background: url('../../../assets/images/package.png');
  background-repeat: no-repeat;
  background-size: auto 50%;
  background-position: 0.4rem 1.5rem;
  background-color: #fff;
  border: 2px solid #fff;
  border-radius: 3px;
  &-title {
    display: flex;
    line-height: 2.2em;
    &-left {
      flex: 3;
      text-align: left;
    }
    &-right {
      flex: 3;
      text-align: right;
    }
  }
  &-container {
    line-height: 2.2em;
    display: flex;
    text-align: right;
    &-item1 {
      flex: 2;
      text-align: left;
    }    
    &-item2 {
      flex: 1;
      text-align: left;
    }    
    &-item3 {
      flex: 1;
      text-align: left;
    }    
    &-item4 {
      flex: 1;
    }    
  }
}
</style>
