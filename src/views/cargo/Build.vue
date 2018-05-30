<template>
  <div class="caogobuild">
    <div class="caogobuild-header-title">合并订单</div>
    <div class="caogobuild-container">
      <div class="none-list" v-show="showNoneList">
        <img src="../../assets/images/coupon_none_2.png" alt="">
        <p>{{'coupon.nocoupon' | translate}}</p>
      </div>
      <scroller
        class="list-scroller"
      >
        <item-cell v-for="(item,index) in list" :key="index" :data='item'></item-cell>
        <div class="seat"></div>
      </scroller>
    </div>

    <div class="caogobuild-footer">
      <div class="caogobuild-footer-left">
        <p class="caogobuild-footer-left-active">已选包裹: {{itemCount}}</p>
        <p>注：特货和普货合单将以特货价值结算</p>
      </div>
      <div class="caogobuild-footer-right">
        <button>合单</button>
      </div>
    </div>
    
    <div v-transfer-dom>
      <loading class="loading" :show="showLoading" text="加载中..."></loading>
    </div>

  </div>
</template>

<script>
import { queryCargoByBatch } from '../../services/cargo'
import ItemCell from './components/Cell'
import { Loading, TransferDomDirective as TransferDom } from 'vux'
import { mapMutations, mapGetters } from 'vuex'

export default {
  name: 'caogobuild',
  data () {
    return {
      list: [],
      showLoading: false,
      showNoneList: false
    }
  },
  created () {
    this.getCargoList()
  },
  computed: {
    ...mapGetters([
      'getCargoBuildList'
    ]),
    itemCount () {
      return Object.keys(this.getCargoBuildList).length
    }
  },
  methods: {
    ...mapMutations([
      'SET_CAEGO_BUILD_LIST'
    ]),
    // 获取集运订单列表
    async getCargoList () {
      try {
        this.showLoading = true
        const batch = this.$route.query.batch
        const data = await queryCargoByBatch({batch})
        if (data.code === 200 && data.obj) {
          this.list = data.obj
        } else {
          this.showNoneList = true
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.showLoading = false
      }
    }
  },
  components: {
    Loading,
    ItemCell
  },
  directives: {
    TransferDom
  }
}

</script>

<style lang="less" scoped>
.caogobuild {
  height: 100vh;
  overflow: hidden;
  background: -webkit-linear-gradient(#571d79, #873ec1); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(#571d79, #873ec1); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(#571d79, #873ec1); /* Firefox 3.6 - 15 */
  background: linear-gradient(#571d79, #873ec1); /* 标准的语法 */
  &-header-title {
    position: absolute;
    top: 0px;
    background-color: #fff;
    height: 4rem;
    line-height: 4rem;
    font-size: 1.4rem;
    color: #ffa414;
    width: 100%;
  }
  &-footer {
    height: 4rem;
    position: absolute;
    bottom: 0px;
    width: 100%;
    background-color: #fff;
    display: flex;
    &-left {
      flex: 2;
      color: #333;
      text-align: left;
      padding-left: 1rem;
      font-size: 1rem;
      line-height: 2rem;
      &-active {
        font-size: 1.6rem;
      }
    }
    &-right {
      flex: 1;
      text-align: right;
      button {
        background-color: #ffa414;
        border: none;
        color: #fff;
        height: 4rem;
        width: 6rem;
      }
    }
  }
  &-container {
    position: absolute;
    top: 4rem;
    bottom: 4rem;
    width: 100%;
    height: auto;
    .list-scroller {
      li {
        span {
          color: #fff;
        }
      }
      height: 100%;
      // padding-top: 3.8rem;
      .seat {
        height: 13.8rem;
      }
    }
    .none-list {
      padding: 4rem;
      img {
        width: 10rem;
        height: 10rem;
      }
      p {
        font-size: 1.6rem;
        color: #fff;
      }
    }
  }
}
</style>
