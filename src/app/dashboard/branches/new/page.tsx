import FormNewBranch from "@/modules/branches/components/FormNewBranch";

export default function NewBranchPage() {
  return (
    <div className="px-6">
      <h2 className="text-xl font-bold mb-5 text-center">
        Formulario para crear una nueva Sucursal
      </h2>
      <FormNewBranch />
    </div>
  );
}
