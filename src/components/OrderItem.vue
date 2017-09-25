<template>
  <div class="senditem">
    <div class="senditem-detail">
      <div class="senditem-detail__icon">
        收
      </div>
      <div class="senditem-detail__address">
        <p class="senditem-detail__address--detail">{{item.RECEIVER_NAME}}&nbsp;&nbsp;{{item.RECEIVER_MOBILE}}</p>
        <p class="senditem-detail__address--detail">{{item.RECEIVER_COUNTRY}}{{item.RECEIVER_PROV}}{{item.RECEIVER_CITY}}{{item.RECEIVER_COUNTY}}&nbsp;详细:&nbsp;{{item.RECEIVER_ADDRESS}}</p>
      </div>
      <span class="senditem-detail__state">{{item.STATUS | orderstatus}}</span>
    </div>
    <div class="senditem-edit" style="justify-content: space-between;">
      <p class="senditem-edit__time">{{item.CREATE_TIME | formatedatestamp}}</p>
      <div>
        <button v-show="item.STATUS === 7" class="cancle-btn" @click="cancle(item)">取消订单</button>
        <button class="gosend-btn" @click="goPath(item)">详情</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'orderitem',
  props: {
    item: {
      type: Object,
      default: {}
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
  },
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
    ...mapActions([
      'cancleSend'
    ]),
    goPath (item) {
      const id = item.ID
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
@import '../assets/styles/colors.less';
@import '../assets/styles/helpers.less';

.border-bottom-grey {
  border-bottom: 1px solid @borderbt;
}

.normal-btn {
  min-width: 6rem;
  max-width: 6.6rem;
  font-size: 1.4rem;
  text-align: center;
  padding: .4rem .4rem;
  border-radius: 5px;
  box-sizing: border-box;
  white-space: nowrap;
}

.gosend-btn {
  .normal-btn;
  color: white;
  border: none;
  border: 1px solid @m-yellow;
  background: @m-yellow;
}

.order-padding {
  padding: 2px;
}

.senditem {
  padding: 0 .3rem;
  background: white;
  border-radius: 5px;
  .senditem-box {
    .flex;
    .border-bottom-grey;
    .item-padding;
    background: white;
    text-align: justify;
  }
  &-detail {
    .senditem-box;
    &__state {
      font-size: 1.3rem;
      color: @m-yellow;
      padding-top: .3rem;
      position: absolute;
      right: 2.7rem;
    }
    &__icon {
      border-radius: 50%;
      background: @m-receiver;
      color: white;
      margin-right: 1rem;
      width: 3rem;
      height: 3rem;
      font-size: 1.3rem;
      line-height: 3rem;
      text-align: center;
    }
    &__address {
      font-size: 1.3rem;
      &--detail {
        &:first-child {
          font-weight: 600;
          font-size: 1.4rem;
        }
        width: 18rem;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        @media (max-width:320px) {
          width: 14rem;
        }
        @media (min-width:360px) {
          width: 18rem;
        }
        @media (min-width:400px) {
          width: 20rem;
        }
      }
    }
  }
  &-edit {
    .senditem-box;
    &__time {
      font-size: 1.2rem;
    }
  }
}
</style>
