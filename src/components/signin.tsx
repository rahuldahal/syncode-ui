import { z } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import useAuthStore from '@/store/auth.store';
import useFileStore from '@/store/file.store';
import LoadingButton from './ui/loading-button';
import { Button } from '@/components/ui/button';
import { signinSchema } from '@/schemas/signin';
import { zodResolver } from '@hookform/resolvers/zod';
import { Navigate, useNavigate } from '@tanstack/react-router';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

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

  if (isAuthenticated) {
    return <Navigate to="/editor" />;
  }

  // INFO: Authentication finish
  // INFO: Signin logic start

  async function onSubmit(values: z.infer<typeof signinSchema>) {
    setSubmiting(true);

    const endpoint = `${import.meta.env.VITE_API_URL}/auth/signin`;
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.status === 200) {
        setAccessToken(data.accessToken);
        toast.success('Signed in successfully! Redirecting to /editor.');
        fetchFiles();
        navigate({ to: '/editor' });
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
