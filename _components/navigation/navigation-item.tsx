"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ActionTooltip } from "../action-tooltop";
import { Button } from "@/components/ui/button";
interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
}
export const NavigationItem = ({ id, imageUrl, name }: NavigationItemProps) => {
  const params = useParams();
  const router = useRouter();
  const onClick = () => {
    router.push(`/studyhub/rooms/${id}`);
  };
  return (
    <ActionTooltip label={name} align="center" side="right">
      <button
        className="group relative flex items-center"
        onClick={() => {
          onClick();
        }}
      >
        <div
          className={cn(
            "absolute left-0 rounded-r-full transition-all w-[4px] bg-primary",
            params?.roomId !== id && "group-hover:h-[20px]",
            params?.roomId === id ? "h-[36px]" : "h-[0px]"
          )}
        />
        <div
          className={cn(
            "relative group flex mx-3 h-[45px] w-[45px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            params?.roomId === id && "bg-n-6 text-primary rounded-[16px]"
          )}
        >
          <Image
            src={
              name !== "Edexcel IAS Maths (Pure)"
                ? imageUrl || "https://i.ibb.co/phH8snp/picc.jpg"
                : ""
            }
            alt={""}
            fill
          />
        </div>
      </button>
    </ActionTooltip>
  );
};
