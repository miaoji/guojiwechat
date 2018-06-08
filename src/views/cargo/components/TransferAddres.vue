<template>
  <div class="transferAddres-box">
    <div class="transferAddres">
      <div class="transferAddres-left">
        中转地址
      </div>
      <div class="transferAddres-right">
        <div class="transferAddres-info">
          上海市,闵行区,泰虹路168弄万科时一区1号楼302室,明彰,15022554455
        </div>
        <div class="transferAddres-notice">
          用户电商平台下单地址,下单时请在地址后加上客户编号哦
        </div>
      </div>
    </div>
    <div class="user-no">
      <div class="user-no-left">客户编码</div>
      <div class="user-no-right">MZA100049</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'transferAddres',
  props: {
  }
}
</script>

<style lang="less" scoped>
.transferAddres-box {
  padding: 10px;
}
.transferAddres {
  border-top: 1px solid #ccc;
  padding-top: 10px;
  margin: auto;
  display: flex;
  align-items: center;
  &-left {
    flex: 1;
  }
  &-right {
    flex: 2;
    text-align: right;
    .transferAddres-info {
      color: #333;
    }
    .transferAddres-notice {
      color: #ffa414;
    }
  }
}
.user-no {
  border-top: 1px #ccc solid;
  margin-top: 10px;
  padding-top: 10px;
  display: flex;
  align-items: center;
  &-left {
    flex: 1;
  }
  &-right {
    flex: 2;
    text-align: right;
  }
}
</style>
