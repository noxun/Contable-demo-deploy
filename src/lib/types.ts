export type LoginResponse = {
  token: string;
  user: User;
  ufvRegister: boolean;
  rols: Role[];
};

export type Role = {
  id: number;
  name: string;
  main: boolean;
  nameRef: number;
  icon: string;
  title?: string;
};

export type RoleMenu = {
  id: number;
  name: string;
  main: boolean;
  nameRef: number;
  icon: string;
  title?: string;
  rolsList?: Role[];
};

export type User = {
  id: number;
  username: string;
  name: string;
  email: string;
  fatherLastName: string;
  motherLastName: string;
  ci: string;
  status: string;
  photoUrl: any;
  creationDate: string;
  lastActive: string;
};

export type Ufv = {
  tc: string;
  ufv: string;
};

export type AccountRelation = {
  accountId: number;
  accountCode: string;
  accountDescription: string;
  accountIdRef: number;
  accountCodeRef: any;
  accountDescriptionRef: any;
};

export type SiatMotionAccount = {
  id: number;
  code: string;
  description: string;
  coin: string;
  active: boolean;
  isBudgetable: boolean;
  isMotion: boolean;
  isCost: boolean;
};

export type ModelSeat = {
  id: number;
  description: string;
  typeTransaction: string;
  accountModelSeats: any;
  createdAt: string;
  updatedAt: string;
};

export type ModelSeatItem = {
  accountId: number;
  debit: boolean;
  asset: boolean;
  percentage: number;
};

export type ModelSeatItemFromDetail = {
  accountId: number
  debit: boolean
  asset: boolean
  percentage: number
}

export type PostModelSeat = {
  description: string;
  typeTransaction: string;
  accounts: ModelSeatItem[];
};

export type ModelSeatDetailResponse = {
  id: number;
  description: string;
  typeTransaction: "ingresos" | "egresos" | "diarios";
  accounts: ModelSeatItemFromDetail[];
};

export type TypeCompany = {
  id: number;
  name: string;
};

export type Branch = {
  nameSucutsal: string;
  address: string;
  phone: string;
  email: string;
  personInCharge: string;
  status: boolean;
};

export type BankExcerpt = {
  id: number;
  date: string;
  nroDocument: string;
  amount: number;
  glossInExtract: string;
  internCode: any;
  accountId: number;
  trazoRegister: boolean;
  accountingEntry: boolean;
};

export type BankExcerptData = {
  id: number;
  date: string;
  agency: string;
  description: string;
  nroDocument: string;
  amount: number;
  balance: number;
  bankAccount: string;
  accountingAccount: any;
  internCode: any;
  dateEdited: string;
  importer: any;
  glossInExtract: string;
  specialMovementIdentifier: any;
  income: number;
  exitAmount: number;
  balanceAmount: number;
  totalAmount: number;
  trazoRegister: boolean;
  accountingEntry: boolean;
  bankExtract: any;
  bankExtractId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  createdById: any;
  updatedById: any;
  deletedById: any;
};

export type BranchToList = {
  id: number;
  nameSucutsal: string;
};

export type CostCenter = {
  id: number
  name: string
  descripcion: string
  account: any
  accountId: number
  diaryVouchers: any
  egressVouchers: any
  incomeVouchers: any
  createdAt: string
  updatedAt: string
  deletedAt: string
  createdById: any
  updatedById: any
  deletedById: any
}

export type AccountingBox = {
  id: number
  name: string
  descripcion: string
  account: any
  accountId: number
  diaryVouchers: any
  egressVouchers: any
  incomeVouchers: any
  createdAt: string
  updatedAt: string
  deletedAt: string
  createdById: any
  updatedById: any
  deletedById: any
}

export type TrazoInternCode = {
  id: number
  value: string
  procedureId: number
  fieldId: number
}

export type AccountingBoxItems = {
  id: number
  mes: string
  fecha: string
  accountId: number
  reciboInterno: string
  tipoComprobante: string
  comprobanteProveedor: string
  proveedor: any
  hojaDeRuta: string
  cliente: string
  detalle: string
  ingreso: number
  egreso: number
  saldo: number
  accountingBox: any
  accountingBoxId: number
  costCenterId: number
}

export type Bank = {
  id: number,
  name: string,
  descripcion: string,
  sigla: any,
  nroCuentaBancaria: any,
  accountId: number,
  code: string | null,
}

export type BankSelectionState = {
  [key: number]: number | null;  // bankExtractId -> accountId
};

export type ConfigValues = {
  id: number;
  ufvValue: number;
  dollarValue: number;
  stateMain: boolean;
  ivaValue: number;
  itValue: number;
  iceValue: number;
  iehdValue: number;
  itfValue: number;
  tributosAduaneros: number;
  ufvDate: string;
}

export type NewConfigValues = Omit<ConfigValues, "id">