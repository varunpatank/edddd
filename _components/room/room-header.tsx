"use client";

import { useState } from "react";
import { MemberRole, Room } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { useModal } from "@/hooks/use-modal-store";
import { Separator } from "@/components/ui/separator";
import { ConfirmModal } from "@/components/modals/confirm-modal";

interface RoomHeaderProps {
  room: Room;
  role?: MemberRole;
}

const RoomHeader = ({ room, role }: RoomHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { onOpen } = useModal();

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = role === MemberRole.MODERATOR;
  const isGuest = role === MemberRole.GUEST;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button
          className="w-full text-md font-semibold px-3 flex items-center h-12 border-n-6 hover:bg-n-7 transition-all"
          onClick={handleToggle}
        >
          {room.name}
          <ChevronDown
            className={`h-5 w-5 ml-auto transform transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </DropdownMenuTrigger>
      <Separator className="bg-n-6" />
      <DropdownMenuContent className="text-neutral-300 font-medium w-56 text-xs space-y-[2px]">
        <DropdownMenuItem
          className="px-3 py-2 text-sm cursor-pointer text-purple-400 hover:text-purple-600"
          onClick={() => onOpen("invite", { room })}
        >
          Invite Students <UserPlus className="w-4 h-4 ml-auto" />
        </DropdownMenuItem>

        {/* Admin and Moderator can access room settings */}
        {(isAdmin || isModerator) && (
          <DropdownMenuItem
            className="px-3 py-2 text-sm cursor-pointer"
            onClick={() => onOpen("editRoom", { room })}
          >
            Room Settings <Settings className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {/* Admin and Moderator can manage members */}
        {isAdmin && (
          <DropdownMenuItem
            className="px-3 py-2 text-sm cursor-pointer"
            onClick={() => onOpen("members", { room })}
          >
            Manage Members <Users className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {/* Admin and Moderator can create a channel */}
        {(isAdmin || isModerator) && (
          <DropdownMenuItem
            className="px-3 py-2 text-sm cursor-pointer text-emerald-400 hover:text-emerald-600"
            onClick={() => onOpen("createChat")}
          >
            Add Chat <PlusCircle className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {/* Only Admin can delete the room */}
        {isAdmin && (
          <>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="px-3 py-2 text-sm cursor-pointer text-rose-400 hover:text-rose-600"
              onClick={() => {
                onOpen("deleteRoom", { room });
              }}
            >
              Delete Room <Trash className="w-4 h-4 ml-auto" />
            </DropdownMenuItem>
          </>
        )}

        {/* Guests should see "Leave Room" */}
        {isGuest && (
          <DropdownMenuItem
            className="px-3 py-2 text-sm cursor-pointer text-rose-400 hover:text-rose-600"
            onClick={() => {
              onOpen("leaveRoom", { room });
            }}
          >
            Leave Room <LogOut className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RoomHeader;
