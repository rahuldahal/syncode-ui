import Editor from '@/components/collaboration';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/editor')({
  component: () => <Editor />,
});
