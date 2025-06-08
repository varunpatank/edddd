"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogDescription,
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
import { useRouter } from "next/navigation";
import { FileUpload } from "@/components/file-uploadertwo";
import { UploadDropzone, Uploader } from "@uploadthing/react";
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, CopyCheck, RefreshCcw } from "lucide-react";
import { ActionTooltip } from "../action-tooltop";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";

export const InviteModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const origin = useOrigin();

  const isModalOpen = isOpen && type === "invite";
  const { room } = data;
  const inviteUrl = `${origin}/studyhub/invite/${room?.inviteCode}`;
  const [copied, setCopied] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true); // Set copied state to true when copied

    // Reset copied state after 10 seconds
    setTimeout(() => {
      setCopied(false);
    }, 10000);
  };

  const onNew = async () => {
    try {
      setLoading(true);
      const response = await axios.patch(`/api/rooms/${room?.id}/invite-code`);
      onOpen("invite", { room: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-n-7 text-white overflow-hidden p-0">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite Members!
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-center">
            Invite your friends, students, tutors, admins or assistants
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-primary/70">
            Room invite link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              disabled={isLoading}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={inviteUrl}
              readOnly
            />
            <ActionTooltip
              label={copied ? "Copied!" : "Copy"}
              align="center"
              side="top"
            >
              <Button
                disabled={isLoading}
                variant={"tert"}
                onClick={onCopy}
                size={"icon"}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </ActionTooltip>
          </div>
          <Button
            variant={"link"}
            size={"sm"}
            className="text-xs mt-4 text-zinc-300"
            onClick={onNew}
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate new link"}
            <RefreshCcw className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
