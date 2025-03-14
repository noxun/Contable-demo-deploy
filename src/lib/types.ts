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
  rolName: string;
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
  type: number;
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
  accountId: number;
  debit: boolean;
  asset: boolean;
  percentage: number;
};

export type PostModelSeat = {
  description: string;
  type: number;
  typeTransaction?: string;
  accounts: ModelSeatItem[];
};

export type ModelSeatDetailResponse = {
  id: number;
  type: number;
  description: string;
  typeTransaction: "ingresos" | "egresos" | "diarios";
  accounts: ModelSeatItemFromDetail[];
};

export type TypeCompany = {
  id: number;
  name: string;
};

export type Branch = {
  id?: number;
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
  accountDetail: string;
  type: number;
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

export type CostCenterAccountItem = {
  accountId: number;
  code: string;
  description: string;
};

export type CostCenter = {
  id: number;
  name: string;
  descripcion: string;
  code: any;
  accountId: number;
  accountItems: CostCenterAccountItem[];
};

export type AccountingBox = {
  id: number;
  name: string;
  descripcion: string;
  account: {
    code: string;
    // en realidad hay mas campos pero solo se necesita el codigo
  };
  accountId: number;
  diaryVouchers: any;
  egressVouchers: any;
  incomeVouchers: any;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  createdById: any;
  updatedById: any;
  deletedById: any;
};

export type TrazoInternCode = {
  id: number;
  value: string;
  procedureId: number;
  fieldId: number;
};

export type AccountingBoxItems = {
  id: number;
  fecha: string;
  accountId: number;
  modelSeatId: number;
  hojaDeRuta: string;
  referencia: string;
  nombre: string;
  detalle: string;
  valorPagado: number;
  accountingBox: any;
  accountingBoxId: number;
  costCenterId: number;
};

export type Bank = {
  id: number;
  name: string;
  descripcion: string;
  sigla: any;
  nroCuentaBancaria: any;
  accountId: number;
  code: string;
  saldoTotal: number;
};

export type InvoiceRegistry = {
  id: number;
  nitProvider: number | string;
  businessName: string;
  authorizationCode: number | string;
  invoiceNumber: string | number;
  DUINumber: number;
  invoiceDate: string;
  totalAmount: number;
  discountOrBonus: number;
  giftCardAmount: number;
  creditBase: number;
  taxCredit: number;
  purchaseType: string;
  controlCode: string | number;
  consolidationStatus: string;
};

export type BankSelectionState = {
  [key: number]: number | null; // bankExtractId -> accountId
};

export type TypeSelectionState = {
  [key: number]: number | null; // bankExtractId -> type
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
  minimumWage: number;
};

export type NewConfigValues = Omit<ConfigValues, "id">;

export type AccountingBoxBalance = {
  id: number;
  name: string;
  descripcion: string;
  balance: number;
  account: any;
  accountId: number;
  diaryVouchers: any;
  egressVouchers: any;
  incomeVouchers: any;
  accountingBoxItems: any;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  createdById: any;
  updatedById: any;
  deletedById: any;
};

/**
 * Representa diferentes tipos de facturas:
 * - 0: Compras
 * - 1: Ventas
 */
export type InvoiceRegistryType = 0 | 1;

export type InvoiceRegistryResponseByType = {
  id: number;
  nitProvider: number;
  businessName: string;
  authorizationCode: string;
  invoiceNumber: number;
  duiNumber: number;
  invoiceDate: string;
  totalAmount: number;
  discountOrBonus: number;
  giftCardAmount: number;
  creditBase: number;
  iva: number;
  it: number;
  type: string;
  controlCode: number;
  consolidationStatus: string;
  voucherId: number;
  typeTransaction: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  createdById: any;
  updatedById: any;
  deletedById: any;
};

export type BankExtractPaymentFile = {
  urlFile: string;
  number: number;
  status: string;
  providor: string;
};

export type TrazoCompany = {
  razonSocial: string;
  id: number;
  ref: "Trazo" | "Contable";
};

export type InvoiceVoucher = {
  id: number;
  num: number;
  exchangeRate: number;
  voucherDate: string;
  coin: string;
  checkNum: any;
  canceledTo: any;
  gloss: string;
  bankId: any;
  type: number;
  items: Array<{
    id: number;
    debitBs: number;
    debitSus: number;
    assetBs: number;
    assetSus: number;
    gloss: string;
    accountId: number;
    code: string;
    description: string;
    typeOfExpense: any;
    createdAt: string;
    voucherId: number;
    type: number;
  }>;
};

export type VoucherItemFromExtractedPDF = {
  id: number;
  accountId: number;
  importValue: number; //debitBs
};

export type PaySlip = {
  nit: string;
  position: string;
  nameEmployee: string;
  dateIncome: string;
  antique: string;
  month: string;
  daysWorked: number;
  salary: number;
  income: {
    salary: number;
    antique: number;
    overtime: number;
    comminOtherPay: number;
    total: number;
  };
  egress: {
    afps: number;
    loans: number;
    advances: number;
    otherDcts: number;
    total: number;
  };
  liquidPayable: number;
  dateNowPaySlip: string;
};

export type BookBiggerData = {
  accountCode: string;
  accountDescription: string;
  totalDebit: number;
  totalAsset: number;
  totalDebitSus: number;
  totalAssetSus: number;
  totalSaldoNum: number;
  totalSaldoNumSus: number;
  totalSaldoText: string;
  totalSaldoTextSus: string;
  literal: any;
  previousBalance: number;
  previousBalanceSus: number;
  voucherItems: BookBiggerDataVoucherItem[];
};

export type BookBiggerDataVoucherItem = {
  id: number;
  debitBs: number;
  debitSus: number;
  assetBs: number;
  assetSus: number;
  totalSaldoBs: number;
  totalSaldoSus: number;
  previousBalance: number;
  gloss: string;
  accountId: number;
  code: string;
  description: string;
  typeOfExpense: any;
  createdAt: string;
  voucherDate: string;
  voucherId: number;
  type: number;
  typeDes: string;
  hojaDeRuta?: string;
};

export type DiaryBookResponse = {
  report: Array<{
    id: number;
    type: number;
    num: number;
    typeDes: string;
    voucher: any;
    gloss: string;
    exchangeRate: number;
    coin: string;
    voucherDate: string;
    date: string;
    voucherItems: Array<{
      id: number;
      debitBs: number;
      debitSus: number;
      assetBs: number;
      assetSus: number;
      totalSaldoBs: number;
      totalSaldoSus: number;
      gloss: string;
      accountId: number;
      code: string;
      description: string;
      typeOfExpense: any;
      createdAt: string;
      voucherId: number;
      type: number;
      typeDes: string;
      hojaDeRuta?: string;
    }>;
    plusData: {
      debe: number;
      haber: number;
      debeSus: number;
      haberSus: number;
    };
  }>;
  total: {
    debe: number;
    haber: number;
    debeSus: number;
    haberSus: number;
  };
};

export type RegisterVoucherByDocumentResponse = {
  type: number;
  exchangeRate: number;
  voucherDate: string;
  coin: string;
  checkNum: any;
  canceledTo: any;
  gloss: string;
  bankId: any;
  bankItemRef: number;
  accountingBoxItemRef: number;
  sucursalId: number;
  costCenterId: number;
  createdById: number;
  hojaDeRuta: string;
  bookSBRef: number;
  typeDocument: string;
  items: Array<{
    debitBs: number;
    debitSus: number;
    assetBs: number;
    assetSus: number;
    gloss: string;
    accountId: number;
    voucherId: number;
    createdAt: string;
    conceptExpenseId: any;
    carpeta: any;
    typeOfExpense: any;
  }>;
};

export type HeritageEvaluationData = {
  initDate: string;
  endDate: string;
  inSus: boolean;
  items: Array<{
    sldDateText: string;
    sldPaidCapital: number;
    sldCapitalAdjust: number;
    sldLegalReserv: number;
    sldAdjustReserv: number;
    sldCumulResults: number;
    sldNetWorth: number;
    exCapitalAdjust: number;
    exAdjustReserv: number;
    exCumulResults: number;
    exNetWorth: number;
    incPaidCapital: number;
    resLegalReserv: number;
    reslCumulResults: number;
  }>;
  resultFinal: {
    sldDateText: string;
    sldPaidCapital: number;
    sldCapitalAdjust: number;
    sldLegalReserv: number;
    sldAdjustReserv: number;
    sldCumulResults: number;
    sldNetWorth: number;
    exCapitalAdjust: number;
    exAdjustReserv: number;
    exCumulResults: number;
    exNetWorth: number;
    incPaidCapital: number;
    resLegalReserv: number;
    reslCumulResults: number;
  };
};

export type SendAllSubDatas = {
  sucursal: string;
  centroCostos: string;
  internCode: string;
  companyRazonSocial: string;
  total: string; //totalProforma
  userId: number;
  items: Array<{
    description: string;
    description2: string;
    description3: string;
    recibo?: boolean;
  }>;
};

export type SalariesAndWagesAccounts = SalaryAndWageAccount[];

export type SalaryAndWageAccount = {
  id: number;
  code: string;
  description: string;
  coin: string;
  active: boolean;
  isBudgetable: boolean;
  isMotion: boolean;
  isCost: boolean;
};

export type BudgetExecutionData = {
  codeAccount: string;
  description: string;
  tag: any;
  disbursements: number;
  deviation: number;
  execution: string;
  initial: {
    annual: number;
    monthly: number;
  };
  modifications: {
    annual: number;
    monthly: number;
  };
  inEffect: {
    annual: number;
    monthly: number;
  };
};

export type BudgetExecutionResponse = {
  list: BudgetExecutionData[];
  totals: {
    disbursementsTotal: number;
    deviation: number;
    initialAnnualTotal: number;
    initialMonthlyTotal: number;
    modificationsAnnualTotal: number;
    modificationsMonthlyTotal: number;
    inEffectAnnualTotal: number;
    inEffectMonthlyTotal: number;
  };
};

export type RelationAccount = {
  id: number;
  code: string;
  description: string;
  coin: string;
  active: boolean;
  isBudgetable: boolean;
  isMotion: boolean;
  isCost: boolean;
  businessEntityId: number;
  businessEntityName: any;
  typeCompanyId: number;
  accountIdRef: number;
  accountCodeRef: any;
  accountDescriptionRef: any;
  items: RelationAccountItem[];
};

export type RelationAccountItem = {
  id: number;
  code: string;
  description: string;
  coin: string;
  active: boolean;
  isBudgetable: boolean;
  isMotion: boolean;
  isCost: boolean;
  businessEntityId: number;
  businessEntityName: any;
  typeCompanyId: number;
  accountIdRef: number;
  accountCodeRef: any;
  accountDescriptionRef: any;
  items: RelationAccountItem[];
};
