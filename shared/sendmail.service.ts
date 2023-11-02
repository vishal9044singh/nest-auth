const sm = require('@sendgrid/mail');
var client = sm.client;

let templates = (data: any) => {
  let html: any;
  if(data.key == 'forgotPassword'){
   html =  `<h2>Dear ${data.userName},</h2>
    </br> 
    <p>We've received a request to reset your password for your Auth Service account. 
    </br>
    <p>To complete the password reset process, please use the following verification code:</p>
    </br>
    <p><strong> Verification Code: ${data.otp} </strong></p>
    <p> Please note that this code is valid for a limited time only. It is for one-time use and should not be shared with anyone.</p>
    </br>
    <p>
  <p> If you have requested this password reset, please follow the instructions below: </p>
   </br>
   <ol>
   <li> Visit our website or app at authservice.com.</li>
   <li> Click on the "Forgot Password" or "Reset Password" link.</li>
   <li> Enter your email address associated with your account.</li>
   <li> Enter the verification code provided in this email.</li>
   <li> Follow the on-screen instructions to create a new password.</li>
   </ol>

   <p>If you encounter any issues or need assistance, please contact our support team at ${data.from_email}.</p>
</br>
   <p>Thank you for using Auth Service. We value your security and look forward to serving you.</p>
    `
  }
  else if(data.key == 'registration'){
    html =  `<h2>Dear ${data.userName},</h2>
    </br> 
    <p>
    Welcome to Auth Service! We're excited to have you join our community.</p>
    <p> To complete your registration, please use the following verification code to verify your email address:</p>
    </br>
    <p><strong> Verification Code: ${data.otp} </strong></p>
    <p> Please note that this code is valid for a limited time only. It is for one-time use and should not be shared with anyone.</p>
    </br>
    <p>
  <p> To verify your email and complete your registration, please follow these steps: </p>
   </br>
   <ol>
   <li> Visit our website or app at authservice.com.</li>
   <li> Click on the "Register" link.</li>
   <li> Enter your email address.</li>
   <li> Enter the verification code provided in this email.</li>
   <li> Follow the on-screen instructions to complete the verification process.</li>
   </ol>
   </br>
   <p>If you did not sign up for authservice.com, please disregard this email.</p>

   <p>If you encounter any issues or need assistance, please contact our support team at ${data.from_email}.</p>
</br>
   <p>Thank you for choosing Auth Service. We're committed to providing you with a great experience.</p>
    `
  }
  return html;
}

class SendMailService {
  async sendMail(data) {
    var s = client;
    console.log("the data is ", data)
    s.setApiKey('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');
    var msg = {
      to: data.to_email,
      from: data.from_email,
      subject: data.subject,
      html: templates(data),
    }
    console.log("i am under msg params")
    var r = await sm.send(msg, (err, result) => {
      if (err) {
        console.log("the error is ", err)
      } else {
        console.log("the result is ", result)
        return true;
      }
    })
    if (r) {
      return true;
    }
  }
}

export const mailService = new SendMailService();
