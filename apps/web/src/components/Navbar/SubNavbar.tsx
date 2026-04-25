"use client";
import type { Folder } from "@monorepo/types";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@monorepo/ui/components/breadcrumb";
import { Button } from "@monorepo/ui/components/button";
import { ButtonGroup } from "@monorepo/ui/components/button-group";
import { Skeleton } from "@monorepo/ui/components/skeleton";
import { Grid2X2, List, UploadIcon } from "lucide-react";
import Link from "next/link";
import React, { Fragment, useMemo, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { useFolders } from "@/hooks/useFolders";

import { UploadModal } from "../UploadModal";

const SubNavbar = ({
  onUploaded,
  selectedId,
  setView,
  view,
}: {
  onUploaded: () => void;
  selectedId: null | string;
  setView: (v: "grid" | "list") => void;
  view: "grid" | "list";
}) => {
  const [uploadOpen, setUploadOpen] = useState(false);

  const { isAuthed } = useAuth();
  const { folders } = useFolders({ enabled: isAuthed });

  function getFolderBreadcrumbTrail(
    folders: Folder[],
    selectedId: null | string,
  ): { _id: string; name: string }[] {
    if (!selectedId) {
      return [];
    }
    const byId = new Map(folders.map((f) => [f._id, f]));
    const trail: { _id: string; name: string }[] = [];
    let id: null | string = selectedId;
    const seen = new Set<string>();
    while (id) {
      if (seen.has(id)) {
        break;
      }
      seen.add(id);
      const folder = byId.get(id);
      if (!folder) {
        break;
      }
      trail.push({ _id: folder._id, name: folder.name });
      id = folder.parentId;
    }
    trail.reverse();
    return trail;
  }
  const folderBreadcrumbTrail = useMemo(
    () => getFolderBreadcrumbTrail(folders, selectedId),
    [folders, selectedId],
  );
  return (
    <div className="border-b px-6 h-16 flex flex-wrap items-center sticky top-0 justify-between gap-3">
      <div className="min-w-0 flex-1">
        {folderBreadcrumbTrail.length > 0 ? (
          <>
            <Breadcrumb>
              <BreadcrumbList className="flex-nowrap overflow-x-auto sm:gap-2">
                {folderBreadcrumbTrail.map((segment, index) => {
                  const isLast = index === folderBreadcrumbTrail.length - 1;
                  return (
                    <Fragment key={segment._id}>
                      {index > 0 ? <BreadcrumbSeparator /> : null}
                      <BreadcrumbItem className="max-w-[min(100%,12rem)] sm:max-w-[16rem]">
                        {isLast ? (
                          <BreadcrumbPage className="truncate text-xl font-semibold">
                            {segment.name}
                          </BreadcrumbPage>
                        ) : (
                          <Link
                            className="truncate text-xl font-semibold"
                            href={`/dashboard/folder/${segment._id}`}
                          >
                            {segment.name}
                          </Link>
                        )}
                      </BreadcrumbItem>
                    </Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </>
        ) : (
          <div className="flex items-center space-x-2">
            <Skeleton className="h-7 w-[100px]" />
            <Skeleton className="h-7 w-[100px]" />
            <Skeleton className="h-7 w-[100px]" />
            <Skeleton className="h-7 w-[100px]" />
          </div>
        )}
      </div>
      <div className="flex gap-4 shrink-0">
        <ButtonGroup>
          <Button
            onClick={() => {
              setView("grid");
              localStorage.setItem("view", "grid");
            }}
            size={"icon"}
            variant={view === "grid" ? "secondary" : "outline"}
          >
            <Grid2X2 />
          </Button>
          <Button
            onClick={() => {
              setView("list");
              localStorage.setItem("view", "list");
            }}
            size={"icon"}
            variant={view === "list" ? "secondary" : "outline"}
          >
            <List />
          </Button>
        </ButtonGroup>
        <Button disabled={!selectedId} onClick={() => setUploadOpen(true)}>
          <UploadIcon className="size-4" />
          <span className="hidden md:block">Upload File</span>
        </Button>
      </div>
      <UploadModal
        folderId={selectedId}
        onOpenChange={setUploadOpen}
        onUploaded={onUploaded}
        open={uploadOpen}
      />
    </div>
  );
};

export default SubNavbar;
