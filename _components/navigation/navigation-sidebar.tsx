import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import NavigationAction from "./navigation-action";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavigationItem } from "./navigation-item";
import { UserButton } from "@clerk/nextjs";

export const NavigationSidebar = async () => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/dashboard");
  }

  const rooms = await db.room.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full bg-[#1B172A] py-3">
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {rooms.map((room) => (
          <div key={room.id} className="mb-4">
            <NavigationItem
              id={room.id}
              name={room.name}
              imageUrl={room.imageUrl}
            />
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};
