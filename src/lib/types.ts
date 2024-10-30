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
  accountId: number | string;
  debit: boolean;
  asset: boolean;
  percentage: number;
};

export type PostModelSeat = {
  description: string;
  accounts: ModelSeatItem[];
};

export type ModelSeatDetailResponse = {
  id: number;
  description: string;
  accounts: ModelSeatItem[];
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
