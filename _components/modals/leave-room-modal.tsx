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
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FcLeave } from "react-icons/fc";
import { useRouter } from "next/navigation";

export const LeaveRoomModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const isModalOpen = isOpen && type === "leaveRoom";
  const { room } = data;
  const [isLoading, setLoading] = useState(false);
  const onClick = async () => {
    try {
      setLoading(true);
      await axios.patch(`/api/rooms/${room?.id}/leave`);
      onClose();
      toast.success("Room Left");
      router.push("/studyhub");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong...");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-n-7 text-white overflow-hidden p-0">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Leave Room
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-center">
            Are you sure you want to leave{" "}
            <span className="font-semibold text-purple-400">{room?.name}</span>{" "}
            room?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className=" px-6 py-4">
          <div className="justify-between flex items-center w-full">
            <Button
              disabled={isLoading}
              variant={"ghost"}
              onClick={() => {
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              variant={"destructive"}
              onClick={() => {
                onClick();
              }}
            >
              {isLoading ? "Leaving..." : "Leave"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
