import { effectScope, onScopeDispose, type EffectScope } from 'vue'

/**
 * 创建可共享的可组合项
 * @param composable 可组合项
 * @returns 可共享的可组合项
 * @link https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md#example-a-shared-composable 有修改
 * @since 2023-07-20
 * @changeLog
 *    2023-09-16 优化 ts 签名
 *    2023-07-20 修改成 ts 版本，并且 if 判断 scope
 */
export function createSharedComposable<S, A extends unknown[], F extends (...args: A) => S>(composable: F) {
  let subscribers = 0
  let state: S | null | undefined, scope: EffectScope | null | undefined

  const dispose = () => {
    if (scope && --subscribers <= 0) {
      scope.stop()
      state = scope = null
    }
  }

  return ((...args: A) => {
    subscribers++
    if (!scope) {// 此处从 state 改为 scope，因为需要考虑正常返回的 state 也是假值
      scope = effectScope(true)
      state = scope.run(() => composable(...args)) as S // 确定此时不是 stop 故一定非空
    }
    onScopeDispose(dispose)
    return state as S // 此处返回的 state 一定非空，因为如果是空则会进入上面的 if 进行初始化。逻辑上除非 dispose 在上一行中被立即运行。
  }) as F // 其实签名和传入的参数一样，这里强制转型是为了识别带泛型的函数。
}