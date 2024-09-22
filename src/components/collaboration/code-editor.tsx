import { toast } from 'sonner';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/ext-language_tools';

const editorStyle = {
  width: '100vw',
  height: 'calc(100vh - (2rem + 2.5rem))',
};

interface CodeEditorProps {
  currentFileId: number;
  onLoad: (e: any) => void;
  onChange: (newValue: string) => void;
}

export default function CodeEditor({
  currentFileId,
  onLoad,
  onChange,
}: CodeEditorProps) {
  return (
    <AceEditor
      className="mt-4"
      style={editorStyle}
      readOnly={currentFileId === 0}
      onFocus={() => currentFileId === 0 && toast.error('No file is selected!')}
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
