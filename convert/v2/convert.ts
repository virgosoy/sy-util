/**
 * 类型转换
 * @version 2.0.0.220428
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
