import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

interface RoomIdPageProps {
  params: {
    roomId: string;
  };
}

const RoomIdPage = async ({ params }: RoomIdPageProps) => {
  // Get the current user's profile
  const profile = await currentProfile();

  // If the user is not authenticated, redirect to sign-in
  if (!profile) {
    return auth().redirectToSignIn();
  }

  // Fetch the room and the associated chats
  const room = await db.room.findUnique({
    where: {
      id: params.roomId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      chats: {
        where: {
          name: "general",
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  const initialChat = room?.chats[0];

  // Check if the user is already on a specific chat or not
  const isAlreadyOnChat =
    typeof window !== "undefined" &&
    window.location.pathname.includes("/chats/");

  // Only redirect to the 'general' chat if the user is not already in a chat
  if (initialChat && !isAlreadyOnChat) {
    return redirect(`/studyhub/rooms/${params.roomId}/chats/${initialChat.id}`);
  }

  return null; // Or return the room details if needed, depending on the rest of the app
};

export default RoomIdPage;
