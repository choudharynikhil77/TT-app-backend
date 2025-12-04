
import { IsDate, IsNotEmpty, IsString, IsTimeZone } from "class-validator";
export class CreateMatchDto{
    @IsString()
    name:string;
    @IsString()
    description:string;
    @IsString()
    location:string;
    @IsString()
    date:string;
    @IsString()
    time:string;

}