<template>
  <div class="earings">
    <div class="earings-container">
      <div slot="title" class="slot">
        <img :src="userInfo.headimgurl"/>
      </div>
      <group label-width="11rem" label-align="left">
        <cell
          :title="$t('promoteUD.wechat')"
          :value="userInfo.nickName"
        ></cell>
        <cell
          :title="$t('promoteUD.amount')"
          :value="'￥' + userInfo.totalAmount / 100"
        ></cell>
        <cell
          :title="$t('promoteUD.profitAmount')"
          :value="$t('promoteUD.inquire')"
        ></cell>
        <cell
          :title="$t('promoteUD.followTime')"
          :value="userInfo.subscribeTime"
        ></cell>
        <cell
          :title="$t('promoteUD.sex')"
          :value="userInfo.sex"
        ></cell>
      </group>
    </div>
  </div>
</template>

<script>
import { formatedatestamp } from '@/utils/time'

export default {
  name: 'userdetail',
  data () {
    return {
      userInfo: null
    }
  },
  created () {
    const sex = {
      0: this.$t('promoteUD.unknown'),
      1: this.$t('promoteUD.boy'),
      2: this.$t('promoteUD.girl')
    }
    this.userInfo = this.$route.query
    this.userInfo.subscribeTime = formatedatestamp(this.userInfo.subscribeTime, 2)
    this.userInfo.sex = sex[this.userInfo.sex]
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/styles/helpers.less';
@import '../../assets/styles/colors.less';

.earings {
  &-container {
    .slot {
      margin: 0 auto -3rem;
      background-color: #fff;
      text-align: center;
      img {
        width: 10rem;
        height: 10rem;
        padding-bottom: 3rem;
        padding-top: 3rem;
      }
    }
    .list {
      .tools {
        .flex;
        background: white;
        padding: 10px 15px;
        justify-content: space-between;
        section {
          font-size: @normal-size;
          img.datetimepicker {
            width: 2.1rem;
          }
        }
      }
      .content {
        p.time {
          text-align: left;
          padding: 10px 15px;
          font-size: @small-size;
        }
      }
    }
  }
}
</style>
