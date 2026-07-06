import { UserRole } from "./user-roles.enum";

export interface UserEntityProps {
    username: string;
    md: number;
    yang: number;
    email: string;
    role: UserRole;
}