"use client";
import { cn } from "@/lib/utils";
import { GroupBase, Props } from "react-select";
import Select from "react-select";

export default function CustomSelect<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: Props<Option, IsMulti, Group>) {
  return (
    <Select
      // className="my-react-select-container w-full"
      classNames={{
        menuPortal: () => cn("my-react-select-container"),
        container: () => cn("my-react-select-container", props.className),
      }}
      classNamePrefix="my-react-select"
      {...props}
    />
  );
}
