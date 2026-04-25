"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as folderApi from "@/services/folder.api";

export function useFolders(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true;
  const queryClient = useQueryClient();

  const query = useQuery({
    enabled,
    queryFn: folderApi.listFolders,
    queryKey: ["folders"],
    staleTime: 1000 * 60 * 5, // 5 min cache
  });

  const mutation = useMutation({
    mutationFn: ({
      name,
      parentId,
    }: {
      name: string;
      parentId: null | string;
    }) => folderApi.createFolder({ name, parentId }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });

  return {
    createFolder: mutation.mutateAsync,
    error: query.error ? "Failed to load folders" : null,
    folders: query.data?.folders ?? [],

    loading: query.isLoading,

    refresh: () => queryClient.invalidateQueries({ queryKey: ["folders"] }),
  };
}
