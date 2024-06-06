"use client";
import useToken from "@/modules/shared/hooks/useToken";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Entity } from "@/modules/entities/types/entity";
import FormEditEntity from "./FormEditEntity";



export default function EditEntity({id}:{id:number}) {

  const { token, isTokenReady } = useToken();
  
  const editEntityQuery = useQuery({
    queryKey: ["Entities", id],
    queryFn: async function (): Promise<Entity> {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Entity/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    enabled: isTokenReady,
    staleTime: 1000 * 30 * 10,
  });

  if(editEntityQuery.isLoading || editEntityQuery.isPending){
    return <div>Cargando...</div>
  }

  return <FormEditEntity entity={editEntityQuery.data!}/>;

}