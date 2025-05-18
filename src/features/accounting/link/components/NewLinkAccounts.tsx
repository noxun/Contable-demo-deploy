"use client";
import AccountLayoutSkeleton from "@/features/accounting/account/components/AccountLayoutSkeleton";
import ChildAccountsLink from "./ChildAccountsLink";
import { useQuery } from "@tanstack/react-query";
import { fetchAllMotionAccountsWithRelations } from "@/lib/data";


export default function NewLinkAccounts() {
  const { data: accounts, isError, isPending } = useQuery({
    queryKey: ["AllAccountRelation"],
    queryFn: fetchAllMotionAccountsWithRelations,
  });

  if (isError) {
    return <div>Error</div>;
  }

  if (isPending) {
    return <AccountLayoutSkeleton />;
  }

  return (
    <div>
      <ChildAccountsLink accounts={accounts} />
    </div>
  );
}
