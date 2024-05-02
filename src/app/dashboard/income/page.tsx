"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import axios from "axios";

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
  console.log(data.data);

  return <div>page</div>;
};

export default IncomePage;
