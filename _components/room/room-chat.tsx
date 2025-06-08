"use client";

import { cn } from "@/lib/utils";
import { Chat, ChatType, MemberRole, Room } from "@prisma/client";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ActionTooltip } from "../action-tooltop";
import { ModalType, useModal } from "@/hooks/use-modal-store";

interface RoomChatProps {
  chat: Chat;
  room: Room;
  role?: MemberRole;
}
const iconMap = {
  [ChatType.TEXT]: Hash,
  [ChatType.AUDIO]: Mic,
  [ChatType.VIDEO]: Video,
};
const RoomChat = ({ chat, room, role }: RoomChatProps) => {
  const params = useParams();
  const router = useRouter();
  const { onOpen } = useModal();
  const Icon = iconMap[chat.type];
  const onClick = () => {
    router.push(`/studyhub/rooms/${params?.roomId}/chats/${chat.id}`);
  };
  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, { chat, room });
  };
  return (
    <button
      onClick={() => {
        onClick();
      }}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 hover:bg-n-6 transition w-full mb-2",
        params?.chatId === chat.id && " bg-n-6"
      )}
    >
      <Icon className="flex-shrink-0 w-5 h-5 text-gray-400" />
      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm text-gray-400 group-hover:text-gray-300 transition",
          params?.chatId === chat.id &&
            "text-primary text-gray-200 group-hover:text-white"
        )}
      >
        {chat.name}
      </p>
      {chat.name !== "general" && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <Edit
              className="hidden group-hover:block w-4 h-4 text-gray-400 hover:text-gray-200 transition"
              onClick={(e) => {
                onAction(e, "editChat");
              }}
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              className="hidden group-hover:block w-4 h-4 text-gray-400 hover:text-gray-200 transition"
              onClick={(e) => {
                onAction(e, "deleteChat");
              }}
            />
          </ActionTooltip>
        </div>
      )}
      {chat.name === "general" && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Can't edit 'general'">
            <Lock className="hidden group-hover:block w-4 h-4 text-gray-400 hover:text-gray-200 transition" />
          </ActionTooltip>
        </div>
      )}
    </button>
  );
};

export default RoomChat;
