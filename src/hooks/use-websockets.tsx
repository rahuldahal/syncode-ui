import { Websocket } from '@/types/socket';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const useWebSocket = (url: string) => {
  const [socket, setSocket] = useState<Websocket>(null);
  const [socketConnected, setSocketConnected] = useState<boolean>(false);

  useEffect(() => {
    const newSocket = io(url, { withCredentials: true });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setSocketConnected(true);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [url]);

  return { socket, socketConnected };
};

export default useWebSocket;
