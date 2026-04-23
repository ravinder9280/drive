'use client'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@monorepo/ui/components/combobox'
import type { ImageFile } from '@monorepo/types'
import { useQuery } from '@tanstack/react-query'
import { Search, FileImageIcon, Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { listByQuery } from '@/services/image.api'
import { useRouter } from 'next/navigation'
import ImageModal from '@/components/ImageModal' // adjust path as needed
import * as imageApi from "@/services/image.api";

const SearchModal = () => {
  const [inputValue, setInputValue] = useState('')
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const debouncedQuery = useDebounce(inputValue, 300)
  const router = useRouter()

  const { data: results = [], isLoading } = useQuery({
    queryKey: ['image-search', debouncedQuery],
    queryFn: () => listByQuery(debouncedQuery),
    enabled: debouncedQuery.trim().length > 0,
  })

  const [isItemSelected, setIsItemSelected] = useState(false)

const handleSelect = (img: ImageFile) => {
  setIsItemSelected(true)
  setSelectedImage(img)
  setInputValue('')        
  setModalOpen(true)
}

const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter' && !isItemSelected && inputValue.trim()) {
    router.push(`/dashboard/search?query=${encodeURIComponent(inputValue.trim())}`)
  }
  setIsItemSelected(false)
}

  return (
    <>
      <div className="max-w-2xl w-full relative">
        <Combobox
          items={results}
          itemToStringValue={(img) => img.name}
          onInputValueChange={setInputValue}
          onValueChange={(img) => img && handleSelect(img as ImageFile)}
          filterItems={() => true}
          inputValue={inputValue}                  // controlled input
          shouldResetInputOnSelect={false}         // don't fill input on select
          resetInputOnSelect={false}  
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
              className="pl-10 w-full rounded-full h-12 bg-secondary border dark:border-white/5"
              placeholder="Search Files, Folders and Anything..."
              onKeyDown={handleKeyDown}
              showClear={true}
              showTrigger={false}
              
            />
          </div>

          <ComboboxContent className="max-w-2xl ">
            {results.length==0 &&debouncedQuery &&

            <ComboboxEmpty>
              {debouncedQuery.trim() ? 'No images found.' : ''}
            </ComboboxEmpty>
            }
            <ComboboxList className="w-full">
              {(img: ImageFile) => (
                <ComboboxItem
                  key={img._id}
                  value={img}
                  className="flex items-center gap-3"
                  onSelect={() => handleSelect(img)}
                >
                  <div className="h-8 w-8 rounded overflow-hidden bg-muted flex-shrink-0">
                    <img src={imageApi.imageUrlToAbsolute(img.url)} alt={img.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium truncate">{img.name}</span>
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
            setModalOpen(open)
            if (!open) setSelectedImage(null)
          }}
        />
      )}
    </>
  )
}

export default SearchModal