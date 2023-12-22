
import type { NitroFetchRequest } from 'nitropack'
import { safeDestr } from 'destr'
import { tryOnScopeDispose } from '@vueuse/core'
import { fetchEventSource } from '@microsoft/fetch-event-source'
/**
 * Service-Send Events（SSE）客户端组合式工具
 * @since 2023-12-19
 * @version 2023-12-22 为onReceive函数增加泛型支持，替换EventSource实现为fetchEventSource并支持泛型
 * @changeLog
 *        2023-12-22 为onReceive函数增加泛型支持，替换EventSource实现为fetchEventSource并支持泛型
 *        2023-12-19 初始版本
 */
export function useSseClient<Res, Req = any>(url: NitroFetchRequest, opt?: {method?: 'GET' | 'POST' | 'get' | 'post', body?: Req}){
  const receiveHandlerList: ((data: Res) => void)[] = []

  const ctrl = new AbortController();
  fetchEventSource(url, {
    method: opt?.method,
    body: opt?.body === undefined ? undefined : JSON.stringify(opt.body),
    signal: ctrl.signal,
    onmessage(event) {
      if (event.event === 'close') {
        console.log(`Close event trigger. Server will close the the connection ...`,  event)
        ctrl.abort()
        return
      }
      console.log(`event: ${event.event} data: ${event.data}`)
      const data = safeDestr<Res>(event.data)
      receiveHandlerList.map(f => f(data))
    },
    onerror(error) {
      // console.error('EventSource failed:', error)
      throw error;
    },
  })
  tryOnScopeDispose(() => {
    ctrl.abort()
  })
  return {
    /**
     * 接收消息回调
     * @param receiveHandler 
     */
    onReceive(receiveHandler: (data: Res) => void){
      receiveHandlerList.push(receiveHandler)
    },
    /**
     * 客户端关闭 SSE 连接
     */
    close(){
      ctrl.abort()
    }
  }
}