/**
 * 字符串工具类
 * 复制自 validate.js v1.3.0.200911
 * 
 * @version 2.1.0.230627 feat: formatNumber 格式化数字为千分位
 * @changelog
 *          2.1.0.230627 feat: formatNumber 格式化数字为千分位
 *          2.0.0.220610 复制自 validate.js v1.3.0.200911
 */

/**
 * 邮箱
 * @param {*} s
 */
export function isEmail(s: string) {
  // eslint-disable-next-line no-useless-escape
  return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
    s
  )
}

/**
 * 是否为空（不去除空格）
 * @export
 * @param {*} s
 * @returns
 * @deprecated 使用 {@link hasLength} 代替，结果取反
 */
export function isEmpty(s: string) {
  return s === undefined || s === null || s === ''
}

/**
 * 是否为空（去除空格）
 * @export
 * @param {*} s
 * @returns
 * @since 1.2.0
 * @deprecated 使用 {@link hasText} 代替，结果取反
 */
export function isEmptyTrim(s: string) {
  return (
    s === undefined || s === null || (typeof s === 'string' && s.trim() === '')
  )
}

/**
 * 是否有长度
 * @param s 字符串/undefined/null
 * @returns 是否有长度
 * @since 2.0.0
 */
export function hasLength(s: string | undefined | null) {
  return s !== undefined && s !== null && s.length > 0
}

/**
 * 是否有文本
 * @param s 字符串/undefined/null
 * @returns 是否有文本
 * @since 2.0.0
 */
export function hasText(s: string | undefined | null) {
  return s !== undefined && s !== null && s.trim().length > 0
}

/**
 * 校验日期(含日期与时间)
 * yyyy-MM-dd HH:mm:ss
 * @param {String} value
 */
export function isDateTime(value: string) {
  // 参考：https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string

  // var result = /^(\d{4,})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/.exec(value)
  const result = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.exec(value)

  if (!result) {
    return false
  }
  const year = Number(result[1])
  const month = Number(result[2])
  if (!(year > 0 && month >= 1 && month <= 12)) {
    return false
  }
  const day = Number(result[3])

  let maxDay
  if ([1, 3, 5, 7, 8, 10, 12].some(v => month === v)) {
    maxDay = 31
  } else if ([4, 6, 9, 11].some(v => month === v)) {
    maxDay = 30
  } else if (month === 2) {
    if (year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)) {
      maxDay = 29
    } else {
      maxDay = 28
    }
  } else {
    return false
  }
  if (!(day > 0 && day <= maxDay)) {
    return false
  }
  const hour = Number(result[4])
  const minute = Number(result[5])
  const second = Number(result[6])
  if (!(hour < 24 && minute < 60 && second < 60)) {
    return false
  }
  return true
}

/**
 * 校验日期(仅日期)
 * yyyy-MM-dd 格式
 * @param {String} value
 */
export function isDate(value: string) {
  // 参考：https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string

  // var result = /^(\d{4,})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/.exec(value)
  const result = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)

  if (!result) {
    return false
  }
  const year = Number(result[1])
  const month = Number(result[2])
  if (!(year > 0 && month >= 1 && month <= 12)) {
    return false
  }
  const day = Number(result[3])

  let maxDay
  if ([1, 3, 5, 7, 8, 10, 12].some(v => month === v)) {
    maxDay = 31
  } else if ([4, 6, 9, 11].some(v => month === v)) {
    maxDay = 30
  } else if (month === 2) {
    if (year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)) {
      maxDay = 29
    } else {
      maxDay = 28
    }
  } else {
    return false
  }
  if (!(day > 0 && day <= maxDay)) {
    return false
  }
  return true
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile(s: string) {
  return /^1[0-9]{10}$/.test(s)
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone(s: string) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL(s: string) {
  return /^http[s]?:\/\/.*/.test(s)
}

/**
 * 数字(带负号也可)
 * @export
 * @param {*} s
 * @returns
 */
export function isNumber(s: string) {
  return /^-?[0-9]+\.?[0-9]*$/.test(s)
}

/**
 * 整数(带负号也可)
 * @export
 * @param {*} s
 * @returns
 */
export function isInteger(s: string) {
  return /^-?[0-9]+$/.test(s)
}

/**
 * 格式化数字为千分位
 * @param number 数字
 * @returns 
 * @since 2.1.0.230627
 */
export function formatNumber(number: string | number) {
  const sps = (number + '').split('.')
  const re = /\d{1,3}(?=(\d{3})+$)/g
  const int = sps[0].replace(re, '$&,') // 整数部分含千分位
  let dig = sps[1]
  return dig ? `${int}.${dig}` : int 
}