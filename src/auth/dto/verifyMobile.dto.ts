import { IsString, Length, Matches } from 'class-validator';

export class VerifyMobileDto {
  @Matches(/^[6-9]\d{9}$/)
  mobile: string;

  @IsString()
  @Length(6, 6)
  otp: string;
}
