const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messagesSchema = new Schema({
  messageId: {
    type: String,
    required: true
  },
  fromAddress: {
    type: String,
    required: false
  },
  emailId:{
      type:String,
      required:true
  }
}, {
  timestamps: { createdAt: 'created_at' },
});

const Messages = mongoose.model('messages', messagesSchema);

module.exports = Messages;