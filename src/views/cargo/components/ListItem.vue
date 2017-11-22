<template>
  <div class="listitem">
    <div class="detail">
      <div class="detail-address">
        <div class="detail-address--icon address-icon--small">
          <span class="bgblack">收</span>
        </div>
        <p class="detail-address--detail">
          <span>
            {{item.receiverCountry}}{{item.receiverProv}}{{item.receiverCity}}{{item.receiverCounty}}&nbsp;
          </span>
          <span class="order-no">
            批次号:&nbsp;{{item.batch}}
          </span>
        </p>
      </div>
      <span class="detail-state">{{item.status | orderstatus}}</span>
    </div>
    <div class="package">
      <div class="package-info">
        <div class="booklist" v-show="item.parentId !== 0 && item.orderInfoSubset.length > 1">
          <div class="booklist-item" v-for="elem in item.orderInfoSubset" :key="item.id">
            <div>
              {{elem['orderName']}}
            </div>
          </div>
        </div>
        <div class="booklist" v-show="item.parentId !== 0 && item.orderInfoSubset.length === 1">
          <div class="booklist-item">
          </div>
          <div class="booklist-intro">
            {{item.orderInfoSubset[0] ? item.orderInfoSubset[0]['orderName'] : ''}}
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
        <p v-show="item.parentId !== 0">订单号:{{item.orderNo}}</p>
        <p v-show="item.parentId !== 0">
          共{{item.orderInfoSubset.length}}条订单&nbsp;集运类型-{{cargoType}}&nbsp;实付款:&nbsp;{{realPay}}
        </p>
        <p v-show="item.parentId === 0">
          共1条订单
        </p>
      </div>
    </div>
    <div class="edit">
      <p class="edit__time">{{item.createTime | formatedatestamp}}</p>
      <div>
        <button v-show="item.status === 10" class="cancle-btn" @click="cancle(item)">取消订单</button>
        <button class="gosend-btn" @click="goPath(item)">详情</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ColonSpan from '@/components/ColonSpan'

export default {
  name: 'listitem',
  props: {
    item: {
      type: Object,
      default: {}
    }
  },
  components: {
    ColonSpan
  },
  data () {
    return {
    }
  },
  created () {
  },
  computed: {
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
    ...mapActions([
      'cancleSend'
    ]),
    goPath (item) {
      const id = item.id
      this.$router.push({path: '/orderdetail', query: {id}})
    },
    async cancle (item) {
      const _this = this // 需要注意 onCancel 和 onConfirm 的 this 指向
      this.$vux.confirm.show({
        title: '确定取消这一订单吗?',
        onCancel () {
        },
        async onConfirm () {
          const res = await _this.cancleSend({
            id: item.id,
            type: 5
          })
          _this.$vux.toast.show(res)
        }
      })
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
  }
}
</style>
