<template>
  <div class="addres">
    <div class="addres-left">
      收件地址
    </div>
    <div class="addres-right">
      <div class="addres-info" v-show="addressInfo !== {}">
        <div>{{addressInfo.COUNTRY_CN}},{{addressInfo.ADDRESS}},{{addressInfo.NAME}}</div>
      </div>
      <div class="addres-info" v-show="addressInfo === {}">
        请选择你的收件地址
      </div>
    </div>
    <div class="addres-icon">
      <router-link to="/address?type=pickup&pick=1&tabshow=0&ordertype=cargo">
        <img src="../../../assets/images/cargo_update.png" alt="">
      </router-link>
    </div>
  </div>
</template>

<script>
import { storage } from '@/utils'
import { show } from '@/services/receiveAddr'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'addres',
  props: {
  },
  data () {
    return {
      addressId: '',
      addressInfo: {}
    }
  },
  computed: {
    ...mapGetters([
      'getReceiveAddressesId'
    ])
  },
  watch: {
    getReceiveAddressesId (val) {
      this.getAddresInfo({id: val})
    }
  },
  created () {
    this.addressId = storage({key: 'cargo_pickupaddress'}) ? JSON.parse(storage({key: 'cargo_pickupaddress'})).id : ''
    if (!this.addressId) {
      this.getDefaultAddr()
    } else {
      this.getAddresInfo({id: this.addressId})
    }
  },
  methods: {
    ...mapActions(['getDefaultAddr']),
    async getAddresInfo ({id}) {
      const data = await show({id})
      if (data.code === 200 && data.obj) {
        this.addressInfo = data.obj
      }
    }
  }
}
</script>

<style lang="less" scoped>
.addres-box {
  padding: 10px;
}
.addres {
  margin: auto;
  display: flex;
  align-items: center;
  &-left {
    flex: 1;
  }
  &-right {
    flex: 4;
    text-align: right;
    .addres-info {
      text-align: center;
      color: #333;
    }
  }
  &-icon {
    flex: 1;
    img {
      width: 3rem;
      height: 3rem;
    }
  }
}
</style>
