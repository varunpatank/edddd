"use client";
import qs from "query-string";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useModal } from "@/hooks/use-modal-store";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";

export const DeleteChatModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const params = useParams();
  const isModalOpen = isOpen && type === "deleteChat";
  const { room, chat } = data;
  const [isLoading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const isInputValid = inputValue.toUpperCase() === "DELETE";

  const handleDelete = async () => {
    try {
      setLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/chats/${chat?.id}`,
        query: {
          roomId: room?.id,
        },
      });
      await axios.delete(url);
      onClose();
      toast.success("Chat Deleted");
      router.push(`/studyhub/rooms/${room?.id}`);
      router.refresh();
    } catch (error) {
      toast.error(`Something went wrong...`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-n-7 text-white overflow-hidden p-0">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Chat
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-center">
            Are you sure you want to delete the chat #{""}
            <span className="font-semibold text-purple-400">{chat?.name}</span>?
            <br />
            <p className="text-red-500">This action cannot be undone.</p>
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 py-4">
          <Input
            type="text"
            placeholder="Type 'DELETE' to proceed"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="p-2 border rounded-md w-full"
          />
        </div>
        <DialogFooter className="px-6 py-4">
          <div className="justify-between flex items-center w-full">
            <Button disabled={isLoading} variant={"ghost"} onClick={onClose}>
              Cancel
            </Button>
            <Button
              disabled={!isInputValid || isLoading}
              variant={"destructive"}
              onClick={handleDelete}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
