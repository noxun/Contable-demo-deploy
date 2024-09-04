"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Account } from "../types/account";
import ChildAccounts from "./ChildAccounts";
import useToken from "@/modules/shared/hooks/useToken";
import { ITypeCompany } from "../schemas/account";
import Select, {
  CSSObjectWithLabel,
  ControlProps,
  GroupBase,
  SingleValue,
  StylesConfig,
} from "react-select";
import { useEffect, useState } from "react";

function AccountAccordion() {
  const { token, isTokenReady } = useToken();
  const [type, setType] = useState(1);

  const typeCompanyQuery = useQuery({
    queryKey: ["typeCompany"],
    queryFn: async (): Promise<{ data: ITypeCompany[] }> =>
      await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/TypeCompany`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    enabled: isTokenReady,
    staleTime: 1000 * 30 * 10,
  });

  const accountsQuery = useQuery({
    queryKey: ["accountsAll"],
    queryFn: async (): Promise<{ data: Account[] }> =>
      await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Account/All${
          type ? `?typeCompanyId=${type}` : ""
        }`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    enabled: isTokenReady,
    staleTime: 1000 * 60 * 10, //volver a hacer fetch luego de 10 min
  });

  useEffect(() => {
    if (!typeCompanyQuery.isLoading && !typeCompanyQuery.isPending) {
      accountsQuery.refetch();
    }
  }, [accountsQuery, type, typeCompanyQuery.isLoading, typeCompanyQuery.isPending]);

  if (typeCompanyQuery.isLoading || typeCompanyQuery.isPending) {
    return null;
  }

  if (accountsQuery.isLoading || accountsQuery.isPending) {
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
    //aca se puede retornar algun skeleton
  }

  const customStyles: StylesConfig<any, false, GroupBase<any>> = {
    // control: (base, state) => ({
    //   ...base,
    //   backgroundColor: state.isFocused ? "#1F2937" : "#FFFFFF", // dark:bg-neutral-700 or bg-white
    //   borderColor: state.isFocused ? "#D1D5DB" : "#9CA3AF", // dark:border-neutral-400 or border-neutral-300
    //   "&:hover": {
    //     borderColor: state.isFocused ? "#D1D5DB" : "#9CA3AF", // dark:hover:border-neutral-400 or hover:border-neutral-300
    //   },
    // }),
    control: (
      base: CSSObjectWithLabel,
      props: ControlProps<any, false, GroupBase<any>>
    ) => ({
      ...base,
      backgroundColor: props.isFocused ? "#1F2937" : "#FFFFFF", // dark:bg-neutral-700 or bg-white
      borderColor: props.isFocused ? "#D1D5DB" : "#9CA3AF", // dark:border-neutral-400 or border-neutral-300
      "&:hover": {
        borderColor: props.isFocused ? "#D1D5DB" : "#9CA3AF", // dark:hover:border-neutral-400 or hover:border-neutral-300
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#1F2937", // dark:bg-neutral-700
      borderColor: "#9CA3AF", // dark:border-neutral-600
      zIndex: 9999, // Ensure it appears above other elements
    }),
    option: (base, state) => ({
      ...base,
      color: state.isFocused ? "#E5E7EB" : "#4B5563", // dark:text-neutral-200 or text-neutral-600
      backgroundColor: state.isFocused ? "#374151" : "#F3F4F6", // dark:bg-neutral-800 or bg-neutral-100
      "&:hover": {
        backgroundColor: "#374151", // dark:hover:bg-neutral-800
      },
    }),
    menuList: (base) => ({
      ...base,
      padding: 0,
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#9CA3AF", // dark:bg-neutral-600
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#F3F4F6", // dark:text-neutral-100
    }),
    multiValueRemove: (base) => ({
      ...base,
      backgroundColor: "#6B7280", // dark:bg-neutral-700
      "&:hover": {
        backgroundColor: "#4B5563", // dark:hover:bg-neutral-800
      },
    }),
  };

  function onSelectChange(
    option: SingleValue<{ value: string; label: string }> | null
  ) {
    setType(Number(option?.value ?? 1));
  }

  const typeCompanyOptions = typeCompanyQuery.data?.data.map((item) => ({
    value: item.id.toString(),
    label: `${item.name}`,
    //...item
  }));

  return (
    <div>
      <div className="w-[300px]">
        <Select
          maxMenuHeight={200}
          className="my-react-select-container"
          classNamePrefix="my-react-select"
          menuPosition="absolute"
          menuPortalTarget={document.body}
          menuPlacement="top"
          placeholder="Selecciona una Cuenta.."
          // styles={{
          //   menuList: (base) => ({
          //     ...base,
          //     height: 100,
          //     minHeight: 100, // your desired height
          //   }),
          // }}
          styles={customStyles}
          isSearchable={true}
          options={typeCompanyOptions}
          value={typeCompanyOptions?.find(
            (option) => Number(option.value) === type
          )}
          onChange={(option) =>
            onSelectChange(
              option as SingleValue<{ value: string; label: string }>
            )
          }
        />
      </div>
      <br />
      <ChildAccounts accounts={accountsQuery.data?.data} />
    </div>
  );
}

export default AccountAccordion;
