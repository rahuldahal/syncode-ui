import { Label } from '../ui/label';
import { Input } from '../ui/input';
import ListUsers from './list-users';
import { Button } from '../ui/button';
import { Websocket } from '@/types/socket';
import { useEffect, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { DialogFooter } from '../ui/dialog';

interface TExpectedResponse {
  id: number;
  username: string;
}

interface LiveSearchProps {
  socket: Websocket;
  searchUser: (username: string) => void;
  invite: (userSelected: TExpectedResponse) => void;
  submiting: boolean;
}

export default function LiveSearch({
  socket,
  searchUser,
  invite,
  submiting,
}: LiveSearchProps) {
  const [query, setQuery] = useState<string>('');
  const [result, setResult] = useState<TExpectedResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userSelected, setUserSelected] = useState<TExpectedResponse | null>(
    null,
  );

  useEffect(() => {
    if (socket) {
      const handleSearchResult = (data: TExpectedResponse[]) => {
        console.log('Message from server:', data);
        setResult(data);
        setLoading(false);
      };

      socket.on('onSearchResult', handleSearchResult);

      return () => {
        socket.off('onSearchResult', handleSearchResult);
      };
    }
  }, [socket]);

  useEffect(() => {
    if (query.length >= 3) {
      setLoading(true);
      searchUser(query);
    } else {
      setResult([]);
    }
  }, [query]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log({ userSelected });

        userSelected && invite(userSelected);
      }}
    >
      <Label htmlFor="username" className="capitalize">
        Username
      </Label>
      <Input
        id="username"
        type="text"
        placeholder="abhisek_g"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setQuery(e.currentTarget.value.toLowerCase())
        }
      />
      {loading && <LoaderCircle className="block m-auto mt-1 animate-spin" />}

      <ListUsers
        users={result}
        onSelectUser={(username: TExpectedResponse) => {
          setUserSelected(username);
        }}
      />

      {query.length >= 3 && result.length === 0 && (
        <p className="mt-1">No result found</p>
      )}
      <DialogFooter>
        {submiting ? (
          <Button>Loading...</Button>
        ) : (
          <Button type="submit">Invite</Button>
        )}
      </DialogFooter>
    </form>
  );
}
