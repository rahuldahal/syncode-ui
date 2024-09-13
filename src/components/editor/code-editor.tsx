import AceEditor from 'react-ace';
import { debounce } from 'lodash';
import { useMemo } from 'react';
import { toast } from 'sonner';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

const editorStyle = {
  width: '100vw',
  height: 'calc(100vh - (2rem + 2.5rem))',
};

interface CodeEditorProps {
  currentFile: { id: number; name: string };
  onFileUpdate: (newValue: string) => void;
}

export default function CodeEditor({
  currentFile,
  onFileUpdate,
}: CodeEditorProps) {
  const debouncedSendChange = useMemo(() => debounce(onFileUpdate, 300), []);

  function onChange(newValue: string) {
    debouncedSendChange(newValue);
  }

  function onLoad(e: any) {
    console.log('Editor loaded', e);
  }

  return (
    <AceEditor
      className="mt-4"
      style={editorStyle}
      readOnly={currentFile.id === 0 ? true : false}
      onFocus={() =>
        currentFile.id === 0 && toast.error('No file is selected!')
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
  );
}
