import ListBankExcerpts from "@/modules/banks/components/ListBankExcerpts";

export default function BankExtractsPage({
  params,
}: {
  params: { id: string, name: string };
}) {
  const { id, name } = params;

  return (
    <main>
      <h1 className="text-3xl">Lista de Extractos del banco {id}, {decodeURIComponent(name)}</h1>
      <ListBankExcerpts bankId={id} />
    </main>
  );
}
