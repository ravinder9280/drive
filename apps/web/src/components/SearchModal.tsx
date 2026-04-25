"use client";
import type { ImageFile } from "@monorepo/types";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@monorepo/ui/components/combobox";
import { useQuery } from "@tanstack/react-query";
import { FileImageIcon, Loader2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import ImageModal from "@/components/ImageModal"; // adjust path as needed
import { useDebounce } from "@/hooks/useDebounce";
import { listByQuery } from "@/services/image.api";
import * as imageApi from "@/services/image.api";

const SearchModal = () => {
  const [inputValue, setInputValue] = useState("");
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const debouncedQuery = useDebounce(inputValue, 300);
  const router = useRouter();

  const { data: results = [], isLoading } = useQuery({
    enabled: debouncedQuery.trim().length > 0,
    queryFn: () => listByQuery(debouncedQuery),
    queryKey: ["image-search", debouncedQuery],
  });

  const [isItemSelected, setIsItemSelected] = useState(false);

  const handleSelect = (img: ImageFile) => {
    setIsItemSelected(true);
    setSelectedImage(img);
    setInputValue("");
    setModalOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isItemSelected && inputValue.trim()) {
      router.push(
        `/dashboard/search?query=${encodeURIComponent(inputValue.trim())}`,
      );
    }
    setIsItemSelected(false);
  };

  return (
    <>
      <div className="max-w-2xl w-full relative">
        <Combobox<ImageFile>
          filteredItems={results}
          inputValue={inputValue} // controlled input
          items={results}
          itemToStringValue={(img) => img.name}
          onInputValueChange={setInputValue}
          onValueChange={(img) => img && handleSelect(img as ImageFile)}
        >
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
              {isLoading ? (
                <Loader2 className="h-[18px] w-[18px] text-muted-foreground animate-spin" />
              ) : (
                <Search className="h-[18px] w-[18px] text-muted-foreground" />
              )}
            </span>
            <ComboboxInput
              className="pl-10 w-full rounded-full h-12 bg-secondary border  shadow-none dark:border-white/10"
              onKeyDown={handleKeyDown}
              placeholder="Search Files, Folders and Anything..."
              showClear={true}
              showTrigger={false}
            />
          </div>

          <ComboboxContent className="max-w-2xl ">
            {results.length == 0 && debouncedQuery && (
              <ComboboxEmpty>
                {debouncedQuery.trim() ? "No images found." : ""}
              </ComboboxEmpty>
            )}
            <ComboboxList className="w-full">
              {(img: ImageFile) => (
                <ComboboxItem
                  className="flex items-center gap-3"
                  key={img._id}
                  onSelect={() => handleSelect(img)}
                  value={img}
                >
                  <div className="h-8 w-8 rounded overflow-hidden bg-muted flex-shrink-0">
                    <img
                      alt={img.name}
                      className="h-full w-full object-cover"
                      src={imageApi.imageUrlToAbsolute(img.url)}
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium truncate">
                      {img.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {(img.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <FileImageIcon className="h-4 w-4 text-muted-foreground ml-auto flex-shrink-0" />
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>

      {/* Image modal — rendered outside Combobox to avoid z-index issues */}
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          open={modalOpen}
          setOpen={(open) => {
            setModalOpen(open);
            if (!open) setSelectedImage(null);
          }}
        />
      )}
    </>
  );
};

export default SearchModal;
