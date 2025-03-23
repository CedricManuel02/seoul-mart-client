import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import Image from "next/image";
import React from "react";

export default function ItemCommentImageModal({ media }: { media: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Image
          className="w-32 h-32 object-cover rounded hover:opacity-90 cursor-pointer"
          src={media}
          width={100}
          height={100}
          alt={"Rating image"}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[350px] p-0 overflow-hidden">
        <div className="hidden">
          <DialogTitle></DialogTitle>
        </div>
        <Image
          className="w-full h-full object-contain rounded"
          src={media}
          width={100}
          height={100}
          loading="lazy"
          alt={"Rating image"}
        />
      </DialogContent>
    </Dialog>
  );
}
