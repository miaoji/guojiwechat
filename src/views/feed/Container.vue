<template>
  <div class="feed">
    <feed-header></feed-header>
    <transition>
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import Header from './components/Header'

export default {
  name: 'feedcontainer',
  created () {
  },
  components: {
    'feed-header': Header
  },
  data () {
    return {
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import '../../assets/styles/colors.less';
</style>
