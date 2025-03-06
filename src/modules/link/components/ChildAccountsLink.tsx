"use client";
import { Minus, Plus } from "lucide-react";
import { Virtuoso } from "react-virtuoso";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useCallback, useMemo, ChangeEvent, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "use-debounce";
import LinkAccountDialog from "./LinkAccountDialog";
import { RelationAccount } from "@/lib/types";
import UnlinkAccountDialog from "./UnlinkAccountDialog";

interface FlattenedAccount extends RelationAccount {
  depth: number;
  hasChildren: boolean;
}
interface ChildAccountsProps {
  accounts: RelationAccount[] | undefined;
}

const flattenAccounts = (
  accounts: RelationAccount[],
  depth = 0
): FlattenedAccount[] =>
  accounts.flatMap((account) => {
    const children = account.items || [];
    return [
      {
        ...account,
        depth,
        hasChildren: children.length > 0,
      },
      ...flattenAccounts(children, depth + 1),
    ];
  });

export default function ChildAccountsLink({ accounts }: ChildAccountsProps) {
  const [expandedCodes, setExpandedCodes] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 1000);

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

  const filteredFlattenedAccounts = useMemo(() => {
    if (!debouncedSearchQuery) return flattenedAccounts;

    return flattenedAccounts.filter((item) => {
      const codeAndDesc = `${item.code}-${item.description}`;
      return codeAndDesc
        .toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase());
    });
  }, [flattenedAccounts, debouncedSearchQuery]);

  // Effect to handle expanding parent accounts when searching
  useEffect(() => {
    if (debouncedSearchQuery) {
      const parentCodesToExpand = new Set<string>();

      filteredFlattenedAccounts.forEach((account) => {
        // Find all parent accounts that need to be expanded
        let parentDepth = account.depth - 1;
        let currentIndex = flattenedAccounts.indexOf(account);

        while (parentDepth >= 0) {
          const parent = flattenedAccounts
            .slice(0, currentIndex)
            .reverse()
            .find((a) => a.depth === parentDepth);

          if (parent) {
            parentCodesToExpand.add(parent.code);
          }
          parentDepth--;
        }
      });

      setExpandedCodes((prev) => new Set([...prev, ...parentCodesToExpand]));
    }
  }, [debouncedSearchQuery, filteredFlattenedAccounts, flattenedAccounts]);

  // Then the visible accounts memo (without the state updates)
  const visibleAccounts = useMemo(() => {
    return filteredFlattenedAccounts.filter(isVisible);
  }, [filteredFlattenedAccounts, isVisible]);

  const renderAccount = useCallback(
    (_: number, account: FlattenedAccount) => (
      <div
        className="flex items-center gap-2 border px-2 py-4 text-xl"
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

        <div className="flex items-center gap-4">
          <div>
            <span className="font-bold">{account.code}:</span>{" "}
            {account.description}{" "}
            {account.isMotion && <Badge>Movimiento</Badge>}
            {account.isBudgetable && <Badge>Presupuestable</Badge>}
            {account.isCost && <Badge>Costo</Badge>}
          </div>
          <div className="flex ">
            {account.accountIdRef === 0 ? (
              <LinkAccountDialog account={account}/>
            ) : (
              <UnlinkAccountDialog
                accountId={account.id}
                siatAccountId={account.accountIdRef}
              />
            )}
          </div>
        </div>
      </div>
    ),
    [expandedCodes, toggleExpand]
  );

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    setSearchQuery(event.target.value);
  }

  console.log(flattenedAccounts);

  return (
    <div className="flex flex-col gap-4">
      <Input
        type="search"
        onChange={handleSearch}
        placeholder="Buscar Cuenta"
        value={searchQuery}
      />
      <Virtuoso
        style={{ height: 400 }}
        className="!important border-2"
        data={visibleAccounts}
        // data={filteredAccounts}
        itemContent={renderAccount}
      />
    </div>
  );
}
