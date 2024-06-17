import EditConcept from "@/modules/concepts/components/EditConcept";

export default function ConceptEditPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  return (
    <main>
      <EditConcept id={id} />
    </main>
  );
}
