<template>
  <div class="userlist">
    <div class="userlist-container">
      <div class="list">
        <div class="tools">
          <section class="search">
            <input type="" name="" placeholder="根据微信名搜索">
            <span type="" class="search-icon">
              <img src="../../assets/images/search.png" alt="">
            </span>
          </section>
          <section @click.stop="handleDatePicker">
            <img class="datetimepicker" src="../../assets/images/promote/datetimepicker.png"></img>
          </section>
        </div>
        <div class="content" v-for="item in [1, 2, 3, 4, 5]">
          <p class="time">
            2017-0{{item}}
          </p>
          <group label-width="11rem" label-align="left">
            <cell
              title="塞尔达"
              value="已产生收益￥6.00"
              link="/promote/users/12"
              is-link
            ></cell>
            <cell
              title="林克"
              value="已产生收益￥66.00"
              link="/promote/users/33"
              is-link
            ></cell>
          </group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'userlist',
  data () {
    return {
    }
  },
  created () {
  },
  computed: {
  },
  methods: {
    handleDatePicker () {
      this.$vux.datetime.show({
        cancelText: '取消',
        confirmText: '确定',
        format: 'YYYY-MM',
        value: '2017-12',
        minYear: 2017,
        maxYear: 2018,
        onConfirm (val) {
          console.log('plugin confirm', val)
        },
        onShow () {
          console.log('plugin show')
        },
        onHide () {
          console.log('plugin hide')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/styles/helpers.less';
@import '../../assets/styles/colors.less';

.userlist {
  &-container {
    .list {
      .tools {
        .flex;
        background: white;
        padding: 10px 15px;
        justify-content: space-between;
        section {
          font-size: @normal-size;
          img.datetimepicker {
            width: 2.1rem;
            vertical-align: middle;
          }
        }
        .search {
          input {
            padding: 6px 10px;
            font-size: @small-size;
            border: 1px solid #d9d9d9;
            border-radius: @radius-size;
            margin-right: .5rem;
          }
          &-icon {
            img {
              width: 1.6rem;
              vertical-align: middle;
            }
          }
        }
      }
      .content {
        p.time {
          text-align: left;
          padding: 10px 15px;
          font-size: @small-size;
        }
      }
    }
  }
}
</style>
