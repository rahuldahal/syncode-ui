import { create } from 'zustand';
import { TFile } from './file.store';

interface EditorStore {
  socketConnected: boolean;
  currentFile: TFile;
  collaborators: { id: number; username: string }[];
  updateCurrentFile: (newFile: TFile) => void;
  updateContent: (newContent: string) => void;
  setSocketConnected: (state: boolean) => void;
  clearEditor: () => void;
}

const useEditorStore = create<EditorStore>((set, get) => ({
  socketConnected: false,
  currentFile: {
    id: 0,
    name: '',
    content: '',
    createdAt: '',
    updatedAt: '',
    projectId: 0,
  },
  collaborators: [],
  updateCurrentFile: (newFile: TFile) => {
    set(() => ({
      currentFile: newFile,
    }));
    console.log(get().currentFile);
  },
  updateContent: (newContent: string) => {
    if (get().currentFile.id === 0) {
      throw new Error('current file is empty.');
    }

    console.log('Content updated:', newContent);
    set({
      currentFile: {
        ...get().currentFile,
        content: newContent,
      },
    });
  },
  setSocketConnected: (state: boolean) => {
    set({ socketConnected: state });
  },
  clearEditor: () =>
    set({
      socketConnected: false,
      currentFile: {
        id: 0,
        name: '',
        content: '',
        createdAt: '',
        updatedAt: '',
        projectId: 0,
      },
      collaborators: [],
    }),
}));

export default useEditorStore;
