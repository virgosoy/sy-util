
import type { NitroFetchRequest } from 'nitropack'
import { safeDestr } from 'destr'
import { tryOnScopeDispose } from '@vueuse/core'
import { fetchEventSource } from '@microsoft/fetch-event-source'

/** 关闭处理器 */
type CloseHandler = () => void
/** 接收信息处理器 */
type ReceiveHandler<ED> = (
  {event, data}: _Convert<ED>
) => void

/**
 * 把 A 转成 B
 * ```ts
 * type A = {
 *   'a' : number
 *   'b' : string
 *   ...
 * }
 * type B = {
 *   event: 'a'
 *   data: number
 * } | {
 *   event: 'b'
 *   data: string
 * } | ...
 * ```
 */
type _Convert<T> = {
  [K in keyof T]: {
    event: K;
    data: T[K];
  }
}[keyof T];


/**
 * Service-Send Events（SSE）客户端组合式工具
 * @template EventDataRes 响应类型 \
 *   为对象，key 为 event，value 为对应 event 的 data 的类型，如
 *   ```ts
 *   type A = { 'data' : string, 'timestamp' : number }
 *   ```
 * @example
 * ```ts
 * const sse = useSseClient<{'data' : {myres: string}}>('/api/mysse', {method: 'POST', body: {myreq: 'hello world'}})
 * sse.onReceive(({data}) => {
 *   console.log(data.myres)
 * })
 * sse.onClose(() => {
 *   console.log('close')
 * })
 * // 或
 * const sse = useSseClient<{'data' : {myres: string}}>(
 *   '/api/mysse', 
 *   {
 *     method: 'POST', 
 *     body: {myreq: 'hello world'},
 *     receiveHandlers: [({data}) => {
 *       console.log(data.myres)
 *       // 由于是函数，所以这里可以获取到 sse 对象
 *       // sse.close()
 *     }],
 *     closeHandlers: [() => {
 *       console.log('close')
 *     }],
 *   }
 * )
 * ```
 * @since 2023-12-19
 * @version 2024-07-04 fix: 浏览器最小化时中断请求
 * @changeLog
 *          2024-07-04 fix: 浏览器最小化时中断请求
 *          2024-07-03 ⚡onReceive 参数修改成对象，可读取 event。自定义关闭事件。初始化时可传递回调函数。
 *                     ⚡泛型修改成对应事件的数据类型
 *                     ⚡去掉事件会触发客户端关闭
 *          2023-12-28 添加服务端关闭处理函数
 *          2023-12-22 为onReceive函数增加泛型支持，替换EventSource实现为fetchEventSource并支持泛型，fix: 请求头有误
 *          2023-12-19 初始版本
 */
export function useSseClient<
  EventDataRes, 
  Req = any, 
>(
  url: NitroFetchRequest, 
  opt?: {
    method?: 'GET' | 'POST' | 'get' | 'post', 
    body?: Req
    receiveHandlers?: ReceiveHandler<EventDataRes>[]
    /** 当服务器发送完毕会触发 */
    serverCloseHandlers?: CloseHandler[]
  },
){
  const receiveHandlerList: ReceiveHandler<EventDataRes>[] = []
  receiveHandlerList.push(...(opt?.receiveHandlers ?? []))
  const serverCloseHandlerList: CloseHandler[] = []
  serverCloseHandlerList.push(...(opt?.serverCloseHandlers ?? []))

  const ctrl = new AbortController()
  fetchEventSource(url, {
    method: opt?.method,
    headers: {
        'Content-Type': 'application/json',
    },
    body: opt?.body === undefined ? undefined : JSON.stringify(opt.body),
    signal: ctrl.signal,
    openWhenHidden: true,
    onmessage(event) {
      console.debug(`[useSseClient]: fetchEventSource onmessage\nevent: ${event.event}\ndata: ${event.data}`)
      // 如果响应没有 data（标准是不能没有的，但实际可以没有），那么这里会是 空字符串，如果 safeDestr('') 会报错，故返回 undefined
      const data = event.data !== '' ? safeDestr(event.data) : undefined
      receiveHandlerList.map(f => f({
        event: event.event, 
        data
      } as _Convert<EventDataRes>))
    },
    onclose(){
      console.debug('[useSseClient]: fetchEventSource onclose')
      serverCloseHandlerList.map(f => f())
    },
    onerror(error) {
      console.debug('[useSseClient]: fetchEventSource onerror', error)
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
    onReceive(receiveHandler: ReceiveHandler<EventDataRes>){
      receiveHandlerList.push(receiveHandler)
    },
    /**
     * 客户端关闭 SSE 连接
     * 注意：由于中断需要时间，不是立即中断的，故中断后还可能会接收到消息。
     */
    close(){
      ctrl.abort()
    },
    /**
     * 关闭事件监听
     */
    onClose(closeHandler: CloseHandler){
      serverCloseHandlerList.push(closeHandler)
    },
  }
}