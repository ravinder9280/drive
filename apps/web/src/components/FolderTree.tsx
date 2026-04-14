"use client";

import type { Folder } from "@monorepo/types";
import { FolderIcon } from "lucide-react";
import { useMemo } from "react";

import { Button } from "@monorepo/ui/components/button";
import { cn } from "@monorepo/utils/styles";
import {  formatBytes } from "@/lib/common";

function buildChildrenMap(folders: Folder[]): Map<string | null, Folder[]> {
  const map = new Map<string | null, Folder[]>();
  for (const f of folders) {
    const key = f.parentId;
    const list = map.get(key) ?? [];
    list.push(f);
    map.set(key, list);
  }
  for (const [, list] of map) {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }
  return map;
}

interface FolderTreeProps {
  folders: Folder[];
  sizesByFolderId: Record<string, number>;
  selectedId: string | null;
  onSelect: (folderId: string) => void;
}

function FolderTreeNode({
  folder,
  depth,
  childrenMap,
  sizesByFolderId,
  selectedId,
  onSelect,
}: {
  folder: Folder;
  depth: number;
  childrenMap: Map<string | null, Folder[]>;
  sizesByFolderId: Record<string, number>;
  selectedId: string | null;
  onSelect: (folderId: string) => void;
}) {
  const children = childrenMap.get(folder._id) ?? [];
  const total = sizesByFolderId[folder._id] ?? 0;
  const isSelected = selectedId === folder._id;

  return (
    <div className="select-none">
      <Button
        type="button"
        variant={isSelected ? "secondary" : "ghost"}
        className={cn(
          "h-auto w-full cursor-pointer justify-start gap-2 py-1.5 px-2 font-normal",
          isSelected && "bg-blue-400/40 hover:bg-blue-400/40"
        )}
        style={{ paddingLeft: `${8 + depth * 14}px` }}
        onClick={() => onSelect(folder._id)}
      >
        <FolderIcon className="size-4 shrink-0 text-muted-foreground" />
        <span className="truncate  flex-1 text-left">{folder.name}</span>
        <span className="text-xs text-muted-foreground tabular-nums shrink-0">
          {formatBytes(total)}
        </span>
      </Button>
      {children.map((child) => (
        <FolderTreeNode
          key={child._id}
          folder={child}
          depth={depth + 1}
          childrenMap={childrenMap}
          sizesByFolderId={sizesByFolderId}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export function FolderTree({
  folders,
  sizesByFolderId,
  selectedId,
  onSelect,
}: FolderTreeProps) {
  const childrenMap = useMemo(() => buildChildrenMap(folders), [folders]);
  const roots = childrenMap.get(null) ?? [];

  if (roots.length === 0) {
    return (
      <p className="text-sm text-muted-foreground px-2">
        No folders yet. Create one to get started.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      {roots.map((folder) => (
        <FolderTreeNode
          key={folder._id}
          folder={folder}
          depth={0}
          childrenMap={childrenMap}
          sizesByFolderId={sizesByFolderId}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
