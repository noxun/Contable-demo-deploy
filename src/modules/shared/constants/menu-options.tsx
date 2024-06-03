import { FileCheck2, FileInput, FileOutput, ListTree, User, Landmark, NotebookText, Radical, FileText } from "lucide-react";
export const MENU_OPTIONS = [
  {
    name: "Transacciones",
    routes: [
      {
        path: "/dashboard/income",
        name: "Ingresos",
        icon: <FileInput className="h-5 w-5" />,
      },
      {
        path: "/dashboard/expenses",
        name: "Egresos",
        icon: <FileOutput className="h-5 w-5" />,
      },
      {
        path: "/dashboard/diary",
        name: "Diarios",
        icon: <FileCheck2 className="h-5 w-5" />,
      },
      {
        path: "/dashboard/users",
        name: "Usuarios",
        icon: <User className="h-5 w-5" />,
      },
      {
        path: "/dashboard/banks",
        name: "Bancos",
        icon: <Landmark className="h-5 w-5" />,
      },
    ],
  },
  {
    name: "Utilitarios",
    routes: [
      {
        path: "/dashboard/accounts",
        name: "Cuentas",
        icon: <ListTree className="h-5 w-5" />,
      },
    ],
  },
  {
    name: "Estados de Resultado",
    routes: [
      {
        path: "/dashboard/results",
        name: "Reportes",
        icon: <NotebookText className="h-5 w-5"/>
      },
    ]
  }
];
