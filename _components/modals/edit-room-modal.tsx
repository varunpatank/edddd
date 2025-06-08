"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { useEffect } from "react";
const formSchema = z.object({
  name: z.string().min(1, {
    message: "Room name is required.",
  }),
  imageUrl: z.string().min(1, {
    message: "Room image is required.",
  }),
});
export const EditRoomModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const { room } = data;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const handleClose = () => {
    onClose();
  };
  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/rooms/${room?.id}`, values);
      router.refresh();
      handleClose();
    } catch {
      toast.error("Something went wrong");
    }
  };
  const isModalOpen = isOpen && type === "editRoom";
  useEffect(() => {
    if (room) {
      form.setValue("name", room.name);
      form.setValue("imageUrl", room.imageUrl);
    }
  }, [room, form]);
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-n-7 text-white overflow-hidden p-0">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Edit Your Room
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-center">
            Give your Room a personality with a name and image. You can always
            change it later
          </DialogDescription>{" "}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="roomImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-xs uppercase">
                      Room Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="e.g. 'Biology Group'"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
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
