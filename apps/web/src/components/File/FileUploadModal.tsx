"use client";

import { Button } from "@monorepo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@monorepo/ui/components/dialog";
import { Input } from "@monorepo/ui/components/input";
import axios from "axios";
import { UploadIcon } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import * as imageApi from "@/services/image.api";

interface UploadModalProps {
  folderId: null | string;
 
}

export function FileUploadModal({
  folderId,
  
}: UploadModalProps) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const queryClient = useQueryClient();


  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const reset = useCallback(() => {
    setFile(null);
    setName("");
    setIsDragging(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const setSelectedFile = useCallback(
    (nextFile: File | null) => {
      setFile(nextFile);
      if (nextFile && !name) {
        setName(nextFile.name);
      }
    },
    [name],
  );

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selected = event.target.files?.[0] ?? null;
      setSelectedFile(selected);
    },
    [setSelectedFile],
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!folderId) {
        return;
      }
      setIsDragging(true);
    },
    [folderId],
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
    },
    [],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      if (!folderId) {
        return;
      }
      const droppedImage =
        Array.from(event.dataTransfer.files).find((candidate) =>
          candidate.type.startsWith("image/"),
        ) ?? null;
      setSelectedFile(droppedImage);
    },
    [folderId, setSelectedFile],
  );

  const handleClose = (next: boolean) => {
    if (!next) {
      reset();
    }
    setUploadOpen(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderId || !file) {
      toast.error("Choose a folder and a file.");
      return;
    }
    setSubmitting(true);
    try {
      await imageApi.uploadImage({
        file,
        folderId,
        name: name.trim() || undefined,
      });
      reset();
      setUploadOpen(false);
      toast.success("Image Uploaded Successfully");
      queryClient.invalidateQueries({ queryKey: ["folder-images", folderId] });

    } catch (err) {
      const message = axios.isAxiosError(err)
        ? ((err.response?.data as { message?: string })?.message ?? err.message)
        : "Upload failed";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
    <Button disabled={!folderId} onClick={() => setUploadOpen(true)}>
          <UploadIcon className="size-4" />
          <span className="hidden md:block">Upload File</span>
        </Button>
    <Dialog onOpenChange={handleClose} open={uploadOpen}  >
      <DialogContent className="sm:max-w-md">
        <form onSubmit={(e) => void handleSubmit(e)}>
          <DialogHeader>
            <DialogTitle>Upload image</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <div
                className={`relative flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-8 py-16 transition-colors ${
                  isDragging
                    ? "border-zinc-400 bg-muted/90"
                    : "border-zinc-300 hover:border-zinc-400 bg-muted dark:bg-muted/50"
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  accept="image/*"
                  className="hidden"
                  disabled={!folderId}
                  id="image-upload"
                  onChange={handleFileSelect}
                  ref={fileInputRef}
                  type="file"
                />
                {file ? (
                  <>
                    <UploadIcon className="mb-4 size-6" />
                    <p className="mb-1 text-sm font-semibold ">{file.name}</p>
                    <p className="text-sm font-normal text-zinc-500">
                      Click to select a different image
                    </p>
                  </>
                ) : (
                  <>
                    <UploadIcon className="mb-4 size-6" />
                    <p className="mb-1 text-sm font-semibold text-muted-foreground">
                      Select an image to upload
                    </p>
                    <p className="text-sm font-normal text-muted-foreground">
                      or drag and drop it here
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="upload-name">
                Name
              </label>
              <Input
                id="upload-name"
                onChange={(e) => setName(e.target.value)}
                placeholder="Optional"
                value={name}
                />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => handleClose(false)}
              type="button"
              variant="outline"
              >
              Cancel
            </Button>
            <Button disabled={submitting || !folderId || !file} type="submit">
              {submitting ? "Uploading…" : "Upload"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
              </>
  );
}
