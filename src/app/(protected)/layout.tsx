import NavBar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { Toaster } from "@/components/ui/sonner";
interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="flex flex-wrap font-thai">
      <NavBar />
      <Sidebar />

      <main className="ml-14 min-h-full w-full">{children}</main>
      <Toaster />
    </div>
  );
};

export default ProtectedLayout;
