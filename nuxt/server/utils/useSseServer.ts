import { type ServerResponse, type IncomingMessage } from 'http';

/**
 * Service-Send Events（SSE）服务端组合式工具
 * @since 2023-12-19
 * @version 2023-12-19
 */
export function useSseServer<T extends IncomingMessage>(req: IncomingMessage, res: ServerResponse<T>) {
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
