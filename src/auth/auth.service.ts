import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/registerUser.dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/loginUser.dto';
import { VerifyEmailOrMobile } from './dto/verifyEmailOrMobile.dto';
import * as nodemailer from 'nodemailer';
import twilio from 'twilio';

@Injectable()
export class AuthService {
    private transporter;
    private twilioClient;
    
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService){
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        this.twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    }
    async registerUser(registerDto: RegisterDto){
        try{
            const saltRounds = 10;
            const hash =  await bcrypt.hash(registerDto.password, saltRounds);
            const user =  await this.userService.createUser({...registerDto, password:hash});
            if (registerDto.email) {
            await this.sendEmailVerificationOtp(user.email);
            return { message: "User registered successfully. OTP sent to email." };
        } else if (registerDto.mobileNumber) {
            await this.sendMobileVerificationOtp(user.mobileNumber);
            return { message: "User registered successfully. OTP sent to mobile." };
        }
        
        return { message: "User registered successfully" };
            // const payload = {sub: user._id, email: user.email};
            // const token = await this.jwtService.signAsync(payload);
        }
        catch(err){
            console.log("error>>  ", err.message);
            throw err;
        }

    }
    async loginUser(loginDto: LoginDto){
        let user;
        if(loginDto.email){
            user = await this.userService.findUserByEmail(loginDto.email);
        }
        else if(loginDto.mobileNumber){
            user = await this.userService.findUserByMobile(loginDto.mobileNumber);
        }
        else{
            throw new BadRequestException("Please provide either email or mobile number");
        }
        
        if(!user){
            throw new NotFoundException("User not found");
        }
        if(loginDto.email && !user.isEmailVerified ){
            throw new BadRequestException("Email not verified");
        }
        if(loginDto.mobileNumber && !user.isMobileVerified ){
            throw new BadRequestException("Mobile not verified");
        }
        const isMatch = bcrypt.compare(loginDto.password, user.password);
        if(!isMatch){
            throw new Error("Incorrect Password");
        }
        const payload = {sub: user._id, role: user.role};
        const token = await this.jwtService.signAsync(payload);
        return {message: "user successfully logged in",access_token: token};
    }

    private generateOtp():string{
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        return otp;
    }

    private async sendOtpSms(mobile: string, otp: string): Promise<void> {
        try {
            await this.twilioClient.messages.create({
                body: `Your OTP for verification is: ${otp}. Valid for 10 minutes.`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: `+91${mobile}`
            });
            console.log(`✅ SMS sent successfully to ${mobile}`);
        } catch (error) {
            console.error('Twilio SMS error:', error);
            console.log(`📱 Development fallback - OTP for ${mobile}: ${otp}`);
        }
    }

    private async sendOtpEmail(email: string, otp: string): Promise<void> {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Verification OTP',
            html: `
                <h2>Email Verification</h2>
                <p>Your OTP for email verification is: <strong>${otp}</strong></p>
                <p>This OTP will expire in 10 minutes.</p>
            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`OTP sent successfully to ${email}`);
        } catch (error) {
            console.error('Error sending email:', error);
            throw new BadRequestException('Failed to send OTP email');
        }
    }

    async sendEmailVerificationOtp(email: string) {
        const user = await this.userService.findUserByEmail(email);
        if (!user) throw new NotFoundException('User not found');
        if (user.isEmailVerified) throw new BadRequestException('Email already verified');

        const otp = this.generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await this.userService.updateEmailOtp(email, otp, expiresAt);
        this.sendOtpEmail(email, otp);
        
        return { message: 'OTP sent successfully' };
    }

    async sendMobileVerificationOtp(mobile: string) {
        const user = await this.userService.findUserByMobile(mobile);
        if (!user) throw new NotFoundException('User not found');
        if (user.isMobileVerified) throw new BadRequestException('Mobile already verified');

        const otp = this.generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await this.userService.updateMobileOtp(mobile, otp, expiresAt);
        this.sendOtpSms(mobile, otp);
        
        return { message: 'OTP sent successfully' };
    }

    async verifyMobile(mobile: string, otp: string) {
        const user = await this.userService.findUserByMobile(mobile);
        console.log(">>>>>")
        if (!user) throw new NotFoundException("User not found");
        if (user.isMobileVerified) throw new BadRequestException("Mobile already verified");
        if (!user.mobileVerificationOtp || new Date() > user.otpExpiresAt) throw new BadRequestException("OTP expired");
        if (user.mobileVerificationOtp !== otp) throw new BadRequestException("Invalid OTP");

        await this.userService.verifyUserMobile(mobile);
        return { message: "Mobile verified successfully" };
    }

    async verifyEmail(verifyEmailDto: VerifyEmailOrMobile){
        const {email, otp } = verifyEmailDto;
        if(!email) throw new BadRequestException("Please provide email");
        const user = await this.userService.findUserByEmail(email);

        if(!user) throw new NotFoundException("User not found");

        if(user.isEmailVerified) throw new NotFoundException("Email already verified");

        if(!user.emailVerificationOtp || new Date() > user.otpExpiresAt) throw new BadRequestException("otp expired");

        if(user.emailVerificationOtp !== otp) throw new BadRequestException("Invalid OTP");

        const response = await this.userService.verifyUserEmail(email);
        return response;    
    }
}
