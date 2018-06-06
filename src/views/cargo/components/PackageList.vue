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
      <div class="packageList-container-open">
        <ul>
          <li>
            <div class="packageList-container-item item1">33652114568512</div>
            <div class="packageList-container-item item2">顺丰速运</div>
            <div class="packageList-container-item item3">
              <div class="express-btn">物流轨迹</div>
            </div>
          </li>
          <li>
            <div class="packageList-container-item item1">33652114568512</div>
            <div class="packageList-container-item item2">顺丰速运</div>
            <div class="packageList-container-item item3">
              <div class="express-btn">物流轨迹</div>
            </div>
          </li>
        </ul>
      </div>
      <div class="packageList-container-shut">
        <ul>
          <li>
            <div class="packageList-container-item item1">33652114568512</div>
            <div class="packageList-container-item item2">顺丰速运</div>
            <div class="packageList-container-item item3">
              <div class="express-btn">物流轨迹</div>
            </div>
          </li>
          <li>
            <div class="packageList-container-item item1">33652114568512</div>
            <div class="packageList-container-item item2">顺丰速运</div>
            <div class="packageList-container-item item3">
              <div class="express-btn">物流轨迹</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ButtonTab, ButtonTabItem } from 'vux'
export default {
  name: 'packageList',
  components: {
    ButtonTab,
    ButtonTabItem
  },
  props: {
  },
  data () {
    return {
      index: 0
    }
  },
  methods: {
    clickIndex (val) {
      console.log('21', this.index)
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
    border: 1px solid #666;
    margin: 20px 10px;
    &-open {
      display: none;
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
  }
}
</style>
