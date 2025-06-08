import React from "react";
import { NavigationSidebar } from "../_components/navigation/navigation-sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full z-0">
      <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <NavigationSidebar />
      </div>
      <main className="md:pl-[72px] z-0 ">{children}</main>
    </div>
  );
};

export default MainLayout;
