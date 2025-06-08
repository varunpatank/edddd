"use client";

import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Member, MemberRole, Profile } from "@prisma/client";
import {
  Edit,
  FileIcon,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Download,
  X,
} from "lucide-react"; // Import Download icon

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import { UserAvatar } from "../user-avatar";
import { ActionTooltip } from "../action-tooltop";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import toast from "react-hot-toast";
import { saveAs } from "file-saver";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { badWords } from "./array-bad"; // Import badWords

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  GUEST: null,
  MODERATOR: (
    <ActionTooltip label="Mod" side="top">
      <ShieldAlert className="ml-2 h-5 w-5  mr-2 text-yellow-500" />
    </ActionTooltip>
  ),
  ADMIN: (
    <ActionTooltip label="Admin" side="top">
      <ShieldCheck className=" ml-2  h-5 w-5  mr-2 text-emerald-500" />
    </ActionTooltip>
  ),
};

const formSchema = z.object({
  content: z
    .string()
    .min(1)
    .regex(/\S/, "Message cannot be empty or contain only spaces"),
});

const containsBadWord = (value: string, badWords: string[]) => {
  const normalizedValue = value.toLowerCase();
  return badWords.some((word) => normalizedValue.includes(word.toLowerCase()));
};

export const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { onOpen } = useModal();

  const params = useParams();
  const router = useRouter();

  const onMemberClick = () => {
    if (member.id === currentMember.id) {
      return;
    }

    router.push(`/studyhub/rooms/${params?.roomId}/conversations/${member.id}`);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  });

  const isLoading = form.formState.isSubmitting;
  const [isBadWord, setIsBadWord] = useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isBadWord) return;
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });

      await axios.patch(url, values);
      form.reset();
      setIsEditing(false);
    } catch (error) {
      toast.error("something went wrong..");
      console.log(error);
    }
  };

  const onCancelEdit = () => {
    setIsEditing(false);
    form.reset({
      content: content,
    });
  };

  const saveFile = (url: string, type: string) => {
    saveAs(url, `${type}`);
  };

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    form.reset({
      content: content,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const fileType = fileUrl?.split(".").pop();

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;

  return (
    <div className="relative group flex items-center hover:bg-n-6/60 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div
          onClick={onMemberClick}
          className="cursor-pointer hover:drop-shadow-md transition"
        >
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p
                onClick={onMemberClick}
                className="font-semibold text-sm hover:underline cursor-pointer"
              >
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-gray-400">{timestamp}</span>
          </div>

          {isImage && (
            <div className="relative mt-2 flex items-center gap-x-2">
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-square rounded-md overflow-hidden border flex items-center bg-secondary h-48 w-48 cursor-pointer"
              >
                <PhotoProvider>
                  <PhotoView src={fileUrl}>
                    <Image
                      src={fileUrl}
                      alt={content}
                      fill
                      sizes="(max-width: 192px), (max-height: 192px)"
                      className="object-cover"
                    />
                  </PhotoView>
                </PhotoProvider>
              </a>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto"
                onClick={() => {
                  saveFile(fileUrl, "image");
                }}
              >
                <Download className="w-5 h-5" />
              </Button>
            </div>
          )}

          {isPDF && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-n-6/50">
              <FileIcon className="h-10 w-10 fill-n-7 stroke-gray-400" />
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-emerald-500 hover:underline"
              >
                PDF File
              </a>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto"
                onClick={() => {
                  saveFile(fileUrl, "pdf");
                }}
              >
                <Download className="w-5 h-5" />
              </Button>
            </div>
          )}

          {!fileUrl && !isEditing && (
            <p
              className={cn(
                "text-sm text-gray-300",
                deleted && "italic text-gray-400 text-xs mt-1"
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-gray-400">(edited)</span>
              )}
            </p>
          )}

          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex items-start w-full gap-x-2 pt-2"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full flex-grow">
                          <Textarea
                            autoComplete="off"
                            disabled={isLoading}
                            className={`p-2 bg-n-6 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-200 ${
                              isBadWord ? "text-red-500" : ""
                            }`}
                            placeholder="Edited Message"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              const normalizedValue = value.toLowerCase();
                              const containsBadWordInText = containsBadWord(
                                normalizedValue,
                                badWords
                              );
                              setIsBadWord(containsBadWordInText);
                              field.onChange(e);
                            }}
                            rows={3} // Shorter height for textarea
                            style={{
                              resize: "none", // Disable manual resizing
                              maxHeight: "6rem", // Set maximum height
                            }}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex gap-x-1 items-center">
                  <Button
                    disabled={isLoading || isBadWord}
                    size="sm"
                    variant="tert"
                  >
                    Save
                  </Button>
                  <Button
                    type="button"
                    disabled={isLoading}
                    size="lg"
                    variant="link"
                    onClick={onCancelEdit}
                    className="p-1" // Adjust padding to make it smaller
                  >
                    <X className="w-4 h-4" /> {/* Adjust icon size */}
                  </Button>
                </div>
              </form>

              <span className="text-[10px] mt-1 text-gray-400">
                Press ESC to Cancel, Enter to Save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-n-7 border rounded-sm">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit
                onClick={() => setIsEditing(true)}
                className="cursor-pointer ml-auto w-4 h-4 text-gray-400 hover:text-emerald-500 transition"
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash2
              onClick={() =>
                onOpen("deleteMessage", {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                })
              }
              className="cursor-pointer ml-auto w-4 h-4 text-gray-400 hover:text-rose-600 transition"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};
