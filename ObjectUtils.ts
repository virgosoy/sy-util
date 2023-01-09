/**
 * []、{}、any 类型 工具类
 * @version 2.3.1.221228 fix: distinct 返回类型不对
 * @changeLog
 *          2.3.1.221228 fix: distinct 返回类型不对
 *          2.3.0.221228 增加方法 diffAdd 比较获取目标数组比原数组多的元素
 *          2.2.0.221228 将 soy-functional.js 所有方法复制修改到此处。
 *          2.1.0.221115  增加方法 cartesianProductRecordArray（Record数组的笛卡尔积）
 *          2.0.0.220701        从 basetype.js（基础数据类型工具类） 修改，改为 ts
 *          0.0.3-alpha.211018  增加方法 nullIf
 *          0.0.2-alpha.210917  增加方法 isEmptyAsString
 *          0.0.1-alpha.210908  增加常量 isAbsent
 *          0.0.1-alpha.210423
 */

// #region 数组相关

/**
 * 检查数组是否全部包含指定的数组元素
 * @param {Array} origin 被查询的数组
 * @param {Array} findArr 查询的数组（含要指定的元素）
 */
export const includesAll = (origin: unknown[], findArr: unknown[]) =>
  findArr.every(fv => origin.includes(fv))

/**
 * 对数组进行分组
 * @param array 要分组的数组
 * @param fn(o) 回调函数，返回值为分组的key，o为元素
 * @returns {Object} 分组结果，保持对原数组对象的引用
 * @version 2.2.0.221228 从 soy-functional.js 复制修改
 * @since 2.2.0.221228
 */
export function groupBy<T>(array: T[], fn: (o: T) => unknown): Record<string, T[]> {
  const groups: Record<string, T[]> = {}
  array.forEach((o) => {
    const group = JSON.stringify(fn(o))
    groups[group] = groups[group] || []
    groups[group].push(o)
  })
  //  return Object.keys(groups).map(function (group) {
  //    return groups[group];
  //  });
  return groups
}

/**
 * 数组去重，不改变原数组
 * @param {Array} arr
 * @version 2.3.1.221228
 * @since 2.2.0.221228 从 soy-functional.js 复制修改、2.3.1.221228 修改参数类型
 */
export function distinct<T>(arr: T[]) {
  return [...new Set(arr)]
}

/**
 * 比较器
 *
 * demo: \
 * arr.sort(comparator((item)=>new Date(item.checkTime),'desc')) \
 * // 对arr[i].checkTime进行降序排序
 * @param keyOrFn 如果是函数fn(item)，回调函数的参数是比较的对象，回调函数对对象做处理。
 *      如果是key字符串，那么直接取比较对象的key对应值做比较
 * @param sort 可选，排序顺序，默认：asc-升序、desc-降序
 * @returns {function(*, *): number} 一个比较器，用于Array.prototype.sort()
 * @version 2.2.0.221228 从 soy-functional.js 复制修改
 * @since 2.2.0.221228
 */
export function comparator<T>(keyOrFn: ((item: T) => number) | string, sort: 'asc' | 'desc' = 'asc'): (a: any, b: any) => number {
  if (typeof (keyOrFn) === 'function') {
    const fn = keyOrFn
    if (sort === 'asc') {
      return (a: T, b: T) => fn(a) - fn(b)
    } else {
      return (a: T, b: T) => fn(b) - fn(a)
    }
  } else {
    const key = keyOrFn
    if (sort === 'asc') {
      return (a, b) => a[key] - b[key]
    } else {
      return (a, b) => b[key] - a[key]
    }
  }
}

/**
 * 比较获取目标数组比原数组多的元素
 * @param source 原数组
 * @param target 目标数组
 * @returns 多的元素部分的数组
 * @version 2.3.0.221228
 * @since 2.3.0.221228
 */
export function diffAdd<T>(source: T[], target: T[]) {
  return target.filter(v => !source.includes(v))
}
// #endregion

// #region 对象数组相关

/**
 * 根据 key-value 在数组的元素中查找（全等），第一个符合条件立即返回其索引
 * @param {Array<object>} arr 被查找的数组
 * @param {String} key 被查找的key
 * @param {*} value 查找的值，使用全等判断
 */
export function findIndex(
  arr: Record<string, unknown>[],
  key: string,
  value: unknown,
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
  value: unknown,
) {
  const index = findIndex(arr, key, value)
  if (index === undefined) {
    return undefined
  }
  return arr[index]
}

/**
 * Record数组的笛卡尔积
 * @param arr 多个 Record 数组
 * @returns 笛卡尔积，不会改变原数组（即浅克隆）。如果后面的数组元素的key和之前一样，那么后面的会覆盖前面的。
 */
export function cartesianProductRecordArray(
  ...arr: Record<string | number | symbol, unknown>[][]
) {
  // 参数校验
  if (arr.length === 0) {
    return []
  }

  const source = arr[0]
  const [, ...targets] = arr
  let result = source.map(v => v)

  targets.forEach((target) => {
    result = result
      .map(
        si =>
          target.map(
            ti => Object.assign({}, si, ti), // {}
          ), // {}[]
      ) // {}[][]
      .flat(1) // {}[]
  })
  return result
}

// #endregion

// #region 变量判断

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

// #endregion

/**
 * 缺省值，为了 vue3 的 prop 中区分判断无传参和传入undefined而出现。\
 * 并通过 import 解决新版本的vue（^3.2.6）报错的问题
 * @since 0.0.1-alpha.210908
 */
export const isAbsent = Symbol()
