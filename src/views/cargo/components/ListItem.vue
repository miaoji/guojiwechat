<template>
  <div class="listitem">
    <div class="detail">
      <div class="detail-address">
        <div class="detail-address--icon address-icon--small">
          <span class="bgblack">{{'pickS' | translate}}</span>
        </div>
        <p class="detail-address--detail">
          <span>
            {{item.receiverCountry}}{{item.receiverProv}}{{item.receiverCity}}{{item.receiverCounty}}&nbsp;
          </span>
          <span class="order-no">
            {{'cargo.item.batchno' | translate}}:&nbsp;{{item.batch}}
          </span>
        </p>
      </div>
    </div>
    <div class="order-status">
      <span class="detail-state" v-show="item.parentId !== 0">{{item.status | orderstatus}}</span>
      <span class="detail-state" v-show="item.parentId === 0">{{'cargo.item.waitcargo' | translate}}</span>
      <span class="detail-state" v-show="item.cargoStatus === 0">未入库</span>
      <span class="detail-state" v-show="item.cargoStatus === 1">已入库</span>
    </div>
    <div class="package">
      <div class="package-info" @click.stop="goPath('/orderdetail', {'id': orderId})">
        <div class="booklist" v-show="item.parentId !== 0 && item.orderDetailList.length > 1">
          <div class="booklist-item" v-for="(elem, index) in item.orderDetailList" :key="index">
            <div>
              {{elem['orderName']}}
            </div>
          </div>
        </div>
        <div class="booklist" v-show="item.parentId !== 0 && item.orderDetailList.length === 1">
          <div class="booklist-item">
          </div>
          <div class="booklist-intro">
            {{item.orderDetailList[0] ? item.orderDetailList[0]['orderName'] : ''}}
          </div>
        </div>
        <div class="booklist" v-show="item.parentId === 0">
          <div class="booklist-item">
          </div>
          <div>
            {{item.orderName}}
          </div>
        </div>
      </div>
      <div class="package-detail">
        <p v-show="item.parentId !== 0">{{'cargo.item.orderno' | translate}}:{{item.orderNo}}</p>
        <p v-show="item.parentId !== 0">
          {{$t('cargo.item.ordernum', {'num': item.orderDetailList.length})}}&nbsp;{{'cargo.item.cargoorder' | translate}}-{{cargoType}}&nbsp;{{'cargo.item.realpay' | translate}}:&nbsp;{{realPay}}
        </p>
        <!-- <p v-show="item.parentId === 0">
          {{$t('cargo.item.ordernum', {'num': 1})}}
        </p> -->
      </div>
    </div>
    <div class="edit">
      <p class="edit__time">{{item.createTime | formatedatestamp}}</p>
      <div>
        <button class="order-btn" v-show="item.parentId === 0 && item.cargoStatus === 1" @click="goPath('/cargo/build', {'batch': item.batch, type: 'build'})">进行合单</button>
        <button class="order-btn" v-show="item.parentId < 0 && item.cargoStatus === 1" @click="goPath('/cargo/build', {'id': item.id, type: 'cancel'})">修改合单</button>
        <button class="order-btn" @click="goPath('/orderroute', {'id': orderId})">{{'cargo.item.checkroute' | translate}}</button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'listitem',
  props: {
    item: {
      type: Object,
      default: {}
    }
  },
  created () {
    console.log('thisss', this.item)
  },
  data () {
    return {
    }
  },
  computed: {
    orderId () {
      return this.item.id || 0
    },
    cargoType () {
      const parentId = Number(this.item.parentId)
      let res = ''
      switch (parentId) {
        case -1:
          res = '普货'
          break
        case -2:
          res = '特货'
          break
        default:
          res = '普货'
      }
      return res
    },
    realPay () {
      let totalFee = Number(this.item.totalFee)
      if (totalFee === 0) {
        return '正在定价'
      }
      totalFee = totalFee / 100
      return `￥${totalFee}`
    }
  },
  methods: {
    goPath (path, query) {
      this.$router.push({path, query})
    }
  }
}

</script>

<style lang="less" scoped>
@import '../../../assets/styles/colors.less';
@import '../../../assets/styles/helpers.less';
@import '../../../assets/styles/vars.less';

.border-bottom-grey {
  border-bottom: 1px solid @borderbt;
}
.listitem {
  background: white;
  border-radius: @radius-size;
  .order-status {
    padding-left: 3rem;
    span {
      padding-right: 0.5rem;
    }
  }
  .listitem-box {
    padding: .5rem .6rem;
  }
  .detail {
    .flex;
    .listitem-box;
    justify-content: space-between;
    &-state {
      font-size: @normal-size;
      color: @m-yellow;
      white-space: nowrap;
    }
    &-address {
      .flex;
      &--icon {
        margin-right: .5rem;
      }
      &--detail {
        width: 20rem;
        text-align: left;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: @normal-size;
        @media (max-width:320px) {
          width: 17rem;
        }
        @media (min-width:370px) {
          width: 22rem;
        }
        @media (min-width:400px) {
          width: 23rem;
        }
      }
    }
  }
  .package {
    .border-bottom-grey;
    &-info {
      font-size: @normal-size;
      min-height: 5rem;
      padding: .5rem .6rem;
      background: #ececec;
    }
    &-detail {
      font-size: @normal-size;
      padding: .5rem .6rem;
      text-align: right;
    }
  }
  .edit {
    .flex;
    .listitem-box;
    height: 2.2rem;
    justify-content: space-between;
    &__time {
      font-size: @small-size;
    }
    .order-btn {
      background-color: #ffa414;
      border: none;
      padding: 0.5rem;
      border-radius: 3px;
      color: #fff;
      margin-left: 1rem;
    }
  }
}
</style>
