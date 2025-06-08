"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command, Search } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface RoomSearchProps {
  data:
    | {
        label: string;
        type: "chat" | "member";
        data:
          | {
              icon: React.ReactNode;
              name: string;
              id: string;
            }[]
          | undefined;
      }[];
}

const RoomSearch = ({ data }: RoomSearchProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  const onClick = ({ id, type }: { id: string; type: "chat" | "member" }) => {
    setOpen(false);
    if (type === "member") {
      return router.push(`/rooms/${params?.roomId}/conversations/${id}`);
    }
    if (type === "chat") {
      return router.push(`/rooms/${params?.roomId}/chats/${id}`);
    }
  };
  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
        }}
        className="group px-2 py-2 rounded-md flex items-center transition gap-x-2 w-full hover:bg-n-7"
      >
        <Search className="w-4 h-4 text-gray-500" />
        <p className="font-semibold text-sm text-gray-500 group-hover:text-gray-300 transition ">
          Search
        </p>
        <kbd className="h-8 inline-flex pointer-events-none select-none items-center gap-2 rounded border bg-muted px-2.5 font-mono text-sm font-medium text-muted-foreground ml-auto border-n-7 bg-n-7">
          <span className="text-base">
            <Command className="h-4 w-4" />
            {/* cmd */}
          </span>
          K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search all chats & members..." />
        <CommandList>
          <CommandEmpty>No results Found</CommandEmpty>
          {data.map(({ label, type, data }) => {
            if (!data?.length) return null;
            return (
              <CommandGroup key={label} heading={label}>
                {data?.map(({ id, icon, name }) => (
                  <CommandItem
                    key={id}
                    onSelect={() => {
                      onClick({ id, type });
                    }}
                    className="cursor-pointer"
                  >
                    {icon} <span>{name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default RoomSearch;
