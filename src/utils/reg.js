/**
 * [js正则验证手机号 15位数字+'+'+'-']
 * @param  {[String]} num  [传入的手机号]
 * @param  {[String]} type [预留字段，以后区分国内和国外手机号，不传则同时验证]
 * @return {[Boolean]}      [description]
 */
export const checkMobile = function (num, type) {
  const regFor = /^\+?\d{1,6}-?\d{8,15}$/
  const regCN = /^1(3|4|5|6|7|8|9)\d{9}$/
  return regFor.test(num) || regCN.test(num)
}

export const checkPostcode = function (num) {
  num = num.replace(/\s/g, '')
  // 邮编“数字”+“英文”+“-”共10位
  // 起始数字不能为0，然后是5个数字  [1-9]\d{5} 国内邮编
  const regCN = /^[1-9]\d{5}$/g
  const regUSA = /\d{5}-\d{4}|\d{5}/
  const regFor = /^\w{0,5}-?\d{4,6}$/g
  const regComm = /^\w{0,8}$/g
  return regFor.test(num) || regCN.test(num) || regUSA.test(num) || regComm.test(num)
}

export const checkSpechars = function (str) {
  const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
  return pattern.test(str)
}
