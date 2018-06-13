<template>
  <div class="mergeOrder">
    <div class="mergeOrder-content">
        <ul>
          <li v-for="(item,index) in CargoBuildList" :key="index">
            <div class="list-item">
              <div>订单号:</div>
              <div class="mergeOrder-container-item item4">{{item.orderNo}}</div>
            </div>
            <div class="list-item">
              <div>订单状态:</div>
              <div class="mergeOrder-container-item item4">{{item.status | orderstatus}}</div>
            </div>
            <div class="list-item">
              <div>包裹状态:</div>
              <div class="mergeOrder-container-item item4">{{item.wmsStatus === 1 ? '已出库': (item.cargoStatus | filterCargoStatus)}}</div>
            </div>
            <div class="list-item">
              <div>订单类型:</div>
              <div class="mergeOrder-container-item item4">{{item.parentId | filterParentId}}</div>
            </div>
            <div class="list-item">
              <div>创建时间:</div>
              <div class="mergeOrder-container-item item4">{{item.createTime | formatdate}}</div>
            </div>
            <div class="list-item">
              <!-- <div class="mergeOrder-container-item item3" v-show="item.cargoStatus === 2"> -->
              <!-- <div class="mergeOrder-container-item item3">
                <div class="express-btn" @click="goPath('/orderroute', {'id': item.id})">物流轨迹</div>
              </div> -->
              <div class="mergeOrder-container-item item4">
                <div v-show="item.status < 2" class="express-btn" @click="goPath('/cargo/cancelbuild', {parentId: item.id,orderNo: item.orderNo})">合单修改</div>
              </div>
              <div class="mergeOrder-container-item item4">
                <div class="express-btn" @click="goPath('/orderdetail', {id: item.id,orderNo: item.orderNo})">订单详情</div>
              </div>
            </div>
          </li>
        </ul>
        <div v-show="CargoBuildList.length === 0">暂时还没有已合订单信息</div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'mergeOrder',
  props: {
  },
  computed: {
    ...mapGetters({
      CargoBuildList: 'getCargoBuildList'
    })
  },
  created () {
    this.getCargoListByUserId()
  },
  methods: {
    ...mapActions({
      getCargoListByUserId: 'getCargoListByUserId'
    }),
    goPath (path, query) {
      this.$router.push({path, query})
    }
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
  .mergeOrder-content {
    padding: 0px 10px;
    ul {
      li {
        padding: 0px 20px;
        &:first-child {
          border-top: 1px solid #ccc;
        }
        border-bottom: 1px solid #ccc;
        list-style: none;
        .list-item {
          display: flex;
          padding: 5px 0px;
          height: 2rem;
          .mergeOrder-container-item {
            &.item1 {
              flex: 3;
            }
            &.item2 {
              flex: 3;
            }
            &.item3 {
              flex: 2;
            }
            &.item4 {
              flex: 2;
            }
            height: 2rem;
            line-height: 2rem;
            text-align: center;
            justify-content: center;
            .express-btn {
              width: 5rem;
              background-color: #ffa414;
              border-radius: 3px;
              line-height: 2em;
              padding: 0px 3px;
              color: #fff;
              // margin: auto;
            }
          }
        }
      }
    }
  }
}
</style>
