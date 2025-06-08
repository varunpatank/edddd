"use client";

import { cn } from "@/lib/utils";
import { Member, MemberRole, Profile, Room } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { UserAvatar } from "../user-avatar";
import { ActionTooltip } from "../action-tooltop";

interface RoomMemberProps {
  member: Member & { profile: Profile };
  room: Room;
}
const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ActionTooltip label="Mod" side="top">
      <ShieldAlert className="h-5 w-5  mr-2 text-yellow-500" />
    </ActionTooltip>
  ),
  [MemberRole.ADMIN]: (
    <ActionTooltip label="Admin" side="top">
      <ShieldCheck className="h-5 w-5  mr-2 text-emerald-500" />
    </ActionTooltip>
  ),
};
export const RoomMember = ({ member, room }: RoomMemberProps) => {
  const params = useParams();
  const router = useRouter();
  const icon = roleIconMap[member.role];
  const onClick = () => {
    router.push(`/studyhub/rooms/${params?.roomId}/conversations/${member.id}`);
  };
  return (
    <button
      onClick={() => onClick()}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-n-6 transition mb-1",
        params?.memberId === member.id && "bg-n-6"
      )}
    >
      <UserAvatar
        src={member.profile.imageUrl}
        className="h-6 w-6 md:h-6 md:w-6"
      />
      <p
        className={cn(
          "font-semibold text-sm text-gray-400 group-hover:text-gray-300 transition",
          params?.member === member.id &&
            "text-primary text-gray-200 group-hover:text-white"
        )}
      >
        {member.profile.name}
      </p>
      {icon}
    </button>
  );
};
