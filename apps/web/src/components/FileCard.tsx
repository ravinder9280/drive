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
import axios from "axios";
import { DownloadIcon, EllipsisVerticalIcon, EyeIcon, TrashIcon } from "lucide-react";
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
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDownload = (): void => {
    const link = document.createElement("a");
    link.href = src;
    link.download = image.name;
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
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
    </>
  );
}
