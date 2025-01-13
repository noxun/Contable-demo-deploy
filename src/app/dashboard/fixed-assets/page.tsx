import { Button } from "@/components/ui/button"
import Link from "next/link"

function FixedAssetPage() {
  return (
    <main>
      <div className="w-full flex justify-between items-center">
        <h1 className="text-2xl font-bold">Activos Fijos</h1>
        <Button asChild>
          <Link href="/dashboard/fixed-assets/new">Nuevo activo fijo</Link>
        </Button>
      </div>
    </main>
  )
}

export default FixedAssetPage