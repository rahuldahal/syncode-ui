import { z } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import useAuthStore from '@/store/auth.store';
import useFileStore from '@/store/file.store';
import LoadingButton from './ui/loading-button';
import { Button } from '@/components/ui/button';
import { signinSchema } from '@/schemas/signin';
import useEditorStore from '@/store/editor.store';
import { zodResolver } from '@hookform/resolvers/zod';
import { QueryOptions, query } from '@/utils/axiosQuery';
import { Navigate, useNavigate } from '@tanstack/react-router';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface SignInResponse {
  accessToken: string;
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

// TODO: clear all the stores first
export default function Signin() {
  // INFO: States
  const [submiting, setSubmiting] = useState(false);

  // INFO: Hooks
  const navigate = useNavigate({ from: '/signin' });
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // INFO: Authentication start

  const { isAuthenticated, setAccessToken } = useAuthStore();
  const { fetchFiles } = useFileStore();
  const { clearEditor } = useEditorStore();

  useEffect(() => {
    if (isAuthenticated) {
      clearEditor();
    }
  }, [isAuthenticated, clearEditor]);

  if (isAuthenticated) {
    return <Navigate to="/editor" />;
  }

  // INFO: Authentication finish
  // INFO: Signin logic start

  const options: QueryOptions<SignInResponse> = {
    method: 'POST',
    endpoint: '/auth/signin',
    expectedStatus: 200,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      toast.success('Signed in successfully! Redirecting to /editor.');
      fetchFiles();
      navigate({ to: '/editor' });
    },
    onError: (error) => {
      toast.error(
        Array.isArray(error.message) ? error.message[0] : error.message,
      );
    },
  };

  async function onSubmit(values: z.infer<typeof signinSchema>) {
    setSubmiting(true);
    await query(options, { body: JSON.stringify(values) });
    setSubmiting(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full md:max-w-lg space-y-8"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="ram_prasad" {...field} autoFocus />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="strong password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {submiting ? <LoadingButton /> : <Button type="submit">Submit</Button>}
      </form>
    </Form>
  );
}
