import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

export default function ConfigPage() {
  const taxData = {
    "IVA": "13%",
    "IT": "3%",
    "ICE": null,
    "IEHD": null,
    "ITF": null,
    "Tributos Aduaneros IVA": "14.94%"
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Ventana de Parametros</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="ufv">UFV</Label>
              <Input id="ufv" placeholder="Ingrese UFV" />
            </div>
            <div>
              <Label htmlFor="exchange-rate">Tipo de Cambio</Label>
              <Input id="exchange-rate" placeholder="Ingrese T/C" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Impuestos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(taxData).map(([key, value]) => (
                <div key={key}>
                  <Label htmlFor={key}>{key}</Label>
                  <Input 
                    id={key} 
                    value={value || ''} 
                    placeholder={`Ingrese ${key}`} 
                    readOnly={value !== null}
                    aria-readonly={value !== null}
                  />
                </div>
              ))}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button type="submit">Guardar Cambios</Button>
      </CardFooter>
    </Card>
  )
}