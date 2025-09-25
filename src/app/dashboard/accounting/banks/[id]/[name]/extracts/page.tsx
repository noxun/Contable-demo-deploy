import ListBankExcerpts from "@/features/accounting/banks/components/ListBankExcerpts";

export default function BankExtractsPage({
  params,
}: {
  params: { id: string, name: string };
}) {
  const { id, name } = params;

  return (
    <main className="space-y-4">
      <h1 className="text-3xl font-bold">Lista de Extractos del banco {decodeURIComponent(name)}</h1>
      <ListBankExcerpts bankId={id} />
    </main>
  );
}
