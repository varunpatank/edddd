import { Separator } from "@/components/ui/separator";
import { Hash, Menu } from "lucide-react";
import { MobileToggle } from "../mobile-toggle";
import { UserAvatar } from "../user-avatar";
import { SocketIndicator } from "../socket-indicator";
import { ChatVideoButton } from "./chat-video-button";

interface ChatHeaderProps {
  roomId: string;
  name: string;
  type: "chat" | "conversation";
  imageUrl?: string;
}
const ChatHeader = ({ roomId, name, type, imageUrl }: ChatHeaderProps) => {
  return (
    <>
      <div className="mt-[0.1rem] text-md font-semibold px-3 flex items-center h-12">
        <MobileToggle roomId={roomId} />
        {type === "chat" && <Hash className="w-5 h-5 text-gray-400 mr-2" />}
        {type === "conversation" && (
          <UserAvatar className="w-8 h-8 md:h-8 md:w-8 mr-2" src={imageUrl} />
        )}
        <p className="text-md text-white font-semibold">{name}</p>
        <div className="ml-auto flex items-center">
          {type === "conversation" && <ChatVideoButton />}
          <SocketIndicator />
        </div>
      </div>
      <Separator className="bg-n-6" />
    </>
  );
};

export default ChatHeader;
