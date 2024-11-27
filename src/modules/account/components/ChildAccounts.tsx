"use client";
import { Account } from "../types/account";
import { Minus, Plus } from "lucide-react";
import { Virtuoso } from "react-virtuoso";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useCallback, useMemo } from "react";
import AccountCreateButton from "./AccountCreateButton";
import AccountEditButton from "./AccountEditButton";
import AccountDeleteButton from "./AccountDeleteButton";

interface FlattenedAccount extends Account {
  depth: number;
  hasChildren: boolean;
}
interface ChildAccountsProps {
  accounts: Account[] | undefined;
}

const flattenAccounts = (accounts: Account[], depth = 0): FlattenedAccount[] =>
  accounts.flatMap((account) => {
    const children = account.accountChild || [];
    return [
      {
        ...account,
        depth,
        hasChildren: children.length > 0,
      },
      ...flattenAccounts(children, depth + 1),
    ];
  });

export default function FoldableFlatAccounts({ accounts }: ChildAccountsProps) {
  const [expandedCodes, setExpandedCodes] = useState<Set<string>>(new Set());

  const flattenedAccounts = useMemo(
    () => flattenAccounts(accounts ?? []),
    [accounts]
  );

  const toggleExpand = useCallback((code: string) => {
    setExpandedCodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(code)) {
        newSet.delete(code);
      } else {
        newSet.add(code);
      }
      return newSet;
    });
  }, []);

  const isVisible = useCallback(
    (account: FlattenedAccount) => {
      let parentDepth = account.depth - 1;
      let currentIndex = flattenedAccounts.indexOf(account);

      while (parentDepth >= 0) {
        const parent = flattenedAccounts
          .slice(0, currentIndex)
          .reverse()
          .find((a) => a.depth === parentDepth);

        if (parent && !expandedCodes.has(parent.code)) {
          return false;
        }
        parentDepth--;
      }
      return true;
    },
    [flattenedAccounts, expandedCodes]
  );

  const visibleAccounts = useMemo(
    () => flattenedAccounts.filter(isVisible),
    [flattenedAccounts, isVisible]
  );

  const renderAccount = useCallback(
    (_: number, account: FlattenedAccount) => (
      <div
        className="flex items-center gap-2 border px-2 py-1"
        style={{ paddingLeft: `${account.depth * 20}px` }}
      >
        {account.hasChildren ? (
          <Button
            variant="outline"
            size="icon"
            onClick={() => toggleExpand(account.code)}
          >
            {expandedCodes.has(account.code) ? (
              <Minus className="size-4" />
            ) : (
              <Plus className="size-4" />
            )}
          </Button>
        ) : (
          <div className="w-8 h-8" aria-hidden="true" />
        )}

        <div className="flex items-center">
          <div className="flex">
            <AccountCreateButton fatherId={account.id} />
            <AccountEditButton
              account={{
                id: account.id,
                code: account.code,
                description: account.description,
                coin: account.coin,
                active: account.active,
                isBudgetable: account.isBudgetable,
                isMotion: account.isMotion,
                isCost: account.isCost,
                accountChild: account.accountChild || [],
              }}
            />
            <AccountDeleteButton
              accountId={account.id}
              message="Esta acción no puede revertirse. Esto borrara permanentemente la cuenta"
            />
          </div>
          <span>
            {account.code}: {account.description}{" "}
            {account.isMotion && <Badge>Movimiento</Badge>}
            {account.isBudgetable && <Badge>Presupuestable</Badge>}
            {account.isCost && <Badge>Costo</Badge>}
          </span>
        </div>
      </div>
    ),
    [expandedCodes, toggleExpand]
  );

  return (
    <div>
      <Virtuoso
        style={{ height: 400 }}
        data={visibleAccounts}
        itemContent={renderAccount}
      />
    </div>
  );
}
