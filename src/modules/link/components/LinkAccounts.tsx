// "use client";

// import { DataTable } from "@/components/ui/data-table";
// import { fetchAllMotionAccountsWithRelations } from "@/lib/data";
// import { useQuery } from "@tanstack/react-query";
// import { columns } from "./columns";
// import { ChangeEvent, useState } from "react";
// import { useDebounce } from "use-debounce";
// import { Input } from "@/components/ui/input";
// export default function LinkAccounts() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

//   const { data, isLoading, isPending } = useQuery({
//     queryKey: ["AllAccountRelation"],
//     queryFn: fetchAllMotionAccountsWithRelations,
//   });

//   if (data === undefined || isLoading || isPending)
//     return <div>Cargando...</div>;

//   const filteredData = data.filter((relations) =>
//     relations.description
//       .toLowerCase()
//       .includes(debouncedSearchQuery.toLowerCase())
//   );

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//   };

//   return (
//     <>
//       <Input value={searchQuery} onChange={handleChange} type="search" />
//       <DataTable data={filteredData} columns={columns} />
//     </>
//   );
// }
