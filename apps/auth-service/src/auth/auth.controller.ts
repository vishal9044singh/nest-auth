import { AuthService } from './auth.service';
import { Get, Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { AuthGuardCommon } from './auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { VerifyOtpDto, NewUserDto, UpdateProfileDto, UserLoginDto, SuspensionDto, ForgotPasswordDto } from './authDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get()
  getHello(): string {
    return this.authService.getHello();
  }

  @Post('registration')
  async registrationByEmail(@Body() body: NewUserDto) {
    console.log('value of entered details at registration are', body)
    return await this.authService.registrationByEmail(body);
  }

  @Post('verifyOtp')
  async verifyOtp(@Body() body: VerifyOtpDto) {
    console.log('value of entered details at verifyOtp are', body)
    return await this.authService.verifyOtpService(body);
  }

  @Post('sign-in')
  async signIn(@Body() body: UserLoginDto) {
    console.log('value of entered details at signIn are', body)
    return await this.authService.passwordSignInService(body);
  }

  @Post('forgotPassword')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    console.log('value of body in forgotPassword is', body)
    return await this.authService.forgotPassword(body)
  }

  @UseGuards(AuthGuardCommon)
  @Post('updateProfile')
  async updateUserProfile(@Body() body: UpdateProfileDto) {
    console.log('value of body in updateUserProfile is', body)
    return await this.authService.updateProfile(body);
  }

  @UseGuards(AuthGuardCommon)
  @Post('accountSuspend')
  async accountSuspend(@Body() body: SuspensionDto) {
    console.log('value of body in accountSuspend is', body)
    return await this.authService.accountSuspend(body)
  }

  @UseGuards(AuthGuardCommon)
  @Post('accountRecovery')
  async accountRecovery(@Body() body: SuspensionDto) {
    console.log('value of body in accountRecovery is', body)
    return await this.authService.accountRecovery(body)
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) { }

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req)
  }
}