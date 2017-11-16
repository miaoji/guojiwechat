<template>
  <div class="consolidation">
    <div class="consolidation-container">
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
          <router-link to="/address?type=pickup&pick=1&tabshow=0&ordertype=consolidation">
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
              <cell
                :value="transferDetail"
              >
                <template slot="title">
                  <span>
                    <span>中转地址</span>
                    <span class="question-icon">
                      <img src="../../assets/images/question.png">
                    </span>
                  </span>
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
            <div> 包裹报关 <span class="question-icon" @click='packagePromptInfoShow = true'><img src="../../assets/images/question.png"></span></div>
            <div @click="packageShow = true">
              <button type="" >点击添加</button>
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
                <tr v-for="item, index in packageTable">
                  <td>
                    <input type="text" v-model="item['nameCn']">
                  </td>
                  <td>
                    <input type="texts" v-model="item['totalFee']">
                  </td>
                  <td>
                    <input type="text" v-model="item['kdCompanyCodeCn']">
                  </td>
                  <td>
                    <input type="text" v-model="item['cnNo']">
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- 提交按钮 -->
          <div class="submit">
            <button class="submit-btn" @click.stop="submitOrder">提交</button>
          </div>
        </div>
      </jag-container>
    </div>
  </div>
</template>

<script>
import { Selector, XInput, PopupPicker, XDialog, TransferDomDirective as TransferDom } from 'vux'
import JagContainer from '@/components/JagContainer'
import Line from './components/Line'
import { getAddress } from '@/utils'
import * as receiveAddrService from '@/services/receiveAddr'
import * as transferAddrService from '@/services/transferAddr'
import { save as saveCargo } from '@/services/cargo'

export default {
  name: 'consolidation',
  directives: {
    TransferDom
  },
  components: {
    Selector,
    PopupPicker,
    XInput,
    XDialog,
    JagContainer,
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
      transferDetail: '',
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
      packageTable: [{
        totalFee: 22,
        kdCompanyCodeCn: 'asdsa',
        cnNo: '123456451'
      }, {
        totalFee: 22,
        kdCompanyCodeCn: 'asdsa',
        cnNo: '123456451'
      }]
    }
  },
  async created () {
    // 1. 创建时将SET_PAGE创建为consolidation
    this.$store.commit('SET_PAGE', {page: 'consolidation'})
    try {
      this.$vux.loading.show()
      // 2. 获取默认中转地址
      await this.getDefaultTransfer()
      // 3. 获取收件地址
      await this.getPickupAddress()
      // 4. 根据收件国家id获取包裹类型
      const pickupCountryId = this.pickupAddress['countryId']
      this.pickupCountryId = pickupCountryId || 0
    } catch (e) {
      console.error(e)
    } finally {
      this.$vux.loading.hide()
    }
  },
  computed: {
  },
  methods: {
    // 获取默认中转地址
    async getDefaultTransfer () {
      try {
        const result = await transferAddrService.query({
          isDefault: 1
        })
        const transfer = result.obj['0']
        const transferDetail = transfer['provinces']['province'] + transfer['transferAddress']
        this.transferDetail = transferDetail
      } catch (e) {
        console.error(e)
        this.transferDetail = e.msg || '获取中转地址失败'
      }
    },
    // 获取收件地址
    async getPickupAddress () {
      try {
        const pickupAddress = await getAddress({
          type: 'pickup',
          storageKey: 'consolidation_pickupaddress',
          apiService: receiveAddrService.show
        })
        if (pickupAddress) {
          this.pickupAddress = pickupAddress
        }
      } catch (e) {
        console.error(e)
      }
    },
    async submitOrder () {
      const saveRes = await saveCargo(this.packageTable, {
        receiveAddrId: this.pickupCountryId
      })
      console.log('saveCargo', saveRes)
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

.question-icon{
  width: 1.5rem;
  height: 1.5rem;
  position: relative;
  overflow: hidden;
  vertical-align: middle;
  img{
    width: 1.5rem;
    height: 1.5rem;
  }
}

.consolidation {
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
          .bgblack {
            background-color: #333;
          }
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
        .tips {
          img {
            width: 1.2rem;
            vertical-align: text-bottom;
          }
          color: @m-yellow;
          text-align: left;
          font-size: 1.2rem;
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
        font-size: 1.5rem;
        color: #2c3e50;
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
          font-size: 1.5rem;
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
              font-size: 1.2rem;
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
