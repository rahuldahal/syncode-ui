import { Socket } from 'socket.io-client';

interface DefaultEventsMap {
  [event: string]: (...args: any[]) => void;
}

export type Websocket = Socket<DefaultEventsMap, DefaultEventsMap> | null;
