/**
 * @file 函数处理
 * @author dafo<huanghoujin@baijiahulian.com>
 */

import moment from 'moment'
import axios from 'axios'

/**
 * 防抖动
 *
 * @param {Function} fn 需要防抖动的函数
 * @param {?Object=} context 函数调用时的上下文
 * @return {Function} 包装过的支持防抖动函数
 */
export const debounce = (fn, delay, context) => {
  let timer = null

  return function debounce() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }

    timer = setTimeout(fn, delay, context)
  }
}

/**
 * 节流
 *
 * @param {Function} fn 需要节流的函数
 * @param {?Object=} context 函数调用时的上下文
 * @return {Function} 包装过的支持节流函数
 */
export const throttle = (fn, delay, context) => {
  let lastCalledTime = +new Date()

  return function throttled() {
    const nowTime = +new Date()

    if (nowTime - lastCalledTime >= delay) {
      fn.call(context)
      lastCalledTime = nowTime
    }
  }
}

/**
 * 针对某种数据类型的判断
 * @param {*} params 判断数据的类型
 * @return
 *  getDataType({}); // "object"
 *  getDataType([]); // "array"
 *  getDataType(5); // "number"
 *  getDataType(null); // "null"
 *  getDataType(); // "undefined"
 *  getDataType(/abcd/); // "regex"
 *  getDataType(new Date()); // "date"
 *  getDataType(); // "undefined"
 *  getDataType('dddd'); // "string"
 *  getDataType(NaN); // "number"
 *  getDataType.isObject({}) // true
 *  getDataType.isNumber(NaN) // true
 *  getDataType.isRegExp(/abc/) // true
 */
const dataType = (params) => {
  const s = Object.prototype.toString.call(params)
  return s.match(/\[object (.*?)\]/)[1].toLowerCase()
}

;[
  'Null',
  'Undefined',
  'Object',
  'Array',
  'String',
  'Number',
  'Boolean',
  'Function',
  'RegExp',
].forEach((t) => {
  dataType[`is${t}`] = (o) => dataType(o) === t.toLowerCase()
})

export const getDataType = dataType

/**
 * 对象深拷贝方法
 * @param {Object} target: 要拷贝的对象
 * @return {Object}
 */
export function deepClone(data) {
  const type = getDataType(data)
  let result = data
  if (type === 'array') {
    result = []
    for (let i = 0, len = data.length; i < len; i++) {
      result.push(deepClone(data[i]))
    }
  }
  if (type === 'object') {
    result = {}
    for (const key in data) {
      result[key] = deepClone(data[key])
    }
  }
  return result
}

// 邮箱正则表达式
export const mailValidate = (rule, value, callback) => {
  const regExp = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/
  try {
    if (value) {
      if (regExp.test(value)) {
        callback()
      } else {
        callback(rule.message)
      }
    } else {
      callback()
    }
  } catch (error) {
    callback(error)
  }
}

// 手机号正则表达式
export const phoneValidate = (rule, value, callback) => {
  const regExp = /^1[3|4|5|6|7|8|9][0-9]{9}$/
  try {
    if (value) {
      if (regExp.test(value)) {
        callback()
      } else {
        callback(rule.message)
      }
    } else {
      callback()
    }
  } catch (error) {
    callback(error)
  }
}

// 将后端的 {city} or {id, name} or {code, value} 转换成 {label, value}
export function translate(data) {
  return data?.map((item) => {
    // 意向城市 只有 {city}
    if (item.city) {
      item.label = item.city
      item.value = item.city
    }
    // 报名时 的职位列表 {code, value}
    else if (item.code) {
      item.label = item.value
      item.value = item.code
    }
    // 活动城市列表 {id, name}
    else {
      item.label = item.name
      item.value = item.id
    }
    return item
  })
}

// {id, name}
export function translateFormat(data) {
  return data?.map((item) => {
    item.label = item.name
    item.value = item.name
    return item
  })
}

/**
 * 周几中的阿拉伯数字转汉字
 *
 * @param {Number} 数字
 * @return {String} 汉字
 */
export const noToChinese = (num) => {
  const map = {
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六',
    0: '日',
  }
  return map[num]
}

/**
 * 将后端返回的 startTime,endTime 格式化成时间段
 *
 * @param {startTime} 开始时间
 * @return {endTime} 结束时间
 * @return {time} 时间段
 */
export const timeFormat = function (startTime, endTime) {
  const day = moment(startTime).weekday()
  const time = moment(startTime).format(
    `YYYY[年]MM[月]DD[(周]${noToChinese(day)}[)] HH:mm`
  )
  if (endTime) {
    const end = moment(endTime).format('HH:mm')
    return `${time}-${end}`
  }
  return time
}

// eslint-disable-next-line no-undefined
export const isObjEmpty = (object) =>
  object === undefined || object === null || Object.keys(object)?.length === 0

// 转换数据格式
export function translateData(arrObj) {
  return arrObj?.map((item) => ({
    accountName: item.label,
    domain: item.value,
    disabled: item.isCreator,
    department: item.department,
  }))
}

export function trim(s, isGlobal) {
  let result
  result = s.replace(/(^\s+)|(\s+$)/g, '')
  if (isGlobal.toLowerCase() === 'g') {
    result = result.replace(/\s/g, '')
  }
  return result
}

export function downloadFile(url, name) {
  axios({
    url,
    method: 'get',
    responseType: 'blob',
    params: url,
  }).then((res) => {
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.style.display = 'none'
    link.setAttribute('download', name)
    document.body.append(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  })
}

export function inputValidator(_, value) {
  if (/\s+/g.test(value)) {
    return Promise.reject('请勿输入空格！')
  }
  // 传统emoj表情符号的校验
  const emojiRegex =
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu
  if (emojiRegex.test(value)) {
    return Promise.reject('请勿输入emoji表情!')
  }
  return Promise.resolve()
}
