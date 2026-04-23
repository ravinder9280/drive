"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as folderApi from "@/services/folder.api";

export function useFolders(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true;
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["folders"],
    queryFn: folderApi.listFolders,
    enabled,
    staleTime: 1000 * 60 * 5, // 5 min cache
  });

  const mutation = useMutation({
    mutationFn: ({
      name,
      parentId,
    }: {
      name: string;
      parentId: string | null;
    }) => folderApi.createFolder({ name, parentId }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });

  return {
    folders: query.data?.folders ?? [],
    loading: query.isLoading,
    error: query.error ? "Failed to load folders" : null,

    refresh: () =>
      queryClient.invalidateQueries({ queryKey: ["folders"] }),

    createFolder: mutation.mutateAsync,
  };
}