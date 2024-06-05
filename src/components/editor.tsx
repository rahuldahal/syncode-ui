import { debounce } from 'lodash';
import AceEditor from 'react-ace';
import { useMemo } from 'react';
import useAuthStore from '@/store/auth.store';
import { Navigate } from '@tanstack/react-router';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

const editorStyle = {
  width: '100vw',
  height: '100vh',
};

export default function Editor() {
  const { isAuthenticated } = useAuthStore();

  // Use useMemo to create a memoized version of the debounced function
  const debouncedSendChange = useMemo(() => debounce(sendChange, 1000), []);

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

  return (
    <AceEditor
      style={editorStyle}
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
  );
}
