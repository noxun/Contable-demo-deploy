"use client";
import { Account } from "../types/account";
import { Minus, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Virtuoso } from "react-virtuoso";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useCallback, useMemo, ChangeEvent, useEffect } from "react";
import AccountCreateButton from "./AccountCreateButton";
import AccountEditButton from "./AccountEditButton";
import AccountDeleteButton from "./AccountDeleteButton";
import { Input } from "@/components/ui/input";
import { useDebounce } from 'use-debounce';

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
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 1000);
  const [allExpanded, setAllExpanded] = useState(false);

  const flattenedAccounts = useMemo(
    () => flattenAccounts(accounts ?? []),
    [accounts]
  );
  
  // Function to collect all account codes that have children
  const allParentCodes = useMemo(() => {
    return flattenedAccounts
      .filter(account => account.hasChildren)
      .map(account => account.code);
  }, [flattenedAccounts]);
  
  // Function to toggle all expandable accounts
  const toggleAllAccounts = useCallback(() => {
    if (allExpanded) {
      // Collapse all
      setExpandedCodes(new Set());
    } else {
      // Expand all
      setExpandedCodes(new Set(allParentCodes));
    }
    setAllExpanded(!allExpanded);
  }, [allExpanded, allParentCodes]);

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
      return codeAndDesc.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
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
  
  // Update allExpanded state based on whether all parent codes are expanded
  useEffect(() => {
    setAllExpanded(
      allParentCodes.length > 0 && 
      allParentCodes.every(code => expandedCodes.has(code))
    );
  }, [expandedCodes, allParentCodes]);
  
  // Then the visible accounts memo (without the state updates)
  const visibleAccounts = useMemo(() => {
    return filteredFlattenedAccounts.filter(isVisible);
  }, [filteredFlattenedAccounts, isVisible]);


  const renderAccount = useCallback(
    (_: number, account: FlattenedAccount) => (
      <div
        className="flex items-center gap-2 border px-2 py-1 text-xl"
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
              // disabled={account.isMotion}
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
                isFinancing: account.isFinancing,
                isInitialBalance: account.isInitialBalance,
                isInvestment: account.isInvestment,
                isOperation: account.isOperation,
              }}
            />
            <AccountDeleteButton
              accountId={account.id}
              message="Esta acción no puede revertirse. Esto borrara permanentemente la cuenta"
            />
          </div>
          <div>
            <span className="font-bold">{account.code}:</span> {account.description}{" "}
            {account.isMotion && <Badge>Movimiento</Badge>}
            {account.isBudgetable && <Badge>Presupuestable</Badge>}
            {account.isCost && <Badge>Costo</Badge>}
          </div>
        </div>
      </div>
    ),
    [expandedCodes, toggleExpand]
  );

  function handleSearch(event:ChangeEvent<HTMLInputElement>){
    setSearchQuery(event.target.value)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Input 
          type="search" 
          onChange={handleSearch} 
          placeholder="Buscar Cuenta" 
          value={searchQuery}
          className="flex-1"
        />
        <Button 
          variant="outline" 
          onClick={toggleAllAccounts}
          className="flex items-center gap-1"
        >
          {allExpanded ? (
            <>
              <ChevronUp className="size-4" />
              Colapsar Todo
            </>
          ) : (
            <>
              <ChevronDown className="size-4" />
              Expandir Todo
            </>
          )}
        </Button>
      </div>
      <Virtuoso
        style={{ height: 700}}
        className="!important border-2"
        data={visibleAccounts}
        itemContent={renderAccount}
      />
    </div>
  );
}