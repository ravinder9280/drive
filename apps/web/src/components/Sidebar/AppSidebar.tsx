'use client'
import { Button } from '@monorepo/ui/components/button';
import { Skeleton } from '@monorepo/ui/components/skeleton';
import React, { useState } from 'react'
import { FolderTree } from '../Folder/FolderTree';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@monorepo/ui/components/dialog";
import type { FolderWithSize } from '@monorepo/types';
import { useFolders } from '@/hooks/useFolders';
import { useAuth } from '@/hooks/useAuth';
import { PlusIcon } from 'lucide-react';
import { Input } from '@monorepo/ui/components/input';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const AppSidebar = ({
    selectedId
    

}:{
    selectedId:string,
    
}) => {
    const [createOpen, setCreateOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const { isAuthed} = useAuth();
    const [createSubmitting, setCreateSubmitting] = useState(false);
    const router=useRouter()


    const [createError, setCreateError] = useState<string | null>(null);
    const {
        folders,
        loading: foldersLoading,
        error: foldersError,
        createFolder,
        refresh: refreshFolders,
      } = useFolders({ enabled: isAuthed });
    

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
          const folder = await createFolder({
            name,
            parentId: selectedId ?? null,
          });

          setNewFolderName("");
          setCreateOpen(false);
          router.push(`/dashboard/folder/${folder._id}`)
        } catch (err) {
          const message = axios.isAxiosError(err)
            ? (err.response?.data as { message?: string })?.message ?? err.message
            : "Could not create folder";
          setCreateError(message);
        } finally {
          setCreateSubmitting(false);
        }
      };
    

  return (
    <aside className="hidden md:flex md:w-72 border-r   flex-col min-h-0 shrink-0">
    <div className="px-4 h-16 flex items-center justify-center border-b ">

      <Button
        size="sm"
        className="w-full "
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

    <div className="flex-1 overflow-y-auto p-2 ">
      {foldersLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      ) : foldersError ? (
        <p className="text-sm text-destructive px-2">{foldersError}</p>
      ) : (
        <FolderTree
          folders={folders}
          selectedId={selectedId}
        />
      )}
    </div>
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
  </aside>
  )
}

export default AppSidebar