<template>
  <div class="zextarea">
    <div class="zextarea-flex">
      <div class="zextarea-flex__hd">
        <label class="" style="">地址</label>
      </div>
      <div class="zextarea-flex__bd">
        <textarea name="" placeholder="请详细到门牌号">
        </textarea>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'zextarea',
  props: {
    type: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
    }
  },
  async created () {
  },
  methods: {
  }
}

</script>

<style lang="less" scoped>
@import '../assets/styles/colors.less';
@import '../assets/styles/helpers.less';
.zextarea {
  &-flex {
    .flex;
    align-items: flex-start;
    position: relative;
    padding: 10px 15px;
    &:before {
      content: " ";
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      height: 1px;
      border-top: 1px solid #D9D9D9;
      color: #D9D9D9;
      transform-origin: 0 0;
      transform: scaleY(0.5);
      left: 15px;
    }
    &__hd {
      width: 10rem;
      text-align: left;
    }
    &__bd {
      textarea {
        font-size: 15px;
        display: block;
        border: 0;
        resize: none;
        width: 100%;
        color: inherit;
        line-height: inherit;
        outline: 0;
      }
    }
  }
}

</style>
