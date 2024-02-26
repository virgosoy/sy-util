
/**
 * Promise 工具类
 * 主要是处理多个 Promise 的组合调用
 * 
 * @version 0.3.0.240226 异步 map 系列方法：asyncMap、asyncSequentialMap、asyncParallelMap。
 * @changeLog
 *          0.3.0.240226 异步 map 系列方法：asyncMap、asyncSequentialMap、asyncParallelMap。
 *          0.2.0.230713
 *          0.1.0.230424
 */

/**
 * 队列，按顺序执行 promise \
 * 执行的 promise 需要写在 func 中，arr 只是作为提供数据，如果在 arr 中已经执行了 promise 那就没有队列效果了。
 * @param arr 
 * @param func 
 * @returns 单个 promise，结果为所有结果的数组。如果拒绝则仅返回拒绝结果，并停止往下执行。类似 Promise.all()
 * @since 0.1.0.230424
 */
export async function queue<T, R>(arr: T[], func: (v: T) => Promise<R>){
  const result: R[] = []
  for(const v of arr){
    result.push(await func(v))
  }
  return result;
}


// /**
//  * 返回的是 Promise 数组
//  * @param arr 
//  * @param func 
//  * @returns 
//  */
// function queue2<T, R>(arr: T[], func: (v: T) => Promise<R>){
//   const result = []
//   let onePromise = Promise.resolve() as Promise<R>
//   for(const v of arr){
//     onePromise = onePromise.then(() => func(v))
//     result.push(onePromise)
//   }
//   return result;
// }

// /**
//  * 和 queue2 效果一样
//  * @param arr 
//  * @param func 
//  * @returns 
//  */
// function queue3<T, R>(arr: T[], func: (v: T) => Promise<R>){
//   const result = [] as Promise<R>[]
//   arr.reduce((p,v) => {
//     const t = p.then(() => func(v))
//     result.push(t)
//     return t
//   }, Promise.resolve() as Promise<R>)
//   return result;
// }

// /* pnpm exec ts-node --skip-project ./server/utils/promiseUtils.ts */

/**
 * 异步 map \
 * 通过参数区分调用 {@link asyncParallelMap}、{@link asyncSequentialMap}，即为2者的别名。
 * @param arr 数组
 * @param func 回调函数
 * @param parallel 是否并行，默认 false
 * @returns 单个 promise，结果为所有结果的数组。\
 *  如果拒绝则仅返回拒绝结果，若为串行可以停止往下执行，并行则无法停止其他 promise 的运行。 \
 *  类似 Promise.all() 的返回类型
 * @since 0.3.0.240226
 */
export async function asyncMap<T, R>(
  arr: T[], 
  func: (value: T, index: number, array: T[]) => Promise<R>,
  parallel: boolean = false,
) {
  return (parallel ? asyncParallelMap : asyncSequentialMap)(arr, func)
}

/**
 * 异步串行 map \
 * 和 {@link queue} 执行一致，后者回调函数参数少。
 * @param arr 数组
 * @param func 回调函数
 * @returns 单个 promise，结果为所有结果的数组。 \
 *  如果拒绝则仅返回拒绝结果，并停止往下执行。 \
 *  类似 Promise.all() 的返回类型。
 * @since 0.3.0.240226
 */
export async function asyncSequentialMap<T, R>(
  arr: T[], 
  func: (value: T, index: number, array: T[]) => Promise<R>
) {
  const result: R[] = []
  for(const [index, value] of arr.entries()){
    result.push(await func(value, index, arr))
  }
  return result;
}

/**
 * 异步并行 map
 * @param arr 数组
 * @param func 回调函数
 * @returns 单个 promise，结果为所有结果的数组。 \
 *  如果拒绝则仅返回拒绝结果，但无法停止其他 promise 的运行。 \
 *  类似 Promise.all()
 * @since 0.3.0.240226
 */
export async function asyncParallelMap<T, R>(
  arr: T[], 
  func: (value: T, index: number, array: T[]) => Promise<R>
) {
  const promises: Promise<R>[] = []
  for(const [index, value] of arr.entries()){
    promises.push(func(value, index, arr))
  }
  return Promise.all(promises)
}

// function sleep(){
//   return new Promise(function(resolve){
//     setTimeout(() => resolve(''),Math.random() * 1000)
//   })
// }
// async function f(v: any) {
//   await sleep()
//   console.log(v)
//   return v
// }
// const result = queue([1,2,3,4],f)
// console.log({result})
// result.then(v => console.log(v))

/**
 * 一段时间后返回 resolve
 * @param ms 
 * @returns 
 * @since 0.2.0.230713
 */
export async function sleep(ms: number){
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms)
  })
}