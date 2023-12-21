import { type ServerResponse, type IncomingMessage } from 'http';

/**
 * Service-Send Events（SSE）服务端组合式工具
 * @since 2023-12-19
 * @version 2023-12-21 修改useSseServer函数参数为对象形式
 * @changeLog
 *        2023-12-21 修改useSseServer函数参数为对象形式
 *        2023-12-19 初始版本
 * @example
 * ```ts
 * const sse = useSseServer(event.node)
 * ```
 */
export function useSseServer<T extends IncomingMessage>({req, res}: {req: IncomingMessage, res: ServerResponse<T>}) {
  const closeHandlerList: (() => void)[] = [];
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
  req.on('close', () => {
    console.log('Client closed the connection');
    closeHandlerList.map(f => f());
  });
  return {
    /**
     * 客户端关闭回调
     * @param closeHandler
     */
    onClose(closeHandler: () => void) {
      closeHandlerList.push(closeHandler);
    },
    /**
     * 写数据
     * @param data
     */
    write(data: string) {
      res.write(`data: ${data}\n\n`);
    },
    /**
     * 服务端关闭
     */
    close() {
      console.log('Close server connection');
      res.write('event: close\ndata: Server will close the connection ...\n\n');
      res.end();
    },
  };
}
