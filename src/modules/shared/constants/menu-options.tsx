import { LuCreditCard, LuFiles, LuFolder, LuUsers2 } from "react-icons/lu";
import { VscGraphLine } from "react-icons/vsc";
export const MENU_OPTIONS = [
  {
    name: "Transacciones",
    icon: <LuFolder />,
    routes: [
      {
        path: "/dashboard/income",
        name: "Ingresos",
      },
      {
        path: "/dashboard/expenses",
        name: "Egresos",
      },
      {
        path: "/dashboard/diary",
        name: "Diarios",
      },
    ],
  },
  {
    name: "Utilitarios",
    icon: <LuFiles />,
    routes: [
      {
        path: "/dashboard/accounts",
        name: "Cuentas",
      },
    ],
  },
];
