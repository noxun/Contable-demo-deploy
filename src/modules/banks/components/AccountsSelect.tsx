import Spinner from "@/components/ui/spinner";
import useAccounts from "@/modules/shared/hooks/useAccounts";
import Select from "react-select";
export default function AccountsSelect() {
  const { data: accounts, isPending } = useAccounts();

  if (isPending) {
    return <Spinner />;
  }

  return (
    <Select
      options={accounts}
      getOptionValue={(account) => account.id.toString()}
      getOptionLabel={(account)=> `${account.code}-${account.description}`}
    />
  );
}
