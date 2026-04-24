import { Dialog,  DialogClose,  DialogContent, DialogHeader, DialogTitle } from "@monorepo/ui/components/dialog";
import * as imageApi from "@/services/image.api";
import type { ImageFile } from "@monorepo/types";
import { FileIcon, X } from "lucide-react";

export default function ImageModal({ image, open, setOpen }: { image: ImageFile, open: boolean, setOpen: (open: boolean) => void }) {
  return (
    <Dialog  open={open} modal={true} onOpenChange={setOpen}>
     
      <DialogContent showCloseBtn={false} style={{height:"100vh"}}  className="p-0 flex flex-col max-h-screen md:rounded-none border-none w-screen max-w-none max-h-screen gap-0 backdrop-blur bg-white/5">
        <div className="p-4  flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileIcon className="size-6 text-muted-foreground" />

          <DialogTitle className="text-xl text-white line-clamp-1">
            {image.name}
          </DialogTitle>
          </div>
          <DialogClose className="rounded-full ring-0 p-2 cursor-pointer hover:bg-white/10">
            <X className="text-muted-foreground size-6 "/>
          </DialogClose>
        </div>
        <div className="flex flex-1 p-4 items-center h-full w-full max-h-[100%] pb-12 justify-center">
          <img
            src={imageApi.imageUrlToAbsolute(image.url)}
            alt={image.name}
            
           
            className=" object-contain h-full "
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}