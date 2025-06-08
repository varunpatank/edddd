import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChatType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import RoomHeader from "./room-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import RoomSearch from "./room-search";
import { Bot, Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import RoomSection from "./room-section";
import RoomChat from "./room-chat";
import { RoomMember } from "./room-member";

interface RoomSidebarProps {
  roomId: string;
}

const iconMap = {
  [ChatType.VIDEO]: <Video className="w-4 h-4 mr-2" />,
  [ChatType.AUDIO]: <Mic className="w-4 h-4 mr-2" />,
  [ChatType.TEXT]: <Hash className="w-4 h-4 mr-2" />,
};

// Role icon map, treating bot as a special case
const roleIconMap = (profileId: string) => ({
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldAlert className="h-5 w-5 mr-2 text-yellow-500" />
  ),
  [MemberRole.ADMIN]: <ShieldCheck className="h-5 w-5 mr-2 text-emerald-500" />,
  // You will dynamically show the Bot icon if the user is a bot (this is checked later)
});

const RoomSidebar = async ({ roomId }: RoomSidebarProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/studyhub");
  }

  const room = await db.room.findUnique({
    where: {
      id: roomId,
    },
    include: {
      chats: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  if (!room) {
    return redirect("/studyhub");
  }

  // Fetch bot user IDs from environment variables
  const botUserIds = process.env.NEXT_PUBLIC_BOT_IDS?.split(",") ?? [];

  // Find the current user's role in the room
  const member = room.members.find((member) => member.profileId === profile.id);
  let role = member ? member.role : MemberRole.GUEST; // Default to GUEST if not found

  // Check if the user is a bot (add this logic for guests)
  const isBot = botUserIds.includes(profile.id);

  // If the user is a bot and has a GUEST role, treat them as a BOT
  if (role === MemberRole.GUEST && isBot) {
    role = MemberRole.MODERATOR; // You can assign any role or just keep the "GUEST" and treat as special
  }

  const members = room?.members;

  const textChats = room?.chats.filter((chat) => chat.type === ChatType.TEXT);
  const audioChats = room?.chats.filter((chat) => chat.type === ChatType.AUDIO);
  const videoChats = room?.chats.filter((chat) => chat.type === ChatType.VIDEO);

  return (
    <div
      className="flex flex-col h-full text-primary w-full bg-n-8 border-r-2 border-n-6 mt-[2.3rem] pt-[2.3rem]"
      style={{ maxHeight: `calc(100vh - 2.3rem)` }}
    >
      <RoomHeader room={room} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <RoomSearch
            data={[
              {
                label: "Text Chats",
                type: "chat",
                data: textChats?.map((chat) => ({
                  id: chat.id,
                  name: chat.name,
                  icon: iconMap[chat.type],
                })),
              },
              {
                label: "Voice Chats",
                type: "chat",
                data: audioChats?.map((chat) => ({
                  id: chat.id,
                  name: chat.name,
                  icon: iconMap[chat.type],
                })),
              },
              {
                label: "Video Chats",
                type: "chat",
                data: videoChats?.map((chat) => ({
                  id: chat.id,
                  name: chat.name,
                  icon: iconMap[chat.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon:
                    member.role === MemberRole.GUEST &&
                    botUserIds.includes(member.profileId) ? (
                      <Bot className="h-5 w-5 mr-2 text-purple-500" />
                    ) : (
                      roleIconMap(profile.id)[member.role] ?? null
                    ),
                })),
              },
            ]}
          />
        </div>
        <Separator className="bg-n-6 rounded-md my-2" />
        {!!textChats?.length && (
          <div className="mb-2">
            <RoomSection
              sectionType={"chats"}
              chatType={ChatType.TEXT}
              role={role}
              label="Text Chats"
            />
            <div className="space-y-[2px]">
              {textChats.map((chat) => (
                <RoomChat key={chat.id} chat={chat} role={role} room={room} />
              ))}
            </div>
          </div>
        )}
        {!!audioChats?.length && (
          <div className="mb-2">
            <RoomSection
              sectionType={"chats"}
              chatType={ChatType.AUDIO}
              role={role}
              label="Voice Chats"
            />
            <div className="space-y-[2px]">
              {audioChats.map((chat) => (
                <RoomChat key={chat.id} chat={chat} role={role} room={room} />
              ))}
            </div>
          </div>
        )}
        {!!videoChats?.length && (
          <div className="mb-2">
            <RoomSection
              sectionType={"chats"}
              chatType={ChatType.VIDEO}
              role={role}
              label="Video Chats"
            />
            <div className="space-y-[2px]">
              {videoChats.map((chat) => (
                <RoomChat key={chat.id} chat={chat} role={role} room={room} />
              ))}
            </div>
          </div>
        )}
        {!!members?.length && (
          <div className="mb-2">
            <RoomSection
              sectionType={"members"}
              role={role}
              label="Members"
              room={room}
            />
            <div className="space-y-[2px]">
              {members.map((member) => (
                <RoomMember key={member.id} member={member} room={room} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default RoomSidebar;
