import { Dialog,  DialogContent } from "@monorepo/ui/components/dialog";
import * as imageApi from "@/services/image.api";
import type { ImageFile } from "@monorepo/types";

export default function ImageModal({ image, open, setOpen }: { image: ImageFile, open: boolean, setOpen: (open: boolean) => void }) {
  return (
    <Dialog open={open} modal={true} onOpenChange={setOpen}>
     
      <DialogContent  className="p-0 max-w-[60vw] max-h-[60vh]">
        <div className="relative">
          <img
            src={imageApi.imageUrlToAbsolute(image.url)}
            alt={image.name}
            width="1200"
            height="800"
            className="max-h-[60vh] object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}