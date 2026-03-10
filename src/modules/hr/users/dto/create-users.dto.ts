import {
    IsString,
    IsOptional,
    IsEnum,
    IsObject,
    MinLength,
    IsNotEmpty,
    IsInt,
    IsEmail,
    IsDateString,
    IsNumber,
    IsArray,
    IsStrongPassword,
} from 'class-validator';
import { IsCPF, IsUniqueCPF, IsUniqueEmail, IsUniqueLogin } from 'src/shared/validators';
import { VALIDATION_MESSAGES } from '../../../../shared/common/messages';
import { Roles, UserContractType, UserStatus } from '@prisma/client';


export class CreateUsersDto {
    @IsString({ message: VALIDATION_MESSAGES.REQUIRED.NAME })
    @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
    @MinLength(2, { message: VALIDATION_MESSAGES.LENGTH.NAME_MIN })
    name: string;

    @IsEmail({}, { message: VALIDATION_MESSAGES.FORMAT.EMAIL_INVALID })
    @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
    @IsUniqueEmail({ message: VALIDATION_MESSAGES.UNIQUENESS.EMAIL_EXISTS })
    email: string;

    @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
    @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
    @IsUniqueLogin({ message: VALIDATION_MESSAGES.UNIQUENESS.LOGIN_EXISTS })
    login: string;

    @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
    @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
    @IsStrongPassword({}, { message: VALIDATION_MESSAGES.FORMAT.PASSWORD_WEAK })
    password: string;

    @IsEnum(Roles, { message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID })
    @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
    role: Roles;

    @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
    @IsOptional()
    profilePicture?: string;

    @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
    @IsOptional()
    registration?: string;

    @IsEnum(UserStatus, { message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID })
    @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
    status: UserStatus;

    @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
    @IsOptional()
    rg?: string;

    @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
    @IsOptional()
    phone?: string

    @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
    @IsOptional()
    @IsCPF({ message: VALIDATION_MESSAGES.FORMAT.CPF_INVALID })
    @IsUniqueCPF({ message: VALIDATION_MESSAGES.UNIQUENESS.CPF_EXISTS })
    cpf?: string

    @IsObject({ message: VALIDATION_MESSAGES.FORMAT.OBJECT_INVALID })
    @IsOptional()
    address?: Record<string, unknown>;

    @IsDateString({}, { message: VALIDATION_MESSAGES.FORMAT.DATE_INVALID })
    @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
    birthDate?: string;

    @IsDateString({}, { message: VALIDATION_MESSAGES.FORMAT.DATE_INVALID })
    @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
    hireDate?: string;

    @IsDateString({}, { message: VALIDATION_MESSAGES.FORMAT.DATE_INVALID })
    @IsOptional()
    terminationDate?: string;

    @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
    @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
    salary: number;

    @IsEnum(UserContractType, { message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID })
    @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
    contractType: UserContractType;

    @IsObject({ message: VALIDATION_MESSAGES.FORMAT.OBJECT_INVALID })
    @IsOptional()
    documents?: Record<string, unknown>;

    @IsArray({ message: VALIDATION_MESSAGES.FORMAT.ARRAY_INVALID })
    @IsOptional()
    benefits?: string[];
}