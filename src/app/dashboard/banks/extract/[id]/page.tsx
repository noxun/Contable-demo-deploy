import ListBankExcerptData from "@/modules/banks/components/ListBankExcerptData";

export default function ExtractDetailsPage({params}: {params: {id: string}}) {
  const {id} = params
  return (
    <div>
      <h1>Detalles del extracto</h1>
      <ListBankExcerptData bankExcerptId={id}/>
    </div>
  )
}
