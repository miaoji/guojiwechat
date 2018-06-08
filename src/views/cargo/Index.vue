<template>
  <div class="cargo">
    <div class="cargo-bg-header"></div>
    <div class="cargo-item cargo-item5">
      <address-item />
    </div>
    <div class="cargo-item cargo-item3">
      <transfer-addres />
    </div>
    <div class="cargo-bg-line"><div class="cargo-bg-line-detail"></div></div>
    <div class="cargo-item cargo-item1">
      <add-package />
    </div>
    <div class="cargo-bg-footer"></div>
    <div class="cargo-item-title">我的包裹</div>
    <div class="cargo-bg-header"></div>
    <div class="cargo-item cargo-item2">
      <package-list />
    </div>
    <div class="cargo-bg-footer"></div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import AddPackage from './components/AddPackage'
import PackageList from './components/PackageList'
import TransferAddres from './components/TransferAddres'
import AddressItem from './components/Address'

export default {
  name: 'cargo',
  components: {
    AddPackage,
    PackageList,
    TransferAddres,
    AddressItem
  },
  methods: {
    ...mapMutations(['SET_PAGE'])
  },
  created () {
    this.SET_PAGE({page: 'cargo'})
  }
}

</script>

<style lang="less" scoped>
@btn: #ffa414;

.cargo {
  background: url("../../assets/images/bg/bj.png");
  overflow: hidden;
  min-height: 100vh;
  padding: 28px 10px 100px;
  .cargo-item-title {
    color: #fff;
    line-height: 4rem;
  }
  .cargo-bg-header {
    background: url("../../assets/images/border_bg.png");
    background-size: 100% 1000%;
    height: 10px;
  }
  .cargo-bg-line {
    &-detail {
      background: url("../../assets/images/border.png");
      background-size: 100% 100%;
      height: 3px;
      background-repeat: no-repeat;
      margin: 0 0.5rem;
    }
    background-color: #fff;
  }
  .cargo-bg-footer {
    background: url("../../assets/images/border_bg.png");
    background-size: 100% 1000%;
    height: 10px;
    background-position: 0 -83px;
  }
  .cargo-item {
    background-color: #fff;
    &.cargo-item1 {
      padding: 1rem 0;
    }
    &.cargo-item5 {
      padding: 1rem 10px;
    }
  }
}
</style>
