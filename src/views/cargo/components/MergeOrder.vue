<template>
  <div class="mergeOrder">
    <div class="mergeOrder-title">已合并订单</div>
    <div class="mergeOrder-content">
        <ul>
          <li>
            <div class="mergeOrder-container-item item1">33652114568512</div>
            <div class="mergeOrder-container-item item2">待出库</div>
            <div class="mergeOrder-container-item item3">
              <div class="express-btn">物流轨迹</div>
            </div>
          </li>
          <li>
            <div class="mergeOrder-container-item item1">33652114568512</div>
            <div class="mergeOrder-container-item item2">待出库</div>
            <div class="mergeOrder-container-item item3">
              <div class="express-btn">物流轨迹</div>
            </div>
          </li>
        </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mergeOrder',
  props: {
  }
}
</script>

<style lang="less" scoped>
@btn: #ffa414;

.mergeOrder {
  margin: auto;
  &-title {
    font-size: 1.4rem;
    line-height: 2em;
  }
  ul {
    li {
      list-style: none;
      display: flex;
      padding: 5px 0px;
      height: 2rem;
      .mergeOrder-container-item {
        flex: 1;
        height: 2rem;
        line-height: 2rem;
        text-align: center;
        justify-content: center;
        .express-btn {
          width: 4rem;
          background-color: #ffa414;
          border-radius: 3px;
          line-height: 2em;
          padding: 0px 5px;
          color: #fff;
          margin: auto;
        }
      }
    }
  }
}
</style>
