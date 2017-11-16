<template>
  <div class="selectbox" v-show="show">
    <div class="selectbox-container">
      <div class="fix-box">
        <div class="head-box">
          <div class="header">
            <p>选择快递公司</p> 
            <div class="header-right" @click.stop="confirmNation">完成</div>
          </div>
        </div>

        <div class="selectbox-container-input">
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
          <p v-for="item in searchResult" v-show="item.hiddenStatus === 1" @click.stop="onClickSearchRes(item)">
            {{item.companyName}}&nbsp;{{item.companyCode}}
          </p>
        </div>
        <div class="input-search-container" v-show="searchResult.length === 0">
          <p>
            搜索结果为空
          </p>
        </div>
      </div>

      <div class="item-container" v-show="!inputLen">
        <div class="selectbox-container-item item-history">
          <div class="item-title">最近查询</div>
          <ul class="item-list">
            <li v-for="item in recentSearch">
              <span class="item" @click.stop="onClickCity({name: item})">
                {{item}}
              </span>
            </li>
          </ul>
          <p v-show="recentSearch.length === 0" style="color: white;">暂无查询记录</p>
        </div>
        
        <!-- 热门快递公司 -->
        <div class="selectbox-container-item item-hot">
          <div class="item-title">热门快递</div>
          <ul class="item-list">
            <li v-for="item in hotExpress">
              <span class="item" @click.stop="onClickCity({name: item})">
                {{item}}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { storage } from '@/utils'
import { query } from '@/services/expressCompany'
import { XInput, Icon } from 'vux'
import _ from 'lodash'

export default {
  name: 'selectbox',
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
      inputCountryName: '',
      selectPinyin: '',
      inSearching: false,
      hotExpress: [
        '顺丰',
        '圆通',
        '中通',
        '申通',
        '韵达',
        'EMS'
      ],
      searchResult: [],
      recentSearch: []
    }
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
      return this.countryName || '输入快递公司名搜索'
    }
  },
  methods: {
    /**
     * [getRecentSearch 获取近期查询的字段]
     * @return {[type]} [description]
     */
    getRecentSearch () {
      let recent = storage({
        key: 'select_express_recent'
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
        key: 'select_express_recent',
        val: JSON.stringify(recentSearch),
        type: 'set'
      })
    },
    /**
     * [用户点击完成按钮时事件，返回新增地址页面，如果此时搜索结果只有一个值，将改值传递给父组件]
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
      const title = 'selectbox'
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
      window.document.title = '选择快递公司'
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
        const res = await query({
          name: val
        })
        if (res.code === 200) {
          let searchResult = res.obj
          this.searchResult = searchResult || []
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
@import '../assets/styles/helpers.less';

.selectbox {
  &-container {
    .purple-bg;
    padding: 1rem;
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
    .item-container {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2;
      margin-top: 10rem;
      overflow: auto;
    }
    &-item {
      position: relative;
      padding: 0 .8rem;
      .item-title {
        padding: .8rem 0;
        font-size: 1.6rem;
        text-align: left;
        color: #97C1EA;
      }
      ul.item-list {
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
          .item {
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
    .item-history {
      position: relative;
    }
  }
}
</style>
