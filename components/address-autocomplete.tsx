"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { googleAutoComplete } from "@/lib/api/autocomplete";
import type {
  Prediction,
  AutocompleteResponse,
  AddressAutocompleteProps,
} from "@/lib/types";

export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder,
  disabled,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Prediction[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced autocomplete function
  const fetchSuggestions = useCallback(async (input: string) => {
    if (!input.trim() || input.length < 3) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = (await googleAutoComplete(
        input
      )) as AutocompleteResponse;

      if (response.status === "OK" && response.predictions) {
        setSuggestions(response.predictions);
        setIsOpen(true);
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Autocomplete error:", error);
      setSuggestions([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for debouncing
    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(newValue);
    }, 300);
  };

  // Handle suggestion selection
  const handleSelect = (suggestion: Prediction) => {
    onSelect(suggestion.description);
    setSuggestions([]);
    setIsOpen(false);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && suggestions.length > 0) {
      e.preventDefault();
      // Focus first suggestion (could be enhanced with arrow key navigation)
      const firstButton = containerRef.current?.querySelector(
        'button[type="button"]'
      ) as HTMLButtonElement;
      firstButton?.focus();
    } else if (e.key === "Enter" && suggestions.length > 0 && isOpen) {
      e.preventDefault();
      handleSelect(suggestions[0]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <Input
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => {
          if (suggestions.length > 0) {
            setIsOpen(true);
          }
        }}
      />
      {isOpen && (suggestions.length > 0 || isLoading) && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-zinc-900 border rounded-md shadow-lg max-h-60 overflow-auto">
          {isLoading ? (
            <div className="px-4 py-2 text-sm text-muted-foreground">
              Loading...
            </div>
          ) : (
            suggestions.map((suggestion) => (
              <button
                key={suggestion.place_id}
                type="button"
                onClick={() => handleSelect(suggestion)}
                className="w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer focus:bg-accent focus:text-accent-foreground outline-none"
              >
                {suggestion.description}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
