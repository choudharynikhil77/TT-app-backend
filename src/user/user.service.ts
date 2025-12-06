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
            mobileNumber: registerDto.mobileNumber,
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
        try{return await this.userModel.findOne({email});}
        catch(err){
            throw err;
        }
    }

    async findUserByMobile(mobileNumber: string){
        try{return await this.userModel.findOne({mobileNumber});}
        catch(err){
            throw err;
        }

    }


    async findUserById(id: string){
        try{
            return await this.userModel.findById(id);
        }catch(err){
            throw err;
        }
    }

    async updateMobileOtp(mobileNumber: string, opt: string, expiresAt: Date){
        try{
            const user =  await this.userModel.findOneAndUpdate(
            { mobileNumber },
            { mobileVerificationOtp: opt, otpExpiresAt: expiresAt },
            { new: true }
            );
            return {message: "OTP updated successfully", user};
        }catch(err){throw err}
    }

    async updateEmailOtp(email: string, otp: string, expiresAt: Date){
        try{
            const user =  await this.userModel.findOneAndUpdate({email}, {emailVerificationOtp: otp, otpExpiresAt: expiresAt}, {new: true});
            return {message: "OTP updated successfully", user};
        }catch(err){throw err}
    }

    async verifyUserMobile(mobileNumber: string){
        try{
            const user =  await this.userModel.findOneAndUpdate(
            { mobileNumber },
            { isMobileVerified: true, mobileVerificationOtp: null, otpExpiresAt: null },
            { new: true }
            );
            return {message: "Mobile verified successfully", user};
        }
        catch(err){
            throw err;
        }
    }
    async verifyUserEmail(email: string){
        try{
            const user =  await this.userModel.findOneAndUpdate(
            { email },
            { isEmailVerified: true, emailVerificationOtp: null, otpExpiresAt: null },
            { new: true }
            );
            return {message: "Email verified successfully", user};
        }
        catch(err){
            throw err;
        }
    }
}
