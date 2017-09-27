<template>
  <div class="redirect">
  </div>
</template>

<script>
import {storage} from '@/utils'

export default {
  created () {
    let {code, state} = this.$route.query
    if (!code && !state) {
      console.log('Redirect.vue: no code fail')
      return
    }
    // 删除code
    storage({
      key: 'code',
      type: 'remove'
    })
    // 删除存入新的code
    storage({
      key: 'code',
      val: code,
      type: 'set'
    })
    this.$router.push({path: '/init'})
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="less">
</style>
