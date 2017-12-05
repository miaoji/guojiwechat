<template>
  <div class="listitem">
    <div class="listitem-detail">
      <div class="listitem-detail__icon">
        收
      </div>
      <div class="listitem-detail__address">
        <p class="listitem-detail__address--detail">{{item.RECEIVER_NAME}}&nbsp;&nbsp;{{item.RECEIVER_MOBILE}}</p>
        <p class="listitem-detail__address--detail">{{item.RECEIVER_COUNTRY}}{{item.RECEIVER_PROV}}{{item.RECEIVER_CITY}}{{item.RECEIVER_COUNTY}}&nbsp;详细:&nbsp;{{item.RECEIVER_ADDRESS}}</p>
      </div>
      <span class="listitem-detail__state">{{item.STATUS | orderstatus}}</span>
    </div>
    <div class="listitem-edit" style="justify-content: space-between;">
      <p class="listitem-edit__time">{{item.CREATE_TIME | formatedatestamp}}</p>
      <div>
        <button class="gosend-btn" @click="goPath(item)">详情</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'listitem',
  props: {
    item: {
      type: Object,
      default: {}
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
@import '../../../assets/styles/colors.less';
@import '../../../assets/styles/helpers.less';

.border-bottom-grey {
  border-bottom: 1px solid @borderbt;
}

.order-padding {
  padding: 2px;
}

.listitem {
  padding: 0 .3rem;
  background: white;
  border-radius: @radius-size;
  .listitem-box {
    .flex;
    .border-bottom-grey;
    .item-padding;
    background: white;
    text-align: justify;
  }
  &-detail {
    .listitem-box;
    &__state {
      font-size: @normal-size;
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
      font-size: @normal-size;
      line-height: 3rem;
      text-align: center;
    }
    &__address {
      font-size: @normal-size;
      &--detail {
        &:first-child {
          font-size: @normal-size;
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
    .listitem-box;
    height: 2.2rem;
    &__time {
      font-size: @small-size;
    }
  }
}
</style>
