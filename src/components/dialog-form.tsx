import { toast } from 'sonner';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import LoadingButton from './ui/loading-button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import useAuthStore from '@/store/auth.store';

interface FormData {
  [key: string]: string;
}

export interface DialogProps {
  data: {
    title: string;
    trigger: JSX.Element;
    description?: string;
    formFields: {
      name: string;
      defaultValue?: string;
      type?: string;
      placeholder?: string;
    }[];
    submitEndpoint: string;
  };

  relation?: {
    onName: string;
    withValue: string | number;
  };
}

export function DialogForm({ data, relation }: DialogProps) {
  const [formData, setFormData] = useState<FormData>({});
  const [submiting, setSubmiting] = useState<boolean>(false);

  const { accessToken } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(formData);
    // return;

    const bodyData: any = {};

    for (const key in formData) {
      bodyData[key] = formData[key];
    }

    if (relation) {
      bodyData[relation.onName] = relation.withValue;
    }

    setSubmiting(true);
    const endpoint = `${import.meta.env.VITE_API_URL}${data.submitEndpoint}`;
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();
      if (response.status === 201) {
        toast.success(`${data.title} created successfully.`);
        //TODO: send the new project/file along with others, or add a new "addProject" function on store
      } else {
        toast.error(
          Array.isArray(data.message) ? data.message[0] : data.message,
        );
      }
    } catch (error) {
      console.error('Error during sign in:', error);
    } finally {
      setSubmiting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{data.trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{data.title}</DialogTitle>
          {data.description && (
            <DialogDescription>{data.description}</DialogDescription>
          )}
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {data.formFields.map((field, index) => (
              <div key={index} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={field.name} className="capitalize">
                  {field.name}
                </Label>
                <Input
                  id={field.name}
                  type={field.type || 'text'}
                  defaultValue={field.defaultValue}
                  placeholder={field.placeholder || ''}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            {submiting ? (
              <LoadingButton />
            ) : (
              <Button type="submit">Save Changes</Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
