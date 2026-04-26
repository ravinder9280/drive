"use client";
import { useState } from "react";

import SubNavbar from "@/components/Navbar/SubNavbar";

import FileList from "./FileList";

export type ViewType = "grid" | "list";

const FolderClient = ({ folderId }: { folderId: null | string }) => {
  const [view, setView] = useState<ViewType>(() =>
    localStorage.getItem("view") === "list" ? "list" : "grid",
  );


  return (
    <>
      <SubNavbar selectedFolderId={folderId} setView={setView} view={view} />
      <FileList folderId={folderId} view={view} />
    </>
  );
};

export default FolderClient;
