<template>
  <div class="selectcountry" v-show="show">
    <div class="selectcountry-container">
      <div class="fix-box">
        <div class="head-box">
          <div class="header">
            <p>选择国家/地区</p> 
            <div class="header-right" @click.stop="confirmNation">完成</div>
          </div>
        </div>

        <div class="selectcountry-container-input">
          <div class="nation-input">
            <input type="" v-model="inputCountryName" name="" :placeholder="inputPlaceHolder">
            <div class="input-clear" v-show="inputLen" @click.stop="clearInput">
              <icon type="clear"></icon>
            </div>
          </div>
          <div v-show="inputLen" class="input-search">
            <div class="input-search-container" v-show="searchResult.length !== 0">
              <p v-for="item in searchResult" v-show="item.hide === 1" @click.stop="onClickSearchRes(item)">
                {{item.name}}&nbsp;{{item.englishname}}
              </p>
            </div>
            <div class="input-search-container" v-show="searchResult.length === 0">
              <p>
                搜索结果为空
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="city-container" v-show="!inputLen">
        <div class="selectcountry-container-city city-history">
          <div class="country-title">最近查询</div>
          <ul class="city-list">
            <li v-for="item in recentSearch">
              <span class="city" @click.stop="onClickCity({name: item})">
                {{item}}
              </span>
            </li>
          </ul>
        </div>

        <div class="selectcountry-container-city city-hot">
          <div class="country-title">所有国家/地区</div>
          <ul class="city-list">
            <li v-for="item in allNation">
              <span class="city" @click.stop="onClickCity({name: item.coutry_cn})">
                {{item.coutry_cn}}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { storage } from '../utils'
import request from '../utils/request'
import { geography as geographyApi } from '@/api'
import { XInput, Icon } from 'vux'
import _ from 'lodash'

export default {
  name: 'selectcountry',
  components: {
    XInput,
    Icon
  },
  props: {
    show: {
      type: Boolean,
      default: true
    },
    countryName: {
      type: String,
      default: ''
    },
    countryId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      allNation: [],
      inputCountryName: '',
      inSearching: false,
      hotcity: [
        '中国',
        '美国',
        '日本',
        '澳大利亚',
        '英国'
      ],
      alphabet: [ 'A', 'B', 'C', 'D', 'E', 'F' ],
      searchResult: [],
      recentSearch: []
    }
  },
  async created () {
    // 获取所有国家
    this.$vux.loading.show()
    const res = await request({
      url: geographyApi.showcountry,
      method: 'get',
      auth: true,
      data: {
        page: 1,
        rows: 500
      }
    })
    this.$vux.loading.hide()
    if (res.code === 200) {
      this.allNation = res.obj
    }
  },
  mounted () {
    window.document.title = '选择国家'
  },
  computed: {
    inputLen () {
      const len = this.inputCountryName.length
      if (len > 0) {
        return true
      }
      return false
    },
    inputPlaceHolder () {
      return this.countryName
    }
  },
  methods: {
    /**
     * [getRecentSearch 获取近期查询的字段]
     * @return {[type]} [description]
     */
    getRecentSearch () {
      let recent = storage({
        key: 'select_country_recent'
      })
      recent = JSON.parse(recent)
      recent = _.compact(recent)
      recent = _.uniq(recent)
      return recent
    },
    /**
     * [将搜索的值插入最近查询集合中]
     * @return {[type]} [description]
     */
    changeRecentSearch () {
      const confrimVal = this.inputCountryName
      let recentSearch = this.recentSearch
      recentSearch.push(confrimVal)
      recentSearch = _.compact(recentSearch)
      recentSearch = _.uniq(recentSearch)
      recentSearch = _.takeRight(recentSearch, 12)
      storage({
        key: 'select_country_recent',
        val: JSON.stringify(recentSearch),
        type: 'set'
      })
    },
    /**
     * [用户点击完成按钮时事件，返回新增地址页面，如果此时搜索结果只有一个值，那个将改值传递给父组件]
     * @return {[type]} [description]
     */
    confirmNation () {
      const searchResult = this.searchResult
      if (searchResult.length === 1) {
        const item = searchResult[0]
        const nation = {
          show: item.name,
          nationId: item.id
        }
        this.$emit('listenCountryConfirm', nation)
      }
      this.$router.go(-1)
    },
    /**
     * [用户点击所有国家时事件，跳转到搜索结果UI]
     * @param  {String} options.name [description]
     * @return {[type]}              [description]
     */
    onClickCity ({name = ''}) {
      this.inputCountryName = name
    },
    /**
     * [用户点击搜索结果的事件，返回新增页面]
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
     */
    onClickSearchRes (item) {
      const nation = {
        show: item.name,
        nationId: item.id
      }
      this.$emit('listenCountryConfirm', nation)
      this.$router.go(-1)
    },
    /**
     * [清空搜索框，此时搜索结果需要清空，最近搜索也要改变]
     * @return {[type]} [description]
     */
    clearInput () {
      this.inputCountryName = ''
      this.searchResult = []
      this.recentSearch = this.getRecentSearch()
    },
    /**
     * [在window history中压入一个新的state]
     */
    pushHistory () {
      const url = '#' + this.$route.fullPath
      const title = 'selectcountry'
      const state = {
        title,
        url
      }
      window.history.pushState(state, title, url)
    }
  },
  watch: {
    async show (val) {
      if (!val) return
      // 输入框值清空
      this.inputCountryName = ''
      // 压入一个新的history
      this.pushHistory()
      const _this = this
      window.addEventListener('popstate', function (e) {
        // 此时的this指的是window, 所以要将_this传入进来
        const vue = _this
        vue.$emit('listenCountryClose', false)
      }, false)
      // 获取最近查询
      this.recentSearch = this.getRecentSearch()
    },
    /**
     * [监听输入框值，变动时获取搜索结果, 并将输入值存入用户习惯中]
     * @param  {[type]} val    [description]
     * @param  {[type]} oldval [description]
     */
    async inputCountryName (val, oldval) {
      if (!val) return
      if (this.inSearching) return
      this.inSearching = true
      this.$vux.loading.show()
      try {
        const res = await request({
          url: geographyApi.showcountry,
          method: 'get',
          auth: true,
          params: {
            name: val
          }
        })
        if (res.code === 200) {
          this.searchResult = res.obj
          this.changeRecentSearch()
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.inSearching = false
        this.$vux.loading.hide()
      }
    }
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
    .fix-box {
      padding-top: .6rem;
      position: fixed;
      top: 0;
      z-index: 2;
    }
    .head-box {
      z-index: 2;
      height: 2rem;
      .header {
        color: #fff;
        margin-top: 0;
        width: 100%;
        font-size: 1.7rem;
        -webkit-transition: all .5s ease;
        transition: all .5s ease;
        &-right {
          position: absolute;
          top: .7rem;
          right: 1rem;
          font-size: 1.5rem;
          color: #fff;
        }
      }
    }
    &-input {
      padding: 0 0;
      top: 1rem;
      width: 100vw;
      .nation-input {
        padding-left: .5rem;
        width: 93vw;
        padding: 1rem 0 0 1rem; 
        margin: 1rem auto;
        margin-bottom: 1rem;
        border-radius: 8px;
        background: #fff;
        input {
          color: #333;
          font-size: 2.2rem;
          width: 97%;
          height: 4rem;
          border: none;
          outline: none;
        }
        .input-clear {
          position: absolute;
          right: 2rem;
          top: 5.5rem;
          i {
            font-size: 2.2rem;
          }
        }
      }
      .input-search {
        padding: 0 1rem;
        &-container {
          p {
            text-align: left;
            font-size: 1.6rem;
            color: #fff;
            padding: .5rem .5rem 1rem 1rem;
            border-bottom: 1px solid #97C1EA;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
    .city-container {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2;
      margin-top: 10rem;
      overflow: auto;
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
