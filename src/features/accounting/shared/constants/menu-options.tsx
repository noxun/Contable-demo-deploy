import {
  FileCheck2,
  ListTree,
  User,
  Landmark,
  NotebookText,
  Folder,
  Text,
  Building,
  ListRestart,
  ListTodo,
  SquareGanttChart,
  Link,
  LayoutTemplate,
  MapPinHouse,
} from "lucide-react";
export const MENU_OPTIONS = [
  {
    name: "Transacciones",
    routes: [
      {
        path: "/dashboard/accounting/transactions",
        name: "Transacciones",
        icon: <FileCheck2 className="h-5 w-5" />,
      },
      {
        path: "/dashboard/accounting/accounts",
        name: "Cuentas",
        icon: <ListTree className="h-5 w-5" />,
      },
      {
        path: "/dashboard/accounting/link",
        name: "Enlazar Cuentas",
        icon: <Link className="h-5 w-5" />,
      },
      {
        path: "/dashboard/accounting/model-seats",
        name: "Asientos Modelo",
        icon: <LayoutTemplate className="h-5 w-5" />,
      },
    ],
  },
  {
    name: "Entidades",
    routes: [
      {
        path: "/dashboard/accounting/entities",
        name: "Entidades",
        icon: <Building className="h-5 w-5" />,
      },
      {
        path: "/dashboard/accounting/branches",
        name: "Sucursales",
        icon: <MapPinHouse className="size-5"/>
      },
      {
        path: "/dashboard/accounting/folders",
        name: "Carpetas",
        icon: <Folder className="h-5 w-5" />,
      },
      {
        path: "/dashboard/accounting/banks",
        name: "Bancos",
        icon: <Landmark className="h-5 w-5" />,
      },
      {
        path: "/dashboard/accounting/accounting-box",
        name: "Caja",
        icon: <Landmark className="h-5 w-5" />,
      },
      {
        path: "/dashboard/accounting/cost-center",
        name: "Centro de costos",
        icon: <Landmark className="h-5 w-5" />,
      },
      {
        path: "/dashboard/accounting/users",
        name: "Usuarios",
        icon: <User className="h-5 w-5" />,
      },
      {
        path: "/dashboard/accounting/concepts",
        name: "Conceptos",
        icon: <Text className="h-5 w-5" />,
      },
    ],
  },
  {
    name: "Facturas y Planillas",
    routes: [
      {
        path: "/dashboard/accounting/invoices",
        name: "Facturas",
        icon: <NotebookText className="h-5 w-5" />,
      },
      {
        path: "/dashboard/accounting/status-entities",
        name: "Estado de cuentas",
        icon: <ListTodo className="h-5 w-5" />,
      },
      {
        path: "/dashboard/accounting/kardex-entities",
        name: "Kardex",
        icon: <ListRestart className="h-5 w-5" />,
      },
    ],
  },
  {
    name: "Reportes",
    routes: [
      {
        path: "/dashboard/accounting/results/balance-amounts",
        name: "Balance de Sumas",
        icon: <SquareGanttChart className="h-5 w-5" />,
      },
      {
        path: "/dashboard/accounting/results/balance-general",
        name: "Balance General",
        icon: <SquareGanttChart className="h-5 w-5" />,
      },
      {
        path: "/dashboard/accounting/results/statement-income",
        name: "Estado de Resultados",
        icon: <SquareGanttChart className="h-5 w-5" />,
      },
      {
        path: "/dashboard/accounting/results/diary-book",
        name: "Libro Diario",
        icon: <NotebookText className="h-5 w-5" />,
      },
      {
        path: "/dashboard/accounting/results/bigger-book",
        name: "Libro Mayor",
        icon: <NotebookText className="h-5 w-5" />,
      },
      {
        path: "/dashboard/accounting/results/cash-flow",
        name: "Flujo de Efectivo",
        icon: <NotebookText className="h-5 w-5" />,
      },
      {
        path: "/dashboard/accounting/results/heritage-evaluation",
        name: "Evolucion del Patrimonio",
        icon: <NotebookText className="h-5 w-5" />,
      },
    ],
  },
];
