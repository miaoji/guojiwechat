<template>
  <div class="cell">
    <div class="cell__hd"></div> 
    <div class="cell-bd">
      <p>
        <label class="label" style="width: 8rem; text-align: left;">{{title}}</label> 
      </p>
      <span class="label-desc"></span>
    </div> 
    <div :class="{'cell__ft': true, 'is-link': isLink}">
      {{value}}
    </div>
  </div>
</template>

<script>

export default {
  name: 'listitem',
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    isLink: {
      type: Boolean,
      default: false
    }
  }
}

</script>

<style lang="less" scoped>
@import '../../../assets/styles/helpers.less';

.cell {
  .flex;
  padding: 10px 15px;
  position: relative;
  &:after {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #D9D9D9;
    color: #D9D9D9;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  &-bd {
    flex: 1;
  }
  &__ft {
    padding-right: 13px;
    position: relative;
  }

  .is-link {
    &:after {
      content: " ";
      display: inline-block;
      height: 6px;
      width: 6px;
      border-width: 2px 2px 0 0;
      border-color: #C8C8CD;
      border-style: solid;
      -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
      transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
      position: relative;
      top: -2px;
      position: absolute;
      top: 50%;
      margin-top: -4px;
      right: 2px;
    }
  }

  .label {
    display: block;
    word-wrap: break-word;
    word-break: break-all;
  }
}
</style>
