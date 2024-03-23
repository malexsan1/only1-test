"use client";

import { useId, useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Command,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui";
import { Character } from "@/types";
import { getExampleData } from "@/server/actions";

export default function Home() {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();

  const searchInputId = useId();
  const [selectedValue, setSelectedValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [_isLoading, _setIsLoading] = useState(false);
  const [charcters, setCharacters] = useState<Character[]>([]);

  const searchDatabase = (value: string) => {
    _setIsLoading(true);
    setIsOpen(true);
    queryClient
      .fetchQuery({
        queryKey: ["characters", value],
        queryFn: getExampleData,
      })
      .then(setCharacters)
      .finally(() => {
        _setIsLoading(false);
      });
  };

  const debouncedSearch = (value: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      searchDatabase(value);
    }, 300);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setSearchValue(value);
    if (value.length > 2) {
      debouncedSearch(value);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 gap-4 bg-zinc-200">
      <div className="flex flex-col items-stretch w-[500px] gap-4">
        {selectedValue && (
          <div>
            <span>Selected character: </span>
            <b>{selectedValue}</b>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor={searchInputId}>Search by house</label>
          <Input
            id={searchInputId}
            value={searchValue}
            onChange={handleInputChange}
            placeholder="Search by house (Atreides, Harkonnen, Corrino)..."
          />
        </div>

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger />

          <PopoverContent asChild>
            {_isLoading ? (
              <div className="w-[500px]">Loading....</div>
            ) : (
              <Command className="flex flex-col w-[500px]">
                <CommandEmpty>No items found.</CommandEmpty>
                <CommandList>
                  {charcters?.map((character) => {
                    return (
                      <CommandItem
                        key={character.name}
                        value={character.name}
                        onSelect={(value) => {
                          setIsOpen(false);
                          setSelectedValue(value);
                          setSearchValue("");
                        }}
                      >
                        <span>{character.name}</span>
                      </CommandItem>
                    );
                  })}
                </CommandList>
              </Command>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </main>
  );
}
