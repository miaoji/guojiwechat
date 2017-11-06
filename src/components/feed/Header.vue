<template>
  <header class="header">
    <div class="header-container">
      <div class="email">
        私信
      </div>
      <div class="intro">
        头条
      </div>
      <div class="search">
        搜索
      </div>
    </div>
  </header>
</template>

<script>

export default {
  name: 'header',
  props: {
    title: {
      type: String,
      default: ''
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
  }
}

</script>

<style lang="less" scoped>
@import '../../assets/styles/colors.less';
@import '../../assets/styles/helpers.less';

.header {
  &-container {
    .flex;
    height: 44px;
    background: @m-yellow;
    font-size: 1.6rem;
    color: #fff;
    .email {
      flex: 1
    }
    .intro {
      flex: 2
    }
    .search {
      flex: 1
    }
  }
}
</style>
