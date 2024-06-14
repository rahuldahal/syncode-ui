import { useState } from 'react';
import { Check, ChevronsUpDown, File, Folder } from 'lucide-react';
import useFileStore, { TFile, TProject } from '@/store/file.store';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { DialogForm } from './dialog-form';
import useEditorStore from '@/store/editor.store';

interface FileItemProps {
  file: TFile | null;
  isSelected: boolean;
  onSelect: (file: TFile | null) => void;
}

interface FilesListProps {
  files: TFile[];
  selectedFile: TFile | null;
  onSelect: (file: TFile | null) => void;
}

interface ProjectsListProps {
  projects: TProject[];
  files: TFile[];
  selectedFile: TFile | null;
  onSelect: (file: TFile | null) => void;
}

export function ProjectsFilesBox() {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<TProject | null>(null);
  const [selectedFile, setSelectedFile] = useState<TFile | null>(null);

  const { projects, files } = useFileStore();
  const projectsArray: TProject[] = Array.from(projects);
  const filesArray: TFile[] = Array.from(files);

  const { updateCurrentFile } = useEditorStore();

  const createProjectData = {
    title: 'Project',
    trigger: <Button className="w-full">Create new Project</Button>,
    description: "Create a new project. Click save when it's done.",
    formFields: [
      {
        name: 'name',
        type: 'text',
      },
    ],
    submitEndpoint: '/projects',
  };

  const handleFileSelect = (updatedFile: TFile | null) => {
    if (updatedFile === null) return;

    setSelectedFile((prevFile) =>
      prevFile?.id === updatedFile.id ? prevFile : updatedFile,
    );

    let updatedProject: TProject | null = null;
    projectsArray.some((project) => {
      if (project.id === updatedFile.projectId) {
        updatedProject = project;
      }
    });
    setSelectedProject(updatedProject);

    updateCurrentFile(updatedFile);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-max justify-between"
        >
          {selectedFile && selectedProject
            ? `${selectedProject.name} - ${selectedFile.name}`
            : 'Select project and file...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search file..." />
          <CommandList>
            {projectsArray.length === 0 ? (
              <>
                <CommandEmpty>No project found.</CommandEmpty>
                <DialogForm info={createProjectData} />
              </>
            ) : (
              <ProjectsList
                projects={projectsArray}
                files={filesArray}
                selectedFile={selectedFile}
                onSelect={handleFileSelect}
              />
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

const FileItem = ({ file, isSelected, onSelect }: FileItemProps) => (
  <CommandItem
    key={file?.id}
    value={file?.name}
    onSelect={() => onSelect(file)}
  >
    <Check
      className={cn('mr-2 h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')}
    />
    {file?.name /*Label */}
  </CommandItem>
);

const FilesList = ({ files, selectedFile, onSelect }: FilesListProps) => (
  <>
    {files.map((file) => (
      <FileItem
        key={file.id}
        file={file}
        isSelected={file.id === selectedFile?.id}
        onSelect={onSelect}
      />
    ))}
  </>
);

const ProjectsList = ({
  projects,
  files,
  selectedFile,
  onSelect,
}: ProjectsListProps) => {
  const createFileData = {
    title: 'File',
    trigger: (
      <Button className="w-max h-max p-0 bg-transparent shadow-none">
        <File className="w-4 fill-primary" />
      </Button>
    ),
    description: "Create a new file. Click save when it's done.",
    formFields: [
      {
        name: 'name',
        type: 'text',
      },
    ],
    submitEndpoint: '/files',
  };

  const createProjectData = {
    title: 'Project',
    trigger: (
      <Button className="w-max h-max p-0 bg-transparent shadow-none">
        <Folder className="w-4 fill-primary" />
      </Button>
    ),
    description: "Create a new project. Click save when it's done.",
    formFields: [
      {
        name: 'name',
        type: 'text',
      },
    ],
    submitEndpoint: '/projects',
  };

  return (
    <>
      {projects.map((project) => {
        // Files belonging to current project
        const projectFiles = files.filter(
          (file) => file.projectId === project.id,
        );

        return (
          <CommandGroup
            key={project.id}
            heading={
              <div className="flex items-center justify-between">
                <span>{project.name}</span>
                <div className="flex items-end gap-[0.125rem]">
                  <DialogForm
                    info={createFileData}
                    relation={{
                      onName: 'projectId',
                      withValue: project.id,
                    }}
                  />
                  <DialogForm info={createProjectData} />
                </div>
              </div>
            }
          >
            {projectFiles.length > 0 && (
              <FilesList
                files={projectFiles}
                selectedFile={selectedFile}
                onSelect={onSelect}
              />
            )}
          </CommandGroup>
        );
      })}
    </>
  );
};
