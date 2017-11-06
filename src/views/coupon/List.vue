<template>
  <div class="list">
    <div class="list-container">
      <list-item
        name="国际快递"
        func="10元代金券"
        status="SENDED"
      >
      </list-item>
      <list-item
        name="国际快递"
        func="10元代金券"
        status="USED"
      >
      </list-item>
      <list-item
        name="国际快递"
        func="10元代金券"
        status="EXPIRED"
      >
      </list-item>
    </div>
  </div>
</template>

<script>
// import { storage } from '@/utils'
// import request from '@/utils/request'
import ListItem from './components/ListItem'

export default {
  name: 'list',
  mounted () {
    window.document.title = '卡券列表'
  },
  data () {
    return {
    }
  },
  created () {
  },
  components: {
    ListItem
  },
  computed: {
  },
  methods: {
  },
  watch: {
  },
  beforeDestroy () {
    this.$vux.loading.hide()
    this.$vux.toast.hide()
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import '../../assets/styles/colors.less';
@import '../../assets/styles/helpers.less';
@import '~vux/src/styles/close';

.list {
  &-container {
  }
}
</style>
