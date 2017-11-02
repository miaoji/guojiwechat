import { storage } from './index'
/**
 * [将数据写入缓存中 localStorage]
 * @param  {[Array]} rules  [传入的规则]
 * @param  {[String]} key [local的key值]
 * @return {[Boolean]}      []
 */
export const setDataToCache = function (rules = [], key) {
  let cache = {}
  for (let i = 0, len = rules.length; i < len; i++) {
    let item = rules[i]
    cache[item.name] = this[item.name]
  }
  storage({
    key,
    val: JSON.stringify(cache),
    type: 'set'
  })
}

/**
 * [从缓存中提取数据 localStorage]
 * @param  {[Array]} rules  [规则]
 * @param  {[String]} key [local的key值]
 * @return {[Boolean]}      []
 */
export const setCacheToData = function (rules = [], key) {
  let cache = storage({
    key
  })
  if (!cache) {
    return false
  }
  try {
    cache = JSON.parse(cache)
    for (let i = 0, len = rules.length; i < len; i++) {
      let item = rules[i]
      if (item['needJudge'] === 0) {
        this[item.name] = cache[item.name]
      }
    }
    return cache
  } catch (err) {
    console.error(err)
    return false
  }
}
