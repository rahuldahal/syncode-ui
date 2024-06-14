import io, { Socket } from 'socket.io-client';
import { debounce } from 'lodash';
import AceEditor from 'react-ace';
import { getCookie } from '@/utils';
import { useEffect, useMemo, useState } from 'react';
import useAuthStore from '@/store/auth.store';
import useEditorStore from '@/store/editor.store';
import { Navigate } from '@tanstack/react-router';
import { ProjectsFilesBox } from './projects-manager';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { toast } from 'sonner';
import { Button } from './ui/button';
import useFileStore from '@/store/file.store';

const editorStyle = {
  width: '100vw',
  height: 'calc(100vh - (2rem + 2.5rem))',
  // position: 'relative',
  // top: '-72px',
};

interface DefaultEventsMap {
  [event: string]: (...args: any[]) => void;
}

export default function Editor() {
  const [socket, setSocket] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(null);
  const { isAuthenticated, isLoading, userInfo, fetchAccessToken } =
    useAuthStore();
  const { files } = useFileStore();
  const { socketConnected, currentFile, setSocketConnected, clearEditor } =
    useEditorStore();

  //   Use useMemo to create a memoized version of the debounced function
  const debouncedSendChange = useMemo(() => debounce(sendChange, 1000), []);

  useEffect(() => {
    fetchAccessToken();
    clearEditor();
  }, [fetchAccessToken, clearEditor]);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_WEB_SOCKET_SERVER, {
      extraHeaders: {
        Authorization: `Bearer ${getCookie('accessToken')}`,
      },
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setSocketConnected(true);
    });

    newSocket.on('onInvitation', (data) => {
      console.log('Message from server:', data);
    });

    setSocket(newSocket);

    // Clean up the socket connection when component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []);

  if (isLoading || !socketConnected) {
    return <h1 className="text-2xl">Loading...</h1>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  //  File selection and editor

  function onLoad(e: any) {
    console.log('loaded', e);
  }

  function sendChange(newValue: string) {
    console.log('send value via websockets', newValue);
  }

  function onChange(newValue: string) {
    debouncedSendChange(newValue);
  }

  function handleCollaboration() {
    if (currentFile.id === 0) {
      return toast.error('No file is seleced!');
    }

    if (socket && socketConnected && userInfo) {
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

  return (
    <>
      <div>
        <ProjectsFilesBox />
        <Button
          className="ml-2"
          onClick={handleCollaboration}
          disabled={files.length === 0}
        >
          Collaborate
        </Button>
      </div>
      <AceEditor
        className="mt-4"
        style={editorStyle}
        readOnly={currentFile.id === 0 ? true : false}
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
