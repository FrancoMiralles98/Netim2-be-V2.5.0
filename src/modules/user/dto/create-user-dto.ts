import { IsEmail, IsNumber, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { USER_VALIDATION_CONFIG } from "../config/user-validation.config";

export class CreateUserDto {
    @IsString()
    @MinLength(USER_VALIDATION_CONFIG.username.minLength)
    @MaxLength(USER_VALIDATION_CONFIG.username.maxLength)
    @Matches(/^[a-zA-Z-0-9_]+$/, { message: 'El username contiene caracteres invalidos' })
    username!: string;

    @IsString()
    @Matches(/^\S+$/, {message: 'No se permiten espacios',})
    @MinLength(USER_VALIDATION_CONFIG.password.minLength)
    @MaxLength(USER_VALIDATION_CONFIG.password.maxLength)
    password!: string

    @IsString()
    @IsEmail()
    email!: string

    @IsNumber()
    @MinLength(USER_VALIDATION_CONFIG.codigo.minLength)
    @MaxLength(USER_VALIDATION_CONFIG.codigo.maxLength)
    codigo!: number
}