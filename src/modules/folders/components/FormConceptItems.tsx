import { ChangeEvent, Dispatch, SetStateAction } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface Props {
  concepts: {
    amount: number;
    id: number;
    acronym: string;
    description: string;
    typeOfExpense: string;
    typeOfTax: string;
    order: number;
    accountId: number;
    carpeta: string;
    debitBs: number;
    assetBs: number;
  }[];
  setConcepts: Dispatch<
    SetStateAction<
      {
        amount: number;
        id: number;
        acronym: string;
        description: string;
        typeOfExpense: string;
        typeOfTax: string;
        order: number;
        accountId: number;
        carpeta: string;
        debitBs: number;
        assetBs: number;
      }[]
    >
  >;
}
export const FormConceptItems = (props: Props) => {
  const { concepts, setConcepts } = props;

  function onChange(e: ChangeEvent<HTMLInputElement>, index: number) {
    const { name, value } = e.target;
    let listConcepts = concepts;
    listConcepts[index] = {
      ...listConcepts[index],
      [name]: parseFloat(value) || 0,
    };
    setConcepts([...listConcepts]);
  }

  return (
    <div className="my-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sigla</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Pagado</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>A pagar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {concepts.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="h-fit">{item.acronym}</TableCell>
              <TableCell className="h-fit">{item.description}</TableCell>
              <TableCell className="h-fit">{item.typeOfExpense}</TableCell>
              <TableCell className="h-fit">
                {item.typeOfExpense === "Factura" ? item.assetBs : item.debitBs}
              </TableCell>
              <TableCell>
                <Input
                  name="amount"
                  onChange={(e) => onChange(e, index)}
                  value={item.amount}
                  defaultValue={0}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
