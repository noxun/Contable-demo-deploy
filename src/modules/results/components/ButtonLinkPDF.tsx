import { BlobProvider } from "@react-pdf/renderer"
import { format } from "date-fns"

interface Props {
  pdfFile: JSX.Element
  nameFile?: string
}

export const ButtonLinkPDF = ({ pdfFile, nameFile }: Props) => {
  return (
    <BlobProvider document={pdfFile}>
      {({ url, loading, error }) => (
        <div className="flex items-center gap-1 border-2 border-[#da3929] min-w-36 text-[#da3929] w-fit rounded-md">
          {(loading) && <div className="py-2 px-3 size-full">Cargando Link</div>}
          {(!loading && error) && <div className="py-2 px-3 size-full">Algo salio mal</div>}
          {(url && !loading) && (<a
            href={url}
            target="_blank"
            download={nameFile ? `${nameFile}_${format(new Date(), "dd-MM-yyyy_HH-mm")}` : undefined}
            className="flex items-center gap-1 w-full px-3 py-2"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M14 3v4a1 1 0 0 0 1 1h4" />
              <path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" />
              <path d="M5 18h1.5a1.5 1.5 0 0 0 0 -3h-1.5v6" />
              <path d="M17 18h2" /><path d="M20 15h-3v6" />
              <path d="M11 15v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1z" />
            </svg>
            {nameFile ? 'Descargar' : 'Abrir'}
          </a>)}
        </div>
      )}
    </BlobProvider>
  )
}