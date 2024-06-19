import {
  FileCheck2,
  FileInput,
  FileOutput,
  ListTree,
  User,
  Landmark,
  NotebookText,
  Radical,
  FileText,
  Folder,
  Text,
  Building,
} from "lucide-react";
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
        path: "/dashboard/accounts",
        name: "Cuentas",
        icon: <ListTree className="h-5 w-5" />,
      },
    ],
  },
  {
    name: "Entidades",
    routes: [
      {
        path: "/dashboard/entities",
        name: "Entidades",
        icon: <Building className="h-5 w-5" />,
      },
      {
        path: "/dashboard/folders",
        name: "Carpetas",
        icon: <Folder className="h-5 w-5" />,
      },
      {
        path: "/dashboard/banks",
        name: "Bancos",
        icon: <Landmark className="h-5 w-5" />,
      },
      {
        path: "/dashboard/users",
        name: "Usuarios",
        icon: <User className="h-5 w-5" />,
      },
      {
        path: "/dashboard/concepts",
        name: "Conceptos",
        icon: <Text className="h-5 w-5" />,
      },
    ],
  },
  {
    name: "Facturas y Planillas",
    routes: [
      {
        path: "/dashboard/invoices",
        name: "Facturas",
        icon: <NotebookText className="h-5 w-5" />,
      },
    ],
  },
  {
    name: "Reportes",
    routes: [
      {
        path: "/dashboard/results/balance-amounts",
        name: "Balance de Sumas",
        icon: <NotebookText className="h-5 w-5" />,
      },
      {
        path: "/dashboard/results/balance-general",
        name: "Balance General",
        icon: <NotebookText className="h-5 w-5" />,
      },
      {
        path: "/dashboard/results/statement-income",
        name: "Estado de Resultados",
        icon: <NotebookText className="h-5 w-5" />,
      },
      // {
      //   path: "/dashboard/results/bigger-book",
      //   name: "Libro Mayor",
      //   icon: <NotebookText className="h-5 w-5" />,
      // },
    ],
  },
];
