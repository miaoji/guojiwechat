<template>
  <div class="cancelbuild">
    <div class="cancelbuild-bg-header"></div>
    <div class="cancelbuild-item cargo-item5">
      <div class="cancelbuild-item-title">订单号: {{orderNo}}</div>
      <ul>
        <li v-for="(item,index) in packageList" :key="index">
          <div class="item-left">
            <img src="../../assets/images/package.png" alt="">
          </div>
          <div class="item-right">
            <div>国内单号: {{item.cnNo}}</div>
            <div>物流公司: {{item.kdCompany.companyName}}</div>
            <div>重量: {{item.wieght || 0}}KG</div>
            <div>类型: {{item.cargoType | filterCargoType}}<span @click="onCancelbuild({id: item.id})" class="item-right-update">删除</span></div>
          </div>
        </li>
      </ul>
      <div class="footer-info">注：实际运费会因合包后重量和体积产生出入而产生差异，预计运费仅做参考，以实际结算为准</div>
    </div>
    <div class="cancelbuild-bg-footer"></div>
    <actionsheet v-model="showActionsheet" :menus="menus" show-cancel @on-click-menu="onClickMenu">
      <p slot="header" v-html="msg"></p>
    </actionsheet>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Actionsheet } from 'vux'

export default {
  name: 'cancelbuild',
  computed: {
    ...mapGetters(['packageList'])
  },
  components: {
    Actionsheet
  },
  methods: {
    ...mapActions(['getPackageList', 'cancelBuild']),
    onClickMenu (type) {
      if (type === 'delete') {
        this.cancelBuild({id: this.itemId, parentId: this.$route.query.parentId})
      }
    },
    onCancelbuild ({id}) {
      this.itemId = id
      this.showActionsheet = true
    }
  },
  data () {
    return {
      orderNo: '',
      itemId: 0,
      showActionsheet: false,
      msg: '确定咩?<br/><span style="color:#666;font-size:12px;">删除后订单将回到待合单状态,需要重新合单!</span>',
      menus: {
        delete: '<span style="color:red">删除</span>'
      }
    }
  },
  created () {
    const parentId = this.$route.query.parentId
    this.orderNo = this.$route.query.orderNo
    this.getPackageList({parentId})
  }
}
</script>

<style lang="less" scoped>
.cancelbuild {
  background: url("../../assets/images/bg/bj.png");
  overflow: hidden;
  min-height: 100vh;
  padding: 0px 10px 0px;
  .cancelbuild-item-title {
    color: #333;
    line-height: 4rem;
    text-align: left;
    padding-left: 10px;
  }
  .cancelbuild-bg-header {
    background: url("../../assets/images/border_bg.png");
    background-size: 100% 1000%;
    height: 10px;
    margin-top: 30px;
  }
  .cancelbuild-bg-footer {
    background: url("../../assets/images/border_bg.png");
    background-size: 100% 1000%;
    height: 10px;
    background-position: 0 -83px;
  }
  .cancelbuild-item {
    background-color: #fff;
    min-height: 100px;
    padding: 0px 0px 20px 0px;
    .footer-info {
      padding: 0px 10px;
      text-align: left;
    }
    ul {
      overflow: hidden;
      li {
        display: flex;
        align-items:center;
        background-color: #eee;
        padding: 10px 0px;
        margin: 10px 10px;
        .item-left {
          flex: 1;
          margin-right: 10px;
          margin-left: 10px;
          img {
            width: 65px;
            height: 65px;
          }
        }
        .item-right {
          flex: 5;
          text-align: left;
          .item-right-update {
            text-align: right;
            float: right;
            padding-right: 30px;
            color: #ffa414;
          }
        }
      }
    }
  }
}
</style>
