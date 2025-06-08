import ChatHeader from "@/app/studyhub/_components/chat/chat-header";
import { ChatInput } from "@/app/studyhub/_components/chat/chat-input";
import { ChatMessages } from "@/app/studyhub/_components/chat/chat-messages";
import { MediaRoom } from "@/app/studyhub/_components/media-room";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ChatType } from "@prisma/client";
import { redirect } from "next/navigation";

interface ChatIdPageProps {
  params: {
    roomId: string;
    chatId: string;
  };
}

const ChatIdPage = async ({ params }: ChatIdPageProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return auth().redirectToSignIn();
  }

  const chat = await db.chat.findUnique({
    where: {
      id: params.chatId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      roomId: params.roomId,
      profileId: profile.id,
    },
  });

  if (!chat || !member) {
    redirect("/studyhub");
  }

  return (
    <div className="bg-n-8 relative">
      <ChatHeader name={chat.name} roomId={chat.roomId} type="chat" />
      {chat.type === ChatType.AUDIO && (
        <div
          className="overflow-y-auto"
          style={{ maxHeight: `calc(100vh - 7.7rem)` }} // Adjust based on your margin-top
        >
          <MediaRoom
            chatId={chat.id}
            video={false}
            audio={true}
            roomId={params.roomId}
          />
        </div>
      )}
      {chat.type === ChatType.VIDEO && (
        <div
          className="overflow-y-auto"
          style={{ maxHeight: `calc(100vh - 7.7rem)` }} // Adjust based on your margin-top
        >
          <MediaRoom
            chatId={chat.id}
            video={true}
            audio={true}
            roomId={params.roomId}
          />
        </div>
      )}
      {chat.type === ChatType.TEXT && (
        <>
          {" "}
          <div
            className="overflow-y-auto"
            style={{ minHeight: `calc(100vh - 7.7rem)` }} // Adjust based on your margin-top
          >
            <ChatMessages
              member={member}
              name={chat.name}
              chatId={chat.id}
              type="chat"
              apiUrl="/api/messages"
              socketUrl="/api/socket/messages"
              socketQuery={{
                chatId: chat.id,
                roomId: chat.roomId,
              }}
              paramKey="chatId"
              paramValue={chat.id}
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-n-8 border-t border-n-6">
            <ChatInput
              name={chat.name}
              type="chat"
              apiUrl="/api/socket/messages"
              query={{
                chatId: chat.id,
                roomId: chat.roomId,
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ChatIdPage;
