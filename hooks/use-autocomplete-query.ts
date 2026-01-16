import { useQuery } from "@tanstack/react-query";
import { googleAutoComplete } from "@/lib/api/autocomplete";
import type { AutocompleteResponse } from "@/lib/types";

export function useAutocompleteQuery(input: string, enabled: boolean = false) {
  return useQuery({
    queryKey: ["autocomplete", input],
    queryFn: async () => {
      const response = (await googleAutoComplete(
        input
      )) as AutocompleteResponse;
      return response;
    },
    enabled: enabled && input.trim().length >= 3,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
  });
}
