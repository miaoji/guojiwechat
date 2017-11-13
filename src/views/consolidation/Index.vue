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
          <router-link to="/address?type=send&pick=1&tabshow=0">
            <div class="address">
              <div class="common-padding">
                <div class="address-icon">
                  <span class="bgblack">收</span>
                </div>
                <div class="address-info">
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
          <!-- 客户信息 -->
          <p class="user-number">客户编号: MZA10240111001</p>
        </div>
      </jag-container>
    </div>
  </div>
</template>

<script>
import { Selector, XInput, XDialog, TransferDomDirective as TransferDom, Cell } from 'vux'
import JagContainer from '../../components/JagContainer'
import Line from './components/Line'

export default {
  name: 'consolidation',
  directives: {
    TransferDom
  },
  components: {
    Selector,
    XInput,
    XDialog,
    Cell,
    JagContainer,
    'purple-line': Line
  },
  data () {
    return {
      dataInCache: [
        {
          name: 'orderOptions',
          needJudge: 0
        }, {
          name: 'pickupCountryId',
          needJudge: 1
        }, {
          name: 'remark',
          needJudge: 0
        }, {
          name: 'packageTable',
          needJudge: 0
        }, {
          name: 'packageType',
          needJudge: 1
        }, {
          name: 'isBack',
          needJudge: 0
        }, {
          name: 'productType',
          needJudge: 1
        }, {
          name: 'isOffer',
          needJudge: 0
        }, {
          name: 'offer',
          needJudge: 1
        }
      ],
      pickupAddress: {
        name: '',
        mobile: '',
        address: '',
        country: '',
        province: '',
        city: '',
        county: ''
      }
    }
  },
  async created () {
    // 1. 创建时将SET_PAGE创建为consolidation
    this.$store.commit('SET_PAGE', {page: 'consolidation'})
  },
  computed: {
  },
  methods: {
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

.div-btn-sub {
  padding: 1rem 0rem;
  text-align: center;
  overflow: hidden;
  .btn-sub {
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

.consolidation {
  &-container {
    .purple-bg;
    min-height: 96vh;
    padding: 10px;
    padding-top: 4vh;
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
            font-size: 1.5rem;
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
        font-size: 1.4rem;
        background: white;
        &-icon {
          flex: 1;
          margin-right: 0.5rem;
          .bgblack {
            background-color: #333;
          }
          span {
            font-size: 1.5rem;
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
          &--line {
            div {
              display: flex;
              align-items: center;
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
        font-size: 1.5rem;
        text-align: left;
        border-bottom: 1px solid #dedede;
      }
    }
  }
}
</style>
