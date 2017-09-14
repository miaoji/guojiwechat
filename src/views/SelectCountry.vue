<template>
  <div class="selectcountry">
    <div class="selectcountry-container">
      <div class="head-box">
        <div class="header">
          <p>出发城市</p> 
          <div class="header-right">完成</div>
        </div>
      </div>

      <div class="selectcountry-container-input">
        <input type="" name="" placeholder="美国">
      </div>

      <div class="selectcountry-container-city city-history">
        <div class="country-title">最近查询</div>
        <ul class="city-list">
          <li v-for="item in hotcity">
            <span class="city">
              {{item}}
            </span>
          </li>
        </ul>
      </div>

      <div class="selectcountry-container-city city-hot">
        <div class="country-title">热门国家</div>
        <ul class="city-list">
          <li v-for="item in hotcity">
            <span class="city">
              {{item}}
            </span>
          </li>
        </ul>
      </div>

      <div class="city-word selectcountry-container-city">
        <div class="country-title">试试国家首字母检索</div>
        <ul class="city-list">
          <li v-for="item in alphabet">
            <span class="city">
              {{item}}
            </span>
          </li>
        </ul>
      </div>

    </div>
  </div>
</template>

<script>
// import { storage } from '../utils'
// import request from '../utils/request'

export default {
  name: 'selectcountry',
  mounted () {
    window.document.title = '选择国家'
  },
  data () {
    return {
      hotcity: [
        '中国',
        '中国',
        '中国',
        '中国',
        '中国',
        '中国',
        '中国',
        '中国',
        '中国',
        '中国',
        '中国',
        '中国',
        '中国',
        '中国',
        '中国',
        '中国',
        '中国',
        '中国',
        '中国',
        '中国',
        '中国',
        '中国',
        '中国'
      ],
      alphabet: [ 'A', 'B', 'C', 'D', 'E', 'F' ]
    }
  },
  async created () {
  },
  computed: {
  },
  methods: {
  },
  watch: {
  },
  beforeDestroy () {
    this.$vux.loading.hide()
    this.$vux.toast.hide()
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../assets/styles/colors.less';
@import '~vux/src/styles/close';

.selectcountry {
  &-container {
    padding: 0;
    position: relative;
    min-height: 100vh;
    background-image: url('../assets/images/global-bg-new.jpg');
    background-size: 100% auto;
    background-repeat: no-repeat;
    background-color: #0666C1;
    .head-box {
      height: 2rem;
      .header {
        color: #fff;
        position: absolute;
        top: .8rem;
        margin-top: 0;
        width: 100%;
        font-size: 1.8rem;
        -webkit-transition: all .5s ease;
        transition: all .5s ease;
        &-right {
          font-size: 1.6rem;
          position: absolute;
          top: .3rem;
          right: 1rem;
          color: #fff;
        }
      }
    }
    &-input {
      input {
        font-size: 2rem;
        padding-left: .5rem;
        width: 95%;
        height: 4rem;
        margin: 3rem auto;
        margin-bottom: 1rem;
        border-radius: 5px;
        background: #fff;
      }
    }
    &-city {
      position: relative;
      padding: 0 .8rem;
      .country-title {
        padding: .8rem 0;
        font-size: 1.6rem;
        text-align: left;
        color: #97C1EA;
      }
      ul.city-list {
        padding: 0 .07rem;
        list-style: none;
        &:after {
          content: "";
          display: table;
          clear: both;
        }
        li {
          position: relative;
          float: left;
          width: 25%;
          box-sizing: border-box;
          padding: 0 .17rem;
          margin-bottom: .6rem;
          color: #fff;
          .city {
            position: relative;
            display: block;
            height: 3rem;
            line-height: 3rem;
            border: 1px solid rgba(255,255,255,.6);
            border-radius: .3rem;
            font-size: 1.6rem;
            text-align: center;
            box-sizing: border-box;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    .city-history {
      position: relative;
    }
    .city-hot {
    }
    .city-word {
      ul.city-list {
        li {
          width: 20%;
        }
      }
    }
  }
}
</style>
