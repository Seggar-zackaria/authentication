"use client";

import { useState, useCallback, useMemo } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import debounce from "lodash/debounce";

type Airline = {
  value: string;
  label: string;
};

interface AirlineSelectProps {
  value?: string;
  onChange: (value: string) => void;
}

interface ApiResponse {
  airlines: Airline[];
  error?: string;
}

export function AirlineSelect({ value = "", onChange }: AirlineSelectProps) {
  const [open, setOpen] = useState(false);
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Define the search function inside useCallback without debounce
  const handleSearch = useCallback(async (keyword: string) => {
    if (keyword.length < 2) {
      setAirlines([]);
      setError(null);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/amadeus?keyword=${encodeURIComponent(keyword)}`);
      const data: ApiResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch airlines');
      }
      
      setAirlines(data.airlines || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      setAirlines([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create debounced version of the search function
  const searchAirlines = useMemo(
    () => debounce(handleSearch, 300),
    [handleSearch]
  );

  const selectedAirline = airlines.find((airline) => airline.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select airline"
          className="w-full justify-between"
        >
          {selectedAirline ? selectedAirline.label : "Select airline..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput 
            placeholder="Search airlines..." 
            onValueChange={searchAirlines}
          />
          <CommandEmpty>
            {loading && "Loading..."}
            {error && `Error: ${error}`}
            {!loading && !error && "No airline found."}
          </CommandEmpty>
          <CommandGroup>
            {airlines.map((airline) => (
              <CommandItem
                key={airline.value}
                value={airline.value}
                onSelect={(currentValue) => {
                  onChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === airline.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {airline.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 