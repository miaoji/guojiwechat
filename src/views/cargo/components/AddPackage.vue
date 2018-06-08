<template>
  <div class="addPackage">
    <div class="cargo-item-add-package" @click="modal_show = true">添加包裹</div>
    <div class="addPackage-modal" v-show="modal_show">
      <div class="addPackage-modal-title">添加包裹</div>
      <group label-width="7rem" label-align="left">
        <x-input title="品名" v-model="form.orderName" placeholder="请填写品名"></x-input>
        <x-input title="价值(RMB)" v-model="form.totalFee" placeholder="请填写包裹价值(¥2000以内)"></x-input>
        <cell
          title="快递公司"
          is-link
          :value="company.companyName"
          @click.native="selectExpressShow = true"
        />
        <x-input title="单号" v-model="form.cnNo" placeholder="请填写国内单号(9~23位)"></x-input>
      </group>
      <div class="instructions">
        <img src="../../../assets/images/tips.png"/>  你的包裹提交后,请关注包裹的入库信息,需要您合并包裹后才会从中转仓库发出!
      </div>
      <div class="addPackage-modal-footer">
        <div class="addPackage-modal-footer-cancel"><span @click="modal_show = false">取消</span></div>
        <div class="addPackage-modal-footer-add"><span @click="addPackage({type: true})">连续添加</span></div>
        <div class="addPackage-modal-footer-add"><span @click="addPackage({type: false})">添加</span></div>
      </div>
    </div>
    <!-- 选择快递公司 -->
    <div class="select-box" v-if="selectExpressShow">
      <select-box
        :show="selectExpressShow"
        type="cargo"
        defaultName="顺丰"
        @listenBoxClose="onExpressClose"
        @listenBoxConfirm="onExpressConfirm"
      />
    </div>
  </div>
</template>

<script>
import { XInput, Group, Cell } from 'vux'
import { storage } from '@/utils'
import SelectBox from '@/components/SelectBox'
import { save } from '@/services/cargo'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'addPackage',
  components: {
    XInput,
    Group,
    SelectBox,
    Cell
  },
  data () {
    return {
      modal_show: false,
      form: {},
      selectExpressShow: false,
      company: {},
      addressId: 0
    }
  },
  computed: {
    ...mapGetters([
      'getReceiveAddressesId'
    ])
  },
  props: {
  },
  created () {
    this.addressId = storage({key: 'cargo_pickupaddress'}) ? JSON.parse(storage({key: 'cargo_pickupaddress'})).id : ''
    if (!this.addressId) {
      this.getDefaultAddr()
    }
  },
  methods: {
    ...mapActions(['getDefaultAddr']),
    onExpressClose () {
      this.selectExpressShow = false
    },
    onExpressConfirm (val) {
      this.selectExpressShow = false
      this.company = val
    },
    handleReset () {
      this.company = {}
      this.form = {
        orderName: '',
        cnNo: '',
        totalFee: ''
      }
    },
    async addPackage ({ type }) {
      const data = await save({
        orderName: this.form.orderName,
        cnNo: this.form.cnNo,
        kdCompanyCodeCn: this.company.companyCode,
        totalFee: Number(this.form.totalFee) * 100,
        type: 1
      }, {
        receiveAddrId: this.addressId || this.getReceiveAddressesId
      })
      if (data.code === 200) {
        if (!type) {
          this.modal_show = false
        }
        this.$vux.toast.show({
          type: 'success',
          text: '新增成功'
        })
        this.handleReset()
      }
    }
  }
}
</script>

<style lang="less" scoped>
@btn: #ffa414;

.addPackage {
  width: 8rem;
  height: 3rem;
  background-color: @btn;
  border-radius: 3px;
  line-height: 3rem;
  margin: auto;
  padding: 0 3rem;
  .select-box {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    z-index: 456788;
  }
  .cargo-item-add-package {
    color: #fff;
  }
  &-modal {
    .weui-cell {
      text-align: left;
    }
    width: 25rem;
    height: 29rem;
    position: absolute;
    left:0;
		right:0;
		top:0;
		bottom:0;
		margin:auto;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 5px #000;
    z-index: 999;
    &-title {
      margin-top: 20px;
      font-size: 1.6rem;
    }
    .instructions {
      img {
        width: 1rem;
        height: 1rem;
        padding-top: 0.2rem;
      }
      overflow: hidden;
      color: #ffa414;
      line-height: 1.4em;
      text-align: left;
      padding: 0 14px;
    }
    &-footer {
      display: flex;
      margin-top: 10px;
      &-add {
        flex: 1;
        span {
          color: #fff;
          background-color: #ffa414;
          padding: 5px 10px;
          border-radius: 3px;
        }
      }
      &-cancel {
        flex: 1;
        span {
          color: #fff;
          background-color: #8e38bf;
          padding: 5px 10px;
          border-radius: 3px;
        }
      }
    }
  }
}
</style>
