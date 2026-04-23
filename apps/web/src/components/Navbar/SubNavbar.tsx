'use client'
import { Button } from '@monorepo/ui/components/button';
import { ButtonGroup } from '@monorepo/ui/components/button-group';
import React, { Fragment, useMemo, useState } from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,

} from "@monorepo/ui/components/breadcrumb";
import type { Folder } from '@monorepo/types';
import { useAuth } from '@/hooks/useAuth';
import { useFolders } from '@/hooks/useFolders';
import { Grid2X2, List, UploadIcon } from 'lucide-react';
import { UploadModal } from '../UploadModal';
import Link from 'next/link';
import { Skeleton } from '@monorepo/ui/components/skeleton';

const SubNavbar = ({ selectedId, onUploaded, setView, view }: {
    selectedId: string | null, onUploaded: () => void, view: "grid" | "list";
    setView: (v: "grid" | "list") => void;
}) => {
    const [uploadOpen, setUploadOpen] = useState(false);

    const { isAuthed } = useAuth();
    const {
        folders,
    } = useFolders({ enabled: isAuthed });



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
    const folderBreadcrumbTrail = useMemo(
        () => getFolderBreadcrumbTrail(folders, selectedId),
        [folders, selectedId]
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
                                                    <Link className='truncate text-xl font-semibold' href={`/dashboard/folder/${segment._id}`}>

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
                    <div className='flex items-center space-x-2'>
                        <Skeleton className='h-7 w-[100px]' />
                        <Skeleton className='h-7 w-[100px]' />
                        <Skeleton className='h-7 w-[100px]' />
                        <Skeleton className='h-7 w-[100px]' />



                    </div>
                )}
            </div>
            <div className="flex gap-4 shrink-0">
                <ButtonGroup  >
                    <Button size={'icon'}
                    variant={view==="grid"?"secondary":"outline"}
                        onClick={() => {
                            setView("grid");
                            localStorage.setItem("view", "grid");
                        }}
                    ><Grid2X2 /></Button>
                    <Button size={'icon'}
                        onClick={() => {
                            setView("list");
                            localStorage.setItem("view", "list");
                        }}
                        variant={view==="list"?"secondary":"outline"}

                        >
                            <List /></Button>
                </ButtonGroup>
                <Button
                    disabled={!selectedId}
                    onClick={() => setUploadOpen(true)}
                >
                    <UploadIcon className="size-4" />
                    <span className="hidden md:block">
                        Upload File
                    </span>
                </Button>
            </div>
            <UploadModal
                open={uploadOpen}
                onOpenChange={setUploadOpen}
                folderId={selectedId}
                onUploaded={onUploaded}
            />
        </div>
    )
}

export default SubNavbar