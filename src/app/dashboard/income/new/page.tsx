import FormNewIncome from "@/modules/income/components/FormNewIncome";

const NewIncomePage = () => {
  return (
    <div className="px-6">
      <h2 className="text-lg font-bold">Formulario para crear ingreso</h2>
      <FormNewIncome type="2" />
    </div>
  );
};

export default NewIncomePage;
