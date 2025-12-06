// Update src/auth/dto/registerUser.dto.ts
import { IsEmail, IsOptional, IsString, Matches, ValidateIf } from 'class-validator';

export class RegisterDto {
    @IsString()
    fname: string;
    
    @IsString() 
    @IsOptional()
    lname: string;
    
    @ValidateIf(o => !o.mobileNumber)
    @IsEmail()
    email?: string;
    
    @ValidateIf(o => !o.email)
    @Matches(/^[6-9]\d{9}$/, { message: 'Invalid mobile number' })
    mobileNumber?: string;
    
    @IsOptional()
    role: string;
    
    @IsString()
    password: string;
}
