"use client";

import { useQuery } from "@tanstack/react-query";

import * as imageApi from "@/services/image.api";

export function useFolderImages(folderId: null | string) {
  return useQuery({
    enabled: !!folderId,
    queryFn: () => imageApi.listImages(folderId!),
    queryKey: ["folder-images", folderId],
  });
}
