"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { InputGroupInput } from "@/components/ui/input-group";
import { useAutocompleteQuery } from "@/hooks/use-autocomplete-query";
import type { Prediction, AddressAutocompleteProps } from "@/lib/types";

export function AddressAutocomplete({
  value,
  onChange,
  onSubmit,
  placeholder,
  disabled,
  className,
  onLoadingChange,
}: AddressAutocompleteProps & { className?: string }) {
  const [isManuallyClosed, setIsManuallyClosed] = useState(false);
  const [debouncedInput, setDebouncedInput] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Use React Query hook for autocomplete
  const { data: autocompleteResponse, isLoading } = useAutocompleteQuery(
    debouncedInput,
    debouncedInput.trim().length >= 3
  );

  // Extract suggestions from the response
  const suggestions = useMemo(() => {
    if (
      autocompleteResponse?.status === "OK" &&
      autocompleteResponse?.predictions
    ) {
      return autocompleteResponse.predictions;
    }
    return [];
  }, [autocompleteResponse]);

  // Derive isOpen from suggestions and manual close state
  const isOpen = useMemo(() => {
    if (isManuallyClosed) return false;
    return suggestions.length > 0 && debouncedInput.trim().length >= 3;
  }, [suggestions.length, debouncedInput, isManuallyClosed]);

  // Notify parent of loading state changes
  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

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
      setDebouncedInput(newValue);
    }, 300);
  };

  // Handle suggestion selection
  const handleSelect = (suggestion: Prediction) => {
    onChange(suggestion.description);
    setDebouncedInput(""); // Clear debounced input to close suggestions
    setIsManuallyClosed(true);
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
      setIsManuallyClosed(true);
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
        setIsManuallyClosed(true);
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
        className={`md:text-lg ${className || ""}`}
        onFocus={() => {
          if (suggestions.length > 0 && debouncedInput.trim().length >= 3) {
            setIsManuallyClosed(false);
          }
        }}
        onInput={() => {
          // Reset manual close when user types
          setIsManuallyClosed(false);
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
