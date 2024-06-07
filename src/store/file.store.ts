import axios from 'axios';
import { create } from 'zustand';
import { getCookie } from '@/utils';

interface Project {
  id: number;
  name: string;
}

interface File {
  id: number;
  name: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  projectId: number;
}

interface TResponse extends File {
  project: Project;
}

interface FileState {
  files: File[];
  projects: Project[];
  isLoading: boolean;
  fetchFiles: () => Promise<void>;
}

const useFileStore = create<FileState>((set) => ({
  files: [],
  projects: [],
  isLoading: true,
  fetchFiles: async () => {
    set({ isLoading: true }); // Set loading to true initially

    const token = getCookie('accessToken');
    if (!token) {
      console.error('Access token not found.');
      set({ isLoading: false });
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/files`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        const filesData: TResponse[] = response.data;
        if (filesData.length === 0) return;

        const projects: Project[] = [];
        const files: File[] = [];

        filesData.forEach((file) => {
          projects.push(file.project);
          const { project, ...rest } = file;
          files.push(rest);
        });

        set({ projects, files });
      } else {
        console.error('Failed to fetch files:', response.statusText);
      }
    } catch (error: any) {
      console.error('Error fetching files:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useFileStore;
