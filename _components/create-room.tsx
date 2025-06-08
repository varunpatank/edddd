"use client";
import React from "react";
import { useModal } from "@/hooks/use-modal-store";

const CreateRoomBTN: React.FC = () => {
  const { onOpen } = useModal();

  const handleOpenModal = () => {
    onOpen("createRoom", {}, true);
  };

  return (
    <button
      onClick={handleOpenModal}
      className="group relative w-full md:w-auto h-12 overflow-hidden rounded-lg bg-purple-800 px-6 py-2 text-white transition-all duration-300 hover:text-black hover:font-semibold"
    >
      <span className="relative z-10 text-lg">Create Room</span>
      <span className="absolute inset-0 overflow-hidden rounded-md">
        <span className="absolute left-0 aspect-square w-full origin-center -translate-x-full rounded-full bg-white transition-all duration-300 group-hover:-translate-x-0 group-hover:scale-150"></span>
      </span>
    </button>
  );
};

export default CreateRoomBTN;
