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
                <span>集运列表</span>
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
                  <span class="bgblack">收</span>
                </div>
                <div class="address-info">
                  <div v-show="!pickupAddress['name']" style="color: #666;">
                    点击选择收件地址
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
                  <tips content="此为默认地址，系统自动选择" v-show="isDefaultAddr"></tips>
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
                title="客户编号"
                :value="customerNo"
              >
              </cell>
              <cell>
                <template slot="title">
                  <div class="question-icon">
                    <span>中转地址</span>
                  </div>
                </template>
                <template slot="value">
                  <Load-toshow
                    title="中转地址"
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
                          用户电商平台下单地址
                          <span class="copyTransfer" id="copyTransfer" data-clipboard-target="#transferAddr">点击复制</span>
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
      <p class="intro-p" style="padding-bottom: 1rem;">包裹报关</p>
      <jag-container>
        <div slot="content" class="packages">
          <div class="packages__title">
            <div class="question-icon">
              <span>
                包裹报关
              </span>
            </div>
            <div @click.stop="handlePackageShow">
              <button type="" class="pay">点击添加</button>
            </div>
          </div>
          <div class="packages__table">
            <table>
              <thead>
                <tr>
                  <th>品名</th>
                  <th>价值/元</th>
                  <th>快递公司</th>
                  <th>国内段单号</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item, index in packageTable" @touchstart="longTap(index, $event)">
                  <td>
                    <input type="text" v-model="item['orderName']">
                  </td>
                  <td>
                    <input type="texts" v-model="item['totalFee']">
                  </td>
                  <td>
                    {{item['companyName']}}
                  </td>
                  <td>
                    <input type="text" v-model="item['cnNo']">
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-show="packageTable.length > 0" class="package-tips">
            <tips :content="'长按删除，快递公司不可修改，' + packageTableLength"></tips>
          </div>
          <!-- 提交按钮 -->
          <div class="submit-btn">
            <button class="normal" @click.stop="submitOrder">提交</button>
          </div>
        </div>
      </jag-container>
    </div>
    <!-- 包裹弹框 -->
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
            <x-input title="价值/元" placeholder="请填写价值" lang="en" type="tel" name="tel" v-model="newPackage['totalFee']" required></x-input>
            <x-input
              title="快递公司"
              placeholder="点击选择快递公司"
              v-model="newPackage['companyName']"
              @click.native="onClickExSelect"
            >
            </x-input>
            <!-- 9~23位 -->
            <x-input title="国内单号" type="text" v-model="newPackage['cnNo']"></x-input>
          </group>
          <tips
            content="您的快递可能合并成普货和特货走不同渠道，最多添加50件"
          >
          </tips>
          <tips
            :content="packageTableLength"
          >
          </tips>
          <div class="pdialog-form__confrim">
            <button type="" class="pdialog-form__confrim--sure" @click="addPackge(true)">保存</button>
            <button type="" class="pdialog-form__confrim--cancle" @click="addPackge(false)">添加</button>
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
import { Selector, XInput, PopupPicker, XDialog, TransferDomDirective as TransferDom } from 'vux'
import JagContainer from '@/components/JagContainer'
import Tips from '@/components/Tips'
import SelectBox from '@/components/SelectBox'
import LoadToshow from '@/components/load/WithService'
import Line from './components/Line'
import { getAddress, storage, cache as cacheUtil } from '@/utils'
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
    /* eslint-disable no-new */
    new Clipboard('#copyTransfer')
  },
  data () {
    return {
      dataInCache: [
        {
          name: 'newPackage',
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
      customerNo: '',
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
      // 控制快递公司选择插件展示
      selectExpressShow: false
    }
  },
  async created () {
    try {
      this.$vux.loading.show()
      // 创建时将SET_PAGE创建为consolidation
      this.$store.commit('SET_PAGE', {page: 'cargo'})
      await this.getPickupAddress()
      this.pickupId = this.pickupAddress['id'] || 0
      // 从localStorage中获取存储的用户习惯信息, 将可以直接赋值的赋值到this
      const dataInCache = this.dataInCache
      cacheUtil.setCacheToData.apply(this, [dataInCache, 'cargo_info'])
      this.customerNo = storage({
        key: 'customerNo'
      })
    } catch (e) {
      console.error(e)
    } finally {
      this.$vux.loading.hide()
    }
  },
  computed: {
    transferService () {
      return transferAddrService.query
    },
    transferAddr () {
      try {
        const transferRes = this.transferRes
        let res = transferRes['obj'][0]
        res = res['provinces']['province'] + res['cities']['city'] + res['districts']['district'] + res['transferAddress'] + res['transferName'] + res['transferMobile']
        return res
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
          wxUserId: storage({
            key: 'userId'
          }),
          receiverCountry: _this.pickupAddress['country']
        }
      })
    },
    packageTableLength () {
      const len = this.packageTable.length
      return `当前包裹数量 ${len}`
    }
  },
  methods: {
    /**
     * [从localStorage中获取选取的收件地址，没有的话则获取默认的收件地址]
     * no return
     */
    async getPickupAddress () {
      try {
        const pickupAddress = await getAddress({
          type: 'pickup',
          storageKey: 'cargo_pickupaddress',
          apiService: receiveAddrService.show
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
    /**
     * [长按删除]
     * @param  {[type]} index  [description]
     * @param  {[type]} $event [description]
     * @return {[type]}        [description]
     */
    longTap (index, $event) {
      const _this = this
      function longPress () {
        _this.$vux.confirm.show({
          title: `确定删除这一行数据吗? (当前为第${index + 1}行)`,
          onCancel () {
          },
          onConfirm () {
            _this.packageTable.splice(index, 1)
          }
        })
      }
      const longTimer = setTimeout(longPress, 700)
      $event.target.ontouchend = () => {
        clearTimeout(longTimer)
      }
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
      this.packageShow = true
      return true
    },
    /**
     * [添加包裹]
     */
    addPackge (isClose = true) {
      if (!this.handlePackageShow()) {
        return
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
      this.packageTable.push(this.newPackage)
      this.newPackage = {
        orderName: '',
        totalFee: '',
        kdCompanyCodeCn: '',
        cnNo: ''
      }
      this.packageShow = !isClose
    },
    /**
     * [提交集运订单，成功后跳转到详细页面]
     * no return
     */
    async submitOrder () {
      try {
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
      this.packageShow = false
    },
    onExpressClose () {
      this.footerShow()
      this.selectExpressShow = false
      this.packageShow = true
    },
    onExpressConfirm (val) {
      this.footerShow()
      this.newPackage['kdCompanyCodeCn'] = val['companyCode']
      this.newPackage['companyName'] = val['companyName']
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
