"use client";
import { useState } from "react";
import { GroupBase, Props } from "react-select";
import Select from "react-select";

export default function NoMenuSelect<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: Props<Option, IsMulti, Group>) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  //esto para que el menu se abra solo cuando se escriba
  function handleInputChange(input: string) {
    if (input) {
      setIsMenuOpen(true);
    } else {
      setIsMenuOpen(false);
    }
  }
  return (
    <Select
      className="my-react-select-container w-full"
      classNamePrefix="my-react-select"
      onInputChange={handleInputChange}
      menuIsOpen={isMenuOpen}
      {...props}
    />
  );
}
