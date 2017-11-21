<template>
  <div class="loadtoshow">
    <div class="loadtoshow-container" @click.stop="onReload">
      <img src="../../assets/images/load.png" class="loading" alt="loadfail" v-show="state === 0">
      <span v-show="state === 2">
        {{msg}}
      </span>
      <span v-show="state === 1 && isShowSuccess">
        {{msg}}
      </span>
      <img src="../../assets/images/load.png" class="loadingfail" alt="loadfail" v-show="state === 2">
    </div>
  </div>
</template>

<script>

export default {
  name: 'loadtoshow',
  props: {
    title: {
      type: String,
      default: ''
    },
    msg: {
      type: String,
      default: ''
    },
    // 0 loading, 1 load success 2 load fail
    state: {
      type: Number,
      default: 0
    },
    isShowSuccess: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
  },
  created () {
  },
  methods: {
    onReload () {
      if (this.state === 0) {
        return
      }
      this.$emit('listenReload', true)
    }
  }
}

</script>

<style lang="less" scoped>
@import '../../assets/styles/helpers.less';
@import '../../assets/styles/vars.less';

.loadtoshow {
  &-container {
    .flex;
    span {
      font-size: @normal-size;
    }
    img.loading {
      height: @big-size;
      transition: all 0.5s ease-in-out;
      animation: rotate 1s infinite linear;
    }
    @keyframes rotate
    {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    img.loadingfail {
      height: @middle-size;
    }
  }
}
</style>
