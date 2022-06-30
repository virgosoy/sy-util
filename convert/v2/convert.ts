/**
 * 类型转换
 * @version 2.1.0.220630 feat:numberToABC、numberFromABC
 * @changeLog
 *          2.1.0.220630 feat:numberToABC、numberFromABC
 *          2.0.0.220428
 */

/**
 * 列表转树形结构
 * @param source 源
 * @param options id 的 key，默认为 id；pid 的 key，默认为 pid。children 的 key；默认为 children。
 * @returns 树形结构，数据为 data，子为 children，不会修改原有数据的元素。
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toTreeKeepItem(source : any[], {idKey = 'id', pidKey = 'pid', childrenKey = 'children'} = {idKey: 'id', pidKey: 'pid', childrenKey : 'children'}) : any[] {
  const result : unknown[] = []
  const map = source.reduce((obj, item) => {
      obj[item[idKey]] = {data: item}
      return obj
  },{})
  source.map(item => {
      const parent = map[item[pidKey]]
      if(parent){
          (parent[childrenKey]??=[]).push(map[item[idKey]])
      }else{
          result.push(map[item[idKey]])
      }
  })
  return result
}

/**
 * 列表转树形结构
 * @param data 源数据
 * @param options id 的 key，默认为 id；pid 的 key，默认为 pid。children 的 key；默认为 children。
 * @returns 树形结构，子为 children，原有数据的元素一样会多个 children。
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toTree(data : any[], {idKey = 'id', pidKey = 'pid', childrenKey = 'children'} = {idKey: 'id', pidKey: 'pid', childrenKey : 'children'}) : any[]{
  const result : unknown[] = []
  if(!Array.isArray(data)) {
      return result
  }
  data.forEach(item => {
      delete item[childrenKey];
  });
  // 创建一个map，key为id，value为元素，用于后面快速定位到元素
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const map : any = {};
  data.forEach(item => {
      map[item[idKey]] = item;
  });
  data.forEach(item => {
      const parent = map[item[pidKey]];
      if(parent) {
          (parent[childrenKey] || (parent[childrenKey] = [])).push(item);
      } else {
          result.push(item);
      }
  });
  return result;
}

/**
 * groovy 字符串化
 * @param data 要转换的 json 对象
 * @returns groovy string
 */
export function groovyStringifyFromJson(data : unknown) : string{
  if(data == null){
    return 'null'
  }else if(typeof data === 'string'){
    return `'${data.replace(/'/mg,String.raw`\'`)}'`
  }else if(typeof data === 'number'){
    return `${data}`
  }else if(Array.isArray(data)){
    return `[${data.map(v => groovyStringifyFromJson(v)).join(', ')}]`
  }else if(typeof data === 'object'){ // 也不为 null
    const entries = Object.entries(data)
    if(entries.length === 0){
      return '[:]'
    }else{
      return `[${entries.map(([k,v])=> `${k}: ${groovyStringifyFromJson(v)}`).join(', ')}]`
    }
  }else{
    throw new Error(`未知的情况，data=${data}`)
  }
}

/**
 * 数字转 ABC，类似 excel 的列头，A=1
 * @param num
 * @returns
 * @since 2.1.0.220630
 */
 export function numberToABC(num: number) {
  // A=1 Z=26 ZZ=26^2+26 ZZZ=26^3+26^2+26 ...
  // 值x26^(位数-1)，如 BC = 2*26^1 + 3*26^0，CZ = 3*26^1 + 26*26^0
  if (num === NaN || num <= 0 || num % 1 !== 0) {
    throw new Error('仅支持正整数')
  }
  let result = ''
  let q = num
  do {
    // 先 -1 再进行处理(正常 A-Z 应该对应 1-26，但是取余只能 0-25)
    q = q - 1
    const r = q % 26 // 余
    q = (q - r) / 26 // 商
    const s = String.fromCharCode(65 + r) // 65 = A
    result = s + result
  } while (q !== 0 && result.length < 10000 /* 预防死循环 */)
  return result
}

/**
 * ABC 转数字，ABC 类似 excel 的列头，A=1
 * @param s
 * @returns
 * @since 2.1.0.220630
 */
export function numberFromABC(s: string) {
  const cs = [...s].map(c => c.charCodeAt(0))
  if (!cs.every(v => v >= 65 && v <= 65 + 26 - 1)) {
    throw new Error('仅支持大写字母A-Z')
  }
  return cs
    .map(v => v - 65 + 1)
    .reduce((r, v) => {
      r *= 26
      r += v
      return r
    }, 0)
}
