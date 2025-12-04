import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/registerUser.dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/loginUser.dto';
@Injectable()
export class AuthService {

    constructor(private readonly userService: UserService, private readonly jwtService: JwtService){

    }
    async registerUser(registerDto: RegisterDto){
        const saltRounds = 10;
        const hash =  await bcrypt.hash(registerDto.password, saltRounds);
        const user =  await this.userService.createUser({...registerDto, password:hash});
        const payload = {sub: user._id, email: user.email};
        const token = await this.jwtService.signAsync(payload);
        console.log(user);
        return {access_token: token};
    }
    async loginUser(loginDto: LoginDto){
        const user = await this.userService.findUserByEmail(loginDto.email);
        if(!user){
            throw new Error("User not found");
        }
        const isMatch = bcrypt.compare(loginDto.password, user.password);
        if(!isMatch){
            throw new Error("Incorrect Password");
        }
        const payload = {sub: user._id, role: user.role};
        const token = await this.jwtService.signAsync(payload);
        return {message: "user successfully logged in",access_token: token};
    }
}
