import EditEntity from "@/features/accounting/entities/components/EditEntity";

export default function EditEntityPage({
    params,
  }: {
    params: { id: string };
  }) {

  const {id} = params;
  return (
    <EditEntity id={parseInt(id)}/>
  )
}
