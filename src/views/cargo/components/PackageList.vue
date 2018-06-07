<template>
  <div class="packageList">
    <div class="title">我的包裹</div>
    <div class="packageList-header">
      <button-tab v-model="index">
        <button-tab-item @on-item-click="clickIndex()">未到库</button-tab-item>
        <button-tab-item @on-item-click="clickIndex()">已到库</button-tab-item>
      </button-tab>
    </div>
    <div class="packageList-container">
      <div class="packageList-container-open" v-show="index === 0">
        <ul>
          <li v-for="(item,index) in noWmsData" :key="index">
            <div class="packageList-container-item item1">{{item.CN_NO}}</div>
            <div class="packageList-container-item item4">{{item.ORDER_NAME}}</div>
            <div class="packageList-container-item item2">{{item.COMPANY_NAME}}</div>
            <div class="packageList-container-item item3">
              <div class="express-btn">物流轨迹</div>
            </div>
          </li>
        </ul>
        <div v-show="noWmsData.length < 1">
          暂时还没有包裹信息
        </div>
      </div>
      <div class="packageList-container-shut" v-show="index === 1">
        <select-cell :data="wmsData" />
        <div class="build_info" v-show="wmsData.length > 0">
          <div class="build_info_row">
            <p>注：特货和普货合单将以特货价值结算</p>
            <p>已选: 1</p>
          </div>
          <div class="build_info_row">
            <div class="build_btn">合单</div>
          </div>
        </div>
        <div v-show="wmsData.length < 1">
          暂时还没有包裹信息
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ButtonTab, ButtonTabItem } from 'vux'
import SelectCell from '@/components/SelectCell'
import { selectOrderByCargoType } from '@/services/cargo'

export default {
  name: 'packageList',
  components: {
    ButtonTab,
    ButtonTabItem,
    SelectCell
  },
  props: {
  },
  data () {
    return {
      index: 0,
      wmsData: [],
      noWmsData: []
    }
  },
  created () {
    console.log('打他啊啊啊啊啊啊啊啊啊', this.index)
    this.selectOrderByCargoType({cargoStatus: this.index})
  },
  methods: {
    async selectOrderByCargoType ({cargoStatus}) {
      const data = await selectOrderByCargoType({cargoStatus})
      if (data.code === 200 && data.obj) {
        if (cargoStatus === 0) {
          this.noWmsData = data.obj
        }
        if (cargoStatus === 1) {
          this.wmsData = data.obj
        }
      }
    },
    clickIndex () {
      this.selectOrderByCargoType({cargoStatus: this.index})
    }
  }
}
</script>

<style lang="less" scoped>
.packageList {
  margin: auto;
  overflow: hidden;
  .title {
    padding: 14px 0 10px;
  }
  .packageList-header {
    margin: 10px 30px;
    .vux-button-group {
      border-color: #ffa414;
      a.vux-button-group-current {
        background-color: #ffa414;
      }
      a.vux-button-tab-item-last:after,
      a.vux-button-tab-item-first:after {
        border-color: #ffa414;
      }
    }
  }
  .packageList-container {
    // border: 1px solid #666;
    margin: 20px 10px;
    &-open {
      ul {
        li {
          list-style: none;
          display: flex;
          padding: 5px 0px;
          height: 2rem;
          .packageList-container-item {
            flex: 1;
            height: 2rem;
            line-height: 2rem;
            text-align: center;
            justify-content: center;
            overflow:hidden; /*超出的部分隐藏起来。*/ 
            white-space:nowrap;/*不显示的地方用省略号...代替*/
            text-overflow:ellipsis;/* 支持 IE */
            .express-btn {
              width: 4rem;
              background-color: #ffa414;
              border-radius: 3px;
              line-height: 2em;
              padding: 0px 5px;
              color: #fff;
              margin: auto;
            }
          }
        }
      }
    }
    &-shut {
      .build_info {
        display: flex;
        .build_info_row {
          &:first-child {
            flex: 3;
            text-align: left;
          }
          &:last-child {
            flex: 1;
            .build_btn {
              background-color: #ffa414;
              width: 5rem;
              margin: auto;
              height: 3rem;
              line-height: 3rem;
              color: #fff;
              border-radius: 3px;
            }
          }
        }
      }
    }
  }
}
</style>
