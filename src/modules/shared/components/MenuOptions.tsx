"use client";
import {
  Accordion,
  AccordionItem,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";
import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import { MENU_OPTIONS } from "../constants/menu-options";

export const MenuOptions = () => {
  return (
    <Accordion
      defaultExpandedKeys={["0", "1", "2"]}
      showDivider={true}
      className="text-white"
      selectionMode="multiple"
    >
      {MENU_OPTIONS.map((option, index) => (
        <AccordionItem
          className="!text-white accordion-item"
          key={index}
          aria-label={option.name}
          startContent={option.icon}
          title={option.name}
        >
          {option.routes.map((route, index) => (
            <Link
              href={route.path}
              style={{ paddingLeft: "1rem", marginBottom: "1rem" }}
              key={route.path}
              className="flex items-center gap-4"
            >
              <LuArrowRight /> {route.name}
            </Link>
          ))}
        </AccordionItem>
      ))}
    </Accordion>
  );
};
