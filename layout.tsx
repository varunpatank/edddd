import NavbarCommunity from "../(dashboard)/_components/navbarCommunity";
import { ThemeProvider } from "@/components/theme-provider";
import { ModalProvider } from "@/components/providers/modal-provider";
import { SocketProvider } from "@/components/providers/socket-provider";
import { QueryProvider } from "@/components/providers/query-provider";

const CommunityLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      forcedTheme="dark"
      storageKey="cambright-theme"
    >
      <SocketProvider>
        <ModalProvider />
        <QueryProvider>
          <div className="flex flex-col min-h-screen antialiased">
            <div className="fixed top-0 left-0 right-0 z-30 bg-n-8 border-b border-n-6">
              <NavbarCommunity />
            </div>
            <div className="flex-1">
              {" "}
              {/* Added a container to handle main content positioning */}
              <main className="max-w-screen-2xl mx-auto mt-9 pt-9">
                {children}
              </main>
            </div>
          </div>
        </QueryProvider>
      </SocketProvider>
    </ThemeProvider>
  );
};

export default CommunityLayout;
