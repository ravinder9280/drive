"use client";

import { useQuery } from "@tanstack/react-query";
import * as imageApi from "@/services/image.api";

export function useFolderImages(folderId: string | null) {
  return useQuery({
    queryKey: ["folder-images", folderId],
    queryFn: () => imageApi.listImages(folderId!),
    enabled: !!folderId,
  });
}