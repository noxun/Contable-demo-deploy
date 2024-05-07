import FormNewIncome from "@/modules/income/components/FormNewIncome";
import React from "react";

const NewExpensePage = () => {
  return (
    <div className="px-6">
      <h2 className="text-lg font-bold">Formulario para crear egreso</h2>
      <FormNewIncome type="1" />
    </div>
  );
};

export default NewExpensePage;
