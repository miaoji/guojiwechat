<template>
  <div class="template">
  </div>
</template>

<script>
import { storage } from '@/utils'
import request from '@/utils/request'

export default {
  name: 'template',
  mounted () {
    window.document.title = 'Template'
  },
  data () {
    return {
    }
  },
  created () {
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
@import '../assets/styles/colors.less';
@import '~vux/src/styles/close';

.template {

}
</style>
