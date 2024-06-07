import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

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

interface TFile {
  value: string;
  label: string;
}

interface TProject {
  name: string;
  files: TFile[];
}

const projects: TProject[] = [
  //   {
  //     name: 'Project A',
  //     files: [
  //       { value: 'file1.ts', label: 'File 1' },
  //       { value: 'file2.ts', label: 'File 2' },
  //     ],
  //   },
  //   {
  //     name: 'Project B',
  //     files: [
  //       { value: 'file3.ts', label: 'File 3' },
  //       { value: 'file4.ts', label: 'File 4' },
  //     ],
  //   },
];

export function ProjectsFilesBox() {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState('');
  const [selectedProject, setSelectedProject] = useState('');

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
            <CommandEmpty>No file found.</CommandEmpty>
            {projects.length === 0 ? (
              <Button>Create a new Project</Button>
            ) : (
              projects.map((project) => (
                <CommandGroup key={project.name} heading={project.name}>
                  {project.files.map((file) => (
                    <CommandItem
                      key={file.value}
                      value={file.value}
                      onSelect={(currentValue) => {
                        setSelectedFile(
                          currentValue === selectedFile ? '' : currentValue,
                        );
                        setSelectedProject(project.name);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedFile === file.value
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                      {file.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
