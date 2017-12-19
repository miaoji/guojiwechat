import lodash from 'lodash'
import config from 'config'
import { localPrefix } from './config'
import * as time from './time'
import * as reg from './reg'
import * as cache from './cache'
import { checkNum } from '@/services/expressCompany'
import { getDefaultAddr } from '@/services/user'

// 连字符转驼峰
String.hyphenToHump = function () {
  return this.replace(/-(\w)/g, (...args) => {
    return args[1].toUpperCase()
  })
}

// 驼峰转连字符
String.humpToHyphen = function () {
  return this.replace(/([A-Z])/g, '-$1').toLowerCase()
}

// 日期格式化
Date.format = function (format) {
  const o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds()
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr(`${o[k]}`.length))
    }
  }
  return format
}

/**
 * [获取路径参数]
 * @param   {String}
 * @return  {String}
 */

const queryURL = (name) => {
  let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  let r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}

/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  const item = array.filter(_ => _[keyAlias] === key)
  if (item.length) {
    return item[0]
  }
  return null
}

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
const arrayToTree = (array, id = 'id', pid = 'pid', children = 'children') => {
  let data = lodash.cloneDeep(array)
  let result = []
  let hash = {}
  data.forEach((item, index) => {
    hash[data[index][id]] = data[index]
  })

  data.forEach((item) => {
    let hashVP = hash[item[pid]]
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = [])
      hashVP[children].push(item)
    } else {
      result.push(item)
    }
  })
  return result
}

/**
 * [对localStorage操作进行封装]
 * @param  {String}  key    [存储的字段名字]
 * @param  {String}  val    [存储的字段值]
 * @param  {Boolean} prefix [是否加前缀，默认为true]
 * @param  {String}  type   [localStorage的操作方式 get、set、remove、clear]
 * @return {String} res     [localStorage.getItem(key)时返回的值]
 */
const storage = function ({key = '', val = '', prefix = true, type = 'get'}) {
  // type为remove时候，允许key为数组
  if (prefix && !Array.isArray(key)) {
    key = localPrefix + key
  }
  const localStorage = window.localStorage
  let res = ''
  switch (type) {
    case 'get':
      res = localStorage.getItem(key)
      break
    case 'set':
      localStorage.setItem(key, val)
      break
    case 'remove':
      if (Array.isArray(key)) {
        for (let i = 0, len = key.length; i < len; i++) {
          let removeKey = localPrefix + key[i]
          localStorage.removeItem(removeKey)
        }
      } else {
        localStorage.removeItem(key)
      }
      break
    case 'removeexcept':
      if (Array.isArray(key)) {
        Object.keys(localStorage).forEach(lkey => {
          if (!key.some(item => (localPrefix + item) === lkey)) {
            localStorage.removeItem(lkey)
          }
        })
      }
      break
    case 'clear':
      localStorage.clear()
      break
    default:
      break
  }
  if (type === 'get') {
    return res
  }
}

/**
 * [从json中获取与传入条件相等的元素]
 * @param  {[Object]} obj [传入的json]
 * @param  {[String]} id  [需要的条件]
 * @return {[String]}     [description]
 */
const getNameById = function (obj, id) {
  let newobj = ''
  Object.keys(obj).forEach((elem, index) => {
    if (obj[elem]['id'] === Number(id)) {
      newobj = obj[elem]
    }
  })
  return newobj['name']
}

/**
 * [根据node环境获取config]
 * @param  {[type]} options.env [description]
 * @return {[type]}             [description]
 */
const getConfByEnv = function () {
  const NODE_ENV = process.env.NODE_ENV
  let conf
  switch (NODE_ENV) {
    case 'development':
      conf = config.dev
      break
    case 'production':
      conf = config.pro
      break
    case 'test':
      conf = config.test
      break
    default:
      conf = config.pro
      break
  }
  return conf
}

/**
 * [快速打印一个五分制的评分情况]
 * @param  {[type]} rating [description]
 * @return {[type]}        [description]
 */
function getRating (rating) {
  if (rating > 5 || rating < 0) throw new Error('数字不在范围内')
  return '★★★★★☆☆☆☆☆'.substring(5 - rating, 10 - rating)
}

/**
 * [根据localStorage中数据，获取地址信息,如果没有则获取默认地址]
 * @param  {[String]} options.type       [send或者pickup]
 * @param  {[String]} options.storageKey [缓存key值]
 * @param  {[Func]} options.apiService [api方法]
 * @return {[Object]}                    [description]
 */
async function getAddress ({type, storageKey, apiService}) {
  try {
    const Local = JSON.parse(storage({key: storageKey}))
    let addrId = ''
    if (Local) {
      addrId = Local.id
    } else {
      // 如果local为空，则选择默认的地址
      const defaultAdrrRes = await getDefaultAddr({
        WxUserId: storage({
          key: 'userId'
        })
      })
      if (defaultAdrrRes.code === 200 && defaultAdrrRes.obj) {
        let defaultAdrr = defaultAdrrRes.obj
        const defaultAdrrType = type === 'send' ? 'mailingAddress' : 'receiveAddresses'
        if (defaultAdrr[defaultAdrrType] && defaultAdrr[defaultAdrrType].length > 0) {
          addrId = defaultAdrr[defaultAdrrType][0]['id']
        }
      }
    }
    if (!addrId) return false
    const Address = await apiService({id: addrId})
    if (!Address.success || !Address.obj) return false
    const addressRes = Address.obj
    if (Number(addressRes.HIDDEN_STATUS) !== 1) return false
    return {
      id: addressRes.ID,
      name: addressRes.NAME,
      mobile: addressRes.MOBILE,
      address: addressRes.ADDRESS || '',
      country: addressRes.COUNTRY_CN || '',
      province: addressRes.PROVINCE || '',
      city: addressRes.cityName || '',
      county: addressRes.DISTRICT || '',
      countryId: addressRes.COUNTRY || ''
    }
  } catch (e) {
    console.error(e)
    return false
  }
}

// 判断是否是微信浏览器的函数
function isWeiXin () {
  // window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
  const ua = window.navigator.userAgent.toLowerCase()
  // 通过正则表达式匹配ua中是否含有MicroMessenger字符串
  if (ua.match(/MicroMessenger/i) === 'micromessenger') {
    return true
  } else {
    return false
  }
}

async function isOrderNo (orderno) {
  if (orderno) {
    try {
      const checkNumRes = await checkNum({
        num: orderno
      })
      if (checkNumRes.success && checkNumRes.statusCode === 200) {
        let resData = checkNumRes.stringData
        resData = JSON.parse(resData)
        if (!resData[0]['comCode']) {
          return {
            type: 'warn',
            text: '经检测，单号所属物流公司为空，请检测后填写',
            width: '25rem'
          }
        } else {
          return {
            type: 'success',
            text: '单号正常',
            width: '20rem'
          }
        }
      }
    } catch (err) {
      console.error(err)
      return {
        type: 'warn',
        text: '单号所属物流公司为空，请检测后重新填写',
        width: '26rem'
      }
    }
  }
  return {
    type: 'warn',
    text: '单号不能为空',
    width: '26rem'
  }
}

export {
  queryURL,
  queryArray,
  arrayToTree,
  getNameById,
  getConfByEnv,
  storage,
  time,
  reg,
  getRating,
  cache,
  getAddress,
  isWeiXin,
  isOrderNo
}
