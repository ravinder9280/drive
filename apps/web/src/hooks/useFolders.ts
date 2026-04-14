"use client";

import type { Folder, ListFoldersResponse } from "@monorepo/types";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

import { getToken } from "@/lib/auth";
import * as folderApi from "@/services/folder.api";

export function useFolders(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true;
  const [data, setData] = useState<ListFoldersResponse | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!enabled || !getToken()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await folderApi.listFolders();
      setData(result);
    } catch (e) {
      const message = axios.isAxiosError(e)
        ? (e.response?.data as { message?: string })?.message ??
          e.message
        : "Failed to load folders";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    void refresh();
  }, [enabled, refresh]);

  const createFolder = useCallback(
    async (name: string, parentId: string | null): Promise<Folder> => {
      const folder = await folderApi.createFolder({ name, parentId });
      await refresh();
      return folder;
    },
    [refresh]
  );

  return {
    folders: data?.folders ?? [],
    sizesByFolderId: data?.sizesByFolderId ?? {},
    loading,
    error,
    refresh,
    createFolder,
  };
}
