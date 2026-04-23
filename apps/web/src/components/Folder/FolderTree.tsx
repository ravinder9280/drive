"use client";

import type { Folder, FolderWithSize } from "@monorepo/types";
import { ChevronDown, FolderIcon } from "lucide-react";
import { useMemo } from "react";

import { Button } from "@monorepo/ui/components/button";
import { cn } from "@monorepo/utils/styles";
import { formatBytes } from "@/lib/common";
import Link from "next/link";

function buildChildrenMap(
  folders: FolderWithSize[]
): Map<string | null, FolderWithSize[]> {
  const map = new Map<string | null, FolderWithSize[]>();

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
  folders: FolderWithSize[];
  selectedId: string | null;
}

function FolderTreeNode({
  folder,
  depth,
  childrenMap,
  selectedId,
}: {
  folder: FolderWithSize;
  depth: number;
  childrenMap: Map<string | null, FolderWithSize[]>;
  selectedId: string | null;
}) {
  const children = childrenMap.get(folder._id) ?? [];
  const isSelected = selectedId === folder._id;

  return (
    <div className="select-none">
      <Link href={`/dashboard/folder/${folder._id}`}>
      <Button
        type="button"
        size={'lg'}
        variant={isSelected ? "secondary" : "ghost"}
        className={cn(
          " w-full  justify-start gap-2 pr-2 ",
          isSelected && "bg-blue-400/40 hover:bg-blue-400/40"
        )}
        style={{ paddingLeft: `${8 + depth * 14}px` }}
      >
        <div className="flex items-center gap-1 ">

        <ChevronDown  className="h-2 w-2 text-muted-foreground"/>
        <FolderIcon className="size-4 shrink-0 text-muted-foreground" />
        </div>
        <span className="truncate text-base  flex-1 text-left">{folder.name}</span>
        <span className="text-xs text-muted-foreground tabular-nums shrink-0">
          {formatBytes(folder.size)}
        </span>
      </Button>
        </Link>
      {children.map((child) => (
        <FolderTreeNode
          key={child._id}
          folder={child}
          depth={depth + 1}
          childrenMap={childrenMap}
          selectedId={selectedId}
        />
      ))}
    </div>
  );
}

export function FolderTree({
  folders,
  selectedId,
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
          selectedId={selectedId}
        />
      ))}
    </div>
  );
}
