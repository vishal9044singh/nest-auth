import * as mongoose from 'mongoose';

export const OtpSchema = new mongoose.Schema({
  userName: String,
  emailId: String,
  otp: String,
  createdAt: Number,
}, { collection: 'otp', autoIndex: false  });