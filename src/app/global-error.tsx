'use client'

import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body className="min-h-screen bg-background">
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle className="text-2xl font-bold">¡Algo salió mal!</CardTitle>
              <CardDescription>
                Se ha producido un error inesperado en la aplicación
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {error.digest && (
                <Alert variant="destructive">
                  <AlertDescription>
                    ID del error: {error.digest}
                  </AlertDescription>
                </Alert>
              )}
              
              <Separator />
              
              <div className="text-sm text-muted-foreground space-y-2">
                <p>¿Qué puedes hacer?</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Intentar recargar la página</li>
                  <li>Verificar tu conexión a internet</li>
                  <li>Contactar soporte si el problema persiste</li>
                </ul>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-2">
              <Button 
                onClick={() => reset()} 
                className="w-full"
                variant="default"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Intentar de nuevo
              </Button>
              
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="w-full"
              >
                <Home className="mr-2 h-4 w-4" />
                Ir al inicio
              </Button>
            </CardFooter>
          </Card>
        </div>
      </body>
    </html>
  )
}