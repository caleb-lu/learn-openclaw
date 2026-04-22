import { Sidebar } from "@/components/layout/sidebar";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex h-[calc(100vh-3.5rem)] max-w-7xl px-4 sm:px-6 lg:px-8">
      <Sidebar />
      <div className="min-w-0 flex-1 overflow-y-auto px-4 py-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
