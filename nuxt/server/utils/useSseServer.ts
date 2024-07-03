import { type ServerResponse, type IncomingMessage } from 'http';

/**
 * Service-Send Events（SSE）服务端组合式工具
 * @since 2023-12-19
 * @version 2024-07-03 增加可选参数，可之间传递客户端关闭处理器。
 *                     fix: 请求关闭不会触发关闭处理器。
 * @changeLog
 *          2024-07-03 增加可选参数，可之间传递客户端关闭处理器。
 *                     fix: 请求关闭不会触发关闭处理器。
 *          2024-07-02 重载 send 和 close 方法，可自定义事件
 *          2023-12-21 修改useSseServer函数参数为对象形式，修改方法名
 *          2023-12-19 初始版本
 * @example
 * ```ts
 * const sse = useSseServer(event.node)
 * sse.send('mydata') // 一般多次调用
 * sse.close()
 * ```
 */
export function useSseServer<T extends IncomingMessage>(
  {req, res}: {req: IncomingMessage, res: ServerResponse<T>},
  opts?: {clientCloseHandlers: (() => void)[]}
) {
  const clientCloseHandlerList: (() => void)[] = [];
  clientCloseHandlerList.push(...(opts?.clientCloseHandlers ?? []))
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
  req.on('close', () => {
    console.debug('[useSseServer]: req on close trigger - Client closed the connection')
  });
  req.on('end', () => {
    console.debug('[useSseServer]: req on end trigger')
  })
  res.on('close', () => {
    console.debug('[useSseServer]: res on close trigger')
    // 服务端结束掉
    res.end()
    clientCloseHandlerList.map(f => f())
  })

  /**
   * 发送数据
   * @param event
   * @param data
   */
  function send(event: string, data: string): void
  /**
   * 发送数据
   * @param data
   */
  function send(data: string): void
  /**
   * 发送数据
   * @param param0.event event
   * @param param0.data data
   */
  function send({event, data}: {event?: string, data: string}): void
  function send(arg1: string | {event?: string, data: string}, arg2?: string) {
    if(typeof arg2 === 'undefined'){
      if(typeof arg1 === 'string'){
        const data = arg1
        _w({data})
      }else{
        const {event, data} = arg1
        _w({event, data})
      }
    }else{
      const [event, data] = [arg1 as string, arg2]
      _w({event, data})
    }
  }

  /**
   * 如果字符串是 undefined，则返回空字符串，否则返回第二个参数。
   * 懒得用回调函数了
   */
  function _s(str: string | undefined, strOut: string){
    if(typeof str === 'undefined'){
      return ''
    }
    return strOut
  }

  /**
   * 写入响应消息
   * @param param0.event
   * @param param0.data
   */
  function _w({event, data}: {event?: string, data?: string}){
    console.log('[useSseServer]: ' + `${_s(event, `event: ${event}\n`)}${_s(data, `data: ${data}`)}`)
    res.write(`${_s(event, `event: ${event}\n`)}${_s(data, `data: ${data}\n`)}\n`);
  }

  return {
    /**
     * 客户端关闭回调
     * @param closeHandler
     */
    onClose(closeHandler: () => void) {
      clientCloseHandlerList.push(closeHandler);
    },
    send,
    /**
     * 服务端关闭
     */
    close({event, data}: {event?: string, data?: string} = {event: 'close', data: 'Server will close the connection ...'}) {
      console.log('[useSseServer]: call close - Close server connection');
      _w({event, data})
      res.end();
    },
  };
}
