"use client";

import type { ImageFile } from "@monorepo/types";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

import * as imageApi from "@/services/image.api";

export function useFolderImages(folderId: string | null) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!folderId) {
      setImages([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const list = await imageApi.listImages(folderId);
      setImages(list);
    } catch (e) {
      const message = axios.isAxiosError(e)
        ? (e.response?.data as { message?: string })?.message ?? e.message
        : "Failed to load images";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [folderId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { images, loading, error, refresh };
}
