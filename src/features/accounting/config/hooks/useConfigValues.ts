import { useQuery } from "@tanstack/react-query";
import { configService } from "../services/configService";

export default function useConfigValues() {
  return useQuery({
    queryKey: ["configValues"],
    queryFn: configService.fetchConfigValues,
  })
}