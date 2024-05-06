import FormNewIncome from "@/modules/income/components/FormNewIncome";
import React from "react";

const NewIncomePage = () => {
  return (
    <div className="px-6">
      <h2 className="text-lg font-bold">Formulario para crear ingreso</h2>
      <FormNewIncome />
    </div>
  );
};

export default NewIncomePage;
