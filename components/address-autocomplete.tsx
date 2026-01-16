"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { InputGroupInput } from "@/components/ui/input-group";
import { googleAutoComplete } from "@/lib/api/autocomplete";
import type {
  Prediction,
  AutocompleteResponse,
  AddressAutocompleteProps,
} from "@/lib/types";

export function AddressAutocomplete({
  value,
  onChange,
  onSubmit,
  placeholder,
  disabled,
  className,
  onLoadingChange,
}: AddressAutocompleteProps & { className?: string }) {
  const [suggestions, setSuggestions] = useState<Prediction[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Notify parent of loading state changes
  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

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
    onChange(suggestion.description);
    setSuggestions([]);
    setIsOpen(false);
    // Trigger search when suggestion is selected
    if (onSubmit) {
      onSubmit();
    }
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
      const target = event.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        !(target as HTMLElement).closest('[data-slot="input-group"]')
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <>
      <InputGroupInput
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        name="address"
        className="md:text-lg"
        onFocus={() => {
          if (suggestions.length > 0) {
            setIsOpen(true);
          }
        }}
      />
      {isOpen && (suggestions.length > 0 || isLoading) && (
        <div
          ref={containerRef}
          className="absolute top-full z-50 left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border shadow-lg max-h-60 overflow-auto"
        >
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
                className="w-full text-left px-6 py-3 text-base hover:bg-accent hover:text-accent-foreground cursor-pointer focus:bg-accent focus:text-accent-foreground outline-none"
              >
                {suggestion.description}
              </button>
            ))
          )}
        </div>
      )}
    </>
  );
}
