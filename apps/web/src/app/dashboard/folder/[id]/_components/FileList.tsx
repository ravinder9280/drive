"use client"

import React from 'react'
import { useQueryClient } from "@tanstack/react-query";
import { useFolderImages } from '@/hooks/useFolderImages';
import Image from 'next/image';
import { Loader2Icon } from 'lucide-react';
import { cn } from '@monorepo/utils/styles';
import { FileCard } from '@/components/FileCard';
import type { ViewType } from './FolderClient';


const FileList = ({ folderId, view }: { folderId?: string | null; view: ViewType }) => {

    const queryClient = useQueryClient();
    const { data: images = [], isLoading: IsImagesLoading } = useFolderImages(folderId || null);

    if (IsImagesLoading) {
        return (

            <div className="flex flex-col items-center gap-2 justify-center h-full">
                <Loader2Icon className="size-10 animate-spin" />
                <p className="text-muted-foreground">Loading files…</p>
            </div>

        )
    }
    if (images.length == 0) {
        return (

            <div className="flex flex-col items-center gap-2 justify-center h-full">
                <Image src="/empty-folder.svg" alt="Empty folder" width={200} height={200} />
                <p className="text-muted-foreground">
                    No images in this folder yet.
                </p>
            </div>

        )
    }



    return (
        <div className=" overflow-scroll flex-1 p-6">

            <div
                className={cn(
                    "grid ",
                    view != "list"
                        ? " grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                        : "divide-y border-y"
                )}
            >
                {images.map((img) => (
                    <FileCard
                        view={view}
                        key={img._id}
                        image={img}
                        onImageUpdated={() => {

                            queryClient.invalidateQueries({
                                queryKey: ["folder-images", folderId],
                            });
                        }}
                    />
                ))}
            </div>

        </div>
    )
}

export default FileList