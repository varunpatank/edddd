import RoomSidebar from "@/app/studyhub/_components/room/room-sidebar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const roomIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { roomId: string };
}) => {
  const profile = await currentProfile();
  if (!profile) {
    return auth().redirectToSignIn();
  }
  const room = await db.room.findUnique({
    where: {
      id: params.roomId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  if (!room) {
    return redirect("/studyhub");
  }
  return (
    <div className="h-full">
      <div className="hidden md:flex  w-60  flex-col h-full absolute inset-y-0 z-0">
        {" "}
        <RoomSidebar roomId={params.roomId} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};
export default roomIdLayout;
