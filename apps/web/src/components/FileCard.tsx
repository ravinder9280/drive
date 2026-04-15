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
import { DownloadIcon, EllipsisVerticalIcon, EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

import * as imageApi from "@/services/image.api";
import ImageModal from "./ImageModal";

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

export function FileCard({
  image,
  onDeleted,
}: {
  image: ImageFile;
  onDeleted?: () => void;
}) {
  const src = imageApi.imageUrlToAbsolute(image.url);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(image.name);

  const handleDownload = async (): Promise<void> => {
    try {
      const response = await fetch(src, { mode: "cors" });
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = image.name || "download";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  const handleDelete = async (): Promise<void> => {
    setIsDeleting(true);
    try {
      await imageApi.deleteImage(image._id);
      setConfirmOpen(false);
      onDeleted?.();
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message ?? err.message
        : "Failed to delete image";
      window.alert(message);
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
      window.alert("Name is required");
      return;
    }
    setIsRenaming(true);
    try {
      await imageApi.renameImage(image._id, nextName);
      setRenameOpen(false);
      onDeleted?.();
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message ?? err.message
        : "Failed to rename image";
      window.alert(message);
    } finally {
      setIsRenaming(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden py-0 gap-0">
        <CardContent className="p-0 aspect-square relative bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element -- dynamic API origin */}
          <img
            src={src}
            onClick={() => setOpen(true)}
            alt={image.name}
            className="absolute inset-0 cursor-pointer size-full object-cover"
          />
          <ImageModal image={image} open={open} setOpen={setOpen} />
        </CardContent>
        <CardFooter className="p-3 pr-1 flex items-center gap-2 justify-between">
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
              <Button variant="ghost" className="cursor-pointer" size="icon">
                <EllipsisVerticalIcon className="size-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="start" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setOpen(true)}>
                  <EyeIcon className="size-4" /> View
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

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
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
              onClick={(e) => {
                e.preventDefault();
                void handleDelete();
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={renameOpen} onOpenChange={setRenameOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rename image</AlertDialogTitle>
            <AlertDialogDescription>
              Update the file name for "{image.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            value={renameValue}
            autoFocus
            

            onChange={(e) => setRenameValue(e.target.value)}
            placeholder="Enter image name"
            disabled={isRenaming}
          />
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRenaming}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void submitRename();
              }}
              disabled={isRenaming}
            >
              {isRenaming ? "Saving..." : "Save"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
