<template>
  <div class="transferAddres-box">
    <div class="transferAddres">
      <div class="transferAddres-left">
        中转地址
      </div>
      <div class="transferAddres-right">
        <div class="transferAddres-info">
          {{defaultTransfer.provinces.province}},{{defaultTransfer.districts.district}},{{defaultTransfer.transferAddress}},{{defaultTransfer.transferCompany}},{{defaultTransfer.transferMobile}}
        </div>
        <div class="transferAddres-notice">
          用户电商平台下单地址,下单时请在地址后加上客户编号哦
        </div>
      </div>
    </div>
    <div class="user-no">
      <div class="user-no-left">客户编码</div>
      <div class="user-no-right">{{userInfo.customerNo}}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'transferAddres',
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo',
      defaultTransfer: 'defaultTransfer'
    })
  },
  methods: {
    ...mapActions({
      getDefaultTransfer: 'getDefaultTransfer'
    })
  },
  props: {
  },
  created () {
    this.getDefaultTransfer()
    console.log('defaultTransfer', this.defaultTransfer)
  }
}
</script>

<style lang="less" scoped>
.transferAddres-box {
  padding: 10px;
}
.transferAddres {
  border-top: 1px solid #ccc;
  padding-top: 10px;
  margin: auto;
  display: flex;
  align-items: center;
  &-left {
    flex: 1;
  }
  &-right {
    flex: 2;
    text-align: right;
    .transferAddres-info {
      color: #333;
    }
    .transferAddres-notice {
      color: #ffa414;
    }
  }
}
.user-no {
  border-top: 1px #ccc solid;
  margin-top: 10px;
  padding-top: 10px;
  display: flex;
  align-items: center;
  &-left {
    flex: 1;
  }
  &-right {
    flex: 2;
    text-align: right;
  }
}
</style>
