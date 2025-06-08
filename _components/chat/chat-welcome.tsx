import { Hash, User } from "lucide-react";

interface ChatWelcomeProps {
  name: string;
  type: "chat" | "conversation";
}

export const ChatWelcome = ({ name, type }: ChatWelcomeProps) => {
  return (
    <div className="space-y-2 px-4 mb-4">
      {type === "chat" && (
        <div className="h-[65px] w-[65px] rounded-full bg-n-6 flex items-center justify-center">
          <Hash className="h-10 w-10 text-white" />
        </div>
      )}
      {type === "conversation" && (
        <div className="h-[65px] w-[65px] rounded-full bg-n-6 flex items-center justify-center">
          <User className="h-10 w-10 text-white" />
        </div>
      )}
      <p className="text-xl md:text-3xl font-bold">
        {type === "chat" ? "Welcome to #" : ""}
        {name}
      </p>
      <p className="text-gray-400 text-sm">
        {type === "chat"
          ? `Heyy! Here is the start of #${name} chat.`
          : `Heyy! This is the start of your conversation with ${name}`}
      </p>
    </div>
  );
};
