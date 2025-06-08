"use client";

import { RoomWithProfiles } from "@/types";
import { ChatType, MemberRole, Room } from "@prisma/client";
import { ActionTooltip } from "../action-tooltop";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface RoomSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "chats" | "members";
  chatType?: ChatType;
  room?: Room;
}
const RoomSection = ({
  label,
  role,
  sectionType,
  room,
  chatType,
}: RoomSectionProps) => {
  const { onOpen } = useModal();
  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-gray-400">{label}</p>
      {role !== MemberRole.GUEST && sectionType === "chats" && (
        <ActionTooltip label="Create Chat" side="top">
          <button
            className="text-gray-400 hover:text-gray-200 transition"
            onClick={() => {
              onOpen("createChat", { chatType });
            }}
          >
            <Plus className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
      {role === MemberRole.ADMIN && sectionType === "members" && (
        <ActionTooltip label="Manage Members" side="top">
          <button
            className="text-gray-400 hover:text-gray-200 transition"
            onClick={() => {
              onOpen("members", { room });
            }}
          >
            <Settings className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};

export default RoomSection;
