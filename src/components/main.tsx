export default function Main({ children }: { children: JSX.Element }) {
  return (
    <main className="container pt-24 pb-4 flex items-center justify-center">
      {children}
    </main>
  );
}
