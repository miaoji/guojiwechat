<template>
  <div class="caogobuild">

    <div v-if="type === 'build'">
      <div class="caogobuild-header-title">合并订单</div>
      <div class="caogobuild-container">
        <div class="none-list" v-show="showNoneList">
          <img src="../../assets/images/coupon_none_2.png" alt="">
          <p>暂无可以操作的订单</p>
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
          <button @click="mergeCargoClick">合单</button>
        </div>
      </div>
    </div>
    
    <div v-transfer-dom>
      <loading class="loading" :show="showLoading" text="加载中..."></loading>
    </div>
    <actionsheet v-model="showActionsheet" :menus="menus" show-cancel @on-click-menu="onClickMenu">
      <p slot="header" v-html="msg"></p>
    </actionsheet>

    <div v-if="type === 'cancel'">
      <div class="caogobuild-header-title">修改合单</div>
      <div class="caogobuild-container">
        <div class="none-list" v-show="showNoneList">
          <img src="../../assets/images/coupon_none_2.png" alt="">
          <p>暂无可以操作的订单</p>
        </div>
        <scroller
          class="list-scroller"
        >
          <div class="order-cancel" v-for="(item,index) in list" :key="index">
            <div class="order-cancel-item1">{{item.CN_NO}}</div>
            <div class="order-cancel-item2">{{item.company_name}}</div>
            <div class="order-cancel-item3" v-show="item.WEIGHT">{{`${item.WEIGHT} kg`}}</div>
            <div class="order-cancel-item4">{{item.PARCEL_TYPES | filterCargoType}}</div>
            <div @click='cancelClick(item)' class="order-cancel-item5">删除</div>
          </div>
          <div class="seat"></div>
        </scroller>
      </div>
    </div>

  </div>
</template>

<script>
import { queryCargoByBatch, cancelMergeCargo, getOrderByParentId, mergeCargo, remove } from '../../services/cargo'
import ItemCell from './components/Cell'
import { Loading, TransferDomDirective as TransferDom, Actionsheet } from 'vux'
import { mapMutations, mapGetters } from 'vuex'

export default {
  name: 'caogobuild',
  data () {
    return {
      list: [],
      showLoading: false,
      showNoneList: false,
      type: '',
      showActionsheet: false,
      deleteItem: {},
      msg: '确定咩?<br/><span style="color:#666;font-size:12px;">删除后订单将回到待合单状态,需要重新合单!</span>',
      menus: {
        delete: '<span style="color:red">删除</span>'
      }
    }
  },
  created () {
    const { type } = this.$route.query
    this.type = type
    if (type === 'build') {
      this.getCargoList()
    }
    if (type === 'cancel') {
      this.getOrderByParentId()
      console.log(1231)
    }
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
    async mergeCargoClick () {
      console.log('getCargoBuildList', this.getCargoBuildList)
      const data = await mergeCargo({
        data: Object.keys(this.getCargoBuildList),
        params: {
          // cargoType -1:普货 -2:特货
          cargoType: -2,
          // type 1:集运订单 0:直邮订单
          type: 1
        }
      })
      this.SET_CAEGO_BUILD_LIST({
        cargoBuildList: {}
      })
      console.log('data', data)
      this.getCargoList()
    },
    cancelClick (item) {
      this.showActionsheet = !this.showActionsheet
      this.deleteItem = item
    },
    async onClickMenu (item) {
      console.log('item', item)
      console.log('this.deleteItem', this.deleteItem)
      try {
        this.showLoading = true
        const id = this.deleteItem.ID
        const data = await cancelMergeCargo([id])
        console.log('data', data)
        if (data.code === 200 && data.obj) {
          alert('撤销成功')
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.showLoading = false
      }
      this.getOrderByParentId()
    },
    async getOrderByParentId () {
      try {
        this.showLoading = true
        const id = this.$route.query.id
        const data = await getOrderByParentId({id})
        if (data.code === 200) {
          if (!data.obj || data.obj.length === 0) {
            await remove({ids: id})
            this.$router.push({path: '/cargo/list'})
          }
          this.list = data.obj
        } else {
          this.showNoneList = true
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.showLoading = false
      }
    },
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
    ItemCell,
    Actionsheet
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
        font-size: 1.2rem;
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
    .order-cancel {
      margin: 0.8rem;
      background-color: #fff;
      padding: 1rem;
      border-radius: 3px;
      color: #333;
      line-height: 2em;
      font-size: 1.4rem;
      display: flex;
      text-align: center;
      &-item1 {
        flex: 2;
      }
      &-item2 {
        flex: 2;
        overflow: hidden;
        white-space:nowrap;
        text-overflow:ellipsis;
      }
      &-item3 {
        flex: 1;
      }
      &-item4 {
        flex: 1;
      }
      &-item5 {
        flex: 1;
        color: #ffa414;
      }
    }
  }
}
</style>
