import FormNewIncome from "@/modules/income/components/FormNewIncome";
import React from "react";

const NewDiaryPage = () => {
  return (
    <div className="px-6">
      <h2 className="text-lg font-bold">Formulario para crear un diario</h2>
      <FormNewIncome type="0" />
    </div>
  );
};

export default NewDiaryPage;
