/**
 * []、{}、any 类型 工具类
 * @version 2.0.0.220701  从 basetype.js（基础数据类型工具类）修改，改为 ts
 * @changeLog
 *      2.0.0.220701        从 basetype.js（基础数据类型工具类） 修改，改为 ts
 *      0.0.3-alpha.211018  增加方法 nullIf
 *      0.0.2-alpha.210917  增加方法 isEmptyAsString
 *      0.0.1-alpha.210908  增加常量 isAbsent
 *      0.0.1-alpha.210423
 */

/**
 * 检查数组是否全部包含指定的数组元素
 * @param {Array} origin 被查询的数组
 * @param {Array} findArr 查询的数组（含要指定的元素）
 */
export const includesAll = (origin: unknown[], findArr: unknown[]) =>
  findArr.every(fv => origin.includes(fv))

/**
 * 根据 key-value 在数组的元素中查找（全等），第一个符合条件立即返回其索引
 * @param {Array<object>} arr 被查找的数组
 * @param {String} key 被查找的key
 * @param {*} value 查找的值，使用全等判断
 */
export function findIndex(
  arr: Record<string, unknown>[],
  key: string,
  value: unknown
) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === value) {
      return i
    }
  }
}

/**
 * 根据 key-value 在数组的元素中查找（全等），第一个符合条件立即返回其元素
 * @param {Array<object>} arr 被查找的数组
 * @param {String} key 被查找的key
 * @param {*} value 查找的值，使用全等判断
 * @since 0.0.1-alpha.210423
 */
export function find(
  arr: Record<string, unknown>[],
  key: string,
  value: unknown
) {
  const index = findIndex(arr, key, value)
  if (index === undefined) {
    return undefined
  }
  return arr[index]
}

/**
 * 检查对象是否为 undefined
 * @param {any} obj
 * @since 0.0.1-alpha.210414
 */
export const isUndefined = (obj: unknown) => typeof obj === 'undefined'

/**
 * 检查对象是否为 null
 * @param {any} obj
 * @since 0.0.1-alpha.210423
 */
export const isNull = (obj: unknown) => obj === null

/**
 * 如果值等于期望值，则返回null，否则返回该值
 * @param {any} obj 要检查的值
 * @param {any} expect 期望返回null时的值
 * @returns
 * @since 0.0.3-alpha.211018
 */
export const nullIf = (obj: unknown, expect: unknown) =>
  obj === expect ? null : obj

/**
 * 检查对象作为字符串是否为空（undefined、null返回true）
 * @param {any} obj
 * @returns
 * @since 0.0.2-alpha.210917
 * @deprecated 使用 {@link StringUtils.hasLength}
 */
export function isEmptyAsString(obj: unknown) {
  return isUndefined(obj) || isNull(obj) || obj === ''
}

/**
 * 缺省值，为了 vue3 的 prop 中区分判断无传参和传入undefined而出现。\
 * 并通过 import 解决新版本的vue（^3.2.6）报错的问题
 * @since 0.0.1-alpha.210908
 */
export const isAbsent = Symbol()
