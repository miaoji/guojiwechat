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
        </div>
      </div>

      <div v-show="inputLen" class="input-search">
        <div class="input-search-container" v-show="searchResult.length !== 0">
          <p v-for="item in searchResult" v-show="item.hidden_status === 1" @click.stop="onClickSearchRes(item)">
            {{item.country_cn}}&nbsp;{{item.country_en}}
          </p>
        </div>
        <div class="input-search-container" v-show="searchResult.length === 0">
          <p>
            搜索结果为空
          </p>
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
        
        <!-- 热门国家、地区 -->
        <div class="selectcountry-container-city city-hot">
          <div class="country-title">热门国家/地区</div>
          <ul class="city-list">
            <li v-for="item in hotNation">
              <span class="city" @click.stop="onCountryConfirm(item)">
                {{item.country_cn}}
              </span>
            </li>
          </ul>
        </div>

        <!-- 首字母搜索 -->
        <div class="selectcountry-container-city city-pinyin">
          <div class="country-title">试试国家首字母检索</div>
          <!-- 全部拼音 -->
          <ul class="city-list" v-show="allPinYin === true">
            <li v-for="item in allAlphabet">
              <span class="city" @click.stop="onClickPinyin({pinyin: item})">
                {{item}}
              </span>
            </li>
          </ul>
          <!-- 点击拼音后展示 -->
          <ul class="city-list" v-show="allPinYin === false">
            <li>
              <span class="pinyin">
                {{selectPinyin}}
              </span>
            </li>
            <li>
              <span class="city" @click.stop="onClickAllPinyin()">
                A-Z
              </span>
            </li>
          </ul>
        </div>

        <!-- 首字母搜索结果 -->
        <div class="selectcountry-container-city city-pinyin" v-show="allPinYin === false">
          <div class="country-title">首字母检索结果</div>
          <ul class="city-list">
            <li v-for="item in alphabetResult">
              <span class="city" @click.stop="onCountryConfirm(item)">
                {{item.country_cn}}
              </span>
            </li>
          </ul>
          <p v-show="alphabetResult.length === 0" style="color: white;font-size: 1.6rem;">
            暂无首字母为 {{selectPinyin}} 的国家或地区
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { storage } from '@/utils'
import * as geographyService from '@/services/geography'
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
    type: {
      type: String,
      default: 'send'
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
      hotNation: [],
      inputCountryName: '',
      selectPinyin: '',
      inSearching: false,
      hotcity: [
        '中国',
        '美国'
      ],
      searchResult: [],
      recentSearch: [],
      allPinYin: true,
      alphabetResult: [],
      allAlphabet: [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
        'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
        'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
        'Y', 'Z'
      ]
    }
  },
  async created () {
  },
  computed: {
    inputLen () {
      const nameLen = this.inputCountryName.length
      if (nameLen > 0) {
        return true
      }
      return false
    },
    inputPlaceHolder () {
      return this.countryName || '输入国家名搜索'
    }
  },
  methods: {
    /**
     * [获取热门国家]
     * @return {[type]} [description]
     */
    async getHotNation () {
      this.$vux.loading.show()
      try {
        const res = await geographyService.queryCountry({
          hot: 1
        })
        this.$vux.loading.hide()
        if (res.code === 200) {
          let nations = res.obj
          if (!nations) return
          // 当type为pickup时，过滤中国这一选项
          if (this.type === 'pickup') {
            nations = this.fliterChina(nations)
          }
          this.hotNation = nations
        }
      } catch (e) {
        console.error(e)
      }
    },
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
      recentSearch = _.takeRight(recentSearch, 4)
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
        const country = {
          id: item.id,
          name: item.country_cn,
          code: item.country_code
        }
        this.$emit('listenCountryConfirm', country)
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
     * [用户点击拼音时事件]
     * @param  {String} options.name [description]
     * @return {[type]}              [description]
     */
    onClickPinyin ({pinyin = ''}) {
      this.selectPinyin = pinyin
      this.allPinYin = false
    },
    /**
     * [用户点击后展示所有拼音，并清空拼音搜索结果]
     * @param  {String} options.name [description]
     * @return {[type]}              [description]
     */
    onClickAllPinyin () {
      this.allPinYin = true
      this.alphabetResult = []
    },
    /**
     * [确认选择的国家]
     * @param  {String} options.name [description]
     * @return {[type]}              [description]
     */
    onCountryConfirm (item) {
      const country = {
        id: item.id,
        name: item.country_cn,
        code: item.country_code
      }
      this.$emit('listenCountryConfirm', country)
      this.$router.go(-1)
    },
    /**
     * [用户点击搜索结果的事件，返回新增页面]
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
     */
    onClickSearchRes (item) {
      const country = {
        id: item.id,
        name: item.country_cn,
        code: item.country_code
      }
      this.$emit('listenCountryConfirm', country)
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
    },
    fliterChina (arr) {
      let shift
      arr = arr.map(function (elem, index) {
        if (elem.country_cn === '中国') {
          shift = index
        }
        return elem
      })
      if (shift || shift === 0) {
        arr.shift(shift)
      }
      return arr
    }
  },
  watch: {
    async show (val) {
      if (!val) return
      if (this.hotNation.length === 0) {
        this.getHotNation()
      }
      // 输入框值清空
      this.inputCountryName = ''
      // 压入一个新的history
      this.pushHistory()
      const _this = this
      window.document.title = '选择国家'
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
        const res = await geographyService.queryCountry({
          name: val,
          page: 1,
          rows: 50
        })
        if (res.code === 200) {
          let searchResult = res.obj
          // 当type为pickup时，过滤中国这一选项
          if (this.type === 'pickup') {
            searchResult = this.fliterChina(searchResult)
          }
          this.searchResult = searchResult || []
          this.changeRecentSearch()
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.inSearching = false
        this.$vux.loading.hide()
      }
    },
    /**
     * [监听选择的拼音变化值，变动时获取首字母检索结果]
     * @param  {[type]} val    [description]
     * @param  {[type]} oldval [description]
     */
    async selectPinyin (val, oldval) {
      if (!val) return
      if (this.inSearching) return
      this.inSearching = true
      this.$vux.loading.show()
      try {
        const res = await geographyService.queryCountry({
          pinyin: val,
          page: 1,
          rows: 50
        })
        if (res.code === 200) {
          let searchResult = res.obj
          // 当type为pickup时，过滤中国这一选项
          if (this.type === 'pickup') {
            searchResult = this.fliterChina(searchResult)
          }
          this.alphabetResult = searchResult || []
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
@import '../../../assets/styles/colors.less';
@import '~vux/src/styles/close';

.selectcountry {
  &-container {
    padding: 0;
    position: relative;
    min-height: 100vh;
    background-size: 100% auto;
    background-repeat: no-repeat;
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
          right: 3rem;
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
        width: 92vw;
        padding: 1rem 0 0 1rem;
        margin-top: 1.5rem;
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
    }
    .input-search {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2;
      margin-top: 10rem;
      padding: 0 1rem;
      overflow: auto;
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
          .pinyin {
            position: relative;
            display: block;
            background: #B883E7;
            height: 3rem;
            line-height: 3rem;
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
