import * as mailingAddrService from '@/services/mailingAddr'
import * as receiveAddrService from '@/services/receiveAddr'
import * as geographyService from '@/services/geography'
import { storage } from '../../utils'

import * as types from '../mutation-types'

export const state = {
  data: {},
  query: {
  }
}

// getters
export const getters = {
  getAddress: state => state.data
}

// actions
export const actions = {
  /**
   * [刷新地址数据]
   * @param  {[type]} options.commit [description]
   * @return {[type]}                [description]
   */
  async changeAddress ({ commit }) {
    try {
      const userId = storage({
        key: 'userId'
      })
      const send = await mailingAddrService.query({
        wxUserId: userId
      })
      const pickup = await receiveAddrService.query({
        wxUserId: userId
      })
      if (send.code === 200 && pickup.code === 200) {
        let sendData = send.obj || []
        let pickupData = pickup.obj || []
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
        text: '获取地址信息失败',
        width: '18rem'
      }
    } catch (e) {
      console.error(e)
      return {
        type: 'warn',
        text: '网络错误',
        width: '18rem'
      }
    }
  },
  /**
   * [addAddress 添加地址]
   * @param {[type]} options.commit    [description]
   * @param {[type]} options.dispatch  [description]
   * @param {[type]} options.data      [添加的数据]
   * @param {Number} options.type      [判断是添加寄件/收件地址]
   */
  async addAddress ({commit, dispatch}, {data = {}, type = 1}) {
    try {
      const userId = storage({
        key: 'userId'
      })
      data['wxUserId'] = userId
      let service = type === 1 ? mailingAddrService.save : receiveAddrService.save
      const res = await service(data)
      if (res.code === 200) {
        dispatch('changeAddress')
        return {
          type: 'success',
          text: '添加地址成功',
          width: '18rem'
        }
      } else {
        return {
          type: 'warn',
          text: '添加地址失败',
          width: '18rem'
        }
      }
    } catch (e) {
      console.error(e)
      return {
        type: 'warn',
        text: '添加地址失败',
        width: '18rem'
      }
    }
  },
  /**
   * [更新地址]
   * @param  {[type]} options.data     [description]
   * @param  {Number} options.type     [description]
   * @return {[type]}                  [description]
   */
  async updateAddress ({dispatch}, {data, type = 1}) {
    try {
      if (!data.wx_user_id) {
        data.wx_user_id = storage({key: 'userId'})
      }
      let service = type === 1 ? mailingAddrService.update : receiveAddrService.update
      const res = await service(data)
      if (res.code === 200) {
        dispatch('changeAddress')
        return {
          type: 'success',
          text: '更新地址成功',
          width: '18rem'
        }
      } else {
        return {
          type: 'warn',
          text: res.msg || '更新地址失败',
          width: '18rem'
        }
      }
    } catch (e) {
      console.error(e)
      return {
        type: 'warn',
        text: '更新地址失败',
        width: '18rem'
      }
    }
  },
  /**
   * [删除地址]
   * @param  {[type]} options.id       [description]
   * @param  {String} options.type     [description]
   * @param  {Number} options.status   [description]
   * @return {[type]}                  [description]
   */
  async delAddress ({dispatch}, {ids, type = 'send'}) {
    try {
      let service = type === 'send' ? mailingAddrService.remove : receiveAddrService.remove
      const res = await service({
        ids
      })
      if (res.statusCode === 200) {
        dispatch('changeAddress')
        return {
          type: 'success',
          text: '删除地址成功',
          width: '18rem'
        }
      } else {
        return {
          type: 'warn',
          text: res.msg || '删除地址失败',
          width: '18rem'
        }
      }
    } catch (e) {
      console.error(e)
      return {
        type: 'warn',
        text: e.message || '删除地址失败',
        width: '18rem'
      }
    }
  },
  async checkedAddress ({commit, dispatch}, {id, status, addressType}) {
    dispatch('changeAddress')
  },
  /**
   * [getGeography 根据国家省市区的id获取名称]
   * @param  {[type]} options.commit     [description]
   * @param  {[number]} options.countryid  [description]
   * @param  {[number]} options.provinceid [description]
   * @param  {[number]} options.cityid     [description]
   * @param  {[number]} options.countyid   [description]
   * @return {[type]}                    [description]
   */
  async getGeography ({commit}, {countryId, provinceId, cityId, countyId}) {
    try {
      countryId = Number(countryId)
      provinceId = Number(provinceId)
      cityId = Number(cityId)
      countyId = Number(countyId)
      const country = await geographyService.showCountry({id: countryId})
      const province = await geographyService.showProvince({id: provinceId})
      const city = await geographyService.showCity({id: cityId})
      const county = await geographyService.showCounty({id: countyId})
      const countryName = country.country_cn || ''
      const provinceName = province.name || ''
      const cityName = city.name || ''
      const countyName = county.name || ''
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
  }
}

export const mutations = {
  [types.SET_ADDRESS] (state, {data}) {
    state.data = data
  }
}
