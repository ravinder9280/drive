export interface FolderSizeEdge {
  _id: string;
  parentId: null | string;
}

export interface ImageSizeRow {
  folderId: string;
  size: number;
}

/**
 * Returns total bytes per folder including all nested subfolders (post-order DFS).
 */
export function calculateFolderSize(
  folders: FolderSizeEdge[],
  images: ImageSizeRow[],
): Record<string, number> {
  const childrenMap = new Map<string, string[]>();
  const directBytes = new Map<string, number>();

  for (const f of folders) {
    if (!childrenMap.has(f._id)) {
      childrenMap.set(f._id, []);
    }
    if (f.parentId) {
      if (!childrenMap.has(f.parentId)) {
        childrenMap.set(f.parentId, []);
      }
      childrenMap.get(f.parentId)!.push(f._id);
    }
  }

  for (const img of images) {
    directBytes.set(
      img.folderId,
      (directBytes.get(img.folderId) ?? 0) + img.size,
    );
  }

  const memo = new Map<string, number>();

  const dfs = (folderId: string): number => {
    const cached = memo.get(folderId);
    if (cached !== undefined) {
      return cached;
    }
    let total = directBytes.get(folderId) ?? 0;
    const children = childrenMap.get(folderId) ?? [];
    for (const childId of children) {
      total += dfs(childId);
    }
    memo.set(folderId, total);
    return total;
  };

  for (const f of folders) {
    dfs(f._id);
  }

  return Object.fromEntries(memo);
}
