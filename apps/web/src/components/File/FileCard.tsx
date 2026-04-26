"use client";

import type { ImageFile } from "@monorepo/types";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@monorepo/ui/components/alert-dialog";
import { Button } from "@monorepo/ui/components/button";
import { Card, CardContent, CardFooter } from "@monorepo/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@monorepo/ui/components/dropdown-menu";
import { Input } from "@monorepo/ui/components/input";
import axios from "axios";
import {
  DownloadIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  File,
  FileIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import * as imageApi from "@/services/image.api";

import ImageModal from "./ImageModal";

export function FileCard({
  image,
  onImageUpdated,
  view = "grid",
}: {
  image: ImageFile;
  onImageUpdated?: () => void;
  view: "grid" | "list";
}) {
  const src = imageApi.imageUrlToAbsolute(image.url || "");
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(image.name);

  const handleDownload = async (): Promise<void> => {
    try {
      const response = await fetch(src);

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = image.name || "download";
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed", err);
      toast.error("Download failed");
    }
  };

  const handleDelete = async (): Promise<void> => {
    setIsDeleting(true);
    try {
      await imageApi.deleteImage(image._id);
      setConfirmOpen(false);
      onImageUpdated?.();
      toast.success("Image Deleted Successfully");
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? ((err.response?.data as undefined | { message?: string })?.message ??
          err.message)
        : "Failed to delete image";
      toast.success(message || "Some Error Occured");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRename = (): void => {
    setRenameValue(image.name);
    setRenameOpen(true);
  };

  const submitRename = async (): Promise<void> => {
    const nextName = renameValue.trim();
    if (!nextName) {
      toast.warning("Name is Required");
      return;
    }
    setIsRenaming(true);
    try {
      await imageApi.renameImage(image._id, nextName);
      setRenameOpen(false);
      onImageUpdated?.();
      toast.success("Image Renamed Successfully");
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? ((err.response?.data as undefined | { message?: string })?.message ??
          err.message)
        : "Failed to rename image";
      toast.success(message || "Some Error Occured");
    } finally {
      setIsRenaming(false);
    }
  };

  return (
    <>
      {view == "list" ? (
        <div className="  px-1  flex items-center justify-between gap-2  hover:bg-muted/50">
          <div
            className="flex-1 cursor-pointer h-full flex items-center gap-4 "
            onClick={() => setOpen(true)}
          >
            <File className="size-5 text-muted-foreground" />
            <span className="line-clamp-1 text-muted-foreground  flex-1">
              {image.name}
            </span>
          </div>
          <div className="py-2 ">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="cursor-pointer" size="icon" variant="ghost">
                  <EllipsisVerticalIcon className="size-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56" side="bottom">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setOpen(true)}>
                    <EyeIcon className="size-4" /> Open
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownload}>
                    <DownloadIcon className="size-4" /> Download
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleRename}>
                    <PencilIcon className="size-4" /> Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-500"
                    onClick={() => setConfirmOpen(true)}
                  >
                    <TrashIcon className="size-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ) : (
        <Card className="overflow-hidden py-0  gap-0">
          <CardContent className="p-0 aspect-square relative bg-muted">
            { image.url?
            <img
              alt={image.name}
              className="absolute inset-0 cursor-pointer size-full object-cover"
              onClick={() => setOpen(true)}
              src={src}
              />:<FileIcon/>

              }
          </CardContent>
          <CardFooter className="p-3 pr-1 border-t flex items-center gap-2 justify-between">
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <p className="text-sm font-medium truncate" title={image.name}>
                {image.name}
              </p>
              <p className="text-xs text-muted-foreground tabular-nums">
                {formatBytes(image.size)}
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="cursor-pointer" size="icon" variant="ghost">
                  <EllipsisVerticalIcon className="size-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-40 md:w-56"
                side="bottom"
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setOpen(true)}>
                    <EyeIcon className="size-4" /> Open
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownload}>
                    <DownloadIcon className="size-4" /> Download
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleRename}>
                    <PencilIcon className="size-4" /> Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-500"
                    onClick={() => setConfirmOpen(true)}
                  >
                    <TrashIcon className="size-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </Card>
      )}
      <ImageModal image={image} open={open} setOpen={setOpen} />

      <AlertDialog onOpenChange={setConfirmOpen} open={confirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete image?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove "{image.name}" from your drive.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-500/90"
              disabled={isDeleting}
              onClick={(e) => {
                e.preventDefault();
                void handleDelete();
              }}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog onOpenChange={setRenameOpen} open={renameOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rename image</AlertDialogTitle>
            <AlertDialogDescription>
              Update the file name for "{image.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            autoFocus
            disabled={isRenaming}
            onChange={(e) => setRenameValue(e.target.value)}
            placeholder="Enter image name"
            value={renameValue}
          />
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRenaming}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isRenaming}
              onClick={(e) => {
                e.preventDefault();
                void submitRename();
              }}
            >
              {isRenaming ? "Saving..." : "Save"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) {
    return "0 B";
  }
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / k ** i;
  return `${value.toFixed(value < 10 && i > 0 ? 1 : 0)} ${sizes[i]}`;
}
