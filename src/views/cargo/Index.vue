<template>
  <div class="cargo">
    <div class="cargo-container" v-show="!selectExpressShow">
      <jag-container>
        <div slot="content" class="content">
          <!-- 顶部寄件列表点击跳转 -->
          <router-link to="/cargo/list">
            <div class="list">
              <div class="list-intro">
                <img slot="icon" class="order-icon" src="../../assets/images/send_list_icon.png" />
                <span>{{'cargo.list' | translate}}</span>
              </div>
              <div class="list-icon">
                <img slot="icon" src="../../assets/images/sen_ico_lis.png" />
              </div>
            </div>
          </router-link>
          <purple-line></purple-line>
          <!-- 收件地址选择 -->
          <router-link to="/address?type=pickup&pick=1&tabshow=0&ordertype=cargo">
            <div class="address">
              <div class="common-padding">
                <div class="address-icon">
                  <span class="bgblack">{{'pickS' | translate}}</span>
                </div>
                <div class="address-info">
                  <div v-show="!pickupAddress['name']" style="color: #666;">
                    {{$t('business.clicktoselectpickupaddr')}}
                  </div>
                  <div class="address-info--line" v-show="pickupAddress['name']">
                    <div>
                      <span>
                        {{pickupAddress['name']}}&nbsp;&nbsp;
                      </span>
                      <span class="address-info">
                        {{pickupAddress['mobile']}}    
                      </span>
                    </div>
                  </div>
                  <p class="address-info--detail">
                   {{pickupAddress['country']}}{{pickupAddress['province']}}{{pickupAddress['city']}}{{pickupAddress['county']}}{{pickupAddress['address']}}
                  </p>
                  <tips :content="'business.defaultaddresstips' | translate" v-show="isDefaultAddr"></tips>
                </div>
                <div class="address-link">
                  <img src="../../assets/images/sen_ico_com.png" alt="地址簿">
                </div>
              </div>
            </div>
          </router-link>
          <!-- 订单配置选择 -->
          <div class="options">
            <group label-width="6rem" label-align="left">
              <cell
                :title="$t('business.customerno')"
                :value="userinfo.customerNo"
              >
              </cell>
              <cell>
                <template slot="title">
                  <div class="question-icon">
                    <span>{{$t('business.transferaddr')}}</span>
                  </div>
                </template>
                <template slot="default">
                  <Load-toshow
                    :title="$t('business.transferaddr')"
                    :ajaxFunc="transferService"
                    :query="{
                      isDefault: 1
                    }"
                    mod="show"
                    :dataLevel="[
                      ['obj', 
                        ['0',
                          [
                            ['provinces', ['province']],
                            'transferAddress', 
                            'transferName',
                            'transferMobile'
                          ]
                        ]
                      ]
                    ]"
                    @listenAjaxDone="handleTransferAddr"
                  >
                  </Load-toshow>
                  <div class="transfer-tips">
                    <p id="transferAddr" style="height: 0;width: 0;font-size: 0;">{{transferAddr}}</p>
                    <tips>
                      <template slot="content">
                        <p>
                          <img src="../../assets/images/tips.png" alt="tips">
                            {{$t('business.transferaddrtips')}}
                          <span class="copyTransfer" id="copyTransfer" data-clipboard-target="#transferAddr">
                            {{$t('click.copy')}}
                          </span>
                        </p>
                      </template>
                    </tips>
                  </div>
                </template>
              </cell>
            </group>
          </div>
        </div>
      </jag-container>
      <p class="intro-p" style="padding-bottom: 1rem;">{{$t('business.packagedetail')}}</p>
      <jag-container>
        <div slot="content" class="packages">
          <div class="packages__title">
            <div class="question-icon">
              <span>
                {{$t('business.packagedetail')}}
              </span>
            </div>
            <div @click.stop="handlePackageShow">
              <button type="" class="pay">{{'click.add' | translate}}</button>
            </div>
          </div>
          <div class="packages__table">
            <table>
              <thead>
                <tr>
                  <th>{{$t('business.productname')}}</th>
                  <th>{{$t('value')}}/{{$t('rmb')}}</th>
                  <th>{{$t('business.expresscom')}}</th>
                  <th>{{$t('business.chineseorderno')}}</th>
                </tr>
              </thead>
              <tbody class="packageitem">
                <tr v-for="item, index in packageTable" :key="index">
                  <td>
                    {{item['orderName']}}
                  </td>
                  <td>
                    {{item['totalFee']}}
                  </td>
                  <td>
                    {{item['companyName']}}
                  </td>
                  <td>
                    {{item['cnNo']}}
                  </td>
                  <td class="tools">
                    <button type="" class="pay" @click="delTableItem(index)">  {{$t('delete')}}
                    </button>
                    <button type="" class="pay" @click="editTableItem(item, index)">
                      {{$t('edit')}}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-show="packageTable.length > 0" class="package-tips">
            <tips :content="$t('leftdeleteandedit')"></tips>
            <tips :content="$t('business.presentpackagenumber', {'num': packageTableLength})"></tips>
          </div>
          <!-- 提交按钮 -->
          <div class="submit-btn">
            <button class="normal" @click.stop="submitOrder">提交</button>
          </div>
        </div>
      </jag-container>
    </div>
    <!-- 包裹弹框 新增 -->
    <div v-transfer-dom>
      <x-dialog v-model="packageShow" class="pdialog">
        <h1>添加包裹</h1>
        <div class="package-close" @click="packageShow = false">
          <span class="vux-close"></span>
        </div>
        <div class="pdialog-form">
          <group label-width="7rem" label-align="left">
            <x-input title="品名" placeholder="请填写品名" type="text" v-model="newPackage['orderName']" required></x-input>
            <!-- 2000以内 -->
            <x-input title="价值/元" type="number" placeholder="请填写价值(￥2000以内)" lang="en" name="tel" v-model="newPackage['totalFee']" required></x-input>
            <x-input
              title="快递公司"
              placeholder="点击选择快递公司"
              v-model="newPackage['companyName']"
              @click.native="onClickExSelect"
            >
            </x-input>
            <!-- 9~23位 -->
            <x-input title="国内单号" placeholder="请填写国内单号(9~23位)" type="text" v-model="newPackage['cnNo']"></x-input>
          </group>
          <tips
            :content="$t('business.presentpackagenumber', {'num': packageTableLength})"
          >
          </tips>
          <tips
            content="您的快递可能合并成普货和特货走不同渠道，最多添加50件"
          >
          </tips>
          <div class="pdialog-form__confrim">
            <button type="" class="pdialog-form__confrim--sure" @click="addPackge(true)">{{$t('save')}}</button>
            <button type="" class="pdialog-form__confrim--cancle" @click="addPackge(false)">{{$t('add')}}</button>
          </div>
        </div>
      </x-dialog>
    </div>
    <!-- 包裹弹框 修改新增 -->
    <div v-transfer-dom>
      <x-dialog v-model="packageShowEdit" class="pdialog">
        <h1>{{$t('business.editpackage')}}</h1>
        <div class="package-close" @click="packageShowEdit = false">
          <span class="vux-close"></span>
        </div>
        <div class="pdialog-form">
          <group label-width="7rem" label-align="left">
            <x-input 
              :title="$t('business.productname')" 
              :placeholder="$t('business.productnametips')" 
              type="text" 
              v-model="editPackage['orderName']" 
              required></x-input>
            <!-- 2000以内 -->
            <x-input 
              :title="$t('business.price')" 
              :placeholder="$t('cargo.pricetips')"
              type="number"
              lang="en" 
              name="tel" 
              v-model="editPackage['totalFee']" 
              required></x-input>
            <x-input
              :title="$t('business.expresscom')"
              :placeholder="$t('business.selectexpresscom')"
              v-model="editPackage['companyName']"
              @click.native="onClickExSelect"
            >
            </x-input>
            <!-- 9~23位 -->
            <x-input
              :title="$t('business.chineseordernoslim')"
              :placeholder="$t('cargo.chinanotips')"
              type="text"
              v-model="editPackage['cnNo']"></x-input>
          </group>
          <div class="pdialog-form__confrim">
            <button type="" class="pdialog-form__confrim--sure" @click="editSave">
              {{$t('saveedit')}}
            </button>
          </div>
        </div>
      </x-dialog>
    </div>
    <!-- 选择快递公司 -->
    <select-box
      :show="selectExpressShow"
      type="pickup"
      defaultName="顺丰"
      @listenBoxClose="onExpressClose"
      @listenBoxConfirm="onExpressConfirm"
    >
    </select-box>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { Selector, XInput, PopupPicker, XDialog, TransferDomDirective as TransferDom } from 'vux'
import JagContainer from '@/components/JagContainer'
import Tips from '@/components/Tips'
import SelectBox from '@/components/SelectBox'
import LoadToshow from '@/components/load/WithService'
import Line from './components/Line'
import { getAddress, storage, cache as cacheUtil, isOrderNo } from '@/utils'
import { bindSwiper, removeClass } from '@/utils/swiper'
import * as receiveAddrService from '@/services/receiveAddr'
import * as transferAddrService from '@/services/transferAddr'
import { save as saveCargo } from '@/services/cargo'
import Clipboard from 'clipboard'

export default {
  name: 'cargo',
  directives: {
    TransferDom
  },
  components: {
    Selector,
    PopupPicker,
    XInput,
    XDialog,
    JagContainer,
    Tips,
    SelectBox,
    LoadToshow,
    'purple-line': Line
  },
  mounted () {
    // 复制按钮
    const _this = this
    const clipboard = new Clipboard('#copyTransfer')
    clipboard.on('success', function (e) {
      _this.$vux.toast.show({
        text: '复制成功',
        type: 'success',
        time: 600,
        width: '18rem'
      })
      e.clearSelection()
    })
    clipboard.on('error', function (e) {
      _this.$vux.toast.show({
        text: '复制失败',
        type: 'warn',
        width: '18rem'
      })
    })
  },
  data () {
    return {
      dataInCache: [
        {
          name: 'newPackage',
          needJudge: 0
        },
        {
          name: 'packageTable',
          needJudge: 0
        }
      ],
      isSubmit: false,
      isDefaultAddr: false,
      transferRes: {},
      pickupAddress: {
        countryId: '',
        name: '',
        mobile: '',
        address: '',
        country: '',
        province: '',
        city: '',
        county: ''
      },
      pickupId: null,
      packageTable: [],
      newPackage: {
        orderName: '',
        totalFee: '',
        kdCompanyCodeCn: '',
        companyName: '',
        cnNo: ''
      },
      packageShow: false,
      packageShowEdit: false,
      dialogType: 'add',
      editPackage: {
        index: '',
        orderName: '',
        totalFee: '',
        kdCompanyCodeCn: '',
        companyName: '',
        cnNo: ''
      },
      // 控制快递公司选择插件展示
      selectExpressShow: false
    }
  },
  async created () {
    try {
      window.scrollTo(0, 0)
      this.$vux.loading.show()
      // 创建时将SET_PAGE创建为consolidation
      this.$store.commit('SET_PAGE', {page: 'cargo'})
      await this.getPickupAddress()
      this.pickupId = this.pickupAddress['id'] || 0
      // 从localStorage中获取存储的用户习惯信息, 将可以直接赋值的赋值到this
      const dataInCache = this.dataInCache
      cacheUtil.setCacheToData.apply(this, [dataInCache, 'cargo_info'])
      if (!this.packageTable) {
        this.packageTable = []
      }
      setTimeout(function () {
        bindSwiper('.packageitem tr', 'swipeleft')
      }, 500)
    } catch (e) {
      console.error(e)
    } finally {
      this.$vux.loading.hide()
    }
  },
  computed: {
    ...mapGetters({
      userid: 'getUserId',
      userinfo: 'getUserInfo'
    }),
    transferService () {
      return transferAddrService.query
    },
    transferAddr () {
      try {
        const transferRes = this.transferRes
        let res = transferRes['obj'][0]
        res = [
          (res['provinces']['province'] + res['cities']['city'] + res['districts']['district'] + res['transferAddress'] + this.userinfo['customerNo']),
          res['transferName'],
          res['transferMobile']
        ]
        return res.join(',')
      } catch (err) {
        return ''
      }
    },
    packages () {
      const packageTable = this.packageTable
      const _this = this
      return packageTable.map(function (elem) {
        delete elem.companyName
        elem.totalFee = elem.totalFee * 100
        return {
          ...elem,
          type: 1,
          wxUserId: _this.userid,
          receiverCountry: _this.pickupAddress['country']
        }
      })
    },
    packageTableLength () {
      const len = this.packageTable.length
      return len || 0
    }
  },
  methods: {
    ...mapActions([
      'setCargoList'
    ]),
    /**
     * [从localStorage中获取选取的收件地址，没有的话则获取默认的收件地址]
     * no return
     */
    async getPickupAddress () {
      try {
        const pickupAddress = await getAddress({
          type: 'pickup',
          storageKey: 'cargo_pickupaddress',
          apiService: receiveAddrService.show,
          userid: this.userid
        })
        if (pickupAddress) {
          this.pickupAddress = pickupAddress
        }
        const isStorage = storage({
          key: 'cargo_pickupaddress'
        })
        if (!isStorage && pickupAddress) {
          this.isDefaultAddr = true
        }
      } catch (e) {
        console.error(e)
      }
    },
    delTableItem (index) {
      this.packageTable.splice(index, 1)
      removeClass('.packageitem tr', 'swipeleft')
    },
    editTableItem (item, index) {
      this.editPackage = {...item, index}
      this.packageShowEdit = true
      this.dialogType = 'edit'
    },
    async editSave () {
      // 价值不能低于0
      const totalFee = Number(this.editPackage['totalFee'])
      if (isNaN(totalFee)) {
        this.$vux.toast.show({
          type: 'warn',
          text: '包裹价值出错',
          width: '19rem'
        })
        return
      }
      if (totalFee < 0) {
        this.$vux.toast.show({
          type: 'warn',
          text: '包裹价值不能小于0',
          width: '19rem'
        })
        return
      }
      // 价值不能超过2000
      if (totalFee > 2000) {
        this.$vux.toast.show({
          type: 'warn',
          text: '包裹价值不能超过2000',
          width: '19rem'
        })
        return
      }
      // 单号为9到23位
      if (this.editPackage['cnNo']) {
        const cnNoLen = this.editPackage['cnNo'].length
        if (cnNoLen < 9 || cnNoLen > 23) {
          this.$vux.toast.show({
            type: 'warn',
            text: '单号长度要在9~23之间',
            width: '19rem'
          })
          return
        }
        // 单号要为正确单号
        try {
          const orderNo = this.editPackage['cnNo']
          this.$vux.loading.show()
          const orderRes = await isOrderNo(orderNo)
          if (orderRes['type'] !== 'success') {
            return this.$vux.toast.show(orderRes)
          }
        } catch (e) {
          console.error(e)
        } finally {
          this.$vux.loading.hide()
        }
      }
      const _this = this
      let complete = []
      Object.keys(_this.editPackage).forEach(function (key) {
        if (!_this.editPackage[key] && key !== 'cnNo' && key !== 'index' && key !== 'companyName' && key !== 'kdCompanyCodeCn') {
          complete.push(false)
        } else {
          complete.push(true)
        }
      })
      if (complete.includes(false)) {
        _this.$vux.toast.show({
          type: 'warn',
          text: '请将信息填写完整',
          width: '16rem',
          time: '600'
        })
        return
      }
      const index = this.editPackage['index']
      delete this.editPackage['index']
      this.packageTable[index] = this.editPackage
      this.editPackage = {
        orderName: '',
        totalFee: '',
        kdCompanyCodeCn: '',
        cnNo: ''
      }
      this.packageShowEdit = false
      removeClass('.packageitem tr', 'swipeleft')
    },
    handleTransferAddr (val) {
      this.transferRes = val
      this.transferRes['done'] = true
    },
    /**
     * [处理点击添加包裹按钮的方法]
     */
    handlePackageShow () {
      // 超出50个包裹，不允许再加
      if (this.packageTable.length >= 50) {
        this.$vux.toast.show({
          type: 'warn',
          text: '集运最多添加50包裹',
          width: '16rem'
        })
        this.packageShow = false
        return false
      }
      this.dialogType = 'add'
      this.packageShow = true
      return true
    },
    /**
     * [添加包裹]
     */
    async addPackge (isClose = true) {
      if (!this.handlePackageShow()) {
        return
      }
      // 价值不能低于0
      const totalFee = Number(this.newPackage['totalFee'])
      if (isNaN(totalFee)) {
        this.$vux.toast.show({
          type: 'warn',
          text: '包裹价值出错',
          width: '19rem'
        })
        return
      }
      if (totalFee < 0) {
        this.$vux.toast.show({
          type: 'warn',
          text: '包裹价值不能小于0',
          width: '19rem'
        })
        return
      }
      // 价值不能超过2000
      if (totalFee > 2000) {
        this.$vux.toast.show({
          type: 'warn',
          text: '包裹价值不能超过2000',
          width: '19rem'
        })
        return
      }
      // 单号为9到23位
      if (this.newPackage['cnNo']) {
        const cnNoLen = this.newPackage['cnNo'].length
        if (cnNoLen < 9 || cnNoLen > 23) {
          this.$vux.toast.show({
            type: 'warn',
            text: '单号长度要在9~23之间',
            width: '19rem'
          })
          return
        }
        // 单号要为正确单号
        try {
          const orderNo = this.newPackage['cnNo']
          this.$vux.loading.show()
          const orderRes = await isOrderNo(orderNo)
          if (orderRes['type'] !== 'success') {
            return this.$vux.toast.show(orderRes)
          }
        } catch (e) {
          console.error(e)
        } finally {
          this.$vux.loading.hide()
        }
      }
      const _this = this
      let complete = []
      Object.keys(_this.newPackage).forEach(function (key) {
        if (!_this.newPackage[key] && key !== 'cnNo' && key !== 'companyName' && key !== 'kdCompanyCodeCn') {
          complete.push(false)
        } else {
          complete.push(true)
        }
      })
      if (complete.includes(false)) {
        _this.$vux.toast.show({
          type: 'warn',
          text: '请将信息填写完整',
          width: '16rem',
          time: '600'
        })
        return
      }
      this.newPackage['totalFee'] = Number(this.newPackage['totalFee'])
      this.packageTable.push(this.newPackage)
      this.newPackage = {
        orderName: '',
        totalFee: '',
        kdCompanyCodeCn: '',
        cnNo: ''
      }
      this.packageShow = !isClose
      setTimeout(function () {
        bindSwiper('.packageitem tr', 'swipeleft')
      }, 500)
    },
    /**
     * [提交集运订单，成功后跳转到详细页面]
     * no return
     */
    async submitOrder () {
      try {
        if (!this.pickupId) {
          this.$vux.toast.show({
            text: '请先选择收件地址',
            type: 'warn',
            width: '18rem'
          })
          return
        }
        if (this.packages.length < 1) {
          this.$vux.toast.show({
            text: '请填写至少一个包裹',
            type: 'warn',
            width: '16rem'
          })
          return
        }
        if (this.isSubmit) {
          this.$vux.toast.show({
            text: '请勿重复提交',
            type: 'warn',
            width: '16rem'
          })
          return
        }
        this.$vux.loading.show()
        this.isSubmit = true
        const saveRes = await saveCargo(this.packages, {
          receiveAddrId: this.pickupId
        })
        if (saveRes.code === 200) {
          this.clearForm()
          await this.setCargoList({
            page: 1,
            rows: 150
          })
          this.$router.push({
            path: '/cargo/list',
            query: {type: 'waitcargo'}
          })
        } else {
          this.$vux.toast.show({
            text: saveRes.msg || '请求失败',
            type: 'warn',
            width: '18rem'
          })
        }
      } catch (err) {
        console.error(err)
      } finally {
        this.isSubmit = false
        this.$vux.loading.hide()
      }
    },
    clearForm () {
      this.packageTable = []
      this.pickupAddress = {
        countryId: '',
        name: '',
        mobile: '',
        address: '',
        country: '',
        province: '',
        city: '',
        county: ''
      }
      storage({
        type: 'remove',
        key: 'cargo_pickupaddress'
      })
    },
    onClickExSelect () {
      this.footerHide()
      this.selectExpressShow = true
      if (this.dialogType === 'add') {
        this.packageShow = false
      } else {
        this.packageShowEdit = false
      }
    },
    onExpressClose () {
      this.footerShow()
      this.selectExpressShow = false
      if (this.dialogType === 'add') {
        this.packageShow = true
      } else {
        this.packageShowEdit = true
      }
    },
    onExpressConfirm (val) {
      this.footerShow()
      if (this.dialogType === 'add') {
        this.newPackage['kdCompanyCodeCn'] = val['companyCode']
        this.newPackage['companyName'] = val['companyName']
      } else {
        this.editPackage['kdCompanyCodeCn'] = val['companyCode']
        this.editPackage['companyName'] = val['companyName']
      }
    },
    footerHide () {
      const footer = window.document.getElementsByTagName('footer')
      footer[0].style.height = '0'
    },
    footerShow () {
      const footer = window.document.getElementsByTagName('footer')
      footer[0].style.height = 'auto'
    }
  },
  watch: {
  },
  beforeDestroy () {
    // 离开页面时在localStorage中保存产品规格，包裹信息
    const dataInCache = this.dataInCache
    cacheUtil.setDataToCache.call(this, dataInCache, 'cargo_info')
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../assets/styles/colors.less';
@import '../../assets/styles/vars.less';
@import '../../assets/styles/helpers.less';
@import '~vux/src/styles/close';

.cargo {
  &-container {
    .purple-bg;
    min-height: 92vh;
    padding: 10px;
    padding-top: 4vh;
    padding-bottom: 9rem;
    overflow: hidden;
    .content {
      background: white;
      .list {
        .flex;
        padding: 1rem 1rem;
        padding-top: 0;
        justify-content: space-between;
        &-intro {
          .flex;
          span {
            padding-left: 1rem;
            font-size: @normal-size;
            color: @m-yellow;
          }
          img {
            width: auto;
            height: 2.6rem;
          }
        }
        .list-icon {
          font-size: 0;
          img {
            width: auto;
            height: 2.6rem;
          }
        }
      }
      .address {
        .common-padding {
          .flex;
          padding: 1rem 0;
          margin: 0 1rem;
          justify-content: space-between;
          border-bottom: 1px solid #dedede;
        }
        font-size: @normal-size;
        background: white;
        &-icon {
          flex: 1;
          margin-right: 0.5rem;
          span {
            font-size: @normal-size;
            width: 2.6rem;
            height: 2.6rem;
            line-height: 2.6rem;
            display: block;
            border-radius: 50%;
            color: white;
          }
        }
        &-info {
          padding-left: .8rem;
          flex: 9;
          text-align: left;
          color: @grey-word;
          &--line {
            div {
              display: flex;
              align-items: center;
            }
          }
          &--detail {
            white-space: nowrap;
            max-width: 19rem;
            overflow: hidden;
            text-overflow: ellipsis;
            @media (max-width:320px) {
              width: 14rem;
            }
            @media (min-width:360px) {
              width: 20rem;
            }
            @media (min-width:400px) {
              width: 26rem;
            }
          }
        }
        &-link {
          flex: 1;
          padding: 0 0;
          font-size: 0;
          img {
            width: 2.6rem;
          }
        }
      }
      .user-number {
        padding: 1rem 0;
        margin: 0 1rem;
        font-size: 1.4rem;
        text-align: left;
        border-bottom: 1px solid #dedede;
      }
      .transfer-tips {
        .copyTransfer {
          text-decoration: underline;
        }
      }
      .options {
        margin-right: 1rem;
        label {
          text-align: left;
          padding-left: .1rem;
          color: @greyfont;
        }
      }
    }
    .packages {
      background: white;
      padding: 10px 15px;
      &__title {
        .flex;
        padding-bottom: 1rem;
        justify-content: space-between;
        font-size: @normal-size;
      }
      &__money {
        text-align: center;
        color: @greyfont;
        padding-top: 10px;
        font-size: 1.5rem;
        span {
          color: @m-yellow;
        }
      }
    }
  }
}
</style>
