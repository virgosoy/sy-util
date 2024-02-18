
/**
 * Promise 工具类
 * 主要是处理多个 Promise 的组合调用
 * 
 * @version 0.2.0.230713
 * @changeLog
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
  const result = []
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