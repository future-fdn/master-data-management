import NavBar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "react-query";
interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-wrap font-thai">
        <NavBar />
        <Sidebar />
        <main className="ml-14 min-h-full w-full">{children}</main>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
};

export default ProtectedLayout;
