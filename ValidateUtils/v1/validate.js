/* input 字符串校验类 
    @version 1.3.0.200911

    1.3.0.200911
        增加 isInteger
    1.2.0.200614
        增加 isEmptyTrim
	1.1.0.200517
*/

/**
 * 邮箱
 * @param {*} s
 */
export function isEmail (s) {
    // eslint-disable-next-line no-useless-escape
    return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(s)
}

/**
 * 是否为空（不去除空格）
 * @export
 * @param {*} s
 * @returns
 */
export function isEmpty (s) {
    return s === undefined || s === null || s === ''
}

/**
 * 是否为空（去除空格）
 * @export
 * @param {*} s
 * @returns
 * @since 1.2.0
 */
export function isEmptyTrim (s) {
    return s === undefined || s === null || 
        (typeof s === 'string' && s.trim() === '')
}

/**
 * 校验日期(含日期与时间)
 * @param {String} value
 */
export function isDateTime (value) {
    // 参考：https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string

    // var result = /^(\d{4,})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/.exec(value)
    var result = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.exec(value)

    if (!result) {
        return false
    }
    var year = Number(result[1])
    var month = Number(result[2])
    if (!(year > 0 && month >= 1 && month <= 12)) {
        return false
    }
    var day = Number(result[3])

    var maxDay
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
    var hour = Number(result[4])
    var minute = Number(result[5])
    var second = Number(result[6])
    if (!(hour < 24 && minute < 60 && second < 60)) {
        return false
    }
    return true
}

/**
 * 校验日期(仅日期)
 * @param {String} value
 */
export function isDate (value) {
    // 参考：https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string

    // var result = /^(\d{4,})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/.exec(value)
    var result = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)

    if (!result) {
        return false
    }
    var year = Number(result[1])
    var month = Number(result[2])
    if (!(year > 0 && month >= 1 && month <= 12)) {
        return false
    }
    var day = Number(result[3])

    var maxDay
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
export function isMobile (s) {
    return /^1[0-9]{10}$/.test(s)
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone (s) {
    return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL (s) {
    return /^http[s]?:\/\/.*/.test(s)
}

/**
 * 数字(带负号也可)
 * @export
 * @param {*} s
 * @returns
 */
export function isNumber (s) {
    return /^-?[0-9]+\.?[0-9]*$/.test(s)
}

/**
 * 整数(带负号也可)
 * @export
 * @param {*} s
 * @returns
 */
export function isInteger (s) {
    return /^-?[0-9]+$/.test(s)
}
