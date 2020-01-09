const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

var accountSchema = new Schema({
  userid: String,
  password: String,
  nickname: String,
  created: { type: Date, default: Date.now}
});

accountSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, 8);
}

accountSchema.methods.validateHash = function(password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('account', accountSchema);