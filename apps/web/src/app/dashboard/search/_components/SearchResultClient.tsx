"use client";
import { cn } from "@monorepo/utils/styles";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import React from "react";

import { FileCard } from "@/components/FileCard";
import { listByQuery } from "@/services/image.api";

const SearchResultClient = ({ query }: { query: string }) => {
  const { data: results = [], isLoading } = useQuery({
    queryFn: () => listByQuery(query),
    queryKey: ["image-search", query],
  });
  const queryClient = useQueryClient();
  const view = localStorage.getItem("view") == "list" ? "list" : "grid";

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-2 justify-center h-full">
        <Loader2Icon className="size-10 animate-spin" />
        <p className="text-muted-foreground">Loading files…</p>
      </div>
    );
  }
  if (results.length == 0) {
    return (
      <div className="flex flex-col items-center gap-2 justify-center h-full">
        <Image
          alt="Empty folder"
          height={200}
          src="/empty-folder.svg"
          width={200}
        />
        <p className="text-muted-foreground">No images found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="border-b px-6 h-16 flex flex-wrap items-center sticky top-0 justify-between gap-3">
        <h3>Search Results For "{query}"</h3>
      </div>

      <div className=" overflow-scroll flex-1 p-6">
        <div
          className={cn(
            "grid ",
            view != "list"
              ? " grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
              : "divide-y border-y",
          )}
        >
          {results.map((img) => (
            <FileCard
              image={img}
              key={img._id}
              onImageUpdated={() => {
                queryClient.invalidateQueries({
                  queryKey: ["image-search"],
                });
              }}
              view={view}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResultClient;
