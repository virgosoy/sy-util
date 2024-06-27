/**
 * []、{}、any 类型 工具类
 * @version 2.16.0.240627 feat: comparatorOfEnum：比较器，按指定的枚举顺序排序
 * @changeLog
 *          2.16.0.240627 feat: comparatorOfEnum：比较器，按指定的枚举顺序排序
 *          2.15.0.240219 feat: deleteUndefinedValue：删除对象中值为 undefined 的字段
 *          2.14.0.230906 feat: omit: 忽略对象指定 keys，返回一个新对象；并修正一些ts检查
 *          2.13.0.230710 feat: pick: 过滤对象指定 keys，返回一个新对象
 *          2.12.0.230706 feat: 新增 WeakMap 的 5 个工具方法 mapGetOrSetIfAbsent、mapCompute、mapComputeIfAbsent、mapComputeIfPresent、mapMerge
 *          2.11.0.230705 feat: mapValues：将对象的值进行映射，返回一个新对象；setItems：给原数组元素一一赋值；moveArrayItemOrderNumberById：移动数组元素，通过排序号确定顺序
 *          2.10.0.230628 feat: mapdistinct：使用 map 结构进行 distinct；required：如果值存在则返回该值，否则抛出错误
 *          2.9.0.230508 feat: give 支持多参数
 *          2.8.0.230508 feat: 新增 give 方法，cartesianProductRecordArray 支持不定长参数中传入 undefined
 *          2.7.0.230507 feat: throwError
 *          2.6.1.230506 fix: 修改一些语法/类型问题
 *          2.6.0.230505 feat: moveArrayByIndex 移动数组元素，会修改原数组，moveArrayById 根据id移动数组元素，会修改原数组
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
 * 给原数组元素一一赋值
 * 会修改当前数组，但是不会修改整个原数组的引用。
 * @param originArr 原数组
 * @param newArr 新数组
 * @since 2.11.0.230705
 */
export function setItems<T extends Array<unknown>>(originArr: [...T], newArr: [...T]){
  originArr.forEach((v, i, a) => {
    a[i] = newArr[i]
  })
}

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
 * 使用 map 结构进行 distinct
 * 浅克隆，不会对原有数组做修改
 * @param arr 要去重的数组
 * @param map 去重映射回调函数，如果此函数的返回值一样（使用 object key 的规则）则表示元素重复
 * @returns 去重后的数组，注意，重复的会只保留最后一个（受到 `Object.fromEntries` 的影响）
 * @since 2.10.0.230628
 * @deprecated 暂未使用临时标记
 */
export function mapdistinct<T>(
  arr: T[],
  map: (value: T, index: number, array: T[]) => string | number
) {
  return Object.values(
    Object.fromEntries(
      arr.map((value, index, array) => {
        return [map(value, index, array), value]
      })
    )
  )
}

/**
 * 排序 key 或函数，函数返回的是进行比较的数字
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (a, b) => <any> a[key] - <any> b[key]
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (a, b) => <any> b[key] - <any> a[key]
    }
  }
}


/**
 * 排序 key 或函数，函数返回的是要比较的枚举内容
 */
type SortKeyOrFnOfEnum<T> = 
  _SortFnOfEnum<T> | _KeyOfEnumValue<T>
/** 枚举父类型 */
type _EnumType = string | number
/** 排序函数 */
type _SortFnOfEnum<T> = (item: T) => _EnumType
/** 枚举值类型的 key */
type _KeyOfEnumValue<T> = keyof {
  [K in keyof T as T[K] extends _EnumType ? K : never]: any
}

/**
 * 比较器，按指定的枚举顺序排序
 * @param keyOrFn 
 * * 如果是函数fn(item)，回调函数的参数是比较的对象，返回值是枚举值，回调函数对对象做处理。
 * * 如果是key字符串，那么直接取比较对象的key对应值（即枚举值）做比较
 * @param enumSort
 * @param [sort='asc'] 可选，升序（默认）/降序
 * @template T 数组的元素类型
 * @template KOF keyOrFn 类型
 * @example
 * ```ts
 * arr.sort(
 *   // 对 arr[].type 按枚举 ['a','b'] 进行降序排序
 *   comparatorOfEnum(item => item.type, ['a','b'], 'desc')
 * )
 * ```
 * @version 2.16.0.240627
 * @since 2.16.0.240627
 */
export function comparatorOfEnum<
  T, 
  KOF extends SortKeyOrFnOfEnum<T>, 
  // E extends (
  //   KOF extends (...args: any) => infer R ? R : 
  //   KOF extends keyof T ? T[KOF] : never
  // )
>(
  keyOrFn: KOF,
  enumSort: (
    KOF extends (...args: any) => infer R ? R : 
    KOF extends keyof T ? T[KOF] : never
  )[], 
  sort: Sort = 'asc'
): (a: T, b: T) => number {
  const enumMap: {[k in _EnumType/*super*/]: number} = Object.fromEntries(enumSort.map((v,i) => [v,i]))
  if (typeof (keyOrFn) === 'function') {
    const fn: _SortFnOfEnum<T> = keyOrFn
    if (sort === 'asc') {
      return (a, b) => enumMap[fn(a)] - enumMap[fn(b)]
    } else {
      return (a, b) => enumMap[fn(b)] - enumMap[fn(a)]
    }
  } else {
    const key = keyOrFn as _KeyOfEnumValue<T>
    if (sort === 'asc') {
      return (a, b) => enumMap[<_EnumType> a[key]] - enumMap[<_EnumType> b[key]]
    } else {
      return (a, b) => enumMap[<_EnumType> b[key]] - enumMap[<_EnumType> a[key]]
    }
  }
}

// 测试：
// const a: Array<{
//   a: '1'|'2',
//   b: number,
//   c: any
// }> = [{a:'1',b:1,c: {}}, {a:'2',b:3,c:{}}]
// a.toSorted(
//   comparatorOfEnum('a', ['1', '2']))
// a.toSorted(
//   comparatorOfEnum(v=> v.a, ['2','1','1']))


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

// /**
//  * 比较器
//  *
//  * @param keyOrMapFn 如果是函数fn(item)，回调函数的参数是比较的对象，回调函数对对象做处理。
//  *      如果是key字符串，那么直接取比较对象的key对应值做比较
//  * @param sort 可选，排序顺序，默认：asc-升序、desc-降序
//  * @returns {function(*, *): number} 一个比较器，用于Array.prototype.sort()
//  * @example
//  * ```js
//  * // 对arr[i].checkTime进行降序排序
//  * arr.sort(comparator((item)=>new Date(item.checkTime),'desc'))
//  * ```
//  * @deprecated 非正式版，目前如果有数字字符串和其他字符串混合会导致排序不稳定。
//  * 不稳定指的是含有相同元素不同顺序的列表，排序也会不同。
//  */
// export function comparator2<T>(
//   keyOrMapFn: (keyof T) | ((item: T) => any) = v => v, 
//   sort: Sort = 'asc',
// ){
//   const fn = typeof keyOrMapFn === 'function' ? keyOrMapFn : ((v: T) => v[keyOrMapFn])
//   return (a: T, b: T) => {
//     let av = fn(a), bv = fn(b)
//     let result: number
//     if((typeof av === 'bigint' && typeof bv === 'bigint') ||
//         (typeof av === 'number' && typeof bv === 'number')){
//       // @ts-ignore
//       result = av - bv
//     }else if((typeof av === 'bigint' && typeof bv === 'number') ||
//         (typeof av === 'number' && typeof bv === 'bigint')){
//       // @ts-ignore
//       result = Number(BigInt(av) - BigInt(bv))
//     }else if(typeof av === 'bigint' || typeof av === 'number'){
//       result = -1
//     }else if(typeof bv === 'bigint' || typeof bv === 'number'){
//       result = 1
//     }else{
//       result =  String(av ?? '').localeCompare(bv ?? '')
//     }
//     return result * (sort === 'asc' ? 1 : -1)
//   }
// }
// export function comparator2<T>(
//   keyOrMapFn: (keyof T) | ((item: T) => any) = v => v, 
//   sort: Sort = 'asc',
// ){
//   const fn = typeof keyOrMapFn === 'function' ? keyOrMapFn : ((v: T) => v[keyOrMapFn])
//   return (a: T, b: T) => {
//     const av = fn(a), bv = fn(b)
//     const result = av - bv
//     return (isNaN(result) ? av.localeCompare(bv) : result) * (sort === 'asc' ? 1 : -1)
//   }
// }


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
 * @param arr 变长参数，每个参数为 Record 数组 或 undefined，传入 undefined 的会被忽略（不等同于空数组）。
 * @returns 笛卡尔积，不会改变原数组（即浅克隆）。如果后面的数组元素的key和之前一样，那么后面的会覆盖前面的。
 * @version 2.8.0.230508 支持不定长参数中传入 undefined \
 *          2.1.0.221115 new
 * @since 2.1.0.221115
 */
export function cartesianProductRecordArray<K extends string | number | symbol, V>(
  ...arr: (Record<K, V>[] | undefined)[]
) {
  // 参数校验
  const realArr = arr.filter(v => v) as Record<K, V>[][]
  if (realArr.length === 0) {
    return []
  }

  const source = realArr[0]
  const [, ...targets] = realArr
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
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

/**
 * 移动数组元素，通过排序号确定顺序 \
 * 会修改排序号，而不会修改数组实际顺序 \
 * 注意：如果排序号 或 id 有重复，那么有可能会排序失败。
 * @param arr 数组
 * @param orderKey 排序号的 key 名称
 * @param idKey id 的 key 名称
 * @param sourceId 要移动的元素id
 * @param targetId 移动到的目标元素id（即移动后元素新位置在移动前的哪个元素上）
 * @returns 排序号有变动的元素数组
 * @version 2.11.0
 * @since 2.11.0.230705 2023-06-29
 */
export function moveArrayItemOrderNumberById<OrderNumberKey extends string = 'orderNumber', IdKey extends string = 'id', IdValue extends string | number = string | number>
    (
      arr: ({[K in OrderNumberKey]: number} & {[K in IdKey]: IdValue})[],
      orderKey: OrderNumberKey,
      idKey: IdKey,
      sourceId: IdValue,
      targetId: IdValue,
    ){
    const sourceIndex = arr.findIndex(o => o[idKey] === sourceId)
    const targetIndex = arr.findIndex(o => o[idKey] === targetId)
    return moveArrayItemOrderNumber(arr, orderKey, sourceIndex, targetIndex)
}

/**
 * 移动数组元素，会修改原数组
 * @param arr 数组
 * @param sourceIndex 要移动的元素索引
 * @param targetIndex 移动到的目标元素索引（元素的新索引。等同于如果目标是在移动的元素之前，那么则插入到目标元素之前。如果目标是在移动的元素之后，那么则插入到目标元素之后。）
 * @version 2.6.0.230505
 * @since 2.6.0.230505
 */
export function moveArrayByIndex<T>(arr: T[], sourceIndex: number, targetIndex: number){
  const items = arr.splice(sourceIndex, 1)
  arr.splice(targetIndex,0,...items)
}

/**
 * 根据id移动数组元素，会修改原数组
 * 
 * 请保证 id 值唯一且存在，此方法不做校验。
 * @param arr 数组
 * @param idKey id 字段名
 * @param sourceId 要移动的元素的id
 * @param targetId 移动到的目标元素id（如果目标是在移动的元素之前，那么则插入到目标元素之前。如果目标是在移动的元素之后，那么则插入到目标元素之后。）
 * @version 2.6.0.230505
 * @since 2.6.0.230505
 */
export function moveArrayById<IdKey extends string = 'id', Id extends string | number = string | number>
    (arr: {[K in IdKey]: Id}[], idKey: IdKey, sourceId: Id, targetId: Id) {
  
  const sourceIndex = arr.findIndex(v => v[idKey] === sourceId)
  const targetIndex = arr.findIndex(v => v[idKey] === targetId)

  moveArrayByIndex(arr, sourceIndex, targetIndex)
}

// #endregion

// #region 对象相关

/**
 * 将对象的值进行映射，返回一个新对象。 \
 * 浅克隆原始对象并 map \
 * 类似 lodash 的 mapValue
 * @param obj 对象
 * @param map map 函数
 * @returns 新对象
 * @since 2.11.0.230705 2023-07-03
 */
export function mapValues<
    O extends Record<string | number | symbol, unknown>, 
    NV>
    (obj: O, map: (value: O[keyof O], key: keyof O, obj: O) => NV){
  const result: Record<keyof O, NV> = {} as Record<keyof O, NV>
  for(const k in obj){
    result[k] = map(obj[k], k, obj)
  }
  return result
}

/**
 * 过滤对象指定 keys，返回一个新对象
 * @param obj -
 * @param keys 需要保留的 key 数组
 * @returns 一个新的对象，不会修改原对象。浅克隆。
 * @since 2.13.0.230710
 */
export function pick<O extends Record<string | number | symbol, unknown>, KS extends Array<keyof O>>(obj: O, keys: KS){
  return Object.fromEntries(Object.entries(obj).filter(([k]) => keys.includes(k))) as Pick<O, KS[number]>
}

/*
// 其他方式
function omit<T extends object, K extends keyof T>(obj: T, keysToOmit: K[]): Omit<T, K> {
  return Object.keys(obj).reduce((acc, key) => {
    if (!keysToOmit.includes(key as K)) {
      acc[key as keyof typeof acc] = obj[key as keyof T];
    }
    return acc;
  }, {} as Omit<T, K>);
}
*/
/**
 * 忽略对象指定 keys，返回一个新对象
 * @param obj -
 * @param keys 需要忽略的 key 数组
 * @returns 一个新的对象，不会修改原对象。浅克隆。
 * @since 2.14.0.230906
 * @example
 * ```ts
 * // 也可以通过解构赋值来处理，demo：
 * function omitKey(obj, keyToOmit) {
 *   // 使用解构赋值从对象中剔除指定的key
 *   const { [keyToOmit]: omitted, ...rest } = obj;
 *   // 返回剩余的对象，它不包含被忽略的键
 *   return rest;
 * }
 * ```
 */
export function omit<
  O extends Record<string | number | symbol, unknown>,
  KS extends Array<keyof O>
>(obj: O, keys: KS) {
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => !keys.includes(k))
  ) as Omit<O, KS[number]>
}

/**
 * 删除对象中值为 undefined 的字段 \
 * 主要是用于展开语法或 Object.assign 复制/合并对象时不会被 undefined 覆盖。
 * ```ts
 * const newObj = {...defaultObj, ...obj}
 * // 上面情况如果 obj 有字段值为 undefined 则 newObj 对应字段值也为 undefined，即会被覆盖。
 * // 使用此方法可以解决。
 * const newObj = {...defaultObj, ...deleteUndefinedValue(obj)}
 * ```
 * 其实实际业务中很少有这种情况，后端 java 会出现比较多。
 * 也可以考虑使用其他默认值合并库，如 defu
 * @param obj 
 * @returns 一个新的对象，不会修改原对象。浅克隆。
 * @since 2.15.0.240219
 * @description 注：ts 中如果字段为可选，那么类型就包含了 undefined，如 `var v = {a?:number}` IDE会显示为 `var v = {a?:number | undefined}`
 */
export function deleteUndefinedValue<
  O extends Record<string | number | symbol, unknown>
>(obj: O) {
  return Object.fromEntries(Object.entries(obj).filter(([k, v]) => v !== undefined)) as O
}

// #endregion

//#region Map 相关

// 假定所有 Map 的 value 中的值是可以为 undefined 的

/**
 * 获取 key 的 value，如果 key 不存在则 set value 并返回此 value
 * @param map 
 * @param key 
 * @param value 
 * @returns 指定 key 最新的 value
 * @since 2.12.0.230706 2023-07-06
 */
// eslint-disable-next-line @typescript-eslint/ban-types
function getOrSetIfAbsent<K extends object, V>(map: WeakMap<K, V>, key: K, value: V){
  if(!map.has(key)){
    map.set(key, value)
    return value
  }
  return map.get(key) as V
}

/**
 * 计算指定 key 的旧 value 映射到新 value。
 * 如果 map 中原本就没有则旧 value 为 undefined。
 * 
 * 类似 java 的 Map#compute
 * @param map 
 * @param key 
 * @param remappingFunction 
 * @returns 新 value
 * @since 2.12.0.230706 2023-07-06
 */
// eslint-disable-next-line @typescript-eslint/ban-types
function compute<K extends object, V>(map: WeakMap<K, V>, key: K, remappingFunction: (value: V | undefined, key: K) => V){
  const oldValue = map.get(key)
  const newValue = remappingFunction(oldValue, key)
  // 添加或覆盖旧值
  map.set(key, newValue)
  return newValue
}

/**
 * 如果 key 不存在，则计算指定 key 的新 value。
 * 
 * 类似 java 的 Map#computeIfAbsent
 * @param map 
 * @param key 
 * @param mappingFunction 
 * @returns 指定 key 最新的 value
 * @since 2.12.0.230706 2023-07-06
 */
// eslint-disable-next-line @typescript-eslint/ban-types
function computeIfAbsent<K extends object, V>(map: WeakMap<K, V>, key: K, mappingFunction: (key: K) => V) {
  if(!map.has(key)){
    const newValue = mappingFunction(key)
    map.set(key, newValue)
    return newValue
  }
  return map.get(key) as V
}

/**
 * 如果 key 存在，则计算指定 key 的旧 value 映射到新 value。
 * 
 * 类似 java 的 Map#computeIfPresent
 * @param map 
 * @param key 
 * @param remappingFunction 
 * @returns 指定 key 最新的 value，如果 key 不存在则返回 undefined
 * @since 2.12.0.230706 2023-07-06
 */
// eslint-disable-next-line @typescript-eslint/ban-types
function computeIfPresent<K extends object, V>(map: WeakMap<K, V>, key: K, remappingFunction: (value: V, key: K) => V){
  if(map.has(key)){
    const oldValue = map.get(key) as V
    const newValue = remappingFunction(oldValue, key)
    map.set(key, newValue)
    return newValue
  }
  return undefined
}

/**
 * 如果 key 不存在，则设置值。否则使用函数计算旧值与设置值，返回新值。
 * 
 * 类似 java 的 Map#merge
 * @param map 
 * @param key 
 * @param value 
 * @param remappingFunction 
 * @returns 指定 key 最新的 value
 * @since 2.12.0.230706 2023-07-06
 * @example
 * 对于合并字符串很有用：
 * ```ts
 * const msg = 'msg'
 * merge(map, key, msg, (a,b) => a.concat(b)) // 如果 key 不存在则为 msg，否则则为旧 value + msg
 * ```
 */
// eslint-disable-next-line @typescript-eslint/ban-types
function merge<K extends object, V>(map: WeakMap<K, V>, key: K, value: V, remappingFunction: (oldValue: V, value: V) => V){
  const newValue = !map.has(key) ? value : remappingFunction(map.get(key) as V, value)
  map.set(key, newValue)
  return newValue
}

// 统一导出
export {
  getOrSetIfAbsent as mapGetOrSetIfAbsent,
  compute as mapCompute,
  computeIfAbsent as mapComputeIfAbsent,
  computeIfPresent as mapComputeIfPresent,
  merge as mapMerge,
}
//#endregion

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

// #region 异常相关

/**
 * 抛出一个异常，可以用在表达式需要的地方，解除对 throw 语句的限制 \
 * 类似于 throw new Error(message)
 * @param message 异常消息
 * @example const v = undefined ?? throwError()
 * @version 2.7.0.230507
 * @since 2.7.0.230507
 */
export function throwError(message?: string): never{
  throw new Error(message)
}

/**
 * 如果值存在则返回该值，否则抛出错误
 * @param v 值
 * @param msg 错误消息
 * @returns -
 * @since 2.10.0.230628
 * @deprecated 暂未使用临时标记
 */
export function required<T>(v: T, msg?: string){
  if(v === undefined || v === null) throw new Error(msg)
  return v
}

// #endregion

// #region any 类型的工具类

/**
 * 先给定参数，再给函数并执行返回。 \
 * 类似于 IIFE 函数和参数互换位置
 * ```
 * give(1,2)((a,b) => a + b) === ((a,b) => a + b)(1,2) // 3
 * give(1)(v => v + 1) === (v => v + 1)(1) // 2
 * ```
 * 
 * 单参数可用于缩短变量 又不需要定义中间变量，也不用有 with 的作用域烦恼 \
 * 类似于 Kotlin 的 Any.let，JS 的 Array.map 但只是单个变量。
 * 
 * 注：其实也可以用 IIFE 来重用长名称引用：
 * ```js
 * (v => v + 1)(1) // 2
 * ```
 * 
 * 函数名由来： \
 * 叫 let 比较方便，但是 let 在严格模式是关键字不可用。 \
 * 类似于 with，但是 with 是关键字不可用。 \
 * 叫 map 会和 Map 类型混淆。 \
 * 叫 use 会和组合式函数混淆。 \
 * let 和 give 类似，就叫 give 吧。。。
 * @param v 不定长参数
 * @example
 * give(1)(v => v + 1) // 2
 * @version 2.9.0.230508 feat: give 支持多参数 \
 *          2.8.0.230508 new
 * @since 2.8.0.230508
 */
export function give<P extends Array<unknown>>(...v: P) {
  return function<R>(func: (...v: P) => R) {
    return func(...v)
  }
}

// #endregion


/**
 * 缺省值，为了 vue3 的 prop 中区分判断无传参和传入undefined而出现。\
 * 并通过 import 解决新版本的vue（^3.2.6）报错的问题
 * @since 0.0.1-alpha.210908
 */
export const isAbsent = Symbol()
