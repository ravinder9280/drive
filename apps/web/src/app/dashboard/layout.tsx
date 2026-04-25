"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Toaster } from "sonner";

import Navbar from "@/components/Navbar/Navbar";
import AppSidebar from "@/components/Sidebar/AppSidebar";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const params = useParams();
  const selectedId = params?.id as string;

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <Toaster closeButton richColors />
        <Navbar />

        <div className="flex flex-1 min-h-0">
          <AppSidebar selectedId={selectedId} />

          <main className="flex-1 flex flex-col min-w-0 min-h-0 bg-sidebar">
            {children}
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
}
