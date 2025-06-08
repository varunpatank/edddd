"use client";

import qs from "query-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Phone, PhoneOff, Video, VideoOff } from "lucide-react";

import { ActionTooltip } from "../action-tooltop";

export const ChatVideoButton = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isVideo = searchParams?.get("video");

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || "",
        query: {
          video: isVideo ? undefined : true,
        },
      },
      { skipNull: true }
    );

    router.push(url);
  };

  const Icon = isVideo ? PhoneOff : Phone;
  const tooltipLabel = isVideo ? "End Call" : "Start Call";

  return (
    <ActionTooltip side="bottom" label={tooltipLabel}>
      <button onClick={onClick} className="hover:opacity-75 trasition mr-4">
        <Icon className="w-6 h-6 text-purple-500" />
      </button>
    </ActionTooltip>
  );
};
