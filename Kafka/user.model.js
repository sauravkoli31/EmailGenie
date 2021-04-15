const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema({
  fullName:{
      type:String,required:false
  },
  profilepicture:{
      type:String
  },
  email: {
      type: String, required: true,
      trim: true, unique: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  },
  googleProvider: {
      type: {
          id: String,
          token: String
      },
      select: false
  }
});

const Users = mongoose.model('users', UserSchema);

module.exports = Users;