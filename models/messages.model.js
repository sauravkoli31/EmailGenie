const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messagesSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  email_uuid: {
    type: String,
    required: false
  },
  fromAddr: {
    type: String,
    require:false
  },
  rootDomain: {
    type: String,
    require:false
  }
}, {
  timestamps: { createdAt: 'created_at' },
});

const Messages = mongoose.model('messages', messagesSchema);

module.exports = Messages;