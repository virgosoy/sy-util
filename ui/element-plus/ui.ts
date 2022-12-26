/**
 * UI工具类，为了统一UI用，此库不允许被本项目其他东西所依赖，仅提供给外部用。
 *
 * 建议本文件为单独文件，也不依赖本项目的其他文件
 *
 * @version 0.2.0.221222 统一一下 UI 的方法，故不向下兼容
 * @changeLog
 *          0.2.0.221222 统一一下 UI 的方法，故不向下兼容
 *          0.1.0.210913
 * @depentOn
 *          element-plus 1.1.0-beta.9 ~ 2.2.26
 */

// 自动导入
// import { ElMessage, ElMessageBox } from 'element-plus'
import type { Ref } from 'vue'

/**
 * 成功的消息
 * @param message 消息
 */
export function notifyOfSuccess(message: string) {
  ElMessage.success({ message, type: 'success', showClose: true, duration: 3000 })
}

/**
 * 失败的消息
 * @param message 消息/消息数组
 */
export function notifyOfError(message: Array<string>): void
export function notifyOfError(message: string): void
export function notifyOfError(message: string | Array<string>): void {
  if (Array.isArray(message)) {
    message.forEach((v) => {
      setTimeout(() => _notifyOfError(v), 0)
    })
  } else {
    _notifyOfError(message)
  }
}

/**
 * 内部调用失败的消息方法
 * @param message 消息
 */
function _notifyOfError(message: string) {
  ElMessage.error({ message, type: 'error', showClose: true, duration: 3000 })
}

/**
 * 弹出确认框
 * @param message 消息
 * @returns
 */
export function confirm(message: string): Promise<any> {
  return ElMessageBox.confirm(message, {
    cancelButtonText: '取消',
    confirmButtonText: '确定',
    type: 'warning',
  })
}

// #region UI 顶层工具类，其实已经和具体 UI 实现关系不大了

/**
 * 做一些事情，同时更改传入的状态，UI提示
 * @param {Function} callback 回调函数
 * @param {import('vue').Ref<boolean>} doingRef 进行中的状态ref，可省略。
 * @param {string} successMessage 成功的消息，可选。默认不会提示。
 */
export async function doSomething(callback: () => Promise<any> | void, successMessage?: string): Promise<void>
export async function doSomething(callback: () => Promise<any> | void, doingRef?: Ref<boolean>, successMessage?: string): Promise<void>
export async function doSomething(arg1: () => Promise<any> | void, arg2?: Ref<boolean> | string, arg3?: string): Promise<void> {
  const callback = arg1
  let doingRef: Ref<boolean> | undefined
  let successMessage: string | undefined
  // doingRef参数可省略
  if (typeof (arg2) === 'string') {
    doingRef = undefined
    successMessage = arg2
  } else {
    doingRef = arg2
    successMessage = arg3
  }

  doingRef && (doingRef.value = true)
  try {
    await callback()
    successMessage && notifyOfSuccess(successMessage)
  } catch (e: any) {
    notifyOfError(e.message)
  } finally {
    doingRef && (doingRef.value = false)
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
    successText && notifyOfSuccess(successText)
    return result
  } catch (e) {
    notifyOfError((e as Error).message)
    throw e
  }
}

// #endregion

const UI = {
  notifyOfSuccess,
  notifyOfError,
  confirm,
  doSomething,
  tryDo,
}

export default UI
