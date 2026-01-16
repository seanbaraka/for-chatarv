import { useQuery } from "@tanstack/react-query";
import { getAddress } from "@/lib/api/address";
import type { ApiResponse } from "@/lib/types";

export function useNeighborhoodQuery(address: string, enabled: boolean = false) {
  return useQuery({
    queryKey: ["neighborhood", address],
    queryFn: async () => {
      const response = (await getAddress(address)) as ApiResponse;
      return response;
    },
    enabled: enabled && address.trim().length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes - neighborhood data doesn't change often
  });
}

