import { ControlProps, CSSObjectWithLabel, GroupBase, StylesConfig } from "react-select";

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