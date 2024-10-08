import { toast } from 'sonner';
import { debounce } from 'lodash';
import CodeEditor from './code-editor';
import LiveSearch from './live-search';
import Collaborate from './invite-dialog';
import useAuthStore from '@/store/auth.store';
import useEditorStore from '@/store/editor.store';
import { Navigate } from '@tanstack/react-router';
import useWebSocket from '@/hooks/use-websockets';
import { useEffect, useMemo, useState } from 'react';
import { ProjectsFilesBox } from '../projects-manager';

interface TExpectedResponse {
  id: number;
  username: string;
}

export default function Collaboration() {
  const [submiting, setSubmiting] = useState<boolean>(false);
  const { isAuthenticated, userInfo, fetchAccessToken } = useAuthStore();
  const { socketConnected, currentFile, setSocketConnected, clearEditor } =
    useEditorStore();
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

      socket.on('onInvitation', (data) => {
        console.log(data);
        toast.info(
          `Collab request: User ${data.sender.username} on file ${data.file.name}`,
        );
      });

      // Clean up the socket connection when component unmounts
      return () => {
        socket.disconnect();
      };
    }
  }, [socket]);

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

  function invite(userSelected: TExpectedResponse) {
    if (currentFile.id === 0) {
      return toast.error('No file is selected!');
    }

    console.log(`Shall invite ${userSelected?.username}`);

    if (socket && socketConnected && userInfo) {
      setSubmiting(true);
      socket.emit('invite', {
        sender: {
          id: userInfo.id,
          username: userInfo.username,
        },
        receiver: userSelected,
        file: {
          id: currentFile.id,
          name: currentFile.name,
        },
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
            <LiveSearch
              socket={socket}
              invite={invite}
              searchUser={searchUser}
              submiting={submiting}
            />
          }
        />
      </div>
      <CodeEditor
        currentFileId={currentFile.id}
        onLoad={onLoad}
        onChange={onChange}
      />
    </>
  );
}
