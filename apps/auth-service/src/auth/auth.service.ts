import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserSchema } from './schemas/user.schema';
import { OtpSchema } from './schemas/otp.schema';
import * as dcriptPassword from './utils/dcriptPassword';
import { Model } from 'mongoose';
import { mailService } from 'shared';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<typeof UserSchema>,
    @InjectModel('Otp') private readonly otpModel: Model<typeof OtpSchema>,
    private jwtService: JwtService,
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  async verifyOtpService(body: any) {
    console.log('value of body at verifyOtpService', body, body.emailId)
    try {
      console.log('value of process env secret key is', process.env.JWT_SECRET);

      //finding otp document using emailId from database
      let otpDetails: any = await this.otpModel.findOne({ "emailId": body.emailId }).sort({ "_id": -1 });
      console.log('opt at line 104 is', otpDetails);

      if (!otpDetails) { throw new NotFoundException('Otp generation failed, Please try again!') }

      //validating otp
      if (body.otp != otpDetails.otp) { throw new NotAcceptableException('Invalid Otp, Please Enter Valid Otp') }

      //validating otp's expiration, valid for only 2 mins
      if ((Date.now() - otpDetails.createdAt) > 2 * 60 * 1000) {  throw new NotAcceptableException('Otp has Expired, Please Retry!') }

      if (body.key.toUpperCase() == 'REGISTRATION') {
        //hashing password using bcrypt
        const hashedPassword = await dcriptPassword.hashPassword(body.password);
        console.log('value of hashedPassword is', hashedPassword);

        const userData = {
          "userName": body.userName,
          "emailId": body.emailId,
          "password": hashedPassword,
          "isActive": true,
          "mobileNumber": '',
          "firstName": '',
          "lastName": ''
        }

        let newUser: any = await this.userModel.findOneAndUpdate({ emailId: body.emailId }, userData, { new: true, upsert: true });

        // //setting up payload in jwt Token
        const payload = { emailId: body.emailId }
        console.log('value of payload is', payload);

        //generating jwtToken and passing it to response
        let jwtToken = await this.jwtService.signAsync(payload);
        console.log('obtained jwtToken is', jwtToken);

        return {
          success: true,
          user: {
            "userName": body.userName,
            "emailId": body.emailId,
            "firstName": newUser.firstName,
            "lastName" : newUser.lastName,
            "mobileNumber" : newUser.mobileNumber,
          },
          access_Token: jwtToken
        }
      }

      else if (body.key.toUpperCase() == 'FORGOTPASSWORD') {
        try {
          //finding user who is active
          let user: any = await this.userModel.findOne({ emailId: body.emailId, isActive: true });
          console.log('value of user found whle forgot password in is', user)

          //if not user means username or password is wrong.
          if (!user) {
            throw new NotFoundException('User not found or account suspended')
          }

          if (body.password !== body.confirmPassword) {
            throw new NotAcceptableException('Password and confirm password should match')
          }
          const hashedPassword = await dcriptPassword.hashPassword(body.password);
          console.log('value of hashedPassword is', hashedPassword);

          let updateUser: any = await this.userModel.findOneAndUpdate({ emailId: body.emailId }, { password: hashedPassword }, { new: true });
          console.log('value of user found while changePassword is', updateUser)

          return {
            success: true,
            user: {
              emailId: updateUser.emailId,
              userName: updateUser.userName,
              firstName: updateUser.firstName,
              lastName: updateUser.lastName,
              mobileNumber: updateUser.mobileNumber
            },
          }

        }
        catch (error) {
          console.log('got error in updateProfile')
          throw error
        }
      }
      else {
        return {
          success: true,
        }
      }
    }
    catch (error) {
      console.log('Got error  in verify mobile otp!', error)
      throw error
    }
  }

  async registrationByEmail(body: any) {
    console.log('value of body atregistrationByEmail', body);
    try {
      const user1 = await this.userModel.findOne({ emailId: body.emailId });
      console.log("user found", user1)
      if(!!user1){ throw new NotAcceptableException('User with emailId already exists') }

      const user2 = await this.userModel.findOne({ userName: body.userName });
      console.log("user found", user2)
      if(!!user2){ throw new NotAcceptableException('Username alraedy exists') }

      const currentTime = new Date().getTime();
      const otp = currentTime.toString().slice(-4).padStart(4, '0');
      console.log("otp is", otp)

      const otpData = {
        userName: body.userName,
        emailId: body.emailId,
        otp: otp,
        createdAt: Date.now()
      }

      const insertMobileOtp = await this.otpModel.findOneAndUpdate({emailId: body.emailId}, otpData, {
        new: true, // Return the modified document
        upsert: true, // Create a new document if no matching document is found
      })
      console.log("insertMobileOtpinsertMobileOtp ", insertMobileOtp);

      const mailData = {
        to_email: body.emailId,
        from_email: 'support@authservice.com',
        subject: 'Welcome to Auth Service - Email Verification Code',
        userName: body.userName,
        otp: otp,
        key: 'registration'
      }
      mailService.sendMail(mailData);

      return {
        success: true,
        message: "OTP sent successfully"
      }

    }
    catch (err) {
      throw err
    }

  }

  async passwordSignInService(body: any) {
      console.log('value of body at passwordSignInService is', body);
      try {
          //finding user who is active
          let user:any = await this.userModel.findOne({ $or:[ {userName: body.userName}, {emailId: body.userName}],  isActive: true});
          console.log('value of user found whle logging in is', user)

          //if not user means username or password is wrong.
          if (!user) {
            throw new NotFoundException('Invalid Username or Account Suspended!')
          }

          //checking if password matches or not
          let isVerified = await dcriptPassword.comparePassword(body.password, user.password);
          console.log('Is it verified!', isVerified)

          if (!isVerified) {
            throw new NotAcceptableException('Invalid Username or Password!')
          }

          //setting up payload in jwt Token
          const payload = { emailId: user.emailId }
          console.log('value of payload is', payload);

          //generating jwtToken and passing it to response
          let jwtToken = await this.jwtService.signAsync(payload);
          console.log('obtained jwtToken is', jwtToken);

          return {
              success: true,
              user: {
                  emailId: user.emailId,
                  userName: user.userName,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  mobileNumber: user.mobileNumber
                },
              access_Token: jwtToken
          }
      }
      catch (error) {
          console.log('got error in passwordSignInService')
          throw error
      }
  }

  async updateProfile(body: any) {
    console.log('value of body at updateProfile is', body);
    try {
      //finding user who is active
      let user: any = await this.userModel.findOne({ emailId: body.emailId, isActive: true });
      console.log('value of user found whle logging in is', user)

      //if not user means username or password is wrong.
      if (!user) {
        throw new NotFoundException('User not found or Account suspended')
      }
      if (!!body.password) {
        const hashedPassword = await dcriptPassword.hashPassword(body.password);
        console.log('value of hashedPassword is', hashedPassword);
        body.password = hashedPassword
      }

      console.log('value of body at updateProfile is after', body);

      let updateUser: any = await this.userModel.findOneAndUpdate({ emailId: body.emailId }, body, { new: true });
      console.log('value of user found whle updateProfile in is', updateUser)

      return {
        success: true,
        user: {
          emailId: updateUser.emailId,
          userName: updateUser.userName,
          firstName: updateUser.firstName,
          lastName: updateUser.lastName,
          mobileNumber: updateUser.mobileNumber
        },
      }
    }
    catch (error) {
      console.log('got error in updateProfile')
      throw error
    }
  }

  async accountSuspend(body: any) {
    console.log('value of body at accountSuspend is', body);
    try {
      let updateUser: any = await this.userModel.findOneAndUpdate({ emailId: body.emailId }, {isActive: false}, { new: true });
      console.log('value of user found whle logging in is', updateUser)

      if(updateUser){
      return {
        success: true,
        user: {
          emailId: updateUser.emailId,
          userName: updateUser.userName,
          firstName: updateUser.firstName,
          lastName: updateUser.lastName,
          mobileNumber: updateUser.mobileNumber,
        },
      }
      }
      else {
        throw new NotFoundException('Account suspension failed')
    }
  }
    catch (error) {
      console.log('got error in accountSuspend')
      throw error
    }
  }

  async accountRecovery(body: any) {
    console.log('value of body at accountRecovery is', body);
    try {
      let updateUser: any = await this.userModel.findOneAndUpdate({ emailId: body.emailId }, {isActive: true}, { new: true });
      console.log('value of user found whle logging in is', updateUser)

      if(updateUser){
      return {
        success: true,
        user: {
          emailId: updateUser.emailId,
          userName: updateUser.userName,
          firstName: updateUser.firstName,
          lastName: updateUser.lastName,
          mobileNumber: updateUser.mobileNumber,
        },
      }
      }
      else {
        throw new NotFoundException('Account recovery failed')
      }
    }
    catch (error) {
      console.log('got error in accountRecovery')
      throw error
    }
  }

  async forgotPassword(body: any){
    try {
      const user: any = await this.userModel.findOne({ emailId: body.emailId , isActive: true});
      console.log("user found", user)
      if(!user){ throw new NotFoundException('User not found or account suspended') }

      const currentTime = new Date().getTime();
      const otp = currentTime.toString().slice(-4).padStart(4, '0');
      console.log("otp is", otp)

      const otpData = {
        userName: user.userName,
        emailId: user.emailId,
        otp: otp,
        createdAt: Date.now()
      }

      const insertMobileOtp = await this.otpModel.findOneAndUpdate({emailId: body.emailId}, otpData, {
        new: true, // Return the modified document
        upsert: true, // Create a new document if no matching document is found
      })
      console.log("insertMobileOtpinsertMobileOtp ", insertMobileOtp);

      const mailData = {
        to_email: body.emailId,
        from_email: 'support@authservice.com',
        subject: 'Reset Your Password - Verification Code',
        userName: user.userName,
        otp: otp,
        key: 'forgotPassword'
      }
      mailService.sendMail(mailData);

      return {
        success: true,
        message: "OTP sent successfully"
      }

    }
    catch (err) {
      throw err
    }
  }

  async googleLogin(body: any) {
    console.log("googleLogingoogleLogin", body.user)
    if (!body.user) {
      return 'No user from google'
    }
    const userData = {
      "emailId": body.user.email,
      "isActive": true,
      "firstName": body.user.firstName,
      "lastName" : body.user.lastName,
      "mobileNumber": "",
      "userName" : ""
    }
    let newUser: any = await this.userModel.findOneAndUpdate({ emailId: body.user.email }, userData, { new: true, upsert: true });
    console.log('value of newUsernewUser is', newUser);

    // //setting up payload in jwt Token
    const payload = { emailId: body.user.email }
    console.log('value of payload is', payload);

    //generating jwtToken and passing it to response
    let jwtToken = await this.jwtService.signAsync(payload);
    console.log('obtained jwtToken is', jwtToken);

    return {
      success: true,
      user: {
        "emailId": body.user.email,
        "isActive": true,
        "firstName": body.user.firstName,
        "lastName" : body.user.lastName,
        "mobileNumber" : newUser.mobileNumber,
        "userName" : newUser.userName
      },
      access_Token: jwtToken
    }
  }
}