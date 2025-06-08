"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { zodResolver } from "@hookform/resolvers/zod";
import { badWords } from "./array-bad";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Plus, SendHorizontal } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import { EmojiPicker } from "../emoji-picker";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useRef, useState } from "react";
import { ActionTooltip } from "../action-tooltop";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "chat";
}

// Utility function to detect if the user is on a mobile device
const isMobileDevice = () => {
  return (
    typeof window !== "undefined" &&
    /Mobi|Android|iPhone/i.test(navigator.userAgent)
  );
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

export const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const { onOpen } = useModal();
  const router = useRouter();
  const [isBadWord, setIsBadWord] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Ref for textarea

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isBadWord) return;
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });

      await axios.post(url, values);

      form.reset();
      setInputValue("");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  const handleInputChange = (value: string) => {
    const normalizedValue = value.toLowerCase();
    const containsBadWordInText = containsBadWord(normalizedValue, badWords);

    setIsBadWord(containsBadWordInText);
    setInputValue(value);
    form.setValue("content", value);

    // Dynamically adjust textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height based on scrollHeight
    }
  };

  // Function to handle keypress events (Enter to send, Shift+Enter for new line on desktop, Enter for new line on mobile)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isMobileDevice()) {
      // On mobile, Enter should only insert a new line
      if (e.key === "Enter") {
        e.preventDefault();
        setInputValue((prev) => prev + "\n");
      }
    } else {
      // On desktop, handle Enter to send and Shift+Enter to insert a new line
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault(); // Prevent the default new line behavior
        form.handleSubmit(onSubmit)(); // Trigger form submit
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow"></div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative p-2 pb-0">
                    {/* Button to open file modal */}
                    <ActionTooltip label="Add Attachment" side="top">
                      <button
                        type="button"
                        onClick={() => {
                          onOpen("messageFile", { apiUrl, query });
                        }}
                        className="absolute top-[1.18rem] left-8 h-[24px] w-[24px] hover:bg-zinc-300 bg-n-3/80 transition rounded-full p-1 flex items-center justify-center"
                      >
                        <Plus className="text-n-8" />
                      </button>
                    </ActionTooltip>

                    {/* Auto-resizing Textarea for chat input */}
                    <textarea
                      ref={textareaRef}
                      autoComplete="off"
                      disabled={isLoading}
                      className={` px-14 py-6 bg-n-6 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-full rounded-md ${
                        isBadWord ? "text-red-500" : "text-gray-100"
                      }`}
                      placeholder={`Message ${
                        type === "conversation" ? name : "#" + name
                      }`}
                      value={
                        isBadWord
                          ? "You will get banned if any inappropriate words are sent!"
                          : inputValue
                      }
                      onChange={(e) => handleInputChange(e.target.value)}
                      onKeyDown={handleKeyDown} // Handling the keypress for Enter and Shift+Enter
                      rows={1} // Initial height with 1 row
                      style={{
                        marginBottom: "0.5rem",
                        paddingTop: "0.7rem", // Reduce padding at the top
                        paddingBottom: "0.7rem", // Reduce padding at the bottom
                        resize: "none", // Disable manual resize
                        overflowY: "auto", // Allow vertical scrolling
                        maxHeight: "8rem", // Set maximum height to 8rem
                        minHeight: "2rem", // Set minimum height
                      }}
                    />

                    <div className="relative">
                      <EmojiPicker
                        onChange={(emoji: string) =>
                          handleInputChange(`${inputValue} ${emoji}`)
                        }
                      />
                    </div>

                    {/* Send button */}
                    <button
                      type="submit"
                      disabled={
                        isLoading || !form.watch("content") || isBadWord
                      }
                      className={`absolute bottom-[0.75rem] right-4 h-[50px] w-[50px] p-1 flex items-center justify-center transition rounded-full ${
                        isBadWord
                          ? "text-red-500"
                          : isLoading || !form.watch("content")
                          ? "text-gray-500"
                          : "text-white"
                      }`}
                    >
                      <SendHorizontal size={24} />
                    </button>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};
