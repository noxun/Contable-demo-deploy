import {
  ApplySaleAccountFormSchema,
  ApplySaleAccountSchema,
} from "../schemas/applySaleAccountSchema";

export function transformForApiApplySaleAccount(
  values: ApplySaleAccountFormSchema
): ApplySaleAccountSchema {
  switch (values.mode) {
    case "one":
      return {
        accountDebitId: values.accountDebitId,
        id: values.id,
        nit: null,
        all: false,
      };
    case "nit":
      return {
        accountDebitId: values.accountDebitId,
        id: null,
        nit: values.nit,
        all: false,
      };
    case "all":
      return {
        accountDebitId: values.accountDebitId,
        id: null,
        nit: null,
        all: true,
      };
    default: 
      throw new Error(`Modo invalido: ${values.mode}`);
  }
}
