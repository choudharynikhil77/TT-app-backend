import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterDto } from 'src/auth/dto/registerUser.dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>){

    }
    async createUser(registerDto: RegisterDto){
        try{return  await this.userModel.create({
            fname: registerDto.fname,
            lname: registerDto.lname,
            role: registerDto.role,
            email: registerDto.email,
            password: registerDto.password
        });} catch(err: unknown){
            const e = err as {code?: number};
            const DUPLICATE_KEY_CODE = 11000;
            if(e.code === DUPLICATE_KEY_CODE){
                throw new ConflictException("Email already exists");
            }
            throw err;
        }
    
    }
    async findUserByEmail(email: string){
        return await this.userModel.findOne({email});
    }

    async findUserById(id: string){
        return await this.userModel.findById(id);
    }
}
