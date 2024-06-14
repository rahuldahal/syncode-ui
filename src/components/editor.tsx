import io from 'socket.io-client';
import { debounce } from 'lodash';
import AceEditor from 'react-ace';
import { getCookie } from '@/utils';
import { useEffect, useMemo } from 'react';
import useAuthStore from '@/store/auth.store';
import useEditorStore from '@/store/editor.store';
import { Navigate } from '@tanstack/react-router';
import { ProjectsFilesBox } from './projects-manager';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { toast } from 'sonner';
import { Button } from './ui/button';

const editorStyle = {
  width: '100vw',
  height: 'calc(100vh - (2rem + 2.5rem))',
  // position: 'relative',
  // top: '-72px',
};

export default function Editor() {
  const { isAuthenticated, isLoading, fetchAccessToken } = useAuthStore();
  const { socketConnected, currentFile, setSocketConnected, clearEditor } =
    useEditorStore();

  //   Use useMemo to create a memoized version of the debounced function
  const debouncedSendChange = useMemo(() => debounce(sendChange, 1000), []);

  useEffect(() => {
    fetchAccessToken();
    clearEditor();
  }, [fetchAccessToken, clearEditor]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_WEB_SOCKET_SERVER, {
      extraHeaders: {
        Authorization: `Bearer ${getCookie('accessToken')}`,
      },
    });

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setSocketConnected(true);
    });

    if (socketConnected) {
      socket.on('message', (data) => {
        console.log('Message from server:', data);
      });
    }

    // Clean up the socket connection when component unmounts
    return () => {
      socket.disconnect();
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

  return (
    <>
      <div>
        <ProjectsFilesBox />
        <Button className="ml-2">Collaborate</Button>
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
