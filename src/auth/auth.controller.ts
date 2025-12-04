import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/registerUser.dto';
import { LoginDto } from './dto/loginUser.dto';
import { AuthGuard } from './auth.guard';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
    // method 1: for using the services inside the controller
    // authService : AuthService;
    // constructor(authService: AuthService){
    //     this.authService = authService;
    // } 

    //method 2: for using the services inside controller
    constructor(private readonly authService: AuthService,
        private readonly userService: UserService
    ){

    }
    @Post('register')
    async register(@Body() registerDto: RegisterDto){
        const result = this.authService.registerUser(registerDto);
        return result;
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto){
        const result = this.authService.loginUser(loginDto);
        return result;
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    async getProfile(@Request() req){
        const userId = req.user.sub;
        const user = await this.userService.findUserById(userId);
        return {
            id: user?._id,
            fname: user?.fname,
            lname: user?.lname,
            role: user?.role,
            email: user?.email
        };
    }
}
