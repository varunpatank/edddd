"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormItem,
  FormMessage,
  FormField,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { ChatType } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import lucide-react icons
import { MessageCircle, Video, Mic } from "lucide-react";
import qs from "query-string";
import { useEffect } from "react";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Chat name is required.",
    })
    .refine((name) => name !== "general", {
      message: "Chat name cannot be 'general'",
    }),
  type: z.nativeEnum(ChatType),
});
export const EditChatModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { chat, room } = data;
  const router = useRouter();
  const params = useParams();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: chat?.type || ChatType.TEXT,
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };
  useEffect(() => {
    if (chat) {
      form.setValue("name", chat.name);
      form.setValue("type", chat.type);
    }
  }, [form, chat]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/chats/${chat?.id}`,
        query: {
          roomId: room?.id,
        },
      });
      await axios.patch(url, values);

      form.reset();
      onClose();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const isModalOpen = isOpen && type === "editChat";

  // Function to return the correct icon based on the chat type
  const getIcon = (type: ChatType) => {
    switch (type) {
      case ChatType.VIDEO:
        return <Video className="w-4 h-4 mr-2" />;
      case ChatType.AUDIO:
        return <Mic className="w-4 h-4 mr-2" />;
      case ChatType.TEXT:
      default:
        return <MessageCircle className="w-4 h-4 mr-2" />;
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-n-7 text-white overflow-hidden p-0">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Edit <span className="text-gray-400">#</span>
            <span className="text-purple-400">{chat?.name || "Chat"}</span>
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-xs uppercase">
                      Chat Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="e.g. 'Questions Chat'"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chat Type</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        {/* Ensure flexbox is used to align icon and text inline */}
                        <SelectTrigger className="border-[1px] ring-offset-0 flex items-center">
                          <div className="flex items-center">
                            <SelectValue placeholder="Select chat type" />
                          </div>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChatType).map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="capitalize flex items-center"
                          >
                            {/* Flex container to keep icon and text inline */}
                            <div className="flex items-center">
                              {getIcon(type)}
                              {type.toLowerCase()}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="bg-n-6/50 px-6 py-4">
              <Button type="submit" disabled={isLoading} variant="tert">
                {isLoading ? "Saving.." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
