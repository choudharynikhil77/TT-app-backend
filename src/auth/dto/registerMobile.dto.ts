import { IsString, IsOptional, Matches, Length } from 'class-validator';

export class RegisterMobileDto {
  @IsString()
  fname: string;

  @IsString() 
  @IsOptional()
  lname: string;

  @Matches(/^[6-9]\d{9}$/, { message: 'Invalid mobile number' })
  mobile: string;

  @IsOptional()
  role: string;

  @IsString()
  @Length(6, 20)
  password: string;
}
