import { z } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import useAuthStore from '@/store/auth.store';
import useFileStore from '@/store/file.store';
import { Button } from '@/components/ui/button';
import LoadingButton from './ui/loading-button';
import { signupSchema } from '@/schemas/signup';
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

interface SignUpResponse {
  accessToken: string;
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

export default function Signup() {
  // INFO: States
  const [submiting, setSubmiting] = useState(false);

  // INFO: Hooks
  const navigate = useNavigate({ from: '/signup' });
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      password: '',
      firstname: '',
      lastname: '',
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
  // INFO: Signup logic start

  const options: QueryOptions<SignUpResponse> = {
    method: 'POST',
    endpoint: '/auth/signup',
    expectedStatus: 201,
    // TODO: error status and messages to show:
    // errorStatus: [
    //   {
    //     401: 'Need to sign in',
    //     403: 'Access Denied'
    //   }
    // ],
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      toast.success('Account created! Redirecting to /editor.');
      fetchFiles();
      navigate({ to: '/editor' });
    },
    onError: (error) => {
      toast.error(
        Array.isArray(error.message) ? error.message[0] : error.message,
      );
    },
  };

  async function onSubmit(values: z.infer<typeof signupSchema>) {
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
        <FormField
          control={form.control}
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Firstname</FormLabel>
              <FormControl>
                <Input placeholder="Ram" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lastname</FormLabel>
              <FormControl>
                <Input placeholder="Prasad" {...field} />
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
