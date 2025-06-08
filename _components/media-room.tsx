"use client";

import { useState, useEffect } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { auth } from "@clerk/nextjs/server";

interface MediaRoomProps {
  chatId: string;
  roomId: string;
  video: boolean;
  audio: boolean;
}

export const MediaRoom = ({ chatId, roomId, video, audio }: MediaRoomProps) => {
  const { user } = useUser();
  const [token, setToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!user?.firstName || !user?.lastName) return;

    const name = `${user.firstName} ${user.lastName}`;

    const fetchToken = async () => {
      try {
        const resp = await fetch(
          `/api/livekit?room=${roomId}&username=${name}`
        );
        const data = await resp.json();
        setToken(data.token);
      } catch (error) {
        console.log(error);
      }
    };

    fetchToken();
  }, [user?.firstName, user?.lastName, roomId]);

  if (token === "") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-400">Loading...</p>
      </div>
    );
  }

  const handleDisconnect = () => {
    router.push(`/studyhub/rooms/${roomId}`); // Redirect to room based on roomId
  };

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={video}
      audio={audio}
      onDisconnected={handleDisconnect} // Redirect on disconnect
    >
      <VideoConference />
    </LiveKitRoom>
  );
};
