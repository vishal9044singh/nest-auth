import { IsNotEmpty, Length, Matches, IsEmail, IsOptional, ValidateIf } from 'class-validator';
import {IsMobileNumber} from './utils/mobileNumberValidator';

export class NewUserDto {
  @IsNotEmpty({ message: 'Please enter userName' })
  userName: string;

  @IsNotEmpty({ message: 'Please enter emailId' })
  @IsEmail()
  emailId: string;

  @IsNotEmpty({ message: 'Please enter password' })
  @Length(8, 16, {
    message:
      'Password must contain at least 8 characters and atmost 16 characters!',
  })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).+$/, {
    message:
      'Password must contain at least one uppercase, one numeric, and one special character!',
  })
  password: string;
}

export class VerifyOtpDto {
  @IsNotEmpty({ message: 'Please Provide the valid key!' })
  key: string

  @IsNotEmpty({ message: 'Please enter emailId' })
  @IsEmail()
  emailId: string;

  @IsNotEmpty({message : 'Please provide userName'})
  @ValidateIf(e => (e.key && e.key.toUpperCase() === 'REGISTRATION'))
  userName: string;

  @IsNotEmpty({message : 'Please provide confirmPassword'})
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).+$/, {
    message:
      'confirmPassword must contain at least one uppercase, one numeric, and one special character!',
  })
  @Length(8, 16, {
    message:
      'confirmPassword must contain at least 8 characters and atmost 16 characters!',
  })
  @ValidateIf(e => (e.key && e.key.toUpperCase() === 'FORGOTPASSWORD'))
  confirmPassword: string;

  @IsNotEmpty({message : 'Please provide password'})
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).+$/, {
    message:
      'Password must contain at least one uppercase, one numeric, and one special character!',
  })
  @Length(8, 16, {
    message:
      'Password must contain at least 8 characters and atmost 16 characters!',
  })
  @ValidateIf(e => (e.key && (e.key.toUpperCase() === 'REGISTRATION' || e.key.toUpperCase() === 'FORGOTPASSWORD')))
  password: string;

  @IsNotEmpty({ message: 'Please Provide Otp Received!' })
  otp: number;
}

export class UserLoginDto {
  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).+$/, {
    message:
      'Password must contain at least one uppercase, one numeric, and one special character!',
  })
  @Length(8, 16, {
    message:
      'Password must contain at least 8 characters and atmost 16 characters!',
  })
  password: string;
}

export class UpdateProfileDto {
  @IsNotEmpty()
  @IsEmail()
  emailId: string;
  
  @IsOptional()
  @IsMobileNumber()
  mobileNumber: string;
  
  @IsOptional()
  userName: string;

  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;

  @IsOptional()
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).+$/, {
    message:
      'Password must contain at least one uppercase case, one numeric, and one special character!',
  })
  @Length(8, 16, {
    message:
      'Password must contain at least 8 characters and atmost 16 characters!',
  })
  password: string;
}

export class SuspensionDto {
  @IsNotEmpty()
  @IsEmail()
  emailId: string;
}

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  emailId: string;
}