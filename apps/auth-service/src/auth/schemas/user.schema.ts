import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  userName: String,
  emailId: String,
  password: String,
  mobileNumber: String,
  firstName: String,
  lastName: String,
  isActive: Boolean
}, { collection: 'users', autoIndex: false  });