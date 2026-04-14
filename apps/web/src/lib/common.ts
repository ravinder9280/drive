export function buildChildrenMap(
    folders: { _id: string; parentId: string | null }[]
  ): Map<string | null, string[]> {
    const map = new Map<string | null, string[]>();
    for (const f of folders) {
      const key = f.parentId;
      const list = map.get(key) ?? [];
      list.push(f._id);
      map.set(key, list);
    }
    return map;
  }

  export function formatBytes(bytes: number): string {
    if (bytes === 0) {
      return "0 B";
    }
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const value = bytes / k ** i;
    return `${value.toFixed(value < 10 && i > 0 ? 1 : 0)} ${sizes[i]}`;
  }