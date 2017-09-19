import {address as addressApi, geography as geographyApi} from '@/api'
import axios from 'axios'
import window from 'window'
import { storage, getNameById } from '../../utils'
import request from '../../utils/request'

import * as types from '../mutation-types'

let local = window.localStorage
let instance = axios.create({
  timeout: 3000
})

export const state = {
  data: {},
  query: {
  }
}

// getters
export const getters = {
  getAddress: state => state.data,
  getAddressResult: state => state.result
}

// actions
export const actions = {
  async changeAddress ({ commit }) {
    try {
      const send = await instance({
        method: 'post',
        url: addressApi.send,
        params: {
          userid: local.getItem('mj_userId')
        },
        headers: {
          'token': local.getItem('mj_token')
        }
      })
      const pickup = await instance({
        method: 'post',
        url: addressApi.pickup,
        params: {
          userid: local.getItem('mj_userId')
        },
        headers: {'token': local.getItem('mj_token')}
      })
      if (send.status === 200 && pickup.status === 200) {
        let sendData = send.data.obj.sort(function (a, b) {
          return a.endtime < b.endtime
        })
        let pickupData = pickup.data.obj.sort(function (a, b) {
          return a.endtime < b.endtime
        })
        let data = {
          send: sendData,
          pickup: pickupData
        }
        commit(types.SET_ADDRESS, {data})
        return {
          type: 'success',
          info: '请求成功',
          width: '18rem'
        }
      }
      return {
        type: 'warn',
        info: '获取地址信息失败',
        width: '18rem'
      }
    } catch (e) {
      console.error(e)
      return {
        type: 'warn',
        info: '网络错误',
        width: '18rem'
      }
    }
  },
  async addAddress ({commit, dispatch}, {nationid, provinnce, city, county, detailedinformation,
    postcode, iphone, userid = local.getItem('mj_userId'), endtime = new Date().getTime(), start = 1, linkman, idnumber, company, remove, type = 1}) {
    try {
      let url, params
      if (type === 1) {
        url = addressApi.addsend
        params = {
          nationid, provinnce, city, county, detailedinformation, postcode, iphone, userid, endtime, start, linkman, company, remove
        }
      } else {
        url = addressApi.addpickup
        const nation = nationid
        params = {
          nation, provinnce, city, county, detaliedinformation: detailedinformation, postcode, iphone, userid, endtime, start, recipients: linkman, idnumber, company, remark: remove
        }
      }
      const res = await instance({
        method: 'post',
        url,
        params,
        headers: {'token': local.getItem('mj_token')}
      })
      if (res.status === 200) {
        dispatch('changeAddress')
        return {
          type: 'success',
          info: '添加地址成功',
          width: '18rem'
        }
      }
    } catch (e) {
      console.error(e)
      let result = {
        type: 'warn',
        info: '添加地址失败',
        width: '18rem'
      }
      commit(types.SET_ADDRESS_RES, {result})
    }
  },
  async eidtAddress ({dispatch}, {id, type = 'send', status = 2}) {
    try {
      let url
      if (type === 'send') {
        url = addressApi.updatesend
      } else {
        url = addressApi.updatepickup
      }
      const res = await instance({
        method: 'post',
        url,
        params: {
          id,
          status
        },
        headers: {'token': local.getItem('mj_token')}
      })
      if (res.status === 200) {
        dispatch('changeAddress')
        return {
          type: 'success',
          info: '添加地址成功',
          width: '18rem'
        }
      }
    } catch (e) {
      console.error(e)
      return {
        type: 'warn',
        info: '添加地址失败',
        width: '18rem'
      }
    }
  },
  async checkedAddress ({commit, dispatch}, {id, status, userid, addressType}) {
    let url = ''
    if (addressType === 1) {
      url = addressApi.sendchecked
    } else {
      url = addressApi.pickupchecked
    }
    const res = await request({
      url,
      method: 'post',
      auth: true,
      params: {
        id,
        status,
        userid
      }
    })
    dispatch('changeAddress')
    return res
  },
  /**
   * [getGeography 根据国家省市区的id获取名称]
   * @param  {[type]} options.commit     [description]
   * @param  {[type]} options.countryid  [description]
   * @param  {[type]} options.provinceid [description]
   * @param  {[type]} options.cityid     [description]
   * @param  {[type]} options.countyid   [description]
   * @return {[type]}                    [description]
   */
  async getGeography ({commit}, {countryid, provinceid, cityid, countyid}) {
    try {
      countryid = Number(countryid)
      provinceid = Number(provinceid)
      cityid = Number(cityid)
      countyid = Number(countyid)
      const country = await instance({
        method: 'post',
        url: geographyApi.showcountry,
        headers: {'token': local.getItem('mj_token')}
      })
      const province = await instance({
        method: 'post',
        url: geographyApi.showprovince,
        params: {
          countryid
        },
        headers: {'token': local.getItem('mj_token')}
      })
      const city = await instance({
        method: 'post',
        url: geographyApi.showcity,
        params: {
          provinceid
        },
        headers: {'token': local.getItem('mj_token')}
      })
      const county = await instance({
        method: 'get',
        url: geographyApi.showcounty,
        params: {
          cityid
        },
        headers: {'token': local.getItem('mj_token')}
      })
      const countryName = getNameById(country.data.obj, countryid) || ''
      const provinceName = getNameById(province.data.obj, provinceid) || ''
      const cityName = getNameById(city.data.obj, cityid) || ''
      const countyName = getNameById(county.data.obj, countyid) || ''
      const allName = countryName + provinceName + cityName + countyName
      const location = {
        allName,
        countryName,
        provinceName,
        cityName,
        countyName
      }
      return {
        type: 'success',
        text: '获取成功',
        width: '18rem',
        data: location
      }
    } catch (e) {
      console.error(e)
      return {
        type: 'warn',
        info: '获取失败',
        width: '20rem'
      }
    }
  },
  /**
   * [寄件页面的选中地址检测，如果选中的被编辑或者删除，寄件页面选中的地址要进行相应改变]
   * @param  {[type]} options.id          [description]
   * @param  {[type]} options.addressType [description]
   * @return {[type]}                     [description]
   */
  addressCheck ({ commit }, {id, addressType}) {
    let params = {
      key: addressType === 'send' ? 'send_sendaddress' : 'send_pickupaddress',
      val: JSON.stringify({
        id
      }),
      type: 'set'
    }
    storage(params)
  }
}

export const mutations = {
  [types.SET_ADDRESS] (state, {data}) {
    state.data = data
  },
  [types.SET_ADDRESS_RES] (stater, {result}) {
    state.result = result
  }
}
