"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import axios from "axios";
import { TableIncome } from "@/modules/income/components/TableIncome";
import { Button, Link } from "@nextui-org/react";

const IncomePage = () => {
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["repoData"],
    queryFn: () =>
      axios
        .get("https://api.github.com/repos/tannerlinsley/react-query")
        .then((res) => res.data),
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <section className="px-6">
      <div className="flex justify-between">
        <h2>Ingresos</h2>
        <Button
          href="/dashboard/income/new"
          as={Link}
          color="primary"
          showAnchorIcon
          variant="solid"
        >
          Nuevo ingreso
        </Button>
      </div>
      <TableIncome />
    </section>
  );
};

export default IncomePage;
