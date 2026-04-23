'use client'
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import SubNavbar from '@/components/Navbar/SubNavbar';
import FileList from './FileList';

 export type ViewType = 'grid' | 'list';

const FolderClient = ({ id }: { id: string | null }) => {

  const [view, setView] = useState<ViewType>(
    () => (localStorage.getItem('view') === 'list' ? 'list' : 'grid')
  );
  
  const queryClient = useQueryClient();

  return (
    <>
      <SubNavbar
        selectedId={id}
        view={view}
        setView={setView}
        onUploaded={() => {
          queryClient.invalidateQueries({ queryKey: ['folder-images', id] });
        }}
      />
      <FileList folderId={id} view={view} />
    </>
  );
};

export default FolderClient;