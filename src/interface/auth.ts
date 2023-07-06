import { FellowTeam } from "./user";
export interface RegistrationData {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phonenumber: string,
    birthday: string,
    team: FellowTeam[],
    telegram: string,
    role?: string
}

export interface CreateUserFormDataType {
    email: string,
    firstName: string,
    lastName: string,
    phonenumber: string,
    birthday: string,
    team: FellowTeam[],
    telegram: string,
    role?: string
}