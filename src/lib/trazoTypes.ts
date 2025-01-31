export type PaymentRoll = {
  codigoDeInterno: string;
  senores: string;
  nroQuotation: string;
  nit: string;
  docEmbarque: string;
  intAgencia: string;
  facturas: any;
  proveedor: any;
  bultos: string;
  peso: string;
  mercancia: string;
  valorFob: string;
  flete1: any;
  flete2: any;
  flete1y2: string;
  aduana: string;
  modalidad: string;
  items: string;
  seguro: string;
  otrosGastos: string;
  valorCif: string;
  tc: string;
  valorCifBs: string;
  tipo: string;
  aList: LetterList[];
  bList: LetterList[];
  cList: LetterList[];
  dList: LetterList[];
  aSubTotal: string;
  bSubTotal: string;
  cSubTotal: string;
  dSubTotal: string;
  tributosAduanerosOtrosGastosYFactura: string;
  descuentosBs: any;
  totalProformaBs: string;
  totalProformaSus: string;
  clarifications: string;
  totalAdvancePayments: string;
  otherChargesPaidByTheImporter: string;
  balanceOfPayroll: string;
  dim: string;
  nroFactura: string;
  fechaValidacion: string;
};

type LetterList = {
  id: number;
  label: string;
  description: string;
  description2: string;
  description3: string;
  description4: string;
  description5: string;
  refVoucherEgressId?: number;
  refVoucherEgressItemId?: number;
  observation: string;
  stringValue: string;
  numberValue: number;
  dataSetId: number;
  procedureId: number;
  recibo: boolean;
  creationDate: string;
  endDate?: string;
};

export type ProcedureDataset = {
  procedureId: number
  procFechaDeInicio: string
  procRegisterDate: any
  company: {
    id: number
    razonSocial: string
    nit: string
    logoUrl: any
    status: string
    code: any
    num: string
    interno: string
    importador: any
    direccion: string
    ci: string
    testimonio: any
    fundempresa: string
    email: string
    phone: string
    cicoin: any
    suma: any
    croquis: any
    foto: any
    fechaApertura: any
    gps: string
    categoria: string
    web: string
    sigla: any
    tipoCliente: any
    pais: any
    departamento: any
    ciudad: any
    domicilioLegal: any
    clasificacionCliente: any
    actividad: any
    pagaTributos: any
    descripcionNegocio: any
    details: any
    creationDate: string
    legalRepresentativeName: any
    legalRepresentativeCI: any
    legalRepresentativeCIEmision: any
    commercialActivity: string
    institution: any
    files: Array<any>
  }
  "a-TributosYOtrosConceptosAduaneros": string
  "a-TributosYOtrosConceptosAduanerosSubDatas"?: Array<{
    id: number
    label: string
    description: string
    description2: string
    description3: any
    description4: any
    description5: any
    refVoucherEgressId: any
    refVoucherEgressItemId: any
    observation: string
    stringValue: any
    numberValue: number
    dataSetId: number
    procedureId: number
    recibo: boolean
    creationDate: string
    endDate: any
  }>
  "b-OtrosGastosDeImportacion/Exportacion": string
  "b-OtrosGastosDeImportacion/ExportacionSubDatas"?: Array<{
    id: number
    label: string
    description: string
    description2: string
    description3: any
    description4: any
    description5: any
    refVoucherEgressId: any
    refVoucherEgressItemId: any
    observation: string
    stringValue: any
    numberValue: number
    dataSetId: number
    procedureId: number
    recibo: boolean
    creationDate: string
    endDate: any
  }>
  "c-GastosDeOperaciones": string
  "c-GastosDeOperacionesSubDatas"?: SubData[]
  "d-HonorariosProfesionales": string
  "d-HonorariosProfesionalesSubDatas"?: SubData[]
  fieldList: Array<any>
  sucursal: string
  centroCostos: string
}

export type SubData = {
  id: number
  label: string
  description: string //proforma
  description2: string  //planilla
  description3: string // codigo de cuenta
  description4: any
  description5: any
  refVoucherEgressId: any
  refVoucherEgressItemId: any
  observation: string //diferencia
  stringValue: any
  numberValue: number
  dataSetId: number
  procedureId?: number //no confiable
  recibo: boolean
  creationDate: string
  endDate: any
}

export type RegisterVoucherByDocuments = {
  sucursal: string
  centroCostos: string
  internCode: string
  companyRazonSocial: string
  userId?: number
  items: Array<{
    description: string
    description2: string
    description3: string
    recibo: boolean
  }>
}

export type DropdownOption = {
  id: number
  name: string
  data: string
  type: string
}
