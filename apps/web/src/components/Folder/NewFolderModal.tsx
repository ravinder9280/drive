import { Button } from '@monorepo/ui/components/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@monorepo/ui/components/dialog";
import { Input } from '@monorepo/ui/components/input';
import axios from "axios";
import { PlusIcon } from 'lucide-react';
import { useRouter } from "next/navigation";
import React, { useState } from 'react'
import { toast } from 'sonner';

import { useAuth } from '@/hooks/useAuth';
import { useFolders } from '@/hooks/useFolders';
const NewFolderModal = ({ parentFolderId }: {
    parentFolderId?: string | null
}) => {
    const [createOpen, setCreateOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [createSubmitting, setCreateSubmitting] = useState(false);
    const { isAuthed } = useAuth();
    const router = useRouter();


    const {
        createFolder,

    } = useFolders({ enabled: isAuthed });

    const handleCreateFolder = async (e: React.FormEvent) => {
        e.preventDefault();
        const name = newFolderName.trim();
        if (!name) {
            toast.error("Folder name is required")
            return;
        }
        setCreateSubmitting(true);
        try {
            const folder = await createFolder({
                name,
                parentId: parentFolderId ?? null,
            });

            setNewFolderName("");
            setCreateOpen(false);
            router.push(`/dashboard/folder/${folder._id}`);
        } catch (err) {
            const message = axios.isAxiosError(err)
                ? ((err.response?.data as { message?: string })?.message ?? err.message)
                : "Could not create folder";
            toast.error(message)
        } finally {
            setCreateSubmitting(false);
        }
    };


    return (<>
        <div className="px-4 h-16 flex items-center justify-center border-b ">
            <Button
                className="w-full "
                onClick={() => {
                    setCreateOpen(true);
                }}
                size="sm"
            >
                <PlusIcon className="size-4" />
                <span className="hidden md:block">New folder</span>
            </Button>
        </div>
        <Dialog onOpenChange={setCreateOpen} open={createOpen}>
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
                                autoFocus
                                className="text-lg h-12"
                                id="folder-name"
                                onChange={(e) => setNewFolderName(e.target.value)}
                                placeholder="Folder name"
                                value={newFolderName}
                            />
                        </div>

                    </div>
                    <DialogFooter className="mt-4">
                        <Button
                            onClick={() => setCreateOpen(false)}
                            type="button"
                            variant="outline"
                        >
                            Cancel
                        </Button>
                        <Button disabled={createSubmitting} type="submit">
                            {createSubmitting ? "Creating…" : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    </>
    )
}

export default NewFolderModal