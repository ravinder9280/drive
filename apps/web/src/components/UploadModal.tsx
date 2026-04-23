"use client";

import axios from "axios";
import { UploadIcon } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { Button } from "@monorepo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@monorepo/ui/components/dialog";
import { Input } from "@monorepo/ui/components/input";

import * as imageApi from "@/services/image.api";
import { toast } from "sonner";

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderId: string | null;
  onUploaded: () => void;
}

export function UploadModal({
  open,
  onOpenChange,
  folderId,
  onUploaded,
}: UploadModalProps) {
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
    [name]
  );

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selected = event.target.files?.[0] ?? null;
      setSelectedFile(selected);
    },
    [setSelectedFile]
  );

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!folderId) {
      return;
    }
    setIsDragging(true);
  }, [folderId]);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      if (!folderId) {
        return;
      }
      const droppedImage =
        Array.from(event.dataTransfer.files).find((candidate) =>
          candidate.type.startsWith("image/")
        ) ?? null;
      setSelectedFile(droppedImage);
    },
    [folderId, setSelectedFile]
  );

  const handleClose = (next: boolean) => {
    if (!next) {
      reset();
    }
    onOpenChange(next);
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
        folderId,
        file,
        name: name.trim() || undefined,
      });
      reset();
      onOpenChange(false);
      onUploaded();
      toast.success("Image Uploaded Successfully")
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message ?? err.message
        : "Upload failed";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={(e) => void handleSubmit(e)}>
          <DialogHeader>
            <DialogTitle>Upload image</DialogTitle>
            
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-8 py-16 transition-colors ${isDragging
                  ? "border-zinc-400 bg-muted/90"
                  : "border-zinc-300 hover:border-zinc-400 bg-muted dark:bg-muted/50"
                  }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  disabled={!folderId}
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {file ? (
                  <>
                    <UploadIcon className="mb-4 size-6" />
                    <p className="mb-1 text-sm font-semibold ">
                      {file.name}
                    </p>
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Optional"
              />
            </div>
            
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || !folderId || !file}>
              {submitting ? "Uploading…" : "Upload"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
