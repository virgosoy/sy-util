/**
 * []、{}、any 类型 工具类
 * @version 2.5.0.230223 feat: comparatorAll 对多个字段生成比较器、comparator 中的类型细化
 * @changeLog
 *          2.5.0.230223 feat: comparatorAll 对多个字段生成比较器、comparator 中的类型细化
 *          2.4.1.230216 fix: moveArrayItemOrderNumber 返回时缺少元素
 *          2.4.0.230215 feat: moveArrayItemOrderNumber 移动数组元素，通过排序号确定顺序
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
 * 排序 key 或函数
 */
type SortKeyOrFn<T> = ((item: T) => number) | keyof T
/**
 * 排序
 */
type Sort = 'asc' | 'desc'
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
 * @version 2.5.0.230223 类型更加细化、2.2.0.221228 从 soy-functional.js 复制修改
 * @since 2.2.0.221228
 */
export function comparator<T>(keyOrFn: SortKeyOrFn<T>, sort: Sort = 'asc'): (a: T, b: T) => number {
  if (typeof (keyOrFn) === 'function') {
    const fn = keyOrFn
    if (sort === 'asc') {
      return (a, b) => fn(a) - fn(b)
    } else {
      return (a, b) => fn(b) - fn(a)
    }
  } else {
    const key = keyOrFn
    if (sort === 'asc') {
      return (a, b) => <any> a[key] - <any> b[key]
    } else {
      return (a, b) => <any> b[key] - <any> a[key]
    }
  }
}

/**
 * 比较器，可以对多个字段进行排序
 * @param confs 配置数组，元素可以是如下格式：
 *        - key
 *        - fn(item)
 *        - [key, sort]
 *        - [fn(item), sort]
 *        
 *        说明：
 *        - key - 字符串：那么直接取比较对象的key对应值做比较
 *        - fn(item) - 回调函数的参数是比较的对象，回调函数对对象做处理。
 *        - sort - 排序顺序，默认：asc-升序、desc-降序
 * @returns 一个比较器，用于Array.prototype.sort()
 * @example
 * // 对 time 进行升序后，id 进行降序
 * arr.sort(comparatorAll((item) => new Date(item.time), ['id','desc']))
 * @version 2.5.0.230223
 * @since 2.5.0.230223
 */
export function comparatorAll<T>( ...confs: ([SortKeyOrFn<T>, Sort] | SortKeyOrFn<T>)[]): (a: T, b: T) => number {
  const params = confs.map<[SortKeyOrFn<T>, Sort]>(conf => !Array.isArray(conf) ? [conf, 'asc' as Sort] : conf)
  return (a, b) => params.reduce((r, param) => r || comparator(...param)(a,b),0)
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

/**
 * 移动数组元素，通过排序号确定顺序 \
 * 会修改排序号，而不会修改数组实际顺序 \
 * 注意：如果排序号有重复，那么有可能会排序失败
 * @param arr 数组
 * @param orderKey 排序号的 key 名称
 * @param sourceIndex 要移动的元素索引
 * @param targetIndex 移动到的目标元素索引（即移动后元素新位置在移动前的哪个元素上）
 * @returns 排序号有变动的元素数组
 * @version 2.4.1.230216 change: 2.4.0.230215
 * @since 2.4.0.230215
 */
export function moveArrayItemOrderNumber<OrderNumberKey extends string = 'orderNumber'>
    (arr: {[K in OrderNumberKey]: number}[], orderKey: OrderNumberKey, sourceIndex: number, targetIndex: number): {[K in OrderNumberKey]: number}[] {

  debugger
  const sourceOrderNumber = arr[sourceIndex][orderKey]
  const targetOrderNumber = arr[targetIndex][orderKey]

  /** 方向，向后移动是正，向前移动是负，不动是0 */
  const dest = targetOrderNumber - sourceOrderNumber

  if(dest === 0){
    return []
  }

  const minOrderNumber = Math.min(sourceOrderNumber, targetOrderNumber)
  const maxOrderNumber = Math.max(sourceOrderNumber, targetOrderNumber)

  const listOrderByAsc = arr
    .filter(o => isInRange(o[orderKey], minOrderNumber, maxOrderNumber))
    .sort(comparator(orderKey, dest > 0 ? 'asc' : 'desc'))

  // 修改数组 orderNumber
  // 可以看成排队：
  // 第一个元素出列
  // 把前一个元素的 orderNumber 给后一个元素，也就是后一个元素占前一个元素的位置。升序的话，就是向前排，倒序的话，就是向后排。
  // 第一个元素回到空位。
  const firstItem = listOrderByAsc.shift()!
  let nextOrderNumber = firstItem[orderKey]
  listOrderByAsc.forEach(o => {
    const temp = o[orderKey]
    o[orderKey] = nextOrderNumber
    nextOrderNumber = temp
  })
  firstItem[orderKey] = nextOrderNumber

  // 插入回去，让此列表表示为有修改的元素，以便返回出去。
  listOrderByAsc.unshift(firstItem)
  return listOrderByAsc

  // -----------------------------------------------------------

  /**
   * 判断数字是否在闭区间范围内
   * @param value 要判断的值
   * @param min 最小值
   * @param max 最大值
   * @returns -
   */
  function isInRange(value: number, min: number, max: number): boolean{
    return value >= min && value <= max
  }
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
