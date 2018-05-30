<template>
  <!-- <div class="cargolistitem"> -->
  <div
    :class="{
      'cargolistitem': true,
      'cargolistitem-active': isChange && getCargoBuildList[data.id]
    }"
    @click="onItemClick"
  >
    <div class="cargolistitem-title">
      <div class="cargolistitem-title-left">123123123</div>
      <div class="cargolistitem-title-right">2018-05-28 11:11:11</div>
    </div>
    <div class="cargolistitem-container">
      <div class="cargolistitem-container-item1">顺丰速运</div>
      <div class="cargolistitem-container-item2">特货</div>
      <div class="cargolistitem-container-item3">5.7KG</div>
      <div class="cargolistitem-container-item4">待合单</div>
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
        this.SET_CAEGO_BUILD_LIST({
          cargoBuildList: {
            ...this.getCargoBuildList,
            [this.data.id]: undefined
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
  background-size: auto 70%;
  background-position: 0.4rem 0.8rem;
  background-color: #fff;
  border: 2px solid #fff;
  border-radius: 3px;
  &-title {
    display: flex;
    line-height: 2.2em;
    &-left {
      flex: 1;
      text-align: left;
      padding-left: 1rem;
    }
    &-right {
      flex: 1;
      text-align: right;
      padding-right: 1rem;
    }
  }
  &-container {
    line-height: 2.2em;
    display: flex;
    &-item1 {
      flex: 1;
    }    
    &-item2 {
      flex: 1;
    }    
    &-item3 {
      flex: 1;
    }    
    &-item4 {
      flex: 1;
    }    
  }
}
</style>
