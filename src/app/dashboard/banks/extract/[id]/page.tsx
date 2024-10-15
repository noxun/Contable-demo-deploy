import ListBankExcerptData from "@/modules/banks/components/ListBankExcerptData";

export default function ExtractDetailsPage({params}: {params: {id: string}}) {
  const {id} = params
  return (
    <div>
      <ListBankExcerptData bankExcerptId={id}/>
    </div>
  )
}
