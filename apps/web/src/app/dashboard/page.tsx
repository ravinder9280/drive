"use client";

import type { Folder } from "@monorepo/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@monorepo/ui/components/breadcrumb";
import { Button } from "@monorepo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@monorepo/ui/components/dialog";
import { Input } from "@monorepo/ui/components/input";

import { FileCard } from "@/components/FileCard";
import { FolderTree } from "@/components/FolderTree";
import { UploadModal } from "@/components/UploadModal";
import { useAuth } from "@/hooks/useAuth";
import { useFolderImages } from "@/hooks/useFolderImages";
import { useFolders } from "@/hooks/useFolders";
import { Loader2Icon, LogOutIcon, PlusIcon, UploadIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@monorepo/ui/components/avatar";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@monorepo/ui/components/dropdown-menu";
import { buildChildrenMap } from "@/lib/common";




/** Root → … → current folder (for breadcrumbs). */
function getFolderBreadcrumbTrail(
  folders: Folder[],
  selectedId: string | null
): { _id: string; name: string }[] {
  if (!selectedId) {
    return [];
  }
  const byId = new Map(folders.map((f) => [f._id, f]));
  const trail: { _id: string; name: string }[] = [];
  let id: string | null = selectedId;
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

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthed, user, logout } = useAuth();
  const {
    folders,
    sizesByFolderId,
    loading: foldersLoading,
    error: foldersError,
    createFolder,
    refresh: refreshFolders,
  } = useFolders({ enabled: isAuthed });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { images, loading: imagesLoading, refresh: refreshImages } =
    useFolderImages(selectedId);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSubmitting, setCreateSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthed) {
      router.replace("/login");
    }
  }, [isAuthed, router]);

  const childrenMap = useMemo(() => buildChildrenMap(folders), [folders]);

  useEffect(() => {
    if (folders.length === 0 || selectedId !== null) {
      return;
    }
    const roots = childrenMap.get(null) ?? [];
    if (roots.length > 0) {
      setSelectedId(roots[0] ?? null);
    }
  }, [folders, selectedId, childrenMap]);

  const selectedFolder = useMemo(
    () => folders.find((f) => f._id === selectedId) ?? null,
    [folders, selectedId]
  );

  const folderBreadcrumbTrail = useMemo(
    () => getFolderBreadcrumbTrail(folders, selectedId),
    [folders, selectedId]
  );

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newFolderName.trim();
    if (!name) {
      setCreateError("Folder name is required");
      return;
    }
    setCreateSubmitting(true);
    setCreateError(null);
    try {
      const folder = await createFolder(name, selectedId);
      setNewFolderName("");
      setCreateOpen(false);
      setSelectedId(folder._id);
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message ?? err.message
        : "Could not create folder";
      setCreateError(message);
    } finally {
      setCreateSubmitting(false);
    }
  };

  const onUploaded = useCallback(() => {
    void refreshFolders();
    void refreshImages();
  }, [refreshFolders, refreshImages]);

  if (!isAuthed) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <Loader2Icon className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b sticky top-0 bg-background z-10 px-6 py-3 flex items-center justify-between gap-4">
        <div className="min-w-0 flex items-center gap-2">
          <Image src={'/drive-logo.png'} alt={'Drive Logo'} width={32} height={32} />
          <h1 className="text-lg font-semibold truncate">Drive</h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">

          <DropdownMenu>
            <DropdownMenuTrigger className="ring-transparent">
          <Avatar className="size-8 ring-transparent">
            <AvatarImage src={'https://github.com/shadcn.png'} height={32} width={32} alt={'Shadcn'} />
            <AvatarFallback>
              SC
            </AvatarFallback>
          </Avatar>

            </DropdownMenuTrigger>
            <DropdownMenuContent>
            <DropdownMenuLabel>
              {user?.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

              <DropdownMenuItem className="text-red-500" onClick={() => {
                logout();
                router.replace("/login");
              }}>
                Log out <LogOutIcon className="size-4" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <aside className="hidden md:flex md:w-72 border-r  flex-col min-h-0 shrink-0">
          <div className="p-4 border-b ">

            <Button
              size="sm"
              className="w-full cursor-pointer"
              variant="secondary"
              onClick={() => {
                setCreateError(null);
                setCreateOpen(true);
              }}
            >
               <PlusIcon className="size-4" />
               <span className="hidden md:block">

              New folder
               </span>
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {foldersLoading ? (
              <p className="text-sm text-muted-foreground px-2">Loading…</p>
            ) : foldersError ? (
              <p className="text-sm text-destructive px-2">{foldersError}</p>
            ) : (
              <FolderTree
                folders={folders}
                sizesByFolderId={sizesByFolderId}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            )}
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 min-h-0">
          <div className="border-b px-6 py-4 flex flex-wrap items-center justify-between gap-3">
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
                                <BreadcrumbLink asChild>
                                  <button
                                    type="button"
                                    className="max-w-full cursor-pointer truncate text-xl text-left"
                                    onClick={() => setSelectedId(segment._id)}
                                  >
                                    {segment.name}
                                  </button>
                                </BreadcrumbLink>
                              )}
                            </BreadcrumbItem>
                          </Fragment>
                        );
                      })}
                    </BreadcrumbList>
                  </Breadcrumb>

                </>
              ) : (
                <h2 className="text-xl font-semibold text-muted-foreground truncate">
                  Select a folder
                </h2>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                size="sm"
                disabled={!selectedId}
                onClick={() => setUploadOpen(true)}
              >
                <UploadIcon className="size-4" />
                <span className="hidden md:block">
                  Upload Image
                </span>
              </Button>
            </div>
          </div>


          <div className="flex-1 overflow-y-auto p-6">
            {!selectedId ? (
              <div className="flex flex-col items-center gap-2 justify-center h-full">
                <Image src="/empty-folder.svg" alt="Empty folder" width={200} height={200} />
                <p className="text-muted-foreground">
                  Select a folder on the left, or create a new one.
                </p>
              </div>
            ) : imagesLoading ? (
              <div className="flex flex-col items-center gap-2 justify-center h-full">
                <Loader2Icon className="size-10 animate-spin" />
                <p className="text-muted-foreground">Loading files…</p>
              </div>
            ) : images.length === 0 ? (
              <div className="flex flex-col items-center gap-2 justify-center h-full">
                <Image src="/empty-folder.svg" alt="Empty folder" width={200} height={200} />
              <p className="text-muted-foreground">
                No images in this folder yet.
              </p>


              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((img) => (
                  <FileCard
                    key={img._id}
                    image={img}
                    onDeleted={() => {
                      void refreshImages();
                      void refreshFolders();
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <UploadModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        folderId={selectedId}
        onUploaded={onUploaded}
      />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="">
          <form onSubmit={(e) => void handleCreateFolder(e)}>
            <DialogHeader>
              <DialogTitle>New folder</DialogTitle>
              {/* <DialogDescription>
                {selectedFolder
                  ? `Inside “${selectedFolder.name}”`
                  : "At the root of your drive"}
              </DialogDescription> */}
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">

                <Input
                  id="folder-name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Folder name"
                  autoFocus
                  className="text-lg h-12"
                />
              </div>
              {createError ? (
                <p className="text-sm text-destructive">{createError}</p>
              ) : null}
            </div>
            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createSubmitting}>
                {createSubmitting ? "Creating…" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
