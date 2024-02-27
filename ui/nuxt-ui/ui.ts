/**
 * UI 工具类，封装一些常用的 UI
 *
 * 依赖 nuxt ui
 *
 * changelog
 * - 2024-02-26 基于 quasar 修改成 nuxt ui
 * - 2023-09-12 新增 tryCall 方法
 */


export function notifyOfSuccess(message: string) {
  const toast = useToast()
  return toast.add({
    title: message,
  })
}

export function notifyOfError(message: string) {
  const toast = useToast()
  return toast.add({
    title: message,
    color: 'red',
  })
}

export function notifyOfInfo(message: string) {
  const toast = useToast()
  return toast.add({
    title: message,
    color: 'orange',
  })
}

export function confirm(message: string) {
  throw new Error('not supported function')
  // return Dialog.create({
  //   title: 'Confirm',
  //   message,
  //   cancel: true,
  // })
}

/**
 * 提示确认，看起来是个 prompt，但实际效果等同 confirm，就是为了输入指定文本后才能确认。避免误操作。
 * @param message 提示的消息
 * @param confirmString 确认文本，输入此文本才能确认。
 * @returns
 */
export function promptConfirm(message: string, confirmString: string) {
  throw new Error('not supported function')
  // return Dialog.create({
  //   title: 'Confirm',
  //   message,
  //   prompt: {
  //     model: '',
  //     isValid: val => val === confirmString,
  //     type: 'text',
  //   },
  //   cancel: true,
  // })
}

// #region UI 顶层工具类，其实已经和具体 UI 实现关系不大了

type DoSomethingOptions = {
  /**
   * 发送错误的时候是否继续抛出，默认 false
   */
  isThrowWhenError: boolean
}

/**
 * 做一些事情，进行 UI 提示。会抑制住错误。
 * @param callback 要做的事情的回调函数
 * @param options
 */
export async function doSomething(
  callback: () => Promise<unknown> | void,
  options?: DoSomethingOptions
): Promise<undefined>
/**
 * 做一些事情，进行 UI 提示。会抑制住错误。
 * @param callback 要做的事情的回调函数
 * @param successText 可选，成功时的提示文本。默认不提示（空字符串也会不提示）
 * @param options
 */
export async function doSomething(
  callback: () => Promise<unknown> | void,
  successText?: string,
  options?: DoSomethingOptions
): Promise<undefined>
/**
 *
 * @param callback 要做的事情的回调函数
 * @param params 可选，回调函数的参数，在这里弄可以让 ts 对参数的一些断言不会因为传入回调而失效，也可以让回调函数简单。
 * @param successText 可选，成功时的提示文本。默认不提示（空字符串也会不提示）
 * @param options
 */
export async function doSomething<P extends Array<unknown> = unknown[]>(
  callback: (...params: P) => Promise<unknown> | void,
  params?: P,
  successText?: string,
  options?: DoSomethingOptions
): Promise<undefined>

// 参数判断
export async function doSomething(
  callback: () => Promise<unknown> | void,
  arg1?: unknown[] | string | DoSomethingOptions,
  arg2?: string | DoSomethingOptions,
  arg3?: DoSomethingOptions
) {
  if (typeof arg2 === 'string') {
    // 4个参数
    return await _doSomething(callback, arg1 as unknown[], arg2, arg3)
  } else if (typeof arg1 === 'string') {
    // 3个参数
    return await _doSomething(
      callback,
      undefined,
      arg1,
      arg2 as DoSomethingOptions
    )
  }
  // 2个参数
  return await _doSomething(
    callback,
    undefined,
    undefined,
    arg1 as DoSomethingOptions
  )
}
// 全参数实现
async function _doSomething(
  callback: (...params: unknown[]) => Promise<unknown> | void,
  params: unknown[] = [],
  successText?: string,
  { isThrowWhenError = false }: DoSomethingOptions = { isThrowWhenError: false }
) {
  try {
    await callback(...params)
    successText && UI.notifyOfSuccess(successText)
  } catch (e) {
    UI.notifyOfError((e as Error).message)
    if (isThrowWhenError) {
      throw e
    }
  }
}

// ------ tryDo 比 doSomething 更加简单灵活 ------

/**
 * 执行回调函数，如果有错误则提示错误信息，然后继续抛出。
 * @param callback 回调函数
 * @param params 传入回调函数的参数
 * @returns 回调函数执行后的返回值
 */
export async function tryDo<P extends unknown[], R>(
  callback: (...params: P) => R,
  ...params: P
): Promise<Awaited<R>>

/**
 * 执行回调函数，如果有错误则提示错误信息，然后继续抛出。如果成功则进行提示。
 * @param successText 成功时显示文本，空字符串（falsy）时不会提示
 * @param callback 回调函数
 * @param params 传入回调函数的参数
 * @returns 回调函数执行后的返回值
 */
export async function tryDo<P extends unknown[], R>(
  successText: string,
  callback: (...params: P) => R,
  ...params: P
): Promise<Awaited<R>>
// 参数判断
export async function tryDo<P extends unknown[], R>(
  arg1: string | ((...params: P) => R),
  arg2: ((...params: P) => R) | unknown,
  ...params: P
): Promise<Awaited<R>> {
  if (typeof arg1 === 'string') {
    return _tryDo(arg1, arg2 as (...params: P) => R, ...params)
  } else {
    return _tryDo('', arg1, ...([arg2, ...params] as P))
  }
}
// 全参数实现
async function _tryDo<P extends unknown[], R>(
  successText: string,
  callback: (...params: P) => R,
  ...params: P
): Promise<Awaited<R>> {
  try {
    const result = await callback(...params)
    successText && UI.notifyOfSuccess(successText)
    return result
  } catch (e) {
    UI.notifyOfError((e as Error).message)
    throw e
  }
}

// #region ------ tryCall 比 tryDo 增强了泛型异步函数的推断 ------

/**
 * 任意函数类型
 * @since 2023-09-12
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FunctionType = (...params: any[]) => unknown

/**
 * 传入回调函数，返回增强的函数。\
 * 调用返回的函数时，如果有错误则提示错误信息，然后继续抛出。如果成功则进行提示。
 *
 * 类似 {@link tryDo} ，但强化泛型函数的推断，并且有可能非异步（返回的函数与传入的函数签名相同，即传入非异步返回也是非异步）\
 * 由于用法不同故新增了方法。
 * @param callback 回调函数
 * @returns 返回一个函数，对传入的函数进行增强，即加入了 UI 相关的 try-catch。
 * @example
 * ```ts
    // type F = <T>(a: T) => T
    function f<T>(a: T){ return a }
    async function fa<T>(a: T){ return a }
    function fn(a: number){ return a }

    const r1 = tryCall(f)(1) // 1
    const r2 = tryCall(f<number>)(1) // number
    const r3 = tryCall(fn)(1) // number
    const r4 = tryCall(fa)(1) // Promise<number>
    const r5 = tryCall(Promise.all.bind(Promise))([1]) // Promise<[number]>
    // 与 tryDo 对比的增强：
    const rd1 = tryDo(f, 1) // tryDo 识别范围过大：Promise<number>
    const rd5 = tryDo(Promise.all.bind(Promise), [1]) // tryDo 识别范围过大：Promise<unknown[] | []>
 * ```
 * @since 2023-09-12
 */
export function tryCall<F extends FunctionType>(callback: F): F

/**
 * 传入回调函数，返回增强的函数。\
 * 调用返回的函数时，如果有错误则提示错误信息，然后继续抛出。如果成功则进行提示。
 *
 * 类似 {@link tryDo} ，但强化泛型函数的推断，并且有可能非异步（返回的函数与传入的函数签名相同，即传入非异步返回也是非异步）\
 * 由于用法不同故新增了方法。
 * @param successText 成功时显示文本，空字符串（falsy）时不会提示
 * @param callback 回调函数
 * @returns 返回一个函数，对传入的函数进行增强，即加入了 UI 相关的 try-catch。
 * @example
 * ```ts
    // type F = <T>(a: T) => T
    function f<T>(a: T){ return a }
    async function fa<T>(a: T){ return a }
    function fn(a: number){ return a }

    const r1 = tryCall('success', f)(1) // 1
    const r2 = tryCall('success', f<number>)(1) //number
    const r3 = tryCall('success', fn)(1) // number
    const r4 = tryCall('success', fa)(1) // Promise<number>
    const r5 = tryCall('success', Promise.all.bind(Promise))([1]) // Promise<[number]>
    // 与 tryDo 对比的增强：
    const rd1 = tryDo('success', f, 1) // tryDo 识别范围过大：Promise<number>
    const rd5 = tryDo('success', Promise.all.bind(Promise), [1]) // tryDo 识别范围过大：Promise<unknown[] | []>
 * ```
 * @since 2023-09-12
 */
export function tryCall<F extends FunctionType>(
  successText: string,
  callback: F
): F
// 参数判断
export function tryCall<F extends FunctionType>(arg0: string | F, arg1?: F) {
  if (typeof arg0 === 'string') {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return _tryCall(arg0, arg1!)
  } else {
    return _tryCall('', arg0)
  }
}
// 全参数实现
function _tryCall<F extends FunctionType>(successText: string, callback: F) {
  return function<P extends Parameters<F>>(...params: P) {
    try {
      const result = callback(...params)
      // 异步函数结果
      if (result instanceof Promise) {
        return result
          .then(r => {
            successText && UI.notifyOfSuccess(successText)
            return r
          })
          .catch(e => {
            UI.notifyOfError((e as Error).message)
            return Promise.reject(e)
          })
      }
      // 同步函数结果
      successText && UI.notifyOfSuccess(successText)
      return result
    } catch (e) {
      UI.notifyOfError((e as Error).message)
      throw e
    }
  } as F
}

// 仅返回异步函数的实现
// /**
//  * 如果函数是异步函数，那么签名不变，如果是同步函数，那么返回类型会被 Promise 包住。\
//  * 注：含有泛型的同步函数无法正确推断
//  * @template F 函数类型
//  */
// type WrapAsyncReturn<F extends FunctionType> = (F extends (...params: unknown[]) => Promise<unknown> ? F : (F extends (...args: infer A) => infer R ? (...args: A) => Promise<R> : F))
// /**
//  * 类似 {@link tryDo} ，但强化泛型异步函数的推断（泛型同步函数依然无法正确推断）
//  * 由于用法不同故新增了方法
//  * @param successText 成功时显示文本，空字符串（falsy）时不会提示
//  * @param callback 回调函数
//  * @returns 返回一个函数，对传入的函数进行增强，即加入了 UI 相关的 try-catch。
//  *    如果函数是异步函数，那么增强后签名不变，如果是同步函数，那么返回类型会被 Promise 包住。
//  * @example
//  * ```ts
//     // 泛型函数的一些限制
//     // type F = <T>(a: T) => T
//     function f<T>(a: T){
//       return a
//     }
//     async function fa<T>(a: T){
//       return a
//     }
//     function fn(a: number){
//       return a
//     }
//     const r1 = tryCall(f)(1) // unknown，无法正常推断
//     const r2 = tryCall(f<number>)(1) // 正常 Promise<number>
//     const r3 = tryCall(fn)(1) // 正常 Promise<number>
//     const r4 = tryCall(fa)(1) // 正常 Promise<number>
//  * ```
//  */
// function _tryCall<F extends FunctionType>(successText: string, callback: F) {
//   return (async function<P extends Parameters<F>>(...params: P) {
//     try {
//       const result = await callback(...params)
//       successText && UI.notifyOfSuccess(successText)
//       return result
//     } catch (e) {
//       UI.notifyOfError((e as Error).message)
//       throw e
//     }
//   }) as WrapAsyncReturn<F>
// }

// #endregion

// #endregion

export const UI = {
  notifyOfSuccess,
  notifyOfError,
  notifyOfInfo,
  confirm,
  promptConfirm,
  doSomething,
  tryDo,
  tryCall,
}
