"use client";
import { Fragment, useRef, ElementRef } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { Member, Message, Profile } from "@prisma/client";
import { Loader2, ServerCrash } from "lucide-react";
import { ChatWelcome } from "./chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { ChatItem } from "./chat-item";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";

const DATE_FORMAT = "dd/MM/yyyy, hh:mm aa";
const TIME_FORMAT = "hh:mm aa";

const formatTimestamp = (timestamp: Date): string => {
  const now = new Date();

  if (isToday(timestamp)) {
    return `Today, ${format(timestamp, TIME_FORMAT)}`;
  } else if (isYesterday(timestamp)) {
    return `Yesterday, ${format(timestamp, TIME_FORMAT)}`;
  } else {
    return format(timestamp, DATE_FORMAT);
  }
};

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "chatId" | "conversationId";
  paramValue: string;
  type: "chat" | "conversation";
}

export const ChatMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });

  useChatSocket({ queryKey, addKey, updateKey });

  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  });

  if (status === "pending") {
    return (
      <div
        className="flex flex-col justify-center items-center w-full"
        style={{ minHeight: `calc(100vh - 9rem)` }} // Adjust based on your margin-top
      >
        <Loader2 className="h-7 w-7 text-purple-500 animate-spin my-4" />
        <p className="text-xs text-purple-400">Loading Messages...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div
        className="flex flex-col justify-center items-center w-full"
        style={{ minHeight: `calc(100vh - 9rem)` }} // Adjust based on your margin-top
      >
        <ServerCrash className="h-12 w-12 text-purple-500 my-4" />
        <p className="text-md text-purple-400">Something Went Wrong...</p>
      </div>
    );
  }

  const messages = data?.pages?.flatMap((group) => group.items) ?? [];

  return (
    <>
      {" "}
      <div
        ref={chatRef}
        className="flex-1 flex flex-col-reverse py-4 overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 13rem)" }}
      >
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                currentMember={member}
                member={message.member}
                key={message.id}
                id={message.id}
                content={message.content}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                timestamp={formatTimestamp(new Date(message.createdAt))}
                isUpdated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}{" "}
        {!hasNextPage && messages.length !== 0 && (
          <div className="flex justify-start my-8">
            <ChatWelcome type={type} name={name} />
          </div>
        )}
        {/* HEREEEE */}
        {messages.length === 0 && (
          <div className="absolute left-0 bottom-32">
            <ChatWelcome type={type} name={name} />
          </div>
        )}
        {/* THISSS ABOVE THIS COMMENT */}
        {hasNextPage && (
          <div className="flex justify-center">
            {isFetchingNextPage ? (
              <Loader2 className="h-6 w-6 text-purple-500 animate-spin my-4" />
            ) : (
              <button
                onClick={() => fetchNextPage()}
                className="text-purple-400 hover:text-purple-300 text-xs my-4 transition"
              >
                Load Previous Messages
              </button>
            )}
          </div>
        )}{" "}
        <div ref={bottomRef} />
      </div>
    </>
  );
};
