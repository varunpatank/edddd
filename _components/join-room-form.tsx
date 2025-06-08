"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";

const JoinRoomForm: React.FC = () => {
  const [link, setLink] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (link) {
      window.location.href = link;
      setLink("");
    }
  };

  return (
    <div className="bg-n-8 p-6 rounded-lg shadow-md">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 md:flex-row md:items-center"
      >
        <Input
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Paste invite link here"
          required
          className="flex-1 px-4 py-[0.7rem]"
        />
        <Button
          type="submit"
          disabled={!link} // Disable button if input is empty
          className={`px-6 py-2 rounded-md transition duration-300 ${
            link
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "bg-purple-700 text-gray-300 cursor-not-allowed"
          }`}
        >
          Join
        </Button>
      </form>
    </div>
  );
};

export default JoinRoomForm;
