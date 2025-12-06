import { IsEmail, IsString, Length, Matches, ValidateIf } from "class-validator";

export class VerifyEmailOrMobile{
    @ValidateIf(o => !o.mobileNumber)
    @IsEmail()
    email?: string;
    
    @ValidateIf(o => !o.email)
    @Matches(/^[6-9]\d{9}$/, { message: 'Invalid mobile number' })
    mobileNumber?: string;

    @IsString()
    @Length(6,6)
    otp:string;
}