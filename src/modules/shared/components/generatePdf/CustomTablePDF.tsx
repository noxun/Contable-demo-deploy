import { Text, View } from "@react-pdf/renderer";
import { numberWithDecimals, validateArray } from "../../utils/validate";

interface Props {
  fields: {
    label: string;
    name: string;
    width: string;
    textAlign?: "center" | "right" | "left" | "justify" | undefined;
    type?: string;
  }[];
  data: any[];
  fontSize?: string | number | undefined;
  isStriped?: boolean;
}

const CustomTablePDF = (props: Props) => {
  const { fields = [], data = [], fontSize = 10, isStriped = false } = props;

  if (!validateArray(fields)) {
    return null;
  }
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 3,
        }}
      >
        {fields.map((field, index) => (
          <View
            key={index}
            style={{
              width: `${field.width ? `${field.width}%` : "auto"}`,
            }}
          >
            <Text
              style={{
                fontSize: fontSize,
                fontFamily: "Helvetica-Bold",
                textAlign: field.textAlign ? field.textAlign : "left",
              }}
            >
              {field.label}
            </Text>
          </View>
        ))}
      </View>
      <View style={{ borderTop: "1px solid black", marginVertical: 5 }}></View>
      {validateArray(data)
        ? data.map((item, idx) => (
            <View
              key={idx}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 3,
                backgroundColor: isStriped
                  ? idx % 2 === 0
                    ? "#d3d3d3d3"
                    : ""
                  : "",
              }}
            >
              {fields.map((field, idy) => (
                <View
                  key={idy}
                  style={{
                    width: `${field.width ? `${field.width}%` : "auto"}`,
                    marginVertical: "2px",
                  }}
                >
                  <Text
                    style={{
                      fontSize: fontSize,
                      textAlign: field.textAlign ? field.textAlign : "left",
                    }}
                  >
                    {field.type && field.type === "index"
                      ? idx + 1
                      : field.type && field.type === "amountString"
                      ? numberWithDecimals(item[field.name])
                      : item[field.name]
                      ? item[field.name]
                      : "--"}
                  </Text>
                </View>
              ))}
            </View>
          ))
        : null}
    </View>
  );
};

export default CustomTablePDF;
