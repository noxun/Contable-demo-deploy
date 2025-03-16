import { ListConceptExpense } from "@/modules/folders/components/ListConceptExpense";

interface Props {
  params: { numRef: string };
}
export default function RegisterPaymentPage({ params }: Props) {
  return (
    <section className="px-6">
      <div className="flex justify-between mb-2">
        <h2 className="text-lg font-semibold">
          Lista de pagos {params.numRef}
        </h2>
      </div>
      <ListConceptExpense numRef={params.numRef} close={true} />
    </section>
  );
}
