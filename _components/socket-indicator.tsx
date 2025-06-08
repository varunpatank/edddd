"use client";
import { useSocket } from "@/components/providers/socket-provider";
import { Badge } from "@/components/ui/badge";
export const SocketIndicator = () => {
  const { isConnected } = useSocket();
  if (!isConnected) {
    return (
      <Badge
        className="bg-yellow-600 text-white border-none"
        variant={"outline"}
      >
        Live
      </Badge>
    );
  }
  return (
    <Badge className="bg-purple-600 text-white border-none" variant={"outline"}>
      Live
    </Badge>
  );
};
