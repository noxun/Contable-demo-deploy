"use client";
import { getFixedAsset } from "@/lib/data";
import { FormFixedAssets } from "@/modules/fixed-assets/components/FormFixedAssets";
import { SchemaFixedAsset } from "@/modules/fixed-assets/types/types";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { Suspense } from "react";

function NewFixedAssetComponent() {
  const params = useSearchParams();
  const AssetId = params.get("IdAsset");
  const { data: fixedAsset, isLoading } = useQuery({
    queryKey: ["fixedAsset", AssetId],
    queryFn: () => getFixedAsset({ id: AssetId ?? "" }),
    enabled: !!AssetId,
  });

  const defaultValues: SchemaFixedAsset = {
    fixedAssetsId: fixedAsset?.fixedAssetsId || "",
    detail: fixedAsset?.detail || "",
    reference: fixedAsset?.reference || "",
    proveedor: fixedAsset?.proveedor || "",
    invoice: fixedAsset?.invoice || "",
    registrationDate: fixedAsset?.registrationDate || "",
    startDate: fixedAsset?.startDate || "",
    initialNetWorth: fixedAsset?.initialNetWorth.toString() || "0",
    previousDA: fixedAsset?.previousDA.toString() || "0",
  };

  return (
    <>
      <section className="px-5 mx-auto">
        {!isLoading && (
          <>
            <h3 className="text-xl pb-4 text-center">
              {fixedAsset
                ? "Editar un activo fijo"
                : "Registrar un nuevo activo fijo"}
            </h3>
            <FormFixedAssets
              mode={fixedAsset ? "edit" : "create"}
              defaultValueForm={defaultValues}
              idAsset={fixedAsset ? AssetId : null}
            />
          </>
        )}
      </section>
    </>
  );
}

export default function NewFixedAssetPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewFixedAssetComponent />
    </Suspense>
  );
}
