<template>
  <div class="loadtoshow">
    <div class="loadtoshow-container" @click.stop="onReload">
      <img src="../assets/images/load.png" class="loading" alt="loadfail" v-show="state === 0">
      <span v-show="state !== 0">
        {{showVal}}
      </span>
      <img src="../assets/images/load.png" class="loadingfail" alt="loadfail" v-show="state === 2">
    </div>
  </div>
</template>

<script>

export default {
  name: 'loadtoshow',
  props: {
    title: {
      type: String,
      default: ''
    },
    ajaxFunc: {
      type: Function
    },
    query: {
      type: Object
    },
    dataLevel: {
      type: Array,
      default: () => {
        return [['obj1', ['name', 'sex']], ['obj2', ['name', 'sex']]]
      }
    }
  },
  data () {
    return {
      // 0 loading, 1 load success 2 load fail
      state: 0,
      returnRes: []
    }
  },
  computed: {
    showVal () {
      let val = ''
      switch (Number(this.state)) {
        case 0:
          val = '请求中'
          break
        case 1:
          val = this.returnRes.join('')
          break
        case 2:
          val = `获取${this.title}失败`
          break
        default:
          val = '请求中'
      }
      return val
    }
  },
  created () {
    this.getAjaxData()
  },
  methods: {
    async getAjaxData () {
      try {
        const res = await this.ajaxFunc(this.query)
        if (res.code === 200 && res.success) {
          this.handleData(this.dataLevel, res)
          this.state = 1
        } else {
          this.state = 2
        }
      } catch (e) {
        console.error(e)
      }
    },
    onReload () {
      if (this.state === 0) {
        return
      }
      this.state = 0
      this.returnRes = []
      this.getAjaxData()
    },
    /**
     * [
     *   handleData:
     *   每个数组层级，获取第一个 data[0],
     *   之后的元素，如果是数组则继续迭代， 如果是string则直接获取值，
     *   每个数组的第一个值一定是string
     * ]
     * @param  {[Array]} rules [获取规则]
     * @param  {[type]} data  [ajax获取的数据]
     * rules example:
     * [
     *   [
     *     'obj',
     *     [
     *       '0',
     *       'transferAddress',
     *       [
     *         'provinces',
     *         'province',
     *         'provinceCode'
     *       ]
     *     ]
     *   ],
     *   'statusCode'
     * ]
     * data['obj']['0']['transferAddress']
     * data['obj']['0']['provinces']['province']
     * data['obj']['0']['provinces']['provinceCode']
     * data['statusCode']
     * @return {[String]}       [description]
     */
    handleData (rules, data) {
      if (!rules && data) {
        this.returnRes.push(data)
        return
      }
      for (let i = 0, len = rules.length; i < len; i++) {
        const rule1 = rules[i]
        if (typeof rule1 === 'string') {
          this.returnRes.push(data[rule1])
          return
        }
        if (Array.isArray(rule1)) {
          let item = data[rule1[0]]
          for (let j = 1, lenitem = rule1.length; j < lenitem; j++) {
            this.handleData(rule1[j][1], item[rule1[j][0]])
          }
        }
      }
    }
  }
}

</script>

<style lang="less" scoped>
@import '../assets/styles/helpers.less';
@import '../assets/styles/vars.less';

.loadtoshow {
  &-container {
    .flex;
    img.loading {
      height: @big-size;
      transition: all 0.5s ease-in-out;
      animation: rotate 1s infinite linear;
    }
    @keyframes rotate
    {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    img.loadingfail {
      height: @middle-size;
    }
  }
}
</style>
