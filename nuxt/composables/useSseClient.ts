
import type { NitroFetchRequest } from 'nitropack'
import { safeDestr } from 'destr'
import { tryOnScopeDispose } from '@vueuse/core'
/**
 * Service-Send Events（SSE）客户端组合式工具
 * @since 2023-12-19
 * @version 2023-12-22 为onReceive函数增加泛型支持
 * @changeLog
 *        2023-12-22 为onReceive函数增加泛型支持
 *        2023-12-19 初始版本
 */
export function useSseClient(url: NitroFetchRequest){
  const receiveHandlerList: ((data: unknown) => void)[] = []
  const eventSource = new EventSource(url as string)
  eventSource.onmessage = (event) => {
    console.log(event.data)
    const data = safeDestr(event.data)
    receiveHandlerList.map(f => f(data))
  }
  eventSource.onerror = (event) => {
    console.error('EventSource failed:', event);
    eventSource.close();
  }
  eventSource.addEventListener('close', () => {
    console.log('Server will close the the connection ...')
    eventSource.close();
  })
  tryOnScopeDispose(() => {
    eventSource.close();
  })
  return {
    /**
     * 接收消息回调
     * @param receiveHandler 
     */
    onReceive<T>(receiveHandler: (data: T) => void){
      receiveHandlerList.push(receiveHandler)
    },
    /**
     * 客户端关闭 SSE 连接
     */
    close(){
      eventSource.close();
    }
  }
}