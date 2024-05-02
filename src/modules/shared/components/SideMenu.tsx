import Image from "next/image";

import { MenuOptions } from "./MenuOptions";
// import logoPic from "../../../../../assets/images/logo-sistema-contable.svg";
// import { LogoutButton } from "@/modules/auth";

export const SideMenu = () => {
  return (
    <nav className="sidemenu overflow-y-auto">
      <div className="flex items-center justify-center flex-col mb-8">
        {/* <Image src={logoPic} alt="Sistema Contable" /> */}
        <h3 className="text-white text-xl">Sistema contable</h3>
      </div>
      <MenuOptions />
      <div className="flex-1"></div>
      {/* <LogoutButton /> */}
    </nav>
  );
};
