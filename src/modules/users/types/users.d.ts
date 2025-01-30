export interface IUserResponse {
  id: number
  username: string
  name: string
  email: string
  fatherLastName: string
  motherLastName: string
  ci: string
  status: string
  photoUrl: string | null
  creationDate: string
  lastActive: string
  rolName: string
}

interface Role {
  id: number
  name: string
  title: string
  main: boolean
  nameRef: number
  rolsList?: Role[]
}

export type userId = Pick<IUserResponse, 'id'>

export type UseRolesDataReturn = {
  userRoles: Role[] | undefined
  allRoles: Role[] | undefined
}

export interface FormValues {
  name: string
  username: string
  email: string
  fatherLastName: string
  motherLastName: string
  ci: string
  status: string
  rolName: string
  roles: number[]
}

