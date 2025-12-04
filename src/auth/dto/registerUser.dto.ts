import {IsEmail, IsOptional, IsString} from 'class-validator'
export class RegisterDto{
    @IsString()
    fname: string;
    @IsString() @IsOptional()
    lname: string;
    @IsEmail()
    email: string;
    @IsOptional()
    role:string;
    @IsString()
    password: string
}   