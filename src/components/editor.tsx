import { toast } from 'sonner';
import { debounce } from 'lodash';
import AceEditor from 'react-ace';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import Collaborate from './collaboration';
import { DialogFooter } from './ui/dialog';
import useAuthStore from '@/store/auth.store';
import LoadingButton from './ui/loading-button';
import useEditorStore from '@/store/editor.store';
import { Navigate } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { ProjectsFilesBox } from './projects-manager';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { LoaderCircle } from 'lucide-react';
import useWebSocket from '@/hooks/use-websockets';
import { Websocket } from '@/types/socket';

const editorStyle = {
  width: '100vw',
  height: 'calc(100vh - (2rem + 2.5rem))',
};

// Set the path for Ace workers
(window as any).ace.config.set('workerPath', '/ace-workers/');

export default function Editor() {
  const [submiting, setSubmiting] = useState<boolean>(false);
  const { isAuthenticated, isLoading, userInfo, fetchAccessToken } =
    useAuthStore();
  const { socketConnected, currentFile, setSocketConnected, clearEditor } =
    useEditorStore();

  // Use the custom hook
  const { socket } = useWebSocket(import.meta.env.VITE_WEB_SOCKET_SERVER);

  // Use useMemo to create a memoized version of the debounced function
  const debouncedSendChange = useMemo(() => debounce(sendChange, 1000), []);

  useEffect(() => {
    fetchAccessToken();
    clearEditor();
  }, [fetchAccessToken, clearEditor]);

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('Connected to WebSocket server');
        setSocketConnected(true);
      });

      // Clean up the socket connection when component unmounts
      return () => {
        socket.disconnect();
      };
    }
  }, [socket]);

  if (isLoading || !socketConnected) {
    return <h1 className="text-2xl">Loading...</h1>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  function onLoad(e: any) {
    console.log('loaded', e);
  }

  function sendChange(newValue: string) {
    console.log('send value via websockets', newValue);
  }

  function onChange(newValue: string) {
    debouncedSendChange(newValue);
  }

  function invite() {
    if (currentFile.id === 0) {
      return toast.error('No file is seleced!');
    }

    if (socket && socketConnected && userInfo) {
      setSubmiting(true);
      socket.emit('invite', {
        sender: {
          id: userInfo.id,
          username: userInfo.username,
        },
        receiver: 3,
        filename: currentFile.name,
      });
    }
  }

  function searchUser(username: string) {
    if (socket && socketConnected && userInfo) {
      setSubmiting(true);
      socket.emit('search', {
        username,
      });
    }
  }

  return (
    <>
      <div>
        <ProjectsFilesBox />
        <Collaborate
          disabled={currentFile.id === 0}
          form={
            <SearchAndInvite
              socket={socket}
              invite={invite}
              searchUser={searchUser}
              submiting={submiting}
            />
          }
        />
      </div>
      <AceEditor
        className="mt-4"
        style={editorStyle}
        readOnly={currentFile.id === 0}
        onFocus={() =>
          currentFile.id === 0 && toast.error('No file is seleced!')
        }
        placeholder="Write your code here"
        mode="javascript"
        theme="monokai"
        name="Co Edit"
        onLoad={onLoad}
        onChange={onChange}
        fontSize={18}
        lineHeight={24}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
    </>
  );
}

interface SearchAndInviteProps {
  socket: Websocket;
  invite: () => void;
  searchUser: (username: string) => void;
  submiting: boolean;
}

interface TExpectedResponse {
  id: number;
  username: string;
}

function SearchAndInvite({
  socket,
  invite,
  searchUser,
  submiting,
}: SearchAndInviteProps) {
  const [query, setQuery] = useState<string>('');
  const [result, setResult] = useState<TExpectedResponse[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userSelected, setUserSelected] = useState<boolean>(false);

  useEffect(() => {
    // Check if socket exists before setting up listeners
    if (socket) {
      const handleSearchResult = (data: TExpectedResponse[]) => {
        console.log('Message from server:', data);

        setResult(data);
        setLoading(false);
      };

      // Register event listener
      socket.on('onSearchResult', handleSearchResult);

      // Clean up the event listener on component unmount
      return () => {
        socket.off('onSearchResult', handleSearchResult);
      };
    }
  }, [socket]);

  function liveSearch(queryToSearch: string) {
    console.log(queryToSearch);
    setLoading(true);

    searchUser(queryToSearch);
  }

  useEffect(() => {
    if (query.length >= 3) {
      liveSearch(query);
    } else {
      setResult([]);
    }
  }, [query]);

  useEffect(() => {
    if (result.length > 0) {
      setLoading(false);
    }
  }, [result]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        userSelected && invite();
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

      <ul className="mt-1">
        {result.map((item: TExpectedResponse, index: number) => (
          <li key={index}>
            <button
              type="button"
              onClick={() => setUserSelected(true)}
              aria-label={`Select ${item.username}`}
            >
              {item.username}
            </button>
          </li>
        ))}
      </ul>

      {query.length >= 3 && result.length === 0 && (
        <p className="mt-1">No result found</p>
      )}
      <DialogFooter>
        {submiting ? <LoadingButton /> : <Button type="submit">Invite</Button>}
      </DialogFooter>
    </form>
  );
}
