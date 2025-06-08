"use client";

import { Smile } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useTheme } from "next-themes";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EmojiPickerProps {
  onChange: (value: string) => void;
}

const excludedEmojis = [
  "flag-il",
  "ru",
  "rainbow-flag",
  "middle_finger",
  "underage",
  "briefs",
];

const filterEmojis = (emojiData: any, excludedEmojis: string[]) => {
  return {
    ...emojiData,
    emojis: Object.fromEntries(
      Object.entries(emojiData.emojis || {}).filter(
        ([key]) => !excludedEmojis.includes(key)
      )
    ),
    categories: emojiData.categories.map((category: any) => ({
      ...category,
      emojis: category.emojis.filter(
        (emoji: string) => !excludedEmojis.includes(emoji)
      ),
    })),
  };
};

export const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  const { resolvedTheme } = useTheme();

  const filteredData = filterEmojis(data, excludedEmojis);

  return (
    <Popover>
      <PopoverTrigger className="z-1imp absolute bottom-[1.6rem] right-[3.5rem] z-[99]">
        <Smile className="text-n-3/80 hover:text-zinc-300 transition" />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={40}
        className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
      >
        <Picker
          theme={resolvedTheme}
          data={filteredData} // Use the filtered data
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  );
};
