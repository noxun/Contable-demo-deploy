"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Check, X, AlertCircle } from "lucide-react"

interface BudgetItem {
  id: string
  category: string
  description: string
  frequency: "A_REQUERIMIENTO" | "ANUAL" | "SEMESTRAL" | "TRIMESTRAL" | "MENSUAL" | "QUINCENAL" | "SEMANAL"
  monthlyData: {
    [key: string]: {
      scheduledDate: string
      paymentDate?: string
      status: "PENDIENTE" | "PAGADO" | "VENCIDO"
      observations?: string
    }
  }
}

const MONTHS = ["ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"]

const FREQUENCY_LABELS = {
  A_REQUERIMIENTO: "A Requerimiento",
  ANUAL: "Anual",
  SEMESTRAL: "Semestral",
  TRIMESTRAL: "Trimestral",
  MENSUAL: "Mensual",
  QUINCENAL: "Quincenal",
  SEMANAL: "Semanal",
}

const INITIAL_BUDGET_DATA: BudgetItem[] = [
  {
    id: "1",
    category: "A_REQUERIMIENTO",
    description: "COMPRA DE MATERIAL DE ESCRITORIO",
    frequency: "A_REQUERIMIENTO",
    monthlyData: {
      ABRIL: {
        scheduledDate: "02/04/2025",
        paymentDate: "02/04/2025",
        status: "PAGADO",
        observations: "PAGADO EN FECHA",
      },
    },
  },
  {
    id: "2",
    category: "A_REQUERIMIENTO",
    description: "COMPRA DE TONER",
    frequency: "A_REQUERIMIENTO",
    monthlyData: {
      ABRIL: {
        scheduledDate: "11/04/2025",
        paymentDate: "11/04/2025",
        status: "PAGADO",
        observations: "PAGADO EN FECHA",
      },
    },
  },
  {
    id: "3",
    category: "ANUAL",
    description: "PAGO DE IUE GESTION 2024",
    frequency: "ANUAL",
    monthlyData: {
      ABRIL: {
        scheduledDate: "28/04/2025",
        paymentDate: "28/04/2025",
        status: "PAGADO",
        observations: "PAGADO EN FECHA",
      },
    },
  },
  {
    id: "4",
    category: "ANUAL",
    description: "AGUINALDO 2025",
    frequency: "ANUAL",
    monthlyData: {
      DICIEMBRE: { scheduledDate: "15/12/2025", status: "PENDIENTE", observations: "HASTA EL 20 DE DICIEMBRE" },
    },
  },
  {
    id: "5",
    category: "MENSUAL",
    description: "ALQUILER OFICINA CENTRAL",
    frequency: "MENSUAL",
    monthlyData: {
      ABRIL: {
        scheduledDate: "04/04/2025",
        paymentDate: "04/04/2025",
        status: "PAGADO",
        observations: "PAGADO EN FECHA",
      },
      MAYO: {
        scheduledDate: "05/05/2025",
        paymentDate: "05/05/2025",
        status: "PAGADO",
        observations: "PAGADO EN FECHA",
      },
      JUNIO: { scheduledDate: "05/06/2025", status: "PENDIENTE" },
      JULIO: { scheduledDate: "04/07/2025", status: "PENDIENTE" },
      AGOSTO: { scheduledDate: "04/08/2025", status: "PENDIENTE" },
      SEPTIEMBRE: { scheduledDate: "04/09/2025", status: "PENDIENTE" },
      OCTUBRE: { scheduledDate: "06/10/2025", status: "PENDIENTE" },
      NOVIEMBRE: { scheduledDate: "04/11/2025", status: "PENDIENTE" },
      DICIEMBRE: { scheduledDate: "04/12/2025", status: "PENDIENTE" },
    },
  },
  {
    id: "6",
    category: "MENSUAL",
    description: "INTERNET",
    frequency: "MENSUAL",
    monthlyData: {
      ABRIL: {
        scheduledDate: "10/04/2025",
        paymentDate: "11/04/2025",
        status: "PAGADO",
        observations: "PAGADO EN FECHA",
      },
      MAYO: { scheduledDate: "12/05/2025", paymentDate: "15/05/2025", status: "PAGADO", observations: "PAGADO" },
      JUNIO: { scheduledDate: "10/06/2025", status: "PENDIENTE" },
      JULIO: { scheduledDate: "10/07/2025", status: "PENDIENTE" },
      AGOSTO: { scheduledDate: "11/08/2025", status: "PENDIENTE" },
      SEPTIEMBRE: { scheduledDate: "10/09/2025", status: "PENDIENTE" },
      OCTUBRE: { scheduledDate: "10/10/2025", status: "PENDIENTE" },
      NOVIEMBRE: { scheduledDate: "10/11/2025", status: "PENDIENTE" },
      DICIEMBRE: { scheduledDate: "10/12/2025", status: "PENDIENTE" },
    },
  },
  {
    id: "7",
    category: "MENSUAL",
    description: "SUELDOS DEL PERSONAL",
    frequency: "MENSUAL",
    monthlyData: {
      ABRIL: {
        scheduledDate: "30/04/2025",
        paymentDate: "30/04/2025",
        status: "PAGADO",
        observations: "PAGADO EN FECHA",
      },
      MAYO: { scheduledDate: "30/05/2025", paymentDate: "30/05/2025", status: "PAGADO", observations: "PAGADO" },
      JUNIO: { scheduledDate: "30/06/2025", status: "PENDIENTE" },
      JULIO: { scheduledDate: "30/07/2025", status: "PENDIENTE" },
      AGOSTO: { scheduledDate: "29/08/2025", status: "PENDIENTE" },
      SEPTIEMBRE: { scheduledDate: "30/09/2025", status: "PENDIENTE" },
      OCTUBRE: { scheduledDate: "30/10/2025", status: "PENDIENTE" },
      NOVIEMBRE: { scheduledDate: "28/11/2025", status: "PENDIENTE" },
      DICIEMBRE: { scheduledDate: "30/12/2025", status: "PENDIENTE" },
    },
  },
  {
    id: "8",
    category: "QUINCENAL",
    description: "QUINCENA PERSONAL",
    frequency: "QUINCENAL",
    monthlyData: {
      ABRIL: { scheduledDate: "15/04/2025", status: "PENDIENTE" },
      MAYO: { scheduledDate: "15/05/2025", paymentDate: "15/05/2025", status: "PAGADO", observations: "PAGADO" },
      JUNIO: { scheduledDate: "16/06/2025", status: "PENDIENTE" },
      JULIO: { scheduledDate: "15/07/2025", status: "PENDIENTE" },
      AGOSTO: { scheduledDate: "15/08/2025", status: "PENDIENTE" },
      SEPTIEMBRE: { scheduledDate: "15/09/2025", status: "PENDIENTE" },
      OCTUBRE: { scheduledDate: "15/10/2025", status: "PENDIENTE" },
      NOVIEMBRE: { scheduledDate: "14/11/2025", status: "PENDIENTE" },
      DICIEMBRE: { scheduledDate: "15/12/2025", status: "PENDIENTE" },
    },
  },
  {
    id: "9",
    category: "SEMANAL",
    description: "COMISION MONROY (SI CORRESPONDE)",
    frequency: "SEMANAL",
    monthlyData: {
      ABRIL: {
        scheduledDate: "04/04/2025",
        paymentDate: "04/04/2025",
        status: "PAGADO",
        observations: "PAGADO EN FECHA",
      },
      MAYO: { scheduledDate: "02/05/2025", status: "PENDIENTE", observations: "NO HAY COMISION" },
      JUNIO: { scheduledDate: "06/06/2025", status: "PENDIENTE" },
      JULIO: { scheduledDate: "04/07/2025", status: "PENDIENTE" },
      AGOSTO: { scheduledDate: "01/08/2025", status: "PENDIENTE" },
      SEPTIEMBRE: { scheduledDate: "05/09/2025", status: "PENDIENTE" },
      OCTUBRE: { scheduledDate: "03/10/2025", status: "PENDIENTE" },
      NOVIEMBRE: { scheduledDate: "07/11/2025", status: "PENDIENTE" },
      DICIEMBRE: { scheduledDate: "05/12/2025", status: "PENDIENTE" },
    },
  },
]

export default function Budgets() {
  const [budgetData, setBudgetData] = useState<BudgetItem[]>([])
  const [selectedItem, setSelectedItem] = useState<BudgetItem | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newItem, setNewItem] = useState<Partial<BudgetItem>>({
    description: "",
    frequency: "MENSUAL",
    monthlyData: {},
  })

  useEffect(() => {
    const savedData = localStorage.getItem("budgetData")
    if (savedData) {
      setBudgetData(JSON.parse(savedData))
    } else {
      setBudgetData(INITIAL_BUDGET_DATA)
      localStorage.setItem("budgetData", JSON.stringify(INITIAL_BUDGET_DATA))
    }
  }, [])

  const saveBudgetData = (data: BudgetItem[]) => {
    setBudgetData(data)
    localStorage.setItem("budgetData", JSON.stringify(data))
  }

  const updatePaymentStatus = (
    itemId: string,
    month: string,
    status: "PENDIENTE" | "PAGADO" | "VENCIDO",
    paymentDate?: string,
    observations?: string,
  ) => {
    const updatedData = budgetData.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          monthlyData: {
            ...item.monthlyData,
            [month]: {
              ...item.monthlyData[month],
              status,
              paymentDate: status === "PAGADO" ? paymentDate || new Date().toLocaleDateString("es-ES") : undefined,
              observations,
            },
          },
        }
      }
      return item
    })
    saveBudgetData(updatedData)
  }

  const addNewBudgetItem = () => {
    if (!newItem.description || !newItem.frequency) return

    const monthlyData: { [key: string]: any } = {}

    // Initialize monthly data based on frequency
    if (newItem.frequency === "MENSUAL" || newItem.frequency === "QUINCENAL") {
      MONTHS.forEach((month) => {
        monthlyData[month] = {
          scheduledDate: `01/${month === "ABRIL" ? "04" : month === "MAYO" ? "05" : month === "JUNIO" ? "06" : month === "JULIO" ? "07" : month === "AGOSTO" ? "08" : month === "SEPTIEMBRE" ? "09" : month === "OCTUBRE" ? "10" : month === "NOVIEMBRE" ? "11" : "12"}/2025`,
          status: "PENDIENTE",
        }
      })
    }

    const newBudgetItem: BudgetItem = {
      id: Date.now().toString(),
      category: newItem.frequency!,
      description: newItem.description,
      frequency: newItem.frequency!,
      monthlyData,
    }

    saveBudgetData([...budgetData, newBudgetItem])
    setNewItem({ description: "", frequency: "MENSUAL", monthlyData: {} })
    setIsAddingNew(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAGADO":
        return "bg-green-100 text-green-800 border-green-200"
      case "VENCIDO":
        return "bg-red-100 text-red-800 border-red-200"
      case "PENDIENTE":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAGADO":
        return <Check className="w-3 h-3" />
      case "VENCIDO":
        return <X className="w-3 h-3" />
      case "PENDIENTE":
        return <AlertCircle className="w-3 h-3" />
      default:
        return null
    }
  }

  const groupedData = budgetData.reduce(
    (acc, item) => {
      if (!acc[item.frequency]) {
        acc[item.frequency] = []
      }
      acc[item.frequency].push(item)
      return acc
    },
    {} as Record<string, BudgetItem[]>,
  )

  return (
    <main className="flex flex-col w-full gap-8 p-6">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-4xl">Gestión de Presupuestos</h1>
        <Button onClick={() => setIsAddingNew(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Agregar Presupuesto
        </Button>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedData).map(([frequency, items]) => (
          <Card key={frequency} className="w-full">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-blue-700">
                {FREQUENCY_LABELS[frequency as keyof typeof FREQUENCY_LABELS]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-500 text-white">
                      <th className="border border-gray-300 p-2 text-left min-w-[300px]">OBLIGACIONES REGULARES</th>
                      {MONTHS.map((month) => (
                        <th key={month} className="border border-gray-300 p-2 text-center min-w-[120px]">
                          {month}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="border border-gray-300 p-2 font-medium">
                          {index + 1}. {item.description}
                        </td>
                        {MONTHS.map((month) => {
                          const monthData = item.monthlyData[month]
                          return (
                            <td key={month} className="border border-gray-300 p-1">
                              {monthData ? (
                                <div className="space-y-1">
                                  <div className="text-xs text-gray-600">Programado: {monthData.scheduledDate}</div>
                                  {monthData.paymentDate && (
                                    <div className="text-xs text-blue-600">Pagado: {monthData.paymentDate}</div>
                                  )}
                                  <Badge
                                    className={`text-xs flex items-center gap-1 ${getStatusColor(monthData.status)}`}
                                  >
                                    {getStatusIcon(monthData.status)}
                                    {monthData.status}
                                  </Badge>
                                  {monthData.observations && (
                                    <div className="text-xs text-gray-500 italic">{monthData.observations}</div>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full text-xs h-6 bg-transparent"
                                    onClick={() => {
                                      setSelectedItem(item)
                                      setSelectedMonth(month)
                                      setIsDialogOpen(true)
                                    }}
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="text-center text-gray-400 text-xs">-</div>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Payment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actualizar Estado de Pago</DialogTitle>
          </DialogHeader>
          {selectedItem && selectedMonth && (
            <div className="space-y-4">
              <div>
                <Label className="font-medium">{selectedItem.description}</Label>
                <p className="text-sm text-gray-600">Mes: {selectedMonth}</p>
              </div>

              <div className="space-y-2">
                <Label>Estado</Label>
                <Select
                  value={selectedItem.monthlyData[selectedMonth]?.status || "PENDIENTE"}
                  onValueChange={(value: "PENDIENTE" | "PAGADO" | "VENCIDO") => {
                    const paymentDate = value === "PAGADO" ? new Date().toLocaleDateString("es-ES") : undefined
                    updatePaymentStatus(selectedItem.id, selectedMonth, value, paymentDate)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                    <SelectItem value="PAGADO">Pagado</SelectItem>
                    <SelectItem value="VENCIDO">Vencido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Observaciones</Label>
                <Textarea
                  value={selectedItem.monthlyData[selectedMonth]?.observations || ""}
                  onChange={(e) => {
                    updatePaymentStatus(
                      selectedItem.id,
                      selectedMonth,
                      selectedItem.monthlyData[selectedMonth]?.status || "PENDIENTE",
                      selectedItem.monthlyData[selectedMonth]?.paymentDate,
                      e.target.value,
                    )
                  }}
                  placeholder="Agregar observaciones..."
                />
              </div>

              <Button onClick={() => setIsDialogOpen(false)} className="w-full">
                Guardar Cambios
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add New Budget Item Dialog */}
      <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Presupuesto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Input
                value={newItem.description || ""}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Descripción del presupuesto..."
              />
            </div>

            <div className="space-y-2">
              <Label>Frecuencia</Label>
              <Select
                value={newItem.frequency || "MENSUAL"}
                onValueChange={(value: any) => setNewItem({ ...newItem, frequency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(FREQUENCY_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button onClick={addNewBudgetItem} className="flex-1">
                Agregar Presupuesto
              </Button>
              <Button variant="outline" onClick={() => setIsAddingNew(false)} className="flex-1">
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}
