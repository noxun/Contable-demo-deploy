import { getAllAssets } from "@/lib/data";
import { queryOptions } from "@tanstack/react-query";

export function fixedAssetsQueryOptions() {
  return queryOptions({
    queryKey: ["AllAssets"],
    queryFn: getAllAssets,
  });
}
