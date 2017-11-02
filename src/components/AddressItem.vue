<template>
  <div class="addressitem">
    <div class="addressitem-detail" @click.stop="selectAddress(item)">
      <div>
        <p>{{item.name}} {{item.mobile}}</p>
        <p class="location"><span class="location-remark">{{item.remark}}</span> {{item.address}} </p>
      </div>
    </div>
    <div class="addressitem-func">
      <span class="is-default" v-show="item.is_default === 1">
        <img src="../assets/images/add_ico_che.png" alt="默认地址">
        <span>默认地址</span>
      </span>
      <span class="not-default" v-show="item.is_default === 0 || !item.is_default" @click.stop="changeChecked(item.id, item.start, item.userid)">
        <img src="../assets/images/add_ico_nor.png" alt="">
        <span>设为默认</span>
      </span>
      <div>
        <span class="edit" @click.stop="goPath('/address/handle', {id: item.id, type: addressType, pagetype: 'edit'})">
          <img src="../assets/images/add_ico_cha.png" alt="">
          <span>编辑</span>
        </span>
        <span class="edit" @click.stop="deleteItem(item.id, addressType)">
          <img src="../assets/images/add_ico_del.png" alt="删除该地址">
          <span>删除</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'addressitem',
  props: {
    item: {
      type: Object,
      default: {}
    },
    pick: {
      type: Boolean,
      default: false
    },
    addressType: {
      type: String,
      default: 'send'
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
      'delAddress',
      'updateAddress'
    ]),
    selectAddress (item) {
      if (!this.pick) {
        return
      }
      if (this.addressType === 'send') {
        window.localStorage.setItem('mj_send_sendaddress', JSON.stringify(item))
      } else {
        window.localStorage.setItem('mj_send_pickupaddress', JSON.stringify(item))
      }
      this.$router.push({path: '/send'})
    },
    changeChecked (id, checked, userid) {
      if (checked === 3) {
        return
      }
      const _this = this
      let type = 1
      if (this.addressType !== 'send') {
        type = 2
      }
      this.$vux.confirm.show({
        // 组件除show外的属性
        title: '确定将这一地址设置为默认地址吗?',
        onCancel () {
        },
        onConfirm () {
          const data = {
            id,
            isDefault: 1
          }
          _this.updateAddress({data, type})
        }
      })
    },
    deleteItem (ids, addressType) {
      // 显示
      const _this = this // 需要注意 onCancel 和 onConfirm 的 this 指向
      this.$vux.confirm.show({
        // 组件除show外的属性
        title: '确定删除这一地址吗?',
        onCancel () {
        },
        async onConfirm () {
          _this.$vux.loading.show({
            text: '正在提交'
          })
          const delRes = await _this.delAddress({ids, type: addressType})
          _this.$vux.loading.hide()
          _this.$vux.toast.show(delRes)
        }
      })
    },
    goPath (path, query) {
      this.$router.push({path, query})
    }
  }
}

</script>

<style lang="less" scoped>
@import '../assets/styles/colors.less';
@import '../assets/styles/helpers.less';

.addressitem {
  padding: 0 .3rem;
  background: white;
  border-radius: 5px;
  &-detail {
    .flex;
    .item-padding;
    justify-content: space-between;
    border-bottom: 1px solid #f1f1f1;
    .location {
      color: #999;
      font-size: 1.4rem;
      width: 21rem;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: left;
      white-space: nowrap;
      @media (max-width:320px) {
        width: 21rem;
      }
      @media (min-width:360px) {
        width: 25rem;
      }
      @media (min-width:400px) {
        width: 28rem;
      }
      &-remark {
        color: @m-yellow;
      }
    }
    p {
      text-align: left;
      font-size: 1.6rem;
    }
    img {
      width: 2rem;
    }
  }
  &-func {
    .flex;
    .item-padding;
    height: 2.2rem;
    background: #fff;
    font-size: 1.2rem;
    justify-content: space-between;
    .edit {
      padding: .1rem 1rem;
      img {
        width: 1.2rem;
        vertical-align: middle;
      }
    }
    .is-default {
      color: @m-yellow;
      img {
        width: 1.2rem;
        vertical-align: text-top;
        *vertical-align: middle;
        font-size: 0;
      }
    }
    .not-default {
      color: #999;
      img {
        width: 1.2rem;
        vertical-align: text-top;
        *vertical-align: middle;
        font-size: 0;
      }
    }
  }
}
</style>
