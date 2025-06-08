// pages/SetupPage.tsx
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";
import CreateRoomBTN from "../_components/create-room";
import JoinRoomForm from "../_components/join-room-form";

const SetupPage = async () => {
  const profile = await initialProfile();

  const room = await db.room.findFirst({
    where: {
      members: {
        some: { profileId: profile.id },
      },
    },
  });

  if (room) {
    return redirect(`/studyhub/rooms/${room.id}`);
  } else {
    return (
      <div className="relative h-full w-full overflow-hidden">
        <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#0e0c15_40%,#581681_100%)]"></div>
        <div
          className="relative z-10 flex flex-col items-center justify-center overflow-hidden text-white p-6"
          style={{ minHeight: `calc(100vh - 4.5rem)` }}
        >
          <h1 className="text-4xl font-extrabold mb-6">
            Welcome to Your Study Hub
          </h1>
          <p className="text-lg mb-8">
            Create a new room or join an existing one & start studying together!
          </p>
          <div className="flex flex-col items-center gap-6">
            <CreateRoomBTN />
            <p className="text-lg">or</p>
            <JoinRoomForm />
          </div>
        </div>
      </div>
    );
  }
};

export default SetupPage;
