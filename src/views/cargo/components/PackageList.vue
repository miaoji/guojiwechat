<template>
  <div class="packageList">
    <div class="packageList-header">
      <button-tab v-model="index">
        <button-tab-item @on-item-click="clickIndex()">未到库</button-tab-item>
        <button-tab-item @on-item-click="clickIndex()">已到库</button-tab-item>
        <button-tab-item @on-item-click="clickIndex()">已合并</button-tab-item>
      </button-tab>
    </div>
    <div class="packageList-container">
      <div class="packageList-container-open" v-show="index === 0">
        <ul>
          <li v-show="noWmsData.length !== 0">
            <div class="packageList-container-item item1">国内单号</div>
            <div class="packageList-container-item item4">品名</div>
            <div class="packageList-container-item item2">快递公司</div>
            <div class="packageList-container-item item3">
              操作
            </div>
          </li>
          <li v-for="(item,index) in noWmsData" :key="index">
            <div class="packageList-container-item item1">{{item.CN_NO}}</div>
            <div class="packageList-container-item item4">{{item.ORDER_NAME}}</div>
            <div class="packageList-container-item item2">{{item.COMPANY_NAME}}</div>
            <div class="packageList-container-item item3">
              <div class="express-btn" @click="goPath('/orderroute', {'id': item.ID})">物流轨迹</div>
            </div>
          </li>
        </ul>
        <div v-show="noWmsData.length === 0">
          暂时还没有包裹信息
        </div>
      </div>
      <div class="packageList-container-shut" v-show="index === 1">
        <select-cell :selectList="selectList" @selectChange="selectChange" :data="wmsData" />
        <div class="build_info" v-show="wmsData.length > 0">
          <div class="build_info_row">
            <p>已选: {{selectList.length}}</p>
            <p>注：特货和普货合单将以特货价值结算,实际运费会因合包后重量和体积产生出入而产生差异，预计运费仅做参考，以实际结算为准</p>
          </div>
          <div class="build_info_row">
            <div class="build_btn" @click="onOrderBuild">合单</div>
          </div>
        </div>
        <div v-show="wmsData.length < 1">
          暂时还没有包裹信息
        </div>
      </div>
      <div class="cargo-item cargo-item4" v-show="index === 2">
        <merge-order />
      </div>
    </div>
  </div>
</template>

<script>
import { ButtonTab, ButtonTabItem } from 'vux'
import SelectCell from '@/components/SelectCell'
import { mapActions, mapGetters } from 'vuex'
import MergeOrder from './MergeOrder'

export default {
  name: 'packageList',
  components: {
    ButtonTab,
    ButtonTabItem,
    SelectCell,
    MergeOrder
  },
  props: {
  },
  computed: {
    ...mapGetters(['noWmsData', 'wmsData'])
  },
  data () {
    return {
      index: 0,
      selectList: [],
      orderParcelType: 0
    }
  },
  created () {
    this.selectOrderByCargoType({cargoStatus: this.index})
  },
  methods: {
    ...mapActions(['selectOrderByCargoType', 'orderBuild', 'getCargoListByUserId']),
    onOrderBuild () {
      if (this.selectList.length === 0) {
        return
      }
      this.orderBuild({selectList: this.selectList, orderParcelType: this.orderParcelType})
      this.selectList = []
    },
    selectChange (val) {
      this.selectList = val.selectDate
      this.orderParcelType = val.orderParcelType
    },
    goPath (path, query) {
      this.$router.push({path, query})
    },
    clickIndex () {
      if (this.index === 2) {
        this.getCargoListByUserId()
        return
      }
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
      a.vux-button-tab-item-middle:after,
      a.vux-button-tab-item-first:after {
        border-color: #ffa414;
      }
    }
  }
  .packageList-container {
    // border: 1px solid #666;
    margin: 20px 10px;
    min-height: 100px;
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
