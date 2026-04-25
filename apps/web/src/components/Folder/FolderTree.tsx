"use client";

import type { Folder, FolderWithSize } from "@monorepo/types";

import { Button } from "@monorepo/ui/components/button";
import { cn } from "@monorepo/utils/styles";
import { ChevronDown, FolderIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { formatBytes } from "@/lib/common";

interface FolderTreeProps {
  folders: FolderWithSize[];
  selectedId: null | string;
}
export function FolderTree({ folders, selectedId }: FolderTreeProps) {
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
          childrenMap={childrenMap}
          depth={0}
          folder={folder}
          key={folder._id}
          selectedId={selectedId}
        />
      ))}
    </div>
  );
}

function buildChildrenMap(
  folders: FolderWithSize[],
): Map<null | string, FolderWithSize[]> {
  const map = new Map<null | string, FolderWithSize[]>();

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

function FolderTreeNode({
  childrenMap,
  depth,
  folder,
  selectedId,
}: {
  childrenMap: Map<null | string, FolderWithSize[]>;
  depth: number;
  folder: FolderWithSize;
  selectedId: null | string;
}) {
  const children = childrenMap.get(folder._id) ?? [];
  const isSelected = selectedId === folder._id;

  return (
    <div className="select-none">
      <Link href={`/dashboard/folder/${folder._id}`}>
        <Button
          className={cn(
            " w-full  justify-start gap-2 pr-2 ",
            isSelected && "bg-blue-400/40 hover:bg-blue-400/40",
          )}
          size={"lg"}
          style={{ paddingLeft: `${8 + depth * 14}px` }}
          type="button"
          variant={isSelected ? "secondary" : "ghost"}
        >
          <div className="flex items-center gap-1 ">
            <ChevronDown className="h-2 w-2 text-muted-foreground" />
            <FolderIcon className="size-4 shrink-0 text-muted-foreground" />
          </div>
          <span className="truncate text-base  flex-1 text-left">
            {folder.name}
          </span>
          <span className="text-xs text-muted-foreground tabular-nums shrink-0">
            {formatBytes(folder.size)}
          </span>
        </Button>
      </Link>
      {children.map((child) => (
        <FolderTreeNode
          childrenMap={childrenMap}
          depth={depth + 1}
          folder={child}
          key={child._id}
          selectedId={selectedId}
        />
      ))}
    </div>
  );
}
