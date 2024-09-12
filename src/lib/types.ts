export type LoginResponse = {
  token: string;
  user: User;
  ufvRegister: boolean;
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
  accountModelSeats: any;
  createdAt: string;
  updatedAt: string;
};

export type ModelSeatItem = {
  accountId: number | string;
  debit: boolean;
  asset: boolean;
}

export type PostModelSeat = {
  description: string;
  accounts: ModelSeatItem[]
}

export type ModelSeatDetailResponse = {
  id: number
  description: string
  accounts: ModelSeatItem[]
}
