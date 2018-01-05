<template>
  <div class="earningitem">
  </div>
</template>

<script>

export default {
  name: 'earningitem',
  props: {
    item: {
      type: Object,
      require: true
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
    goPath (path, query) {
      this.$router.push({path, query})
    }
  }
}

</script>

<style lang="less" scoped>
</style>
