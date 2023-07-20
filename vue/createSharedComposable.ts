import { effectScope, onScopeDispose, type EffectScope } from 'vue'

/**
 * 创建可共享的可组合项
 * @param composable 可组合项
 * @returns 可共享的可组合项
 * @link https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md#example-a-shared-composable 有修改
 * @since 2023-07-20
 */
export function createSharedComposable<S, A extends unknown[]>(composable: (...args: A) => S) {
  let subscribers = 0
  let state: S | null | undefined, scope: EffectScope | null | undefined

  const dispose = () => {
    if (scope && --subscribers <= 0) {
      scope.stop()
      state = scope = null
    }
  }

  return (...args: A) => {
    subscribers++
    if (!scope) {// 此处从 state 改为 scope，因为需要考虑正常返回的 state 也是假值
      scope = effectScope(true)
      state = scope.run(() => composable(...args))! // 确定此时不是 stop 故加 !
    }
    onScopeDispose(dispose)
    return state
  }
}