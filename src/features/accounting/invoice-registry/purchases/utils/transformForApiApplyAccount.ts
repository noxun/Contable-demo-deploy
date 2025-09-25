import {
  ApplyAccountFormSchema,
  ApplyAccountSchema,
} from "../schemas/applyAccountSchema";

export function transformForApiApplyAccount(
  values: ApplyAccountFormSchema
): ApplyAccountSchema {
  switch (values.mode) {
    case "one":
      return {
        accountDebitId: values.accountDebitId,
        accountAssetId: values.accountAssetId,
        id: values.id,
        nit: null,
        all: false,
      };
    case "nit":
      return {
        accountDebitId: values.accountDebitId,
        accountAssetId: values.accountAssetId,
        id: null,
        nit: values.nit,
        all: false,
      };
    case "all":
      return {
        accountDebitId: values.accountDebitId,
        accountAssetId: values.accountAssetId,
        id: null,
        nit: null,
        all: true,
      };
    default: 
      throw new Error(`Modo invalido: ${values.mode}`);
  }
}
