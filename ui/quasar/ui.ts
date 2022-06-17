/**
 * UI 工具类，封装一些常用的 UI
 *
 * 依赖 quasar v2
 */

import { Notify, Dialog } from 'quasar'

export function notifyOfSuccess(message: string) {
  return Notify.create({
    type: 'positive',
    position: 'top',
    message,
    progress: true,
    actions: [{ icon: 'close', color: 'white' }],
  })
}

export function notifyOfError(message: string) {
  return Notify.create({
    type: 'negative',
    position: 'top',
    message,
    progress: true,
    actions: [{ icon: 'close', color: 'white' }],
  })
}

export function notifyOfInfo(message: string) {
  return Notify.create({
    type: 'info',
    position: 'top',
    message,
    progress: true,
    actions: [{ icon: 'close', color: 'white' }],
  })
}

export function confirm(message: string) {
  return Dialog.create({
    title: 'Confirm',
    message,
    cancel: true,
  })
}

/**
 * 提示确认，看起来是个 prompt，但实际效果等同 confirm，就是为了输入指定文本后才能确认。避免误操作。
 * @param message 提示的消息
 * @param confirmString 确认文本，输入此文本才能确认。
 * @returns
 */
export function promptConfirm(message: string, confirmString: string) {
  return Dialog.create({
    title: 'Confirm',
    message,
    prompt: {
      model: '',
      isValid: val => val === confirmString,
      type: 'text',
    },
    cancel: true,
  })
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

// #endregion

const UI = {
  notifyOfSuccess,
  notifyOfError,
  notifyOfInfo,
  confirm,
  promptConfirm,
  doSomething,
  tryDo,
}
export default UI
