import io from 'socket.io-client';
import { Websocket } from '@/types/socket';
import { useEffect, useState } from 'react';

export function useWebSocket(url: string) {
  const [socket, setSocket] = useState<Websocket>(null);

  useEffect(() => {
    const newSocket = io(url, { withCredentials: true });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [url]);

  return socket;
}
