<template>
  <div class="selectCell">
    <div class="selectCell-cell" v-for="item in data" :key="item.ID" @click.stop="onCellClick(item)">
      <div class="selectCell-cell-row">
        <div class="selectCell-cell-row-radio">
          <div :class="{
            radio: true,
            radio_info: selectData.indexOf(item.ID) === -1,
            radio_active: selectData.indexOf(item.ID) !== -1,
            radio_dis: false,
          }"></div>
        </div>
        <div class="selectCell-cell-row-orderNo">{{item.CN_NO}}</div>
        <div class="selectCell-cell-row-time">{{item.CREATE_TIME | formatedatestamp}}</div>
      </div>
      <div class="selectCell-cell-row">
        <div class="selectCell-cell-row-item1">{{item.COMPANY_NAME}}</div>
        <div class="selectCell-cell-row-item2">{{item.CARGO_TYPE | filterCargoType}}</div>
        <div class="selectCell-cell-row-item3">{{item.WEIGHT || 0}}KG</div>
        <div class="selectCell-cell-row-item4">{{item.PARENT_ID | filterParentId}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'selectCell',
  props: {
    data: {
      type: Array,
      default: []
    },
    selectList: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      selectData: []
    }
  },
  computed: {
  },
  methods: {
    onCellClick (item) {
      const index = this.selectData.indexOf(item.ID)
      if (index > -1) {
        this.selectData.splice(index, 1)
      } else {
        this.selectData = [...this.selectData, item.ID]
      }
      this.$emit('selectChange', this.selectData)
    }
  }
}
</script>

<style lang="less" scoped>
@btn: #ffa414;

.selectCell {
  margin: auto;
  &-cell {
    padding: 0 10px 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #ccc;
    &:first-child {
      border-top: 1px solid #ccc;
      padding-top: 10px;
    }
    &-row {
      display: flex;
      &-radio {
        flex: 1;
        text-align: left;
        .radio {
          width: 16px;
          height: 16px;
          &.radio_info {
            background: url('../assets/images/select_cargo.png');
          }
          &.radio_active {
            background: url('../assets/images/select_active.png');
          }
          &.radio_dis {
            background: url('../assets/images/select_dis.png');
          }
        }
      }
      &-orderNo {
        flex: 6;
        text-align: left;
      }
      &-time {
        flex: 6;
        text-align: right;
      }
      &-item1 {
        flex: 1;
        text-align: left;
      }
      &-item2 {
        flex: 1;
      }
      &-item3 {
        flex: 1;
      }
      &-item4 {
        flex: 1;
        text-align: right;
      }
    }
  }
}
</style>
