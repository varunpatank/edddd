import React from "react";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import notfound from "../../../../../../public/405.svg";
import { FaRegFaceDizzy } from "react-icons/fa6";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/studyhub");
  }
  if (!params.inviteCode) {
    return redirect("/studyhub");
  }

  // Find the room using inviteCode
  const existingRoom = await db.room.findFirst({
    where: {
      inviteCode: params.inviteCode,
    },
    include: {
      members: true, // Include members to check for existing memberships
    },
  });

  if (!existingRoom) {
    return (
      <div className="grid place-content-center px-4 overflow-hidden mt-0 ">
        <div className="text-center">
          <Image src={notfound} alt="404 Not Found" height={"500"} />
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-white sm:text-4xl flex justify-center items-center">
            Room not found
            <span className="ml-2">
              <FaRegFaceDizzy />
            </span>
          </h1>

          <p className="mt-4 text-gray-400">
            Your invite link is wrong, please try contacting the room admin or
            checking your invite link :)
          </p>

          <a
            className="group relative inline-flex items-center overflow-hidden rounded bg-purple-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-indigo-500 m-5"
            href="/studyhub"
          >
            <span className="absolute -end-full transition-all group-hover:end-4">
              <svg
                className="size-5 rtl:rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>

            <span className="text-sm font-medium transition-all group-hover:me-4">
              Studyhub
            </span>
          </a>
        </div>
      </div>
    );
  }

  // Check if the profile is already a member
  const isMember = existingRoom.members.some(
    (member) => member.profileId === profile.id
  );

  if (isMember) {
    return redirect(`/studyhub/rooms/${existingRoom.id}`);
  }

  // Update the room by adding the member
  const updatedRoom = await db.room.update({
    where: {
      id: existingRoom.id, // Use the unique `id` for the update operation
    },
    data: {
      members: {
        create: [{ profileId: profile.id }],
      },
    },
  });

  return redirect(`/studyhub/rooms/${updatedRoom.id}`);
};

export default InviteCodePage;
