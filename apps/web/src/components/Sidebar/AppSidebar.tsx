"use client";

import { Skeleton } from "@monorepo/ui/components/skeleton";

import { useAuth } from "@/hooks/useAuth";
import { useFolders } from "@/hooks/useFolders";

import { FolderTree } from "../Folder/FolderTree";
import NewFolderModal from "../Folder/NewFolderModal";

const AppSidebar = ({ selectedFolderId }: { selectedFolderId: string }) => {
  const { isAuthed } = useAuth();

  const {
    error: foldersError,
    folders,
    loading: foldersLoading,
  } = useFolders({ enabled: isAuthed });

  return (
    <aside className="hidden md:flex md:w-72 border-r flex-col min-h-0 shrink-0">
      <NewFolderModal parentFolderId={selectedFolderId} />
      <div className="flex-1 overflow-y-auto p-2 ">
        {foldersLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        ) : foldersError ? (
          <p className="text-sm text-destructive px-2">{foldersError}</p>
        ) : (
          <FolderTree folders={folders} selectedId={selectedFolderId} />
        )}
      </div>
    </aside>
  );
};

export default AppSidebar;
