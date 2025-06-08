import ChatHeader from "@/app/studyhub/_components/chat/chat-header";
import { ChatInput } from "@/app/studyhub/_components/chat/chat-input";
import { ChatMessages } from "@/app/studyhub/_components/chat/chat-messages";
import { MediaRoom } from "@/app/studyhub/_components/media-room";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
  params: {
    memberId: string;
    roomId: string;
  };
  searchParams: {
    video?: boolean;
  };
}

const MemberIdPage = async ({ params, searchParams }: MemberIdPageProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return auth().redirectToSignIn();
  }

  const currentMember = await db.member.findFirst({
    where: {
      roomId: params.roomId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return redirect("/studyhub");
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId
  );

  if (!conversation) {
    return redirect(`/studyhub/rooms/${params.roomId}`);
  }

  const { memberOne, memberTwo } = conversation;
  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  // Determine if the other member is the current user
  const isCurrentUser = otherMember.profileId === profile.id;
  const displayName = isCurrentUser ? "Yourself" : otherMember.profile.name;

  return (
    <div className="bg-n-8 relative">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={displayName}
        roomId={params.roomId}
        type="conversation"
      />{" "}
      {searchParams.video && (
        <div
          className="overflow-y-auto"
          style={{ maxHeight: `calc(100vh - 7.7rem)` }} // Adjust based on your margin-top
        >
          <MediaRoom
            audio={true}
            video={true}
            chatId={conversation.id}
            roomId={params.roomId}
          />
        </div>
      )}
      {!searchParams.video && (
        <div
          className="overflow-y-auto"
          style={{ minHeight: `calc(100vh - 7.7rem)` }} // Adjust based on your margin-top
        >
          <ChatMessages
            member={currentMember}
            name={otherMember.profile.name}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation.id,
            }}
          />
        </div>
      )}{" "}
      {!searchParams.video && (
        <div className="absolute bottom-0 left-0 right-0 bg-n-8 border-t border-n-6">
          <ChatInput
            name={otherMember.profile.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: conversation.id,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default MemberIdPage;
