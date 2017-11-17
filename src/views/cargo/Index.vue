<template>
  <div class="cargo">
    <div class="cargo-container" v-show="!selectExpressShow">
      <jag-container>
        <div slot="content" class="content">
          <!-- 顶部寄件列表点击跳转 -->
          <router-link to="/order/list">
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
                  <div class="address-info--line">
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
                </div>
                <div class="address-link">
                  <img src="../../assets/images/sen_ico_com.png" alt="地址簿">
                </div>
              </div>
            </div>
          </router-link>
          <!-- 订单配置选择 -->
          <div class="options">
            <group label-width="8rem" label-align="left">
              <cell
                title="客户编号"
                value="MZA10240111001"
              >
              </cell>
              <cell>
                <template slot="title">
                  <div class="question-icon">
                    <span>中转地址</span>
                    <img src="../../assets/images/question.png">
                  </div>
                </template>
                <template slot="value">
                  <Load-toshow
                    title="中转地址"
                    :ajaxFunc="transferService"
                    :query="{
                      isDefault: 1
                    }"
                    :dataLevel="[['obj', ['0', [['provinces', ['province']], 'transferAddress']]]]"
                  >
                  </Load-toshow>
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
            <div class="question-icon" @click.stop='packagePromptInfoShow = true'>
              <span>
                包裹报关
              </span>
              <img src="../../assets/images/question.png" />
            </div>
            <div @click.stop="packageShow = true">
              <button type="">点击添加</button>
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
                    <input type="text" v-model="item['companyName']">
                  </td>
                  <td>
                    <input type="text" v-model="item['cnNo']">
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <tips 
            v-show="packageTable.length > 0"
            content="长按删除"
          >
          </tips>
          <!-- 提交按钮 -->
          <div class="submit">
            <button class="submit-btn" @click.stop="submitOrder">提交</button>
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
            <x-input title="品名" placeholder="请填写包裹名字" type="text" v-model="newPackage['orderName']" required></x-input>
            <x-input title="价值/元" placeholder="请填写包裹价值" lang="en" type="tel" name="tel" v-model="newPackage['totalFee']" required></x-input>
            <x-input
              title="快递公司"
              placeholder="点击选择快递公司"
              v-model="newPackage['companyName']"
              @click.native="onClickExSelect"
            >
            </x-input>
            <x-input title="国内单号" type="text" v-model="newPackage['cnNo']"></x-input>
          </group>
          <div class="pdialog-form__confrim">
            <button type="" class="pdialog-form__confrim--cancle" @click="packageShow = false">取消</button>
            <button type="" class="pdialog-form__confrim--sure" @click="addPackge">完成</button>
          </div>
        </div>
        <tips
          content="您的快递可能合并成普货和特货走不同渠道"
        >
        </tips>
      </x-dialog>
    </div>
    <!-- 选择快递公司 -->
    <select-box
      :show="selectExpressShow"
      type="pickup"
      countryName="顺丰"
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
import LoadToshow from '@/components/LoadToshow'
import Line from './components/Line'
import { getAddress, storage } from '@/utils'
import * as receiveAddrService from '@/services/receiveAddr'
import * as transferAddrService from '@/services/transferAddr'
import { save as saveCargo } from '@/services/cargo'

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
  data () {
    return {
      dataInCache: [
        {
          name: 'orderOptions',
          needJudge: 0
        }
      ],
      isSubmit: false,
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
      pickupCountryId: null,
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
      this.pickupCountryId = this.pickupAddress['countryId'] || 0
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
    packages () {
      const packageTable = this.packageTable
      const _this = this
      return packageTable.map(function (elem) {
        delete elem.companyName
        return {
          ...elem,
          wxUserId: storage({
            key: 'userId'
          }),
          receiverCountry: _this.pickupAddress['country']
        }
      })
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
    /**
     * [添加包裹]
     */
    addPackge () {
      const _this = this
      let complete = []
      Object.keys(_this.newPackage).forEach(function (key) {
        if (!_this.newPackage[key] && key !== 'cnNo' && key !== 'kdCompanyCodeCn') {
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
      this.packageShow = false
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
          receiveAddrId: this.pickupCountryId
        })
        if (saveRes.code === 200) {
          this.$router.push({
            path: '/cargo/list'
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
        this.$vux.loading.hide()
      }
    },
    onClickExSelect () {
      this.selectExpressShow = true
      this.packageShow = false
    },
    onExpressClose () {
      this.selectExpressShow = false
      this.packageShow = true
    },
    onExpressConfirm (val) {
      this.newPackage['kdCompanyCodeCn'] = val['companyCode']
      this.newPackage['companyName'] = val['companyName']
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
      .transfer {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 1rem 0;
        margin: 0 1rem;
        font-size: 1.4rem;
        text-align: left;
        border-bottom: 1px solid #dedede;
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
        button {
          color: @m-yellow;
          border: 1px solid @m-yellow;
          border-radius: 3px;
          padding: .1rem .3rem;
          background: transparent;
        }
      }
      &__table {
        padding: .5rem 0;
        border: 1px solid #dedede;
        border-left-width: 0;
        border-right-width: 0;
        table {
          font-size: @normal-size;
          width: 100%;
          thead {
            color: @greyfont;
            th {
              font-weight: 100;
            }
          }
          tr {
            td {
              padding: .3rem 0;
              line-height: 2rem;
              font-size: @normal-size;
              overflow: hidden;
              max-width: 4rem;
              white-space: nowrap;
              text-overflow: ellipsis;
              input {
                width: 3.9rem;
                text-align: center;
                border: none;
                background: transparent;
              }
            }
          }
        }
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
      .submit {
        padding: 1rem 0rem;
        text-align: center;
        overflow: hidden;
        &-btn {
          color: white;
          border: none;
          padding: 1rem 0;
          font-size: 1.6rem;
          width: 100%;
          background-color: @m-yellow;
          border: none;
          border-radius: 5px;
        }
      }
    }
  }
}
</style>
