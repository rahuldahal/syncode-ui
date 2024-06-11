import axios from 'axios';
import { create } from 'zustand';
import { getCookie } from '@/utils';

export interface TProject {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  ownerId: number;
}

export interface TFile {
  id: number;
  name: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  projectId: number;
}

interface FileState {
  files: TFile[];
  projects: TProject[];
  isLoading: boolean;
  fetchFiles: () => Promise<void>;
  clearFiles: () => void;
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
        `${import.meta.env.VITE_API_URL}/projects`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        const responseData: any[] = response.data;
        if (responseData.length === 0) return;

        const projects: TProject[] = [];
        const files: TFile[] = [];

        responseData.forEach((projectData) => {
          const { files: projectFiles, ...project } = projectData;
          projects.push(project);
          projectFiles.forEach((file: TFile) => {
            files.push(file);
          });
        });

        set({ projects, files });
      } else {
        console.error('Failed to fetch projects:', response.statusText);
      }
    } catch (error: any) {
      console.error('Error fetching projects:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  clearFiles: () => {
    set({ files: [], projects: [] });
  },
}));

export default useFileStore;
