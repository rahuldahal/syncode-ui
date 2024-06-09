import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
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

interface FileItemProps {
  file: TFile;
  isSelected: boolean;
  onSelect: (fileName: string) => void;
}

interface FilesListProps {
  files: TFile[];
  selectedFile: string;
  onSelect: (fileName: string) => void;
}

interface ProjectsListProps {
  projects: TProject[];
  files: TFile[];
  selectedFile: string;
  onSelect: (fileName: string) => void;
}

export function ProjectsFilesBox() {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [selectedProject] = useState<string>('');

  const { projects, files } = useFileStore();
  const projectsArray: TProject[] = Array.from(projects);
  const filesArray: TFile[] = Array.from(files);

  function createDialogData(
    of: 'project' | 'file',
    submitEndpoint: 'projects' | 'files',
  ) {
    return {
      title: `Create ${of}`,
      trigger: <Button className="w-full">{`Create new ${of}`}</Button>,
      description: `Create a new ${of}. Click save when it's done.`,
      formFields: [
        {
          name: 'name',
          type: 'text',
        },
      ],
      submitEndpoint,
    };
  }

  const handleFileSelect = (fileName: string) => {
    setSelectedFile((prevFile) => (prevFile === fileName ? '' : fileName));
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedFile
            ? `${selectedProject} - ${selectedFile}`
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
                <DialogForm data={createDialogData('project', 'projects')} />
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
    key={file.id}
    value={file.name}
    onSelect={() => onSelect(file.name)}
  >
    <Check
      className={cn('mr-2 h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')}
    />
    {file.name /*Label */}
  </CommandItem>
);

const FilesList = ({ files, selectedFile, onSelect }: FilesListProps) => (
  <>
    {files.map((file) => (
      <FileItem
        key={file.id}
        file={file}
        isSelected={file.name === selectedFile}
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
}: ProjectsListProps) => (
  <>
    {projects.map((project) => (
      <CommandGroup key={project.id} heading={project.name}>
        {files.length === 0 ? (
          <Button>Create a new File</Button>
        ) : (
          <FilesList
            files={files}
            selectedFile={selectedFile}
            onSelect={onSelect}
          />
        )}
      </CommandGroup>
    ))}
  </>
);
