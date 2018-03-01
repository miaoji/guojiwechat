<template>
  <div class="setting">
    <div class="container">
      <group
        label-width="11rem"
        label-align="left"
      >
        <selector 
          :title="$t('systemlanguage')"
          :options="localeList"
          direction="rtl"
          @on-change="onLocaleChange"
          v-model="locale">
        </selector>
      </group>
    </div>
  </div>
</template>

<script>
import { Selector } from 'vux'
import { storage } from '@/utils'

export default {
  name: 'setting',
  data () {
    return {
      locale: 'zh-cn',
      localeList: [{
        key: 'zh-cn',
        value: '中文'
      }, {
        key: 'en',
        value: 'English'
      }]
    }
  },
  components: {
    Selector
  },
  created () {
    this.locale = this.$i18n.locale()
  },
  computed: {
  },
  methods: {
    onLocaleChange (locale) {
      storage({
        type: 'set',
        key: 'locale',
        val: locale
      })
      this.$i18n.set(locale)
    }
  },
  watch: {
  },
  beforeDestroy () {
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../assets/styles/colors.less';
@import '../../assets/styles/helpers.less';
@import '~vux/src/styles/close';

.setting {
  .question-icon {
    width: 1.4rem;
    height: 1.4rem;
    vertical-align: text-top;
  }
}
</style>
