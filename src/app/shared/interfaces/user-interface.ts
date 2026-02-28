import { UserRole } from "../enums/user-roles"

export interface UserInterface {
    nome: string,
    email: string,
    perfil: UserRole,
    senha: string,
    codFunc?: string
}