import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheetcustom";
import { Menu } from "lucide-react";
import { NavigationSidebar } from "./navigation/navigation-sidebar";
import RoomSidebar from "./room/room-sidebar";

export const MobileToggle = ({ roomId }: { roomId: string }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="block md:hidden" variant={"link"} size={"icon"}>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex gap-0 ">
        <div className="w-[72px]">
          <NavigationSidebar />
        </div>
        <RoomSidebar roomId={roomId} />
      </SheetContent>
    </Sheet>
  );
};
