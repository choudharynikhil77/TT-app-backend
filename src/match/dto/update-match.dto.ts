import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchDto } from './create-match.dto';
import { IsDate, IsNotEmpty, IsString, IsTimeZone } from "class-validator";
export class UpdateMatchDto extends PartialType(CreateMatchDto) {
    @IsString()
    id?: string;
    @IsString()
    name?: string;
    @IsString()
    description?: string;
    @IsString()
    location?: string;
    @IsString()
    date?: string;
    @IsString()
    time?: string;
}
