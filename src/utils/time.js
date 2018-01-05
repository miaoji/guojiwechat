export const formatdate = function (date = new Date()) {
  date = new Date(date)
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  month = month > 10 ? month : '0' + month
  let day = date.getDate()
  day = day >= 10 ? day : '0' + day
  return year + '/' + month + '/' + day
}

/**
 * [format description]
 * @param  {[String]} fmt  [输出的日期格式 'yyyy-MM-dd hh:mm:ss']
 * @param  {[Date]} date [new Date()]
 * @return {[String]}      [格式化后的时间]
 */
export const format = function (fmt, date) {
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

/**
 * [format description]
 * @param  {[Date]} timpstamp    [输出的日期格式 'yyyy-MM-dd hh:mm:ss']
 * @param  {[Number]}   type     需要的类型 1：年月日时分秒 2： 年月日
 * @return {[String]}            [格式化后的时间]
 */

export const formatedatestamp = function (timpstamp, type = 1) {
  if (!timpstamp) {
    return '未知时间'
  }
  let date = new Date(Number(timpstamp))
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  month = month > 10 ? month : '0' + month
  let day = date.getDate()
  day = day >= 10 ? day : '0' + day
  let h = date.getHours() + ':'
  let m = date.getMinutes() + ':'
  let s = date.getSeconds()
  if (type === 1) {
    return year + '-' + month + '-' + day + ' ' + h + m + s
  } else if (type === 2) {
    return year + '-' + month + '-' + day
  } else {
    return year + '-' + month + '-' + day
  }
}

export const getMinute = function (date) {
  const newdate = new Date(date)
  const hour = newdate.getHours()
  let minute = newdate.getMinutes()
  if (minute < 10) {
    minute = '0' + minute
  }
  return hour + ':' + minute
}

export const getDate = function (date) {
  const newdate = new Date(date)
  const year = newdate.getFullYear()
  const redate = newdate.getDate()
  const month = newdate.getMonth() + 1
  return year + '-' + month + '-' + redate
}

/**
 * [setDateByMinutes 根据传入的值获取，据当前时间过后一定分钟的时间戳]
 * @param  {Number} val [分钟数]
 * @return {[Number]}     [时间戳]
 */
export const setDateByMinutes = function (val = 120) {
  let time = new Date()
  return time.setMinutes(time.getMinutes() + Number(val), time.getSeconds(), 0)
}

/**
 * [format description]
 * @param  {[Date]} date [str]
 * @return {[String]}      [格式化后的时间]
 */

export const formatCoupon = function (date = '') {
  let o = [
    date.substr(0, 4),
    date.substr(4, 2),
    date.substr(6, 2)
  ]
  return o.join('.')
}
