<template>
  <div class="earings">
    <div class="earings-container">
      <group label-width="11rem" label-align="left">
        <cell
          title="微信名"
          :value="userInfo.nickName"
        ></cell>
        <cell
          title="消费金额"
          :value="'￥' + userInfo.totalAmount"
        ></cell>
        <cell
          title="分润金额"
          value="待查询"
        ></cell>
        <cell
          title="关注日期"
          :value="userInfo.subscribeTime"
        ></cell>
        <cell
          title="性别"
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
      0: '未知',
      1: '男',
      2: '女'
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
