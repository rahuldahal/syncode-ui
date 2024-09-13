import UserList from './user-list';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useState, useEffect } from 'react';
import LoadingButton from '../ui/loading-button';
import { useWebSocket } from '@/hooks/use-websockets';
import { useLiveSearch } from '@/hooks/use-livesearch';
import { Websocket } from '@/types/socket';

const searchUser = (socket: Websocket, query: string) => {
  if (socket && query) {
    socket.emit('search-user', { query }); // Emit a WebSocket event to search for users
  }
};

const invite = (socket: Websocket, user: string) => {
  if (socket && user) {
    socket.emit('invite-user', { user }); // Emit a WebSocket event to invite the selected user
  }
};

export default function Editor() {
  const [query, setQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null); // Store the selected user's name
  const { result, loading, setLoading } = useLiveSearch(query, (q) =>
    searchUser(socket, q),
  ); // Pass the searchUser function with socket
  const socket = useWebSocket(import.meta.env.VITE_WEB_SOCKET_SERVER); // Hook for WebSocket connection

  // Handle result changes to stop loading
  useEffect(() => {
    if (result.length > 0) {
      setLoading(false);
    }
  }, [result, setLoading]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (selectedUser) {
          invite(socket, selectedUser); // Call the invite function with socket and selected user
        }
      }}
    >
      <Label htmlFor="username" className="capitalize">
        Username
      </Label>
      <Input
        id="username"
        type="text"
        placeholder="meghimire"
        onChange={(e) => setQuery(e.currentTarget.value.toLowerCase())}
      />
      {loading && <LoadingButton />}
      <UserList result={result} setSelectedUser={setSelectedUser} />
      {query.length >= 3 && result.length === 0 && (
        <p className="mt-1">No result found</p>
      )}
      <Button type="submit">Invite</Button>
    </form>
  );
}
