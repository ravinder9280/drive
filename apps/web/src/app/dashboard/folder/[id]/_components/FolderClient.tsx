"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import SubNavbar from "@/components/Navbar/SubNavbar";

import FileList from "./FileList";

export type ViewType = "grid" | "list";

const FolderClient = ({ id }: { id: null | string }) => {
  const [view, setView] = useState<ViewType>(() =>
    localStorage.getItem("view") === "list" ? "list" : "grid",
  );

  const queryClient = useQueryClient();

  return (
    <>
      <SubNavbar
        onUploaded={() => {
          queryClient.invalidateQueries({ queryKey: ["folder-images", id] });
        }}
        selectedId={id}
        setView={setView}
        view={view}
      />
      <FileList folderId={id} view={view} />
    </>
  );
};

export default FolderClient;
